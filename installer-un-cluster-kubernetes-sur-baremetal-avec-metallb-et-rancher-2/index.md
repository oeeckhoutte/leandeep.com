# Installer un cluster Kubernetes sur baremetal avec metalLB et Rancher 2

- Canonical URL: https://leandeep.com/installer-un-cluster-kubernetes-sur-baremetal-avec-metallb-et-rancher-2/
- Author: Olivier Eeckhoutte
- Published: 2020-11-19T23:12:00+02:00
- Updated: 2020-11-19T23:12:00+02:00
- Language: fr
- Tags: metalLB, kubernetes, rancher, baremetal
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Dans cet article, nous allons voir comment installer un cluster Kubernetes sur un ou plusieurs noeuds "physiques". On est sur de l'auto-hébergement. MetalLB sera utilisé pour remplacer les load balancers des "clouders". MetalLB est une implémentation de Load Balancer pour les clusters Kubernetes Bare Metal, utilisant des protocoles de routage standard.
Rancher 2 sera également utilisé. On aurait pu utiliser kubeadm mais cette solution nous simplifie clairement la vie.

<br/>

## Pré-requis

* Docker

<br/>

## Lancer Rancher 2 via Docker

```
sudo docker run -d --privileged --restart=unless-stopped -p 8443:443 rancher/rancher
```

<br/>

## Provisionner un cluster k8s

Une fois le serveur Rancher démarré, connectez-vous en créant un compte admin puis créez un cluster Kubernetes. Pour faire simple dans cet article, cochez les cases `etcd`, `controle-plane`, `worker`. Cela va générer une commande Docker qu'il suffira d'exécuter sur le noeud que vous avez à disposition pour installer votre cluster.

<br/>

La commande va ressembler à ceci:

```
export IP_LOCAL=
export TOKEN=6r5q7w5wnzk95g84bv2zclc4qn5k5dwvc8m9vxgdqjgcvf2vgxbcm8
export CA_CHECKSUM=e768299cdfb443db9b772a23519030f49ad93deaeaedb8064d9aaf2e9b260f77
sudo docker run -d --privileged --restart=unless-stopped --net=host -v /etc/kubernetes:/etc/kubernetes -v /var/run:/var/run rancher/rancher-agent:v2.5.2 --server https://$IP_LOCAL:8443 --token $TOKEN --ca-checksum $CA_CHECKSUM --etcd --controlplane --worker
```

<br/>

## Installer helm 3+

Télécharger le package helm 3.4.1 depuis [l'adresse suivante](https://github.com/helm/helm/releases) puis exécutez les commandes suivantes:

```
tar -zxvf helm-v3.4.1-linux-amd64.tar.gz
sudo chmod +x linux-amd64/helm
mv linux-amd64/helm /usr/local/bin/helm
```

<br/>

## Installer kubectl

```
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
kubectl version --client
```

<br/>

Depuis l'interface admin de Rancher, récupérez le `kubectl` config. Collez le dans le fichier `~/.kube/config` de votre poste local pour que kubectl puisse communiquer avec votre cluster. Cela vous permettra d'exécuter des commandes kubernetes et installer metalLB depuis votre poste local.

<br/>

## Installer et configurer metalLB

```
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.9.3/manifests/namespace.yaml

kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.9.3/manifests/metallb.yaml

# On first install only
kubectl create secret generic -n metallb-system memberlist --from-literal=secretkey="$(openssl rand -base64 128)"
```

<br/>

Vérifier que metalLB tourne bien:

```
kubectl get pods -n metallb-system
```

<br/>

Créer un confimap `config.yaml` permettant de configurer metalLB en mode Layer 2. Ce mode est le plus simple à configurer. Il suffit de configurer uniquement les adresses IP.
Le mode Layer 2 ne requiert pas d'avoir les adresses IP attachées à l'interface réseau du noeud worker. 

<br/>

Remplacer *`- 192.168.15.120-192.168.15.250`* du configmap ci-dessous par le range d'IP de votre réseau.

```
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
  config: |
    address-pools:
    - name: default
      protocol: layer2
      addresses:
      - 192.168.15.120-192.168.15.250
```

<br/>

Appliquer le configmap

```
kubectl apply -f config.yaml
```

<br/>

Maintenant, retourner dans l'interface Rancher, Cluster, Namespaces et déplacer metallb-system dnas le project "System".

![image](/images/rancher1.png)

![image](/images/rancher2.png)

![image](/images/rancher3.png)

<br/>

## Test demo app

```
git clone https://github.com/jodykpw/metallb-nginx-demo.git
cd metallb-nginx-demo
helm install --name nginx-demo ./
```

> Facultatif: éditer `values.yaml`, changer le type de service à `LoadBalancer`. Je n'ai pas eu besoin de faire cela mais c'est recommandé. J'ai suivi la procédure qui suit.

<br/>

**Deployer Nginx comme Ingress Controller**

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.34.1/deploy/static/provider/baremetal/deploy.yaml
```

<br/>

Editer l'ingress-controller et changer `spec.type` de **NodePort à LoadBalancer**.

```
kubectl edit svc ingress-nginx-controller -n ingress-nginx
```

<br/>

Créer un ingress via l'interface Rancher. J'ai associé un hostname dans l'ingress. Créer soit une entrée dans votre `/etc/hosts` ou un CNAME sur votre DNS.

![image](/images/ingress1.png)

![image](/images/ingress2.png)

<br/>

Vérifier que le pod est bien "running":

```
kubectl get svc --all-namespaces
```

<br/>

Depuis votre navigateur, rendez-vous sur `nuc.com` pour voir le résultat suivant:

![image](/images/demo.png)

<br/>

## Test grafana app

Il vous est possible de provisionner un grafana directement depuis le catalogue Rancher. Instanciez en un puis créez un ingress avec un hostname comme par example `grafana.leandeep.com` et ajoutez l'entrée dans votre `/etc/hosts`

![image](/images/ingress3.png)

![image](/images/grafana.png)

<br/>

## Facultatif: Let's encrypt

Installer le cert-manager
```
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.0.3/cert-manager.yaml
```

<br/>

Vérifier que les pods sont running:
```
kubectl get pods --namespace cert-manager
```

<br/>

**Configurer l'env staging**. Créer un fichier `staging_issuer.yaml` et ajouter le contenu suivant:

```
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
 name: letsencrypt-staging
spec:
 acme:
   # The ACME server URL
   server: https://acme-staging-v02.api.letsencrypt.org/directory
   # Email address used for ACME registration
   email: john@example.com
   # Name of a secret used to store the ACME account private key
   privateKeySecretRef:
     name: letsencrypt-staging
   # Enable the HTTP-01 challenge provider
   solvers:
   - http01:
       ingress:
         class:  nginx
```

<br/>

Appliquer la ressource:
```
kubectl apply -f staging_issuer.yaml
```

<br/>

Mettez à jour l'ingress. Voici un example:

```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/issuer: letsencrypt-staging
  name: home-ingress
  namespace: default
spec:
  tls:
  - hosts:
    - example.io
    secretName: home-example-io-tls
  rules:
  - host: example.io
    http:
      paths:
      - backend:
          serviceName: nginx
          servicePort: 80
        path: /
```

<br/>

Vérifier le bon fonctionnement:
```
kubectl describe certificate
```

<br/>

**Configurer le certif de prod.**

Créer le fichier `production-issuer.yaml` et ajouter le contenu suivant:
```
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
 name: letsencrypt-prod
spec:
 acme:
   # The ACME server URL
   server: https://acme-v02.api.letsencrypt.org/directory
   # Email address used for ACME registration
   email: user@example.com
   # Name of a secret used to store the ACME account private key
   privateKeySecretRef:
     name: letsencrypt-prod
   # Enable the HTTP-01 challenge provider
   solvers:
   - http01:
       ingress:
         class:  nginx
```

<br/>

Appliquer le issuer:

```
kubectl apply -f production-issuer.yaml
```

<br/>

Editer votre ingress. Voici un example:

```
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/issuer: letsencrypt-prod
  name: home-ingress
  namespace: default
spec:
  tls:
  - hosts:
    - example.io
    secretName: home-example-io-tls
  rules:
  - host: example.io
    http:
      paths:
      - backend:
          serviceName: nginx
          servicePort: 80
        path: /
```

<br/>

> Attention, l'obtention du certificat peut prendre entre 2 et 5 minutes. 

<br/>

Checker le certificat:
```
kubectl describe certificate
```

<br/>

## Alternative: 

**pfSense + Let’s Encrypt Wildcard + HA Proxy comme Reverse Proxy:** solution prometteuse à tester 

