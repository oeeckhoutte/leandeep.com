# Commandes utiles Kubernetes

- Canonical URL: https://leandeep.com/commandes-utiles-kubernetes/
- Author: Olivier Eeckhoutte
- Published: 2019-03-08T17:08:00Z
- Updated: 2019-03-08T17:08:00Z
- Language: fr
- Tags: Kubernetes, AWS EKS
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Commandes propres à Kubernetes

**Créer un namespace**
```
kubectl create ns <new-namespace>
```

<br/>

**Lister tous les types de ressources disponibles sur le cluster**

```
kubectl api-resources
```

<br/>

**Savoir si une ressource appartient à un namespace**
```
kubectl api-resources --namespaced=true
```

<br/>

**Savoir si une ressource appartient PAS à un namespace**
```
kubectl api-resources --namespaced=false
```

<br/>

**Switcher de namespace**
```
# Install kubens with the following command: 
# Sur Mac: brew install kubectx
# Sur Linux (les 3 commandes qui suivent): 
# sudo git clone https://github.com/ahmetb/kubectx /opt/kubectx
# sudo ln -s /opt/kubectx/kubectx /usr/local/bin/kubectx
# sudo ln -s /opt/kubectx/kubens /usr/local/bin/kubens

kubens <namespace>

# Enregistre de manière permanente le namespace pour toutes les commandes kubectl suivantes dans ce contexte
kubectl config set-context --current --namespace=NOM_DU_NAMESPACE
```

<br/>

**Connaître le cluster dans lequel on se situe**
```
kubectl config get-contexts
```

<br/>

**Connaître le namespace dans lequel on se situe**
```
kubectl config view | grep namespace

# Alternative: 
# kubectl config view --minify --output 'jsonpath={..namespace}'
```

<br/>

**Effacer un namespace**
```
kubectl delete ns <namespace-to-delete>
```

<br/>

**Voir les ressources utilisées par les nodes**
```
# Nécessite heapster
kubectl top node
```

<br/>

**Voir les ressources utilisées par les pods**
```
kubectl top pods
```

<br/>

**Voir les logs d'une app particulière dans un namespace particulier**
```
kubectl logs -l app=catalog-catalog-controller-manager -n catalog
```

<br/>

**Voir le cluster sur lequel kubectl est connecté**
```
kubectl config current-context
```

<br/>

**Lister les clusters configurés dans kubeconfig**
```
kubectl config get-clusters
```

<br/>

**Switcher de cluster en cluster**
```
kubectl config use-context cluster_name
```

<br/>

**Obtenir quelques informations sur le cluster**
```
kubectl cluster-info
```

<br/>

**Voir les noeuds du cluster**
```
kubectl get nodes
```

<br/>

**Port forward un service sur k8s chez vous**
```
kubectl -n NAMESPACE_DANS_LEQUEL_SE_TROUVE_LE_SERVICE port-forward svc/NOM_DU_SERVICE_AUQUEL_VOUS_VOULEZ_ACCEDER PORT_CHEZ_VOUS_POUR_ACCEDER_AU_SERVICE:PORT_DU_SERVICE_SUR_K8S
```

Le port sera bindé sur `127.0.0.1`. Il est possible d'ajouter le flag `--address 0.0.0.0`. (Attention à la sécurité)

<br/>

**Installer le dashboard k8s et y accéder**
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml

kubectl proxy
```

<br/>

Maintenant rendez-vous à l'adresse suivante:

`http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/login`

<br/>

Une mire d'authentification va apparaitre pour se connecter au dashboard. Privilégier l'authentification par token. Pour obtenir ce dernier utiliser les commandes suivantes: 

```
TOKEN=$(kubectl describe secret $(kubectl get secrets | grep default | cut -f1 -d ' ') | grep -E '^token' | cut -f2 -d':' | tr -d '\t' | sed -e 's/^[[:space:]]*//')

echo $TOKEN
```

<br/>

**Déployer un 1er service**
```
kubectl run hello-nginx --image=nginx --port=80
kubectl get pods
kubectl get deployments
kubectl expose deployment hello-nginx --type=NodePort
kubectl describe service hello-nginx
kubectl get services

NAME          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
hello-nginx   NodePort    10.111.152.236   <none>        80:31256/TCP   58s
kubernetes    ClusterIP   10.96.0.1        <none>        443/TCP        46m
```

<br/>

Se rendre sur l'URL suivante pour accéder au service Nginx (Nodeport):
`http://localhost:31256/`


<br/>


**Prioriser des pods**

Récupérer le nom de la classe de prioritié 
```
kubectl get priorityClass
```

Modifier le deployment et ajouter cette propriété:
```
[...]
spec:
    containers:
      - name: nimportequelleimage
        image: imagegeniale
    priorityClassName: priority-classname
[...]
```

Vérification:
```
kubectl get pods --all-namespaces -o custom-columns=NAME:.metadata.name,PRIORITY:.spec.priorityClassName
```

<br/>

## Troubleshooting

**Voir les events et status des noeuds**
```
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl describe nodes
```

<br/>

**Voir tous les events d'un deployment**

```
kubectl get events --field-selector involvedObject.name=$DEPLOYMENT_NAME -n $NAMESPACE
```

<br/>

**Voir un "disk pressure"**

```
kubectl describe nodes 2>&1 | grep -i Disk
```

> Configurer le trigger diskPressure (et autres) sur le [kubelet](https://fr.wikipedia.org/wiki/Kubernetes#Kubelet) (et donc les events pour "evicter" les pods) lors de l'installation d'un cluster k8s avec le flag `--eviction-hard": "memory.available<100Mi,nodefs.available<10%,nodefs.inodesFree<5%`. [More here](https://kubernetes.io/docs/tasks/administer-cluster/out-of-resource/)

<br/>

**Voir la consommation cpu et memory des pods les plus gourmands**
```
kubectl top pods
```

<br/>

**Lister les containers par pods**
```
kubectl get pods --all-namespaces -o=jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort

# Pour un pod particulier, pour avoir les container names dans le pod, on peut aussi exécuter:
kubectl logs POD_NAME 
# S'il y a plusieurs containers un message d'erreur apparaîtra indiquant de selectionner un container --> choose one of: [container-name-1 container-name-2]
```

<br/>

**Lister les containers par pods et les trier par AGE**

```
kubectl get po --sort-by=.status.startTime
```

<br/>

**Entrer dans un pod**
```
kubectl exec -it shell-demo -- /bin/bash
```

<br/>

**Effacer tous les pods avec le status Evicted**
```
kubectl get pods | grep Evicted | awk '{print $1}' | xargs kubectl delete pod
```

<br/>

**Vérifier que l'ingress est fonctionnel (même sans CNAME)**

```
curl -k -H "Host: blabla.leandeep.com" https://public-dns.blabla.com
```

<br/>


## Créer un Single node cluster avec kubeadm sur Ubuntu

**Installer kubeadm**
```
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl
```

<br/>

**Déployer le single node cluster**
```
kubeadm init
# Puis suivre les informations qui apparaissent
```

<br/>

## Effacement du cluster
```
# Obtenir le nom du noeud
kubectl get nodes

# Drainer le noeud 
kubectl drain NOM_DU_NOEUD --delete-local-data --force --ignore-daemonsets

# On l'efface
kubectl delete node NOM_DU_NOEUD

# On reset kubeadm
kubeadm reset

# Un reboot permet d'effacer les interfaces réseaux en trop 
sudo reboot
```

<br/>

**Générer un secret TLS (simple sans root CA)**

Certificat simple pour "pinnage":
```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ${KEY_FILE} -out ${CERT_FILE} -subj "/CN=${HOST}/O=${HOST}"
kubectl create secret tls ${CERT_NAME} --key ${KEY_FILE} --cert ${CERT_FILE}
```

<br/>

**Scaler UP or Down un deployment/statefulset**

> Pour restart un pod avec un PVC c'est idéal. Fonctionne bcp mieux qu'un `kubectl edit ...` avec modification du `replicas`.
```
kubectl scale statefulset statefulset_name --replicas=0
kubectl scale statefulset statefulset_name --replicas=1
kubectl scale deployment deployment_name --replicas=0
kubectl scale deployment deployment_name --replicas=1
``` 

<br/>

**Restart de pod(s)**

```
kubectl rollout restart deployment deployment_name
```

<br/>

**Pod anti affinity**

Pour éviter un downtime si plusieurs pods se retrouvent sur un même node KO

Au niveau du Deployment, ajouter:
```
[...]
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-de-dingue
  labels:
    app: api
spec:
  replicas: 2
[...]
  spec:
    affinity:
      podAntiAffinity:
        requireDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
            matchExpressions:
            - key: app
              operator: In
              values:
              - api
          topologyKey: "kubernetes.io/hostname"
    containers:
    [...]
```

> Plus d'infos [ici](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/): 

<br/>

**Liveness Probe sur job always running (no endpoint)**

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: job-de-dingue
  labels:
    app: job
spec:
  replicas: 1
[...]
  spec:
    containers:
      - name: my-job
        image: ...
        livenessProbe:
          exec:
            command:
              - /bin/bash
              - -c
              - |-
                if [ $(find /tmp/health -type f -mmin +5 | wc -l) -gt 0 ]; then exit 1; fi
          initialDelaySeconds: 60
          periodSeconds: 60
          timeoutSeconds: 5
        [...]

```

<br/>

## Commandes propres à EKS (Kubernetes AWS)

**Se connecter à son cluster EKS nouvellement créé**
```
aws --profile=<profile-name> eks update-kubeconfig --name <cluster-name>
export KUBECONFIG=~/.kube/config-<of-your-cluster>
```

<br/>

**Lister les clusters EKS**
```
aws eks list-clusters
```

<br/>

**Démarrer un pod Ubuntu pour debug**

> Pour tester le réseau, services... 

```
kubectl run -it --rm debug-pod --image=mcr.microsoft.com/aks/fundamental/base-ubuntu:v0.0.11
# apt install iputils-ping
```

<br/>


## Commandes propres à AKS (Kubernetes Azure) et infos utiles

**Se connecter à son cluster AKS nouvellement créé**
```
az login

# Ajoute la conf du cluster dans le kube config
az aks get-credentials --resource-group NOM_DU_RESSOURCE_GROUPE --name NOM_DU_CLUSTER_K8S

# Vérification
kubectl config get-contexts
```

<br/>

**Regénérer un Service Principal**

```
# Option 1
az ad sp create-for-rbac --skip-assignment
export RESOURCE_GROUP=...
export AKS_CLUSTER_NAME=...
export SERVICE_PRINCIPAL_ID=...
export SERVICE_PRINCIPAL_SECRET=...
az aks update-credentials \
    --resource-group $RESOURCE_GROUP \
    --name $AKS_CLUSTER_NAME \
    --reset-service-principal \
    --service-principal $SERVICE_PRINCIPAL_ID \
    --client-secret "$SERVICE_PRINCIPAL_SECRET"


# Option 2
SP_ID=$(az aks show --resource-group myResourceGroup --name myAKSCluster \
    --query servicePrincipalProfile.clientId -o tsv)

SP_SECRET=$(az ad sp credential reset --name $SP_ID --query password -o tsv)

az aks update-credentials --resource-group myResourceGroup --name myAKSCluster --reset-service-principal --service-principal $SP_ID --client-secret $SP_SECRET
```

<br/>

**Troubleshooting disk not seen in AKS node**

Ou resynchroniser AKS avec l'état des diques montés dans la VM/ Node.
```
az vm update -g resource_group -n node_name
```

<br/>

**Vérifier si un Service Principal a expiré**

```
SP_ID=$(az aks show --resource-group myResourceGroup --name myAKSCluster \
    --query servicePrincipalProfile.clientId -o tsv)
az ad sp credential list --id $SP_ID --query "[].endDate" -o tsv
```

<br/>

**Les solutions des stockages persistentes sur AKS**

* Azure disk: **Attention seulement ReadWriteOnce**

* Azure files: ReadWriteMany mais attention aux performances



