# Provisionner un cluster Kubernetes sur HCloud

- Canonical URL: https://leandeep.com/provisionner-un-cluster-kubernetes-sur-hcloud/
- Author: Olivier Eeckhoutte
- Published: 2019-01-02T00:45:00Z
- Updated: 2019-01-02T00:45:00Z
- Language: fr
- Tags: Kubernetes, HCloud
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Introduction 

Dans cet article nous allons voir comment provisionner un cluster avec ou sans haute disponibilité sur [HCloud](https://console.hetzner.cloud). 
Sans haute disponibilité, on va créer un cluster contenant 2 noeuds (1 master et 1 worker). C'est parfait quand on n'est pas en production.

<br/>

## Pré-requis

- Installer Go
- Installer le binaire Go disponible sur le repository https://github.com/xetys/hetzner-kube

<br/>

## Déploiement du cluster

Créer un compte sur HCloud (entrez vos informations personnelles et surtout une CB)

Ensuite créez un projet sur [HCloud](https://console.hetzner.cloud).

Une fois le projet créé, créer un token API et gardez le précieusement.

Ensuite entrer les commandes suivantes:

```
# Doc: https://github.com/xetys/hetzner-kube/blob/master/docs/cluster-create.md

# Create context
hetzner-kube context add demo
# Create SSH key
hetzner-kube ssh-key add --name macbook
# Create Cluster
hetzner-kube cluster create --name demo --ssh-key macbook --datacenters nbg1-dc3 --worker-server-type cx21 --master-server-type cx11 --worker-count 1
```

> Pour avoir un cluster en HA, il suffit de passer le paramètre `--ha-enabled` à la commande précédente. Il y aura alors 3 masters nodes.

La commande suivante va permettre de créer un contexte Kubernetes "kubernetes-admin@kubernetes" sur votre laptop dans ~/.kube/config

```
#hetzner-kube cluster kubeconfig <cluster-name> -f
hetzner-kube cluster kubeconfig demo -f
```

Il sera ensuite possible de lister les noeuds du cluster:
```
kubectl get nodes

NAME             STATUS    ROLES     AGE       VERSION
demo-master-01   Ready     master    1h        v1.9.6
demo-worker-01   Ready     <none>    1h        v1.9.6
```

<br/>

## Installation d'OpenEBS

Installation de l'operator et de la storageclass:
```
kubectl apply -f https://raw.githubusercontent.com/openebs/openebs/master/k8s/openebs-operator.yaml

kubectl apply -f https://raw.githubusercontent.com/openebs/openebs/master/k8s/openebs-storageclasses.yaml
```

On définit la nouvelle storageclass comme classe par défaut:  
```
kubectl patch storageclass openebs-standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

<br/>

## Installation d'un Ingress Controller 

### Traefik Ingress

**1. Création des Rôles (RBAC):**
```
kubectl apply -f   https://raw.githubusercontent.com/containous/traefik/master/examples/k8s/traefik-rbac.yaml
```

Contenu du fichier distant `traefik-rbac.yaml` :
```
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: traefik-ingress-controller
rules:
  - apiGroups:
      - ""
    resources:
      - services
      - endpoints
      - secrets
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - extensions
    resources:
      - ingresses
    verbs:
      - get
      - list
      - watch
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: traefik-ingress-controller
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: traefik-ingress-controller
subjects:
- kind: ServiceAccount
  name: traefik-ingress-controller
  namespace: kube-system
```

<br/>

**2. Déployement de traefik via Deployment ou DaemonSet**

**Option 1: via Deployment (permet de créer un nodePort)**
```
kubectl apply -f https://raw.githubusercontent.com/containous/traefik/master/examples/k8s/traefik-deployment.yaml
```

Contenu du fichier distant `traefik-deployment.yaml`:
```
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
---
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
  labels:
    k8s-app: traefik-ingress-lb
spec:
  replicas: 1
  selector:
    matchLabels:
      k8s-app: traefik-ingress-lb
  template:
    metadata:
      labels:
        k8s-app: traefik-ingress-lb
        name: traefik-ingress-lb
    spec:
      serviceAccountName: traefik-ingress-controller
      terminationGracePeriodSeconds: 60
      containers:
      - image: traefik
        name: traefik-ingress-lb
        ports:
        - name: http
          containerPort: 80
        - name: admin
          containerPort: 8080
        args:
        - --api
        - --kubernetes
        - --logLevel=INFO
---
kind: Service
apiVersion: v1
metadata:
  name: traefik-ingress-service
  namespace: kube-system
spec:
  selector:
    k8s-app: traefik-ingress-lb
  ports:
    - protocol: TCP
      port: 80
      name: web
    - protocol: TCP
      port: 8080
      name: admin
  type: NodePort
```

<br/>

**Option 2: via DaemonSet (sera indispensable pour la suite du tuto)**
```
kubectl apply -f https://raw.githubusercontent.com/containous/traefik/master/examples/k8s/traefik-ds.yaml
```

Contenu du fichier distant `traefik-ds.yaml` :

```
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
---
kind: DaemonSet
apiVersion: extensions/v1beta1
metadata:
  name: traefik-ingress-controller
  namespace: kube-system
  labels:
    k8s-app: traefik-ingress-lb
spec:
  template:
    metadata:
      labels:
        k8s-app: traefik-ingress-lb
        name: traefik-ingress-lb
    spec:
      serviceAccountName: traefik-ingress-controller
      terminationGracePeriodSeconds: 60
      containers:
      - image: traefik
        name: traefik-ingress-lb
        ports:
        - name: http
          containerPort: 80
          hostPort: 80
        - name: admin
          containerPort: 8080
          hostPort: 8080
        securityContext:
          capabilities:
            drop:
            - ALL
            add:
            - NET_BIND_SERVICE
        args:
        - --api
        - --kubernetes
        - --logLevel=INFO
---
kind: Service
apiVersion: v1
metadata:
  name: traefik-ingress-service
  namespace: kube-system
spec:
  selector:
    k8s-app: traefik-ingress-lb
  ports:
    - protocol: TCP
      port: 80
      name: web
    - protocol: TCP
      port: 8080
      name: admin
```

<br/>

**3. Vérification du déploiement**
```
kubectl --namespace=kube-system get pods
```

<br/>

**4. Déploiement de l'interface d'admin de Traefik**

Via un service:
```
kubectl apply -f https://raw.githubusercontent.com/containous/traefik/master/examples/k8s/ui.yaml
```

Contenu du fichier distant `ui.yaml` :
```
---
apiVersion: v1
kind: Service
metadata:
  name: traefik-web-ui
  namespace: kube-system
spec:
  selector:
    k8s-app: traefik-ingress-lb
  ports:
  - name: web
    port: 80
    targetPort: 8080
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: traefik-web-ui
  namespace: kube-system
spec:
  rules:
  - host: traefik-ui.minikube
    http:
      paths:
      - path: /
        backend:
          serviceName: traefik-web-ui
          servicePort: web
```

<br/>

**5. Accès à l'interface Traefik en dev**
```
echo "ip_dun_worker traefik-ui.minikube" | sudo tee -a /etc/hosts
```

<br/>

**6. Vérification du bon fonctionnement de l'ingress**

**6.1. Déploiement de 3 apps de test**

```
kubectl apply -f https://raw.githubusercontent.com/containous/traefik/master/examples/k8s/cheese-deployments.yaml
```

Contenu du fichier distant `cheese-deployments.yaml` :
```
---
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  name: stilton
  labels:
    app: cheese
    cheese: stilton
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cheese
      task: stilton
  template:
    metadata:
      labels:
        app: cheese
        task: stilton
        version: v0.0.1
    spec:
      containers:
      - name: cheese
        image: errm/cheese:stilton
        resources:
          requests:
            cpu: 100m
            memory: 50Mi
          limits:
            cpu: 100m
            memory: 50Mi
        ports:
        - containerPort: 80
---
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  name: cheddar
  labels:
    app: cheese
    cheese: cheddar
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cheese
      task: cheddar
  template:
    metadata:
      labels:
        app: cheese
        task: cheddar
        version: v0.0.1
    spec:
      containers:
      - name: cheese
        image: errm/cheese:cheddar
        resources:
          requests:
            cpu: 100m
            memory: 50Mi
          limits:
            cpu: 100m
            memory: 50Mi
        ports:
        - containerPort: 80
---
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  name: wensleydale
  labels:
    app: cheese
    cheese: wensleydale
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cheese
      task: wensleydale
  template:
    metadata:
      labels:
        app: cheese
        task: wensleydale
        version: v0.0.1
    spec:
      containers:
      - name: cheese
        image: errm/cheese:wensleydale
        resources:
          requests:
            cpu: 100m
            memory: 50Mi
          limits:
            cpu: 100m
            memory: 50Mi
        ports:
        - containerPort: 80
```

<br/>

**6.2. Création des 3 services**
```
kubectl apply -f https://raw.githubusercontent.com/containous/traefik/master/examples/k8s/cheese-services.yaml
```

Contenu du fichier distant `cheese-services.yaml` :
```
---
apiVersion: v1
kind: Service
metadata:
  name: stilton
spec:
  ports:
  - name: http
    targetPort: 80
    port: 80
  selector:
    app: cheese
    task: stilton
---
apiVersion: v1
kind: Service
metadata:
  name: cheddar
spec:
  ports:
  - name: http
    targetPort: 80
    port: 80
  selector:
    app: cheese
    task: cheddar
---
apiVersion: v1
kind: Service
metadata:
  name: wensleydale
spec:
  ports:
  - name: http
    targetPort: 80
    port: 80
  selector:
    app: cheese
    task: wensleydale
```

<br/>

**6.3. Création de l'ingress**

```
kubectl apply -f https://raw.githubusercontent.com/containous/traefik/master/examples/k8s/cheese-ingress.yaml
```

Contenu du fichier distant `cheese-ingress.yaml` :

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: cheese
spec:
  rules:
  - host: stilton.minikube
    http:
      paths:
      - path: /
        backend:
          serviceName: stilton
          servicePort: http
  - host: cheddar.minikube
    http:
      paths:
      - path: /
        backend:
          serviceName: cheddar
          servicePort: http
  - host: wensleydale.minikube
    http:
      paths:
      - path: /
        backend:
          serviceName: wensleydale
          servicePort: http
```

<br/>

**Accès aux 3 apps en dev**

```
echo "116.203.33.4 stilton.minikube cheddar.minikube wensleydale.minikube" | sudo tee -a /etc/hosts
```

<br/>


### Ingress Nginx
Voir le tuto: https://github.com/kubernetes/ingress-nginx/blob/master/docs/deploy/index.md

<br/>

## Déploiement d'une app via helm

**Installation du tiller**
```
helm init --service-account tiller
```

<br/>

**Création d'un service account**
```
kubectl create serviceaccount --namespace kube-system tiller
# Ajout des droits sur l'ensemble du cluster pour pouvoir déployer dans les différents namespaces
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
kubectl patch deploy --namespace kube-system tiller-deploy -p '{"spec":{"template":{"spec":{"serviceaccount":"tiller"}}}}'
```

<br/>

**Déploiement**

Pour accéder à une application il y a différente possibilités. 

<br/>

**Déploiement option 1: Accès via Nodeport**

Déploiement d'un nodeport:
![image](/images/nodeport.png)

```
kubectl expose deployment hello-world --type=NodePort --name=example-service
kubectl get svc
NAME              TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)          AGE
example-service   NodePort    10.97.67.9   <none>        8080:30485/TCP   2s
kubernetes        ClusterIP   10.96.0.1    <none>        443/TCP          1h

curl http://<ip_cluster>:30485
Hello Kubernetes!
```

`NodePort` est une option que l'on configure directement dans le service. Kubernetes va allouer un port specifique sur chaque noeud du cluster pour accéder au service. Une requête arrivant sur n'importe quel noeud sera routée vers le service.

C'est cool car c'est très simple à mettre en place mais ce n'est pas robuste. De plus on ne peut pas savoir quel port sera alloué au service et pas garantir qu'il sera toujours le même...

Il y a d'autres solutions: 
- LoadBalancer
- Ingress

<br/>

**Déploiement option 2: Accès via LoadBalancer** (si votre IAAS est capable de vous fournir un Load Balancer à la demande)

![image](/images/loadbalancer.png)

Egalement assez simple à mettre en place, il est possible de spécifier dans le YAML qu'un service est de type LoadBalancer. 
Par contre, la fonctionnalité de load balancing doit être implémentée à l'extérieur par le cloud provider. Attention donc aux coûts (i.e. GKE) car à chaque fois que vous aurez à exposer un service au monde extérieur vous devrez créer un nouveau load balancer et obtenir une adresse IP.

<br/>

**Déploiement option 3: Accès via Ingress**

![image](/images/ingress.png)

Contrairement au `NodePort` and au `LoadBalancer`, l'`Ingress` est une ressource complètement indépendante du service. On déclare, crée et détruit l'ingress indépendament des services. 

C'est donc découplé et isolé des services que l'on veut exposer. Cela permet, entre autres, de mieux gérer les rêgles de routage.

------ 

Dans notre cas, nous allons utiliser un ingress. 
On commence par déployer l'application en spécifiant `ClusterIP` comme `serviceType`:
```
helm install --set service.type=ClusterIP stable/ghost
```

A présent on peut créer notre ingress:

Note du 02/01/2018 - Procédure suivante à vérifier (validation d'ici peu... Si cela ne fonctionne pas, voir le contenu du fichier `cheese-ingress.yaml` plus haut) 
```
cat ingress.yaml
```

Output:
```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: iron-hyena-ghost
spec:
  backend:
    serviceName: iron-hyena-ghost
    servicePort: 80
```

Puis on applique:
```
kubectl apply -f ingress.yaml
```

<br/>

## Etendre le cluster

Pour ajouter des workers au cluster existant:
```
hetzner-kube cluster add-worker --worker-server-type cx21 --datacenters nbg1-dc3 --name demo --nodes 1

#hetzner-kube cluster add-worker --worker-server-type cx21 --datacenters nbg1-dc3 --name <cluster-name> --nodes 1
```

