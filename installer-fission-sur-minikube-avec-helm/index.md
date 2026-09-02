# Installer Fission sur Minikube avec Helm

- Canonical URL: https://leandeep.com/installer-fission-sur-minikube-avec-helm/
- Author: Olivier Eeckhoutte
- Published: 2018-08-01T21:48:00Z
- Updated: 2018-08-01T21:48:00Z
- Language: fr
- Tags: Cloud
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Introduction

Fission est un Framework perfomant et efficace permettant de faire du serverless sur Kubernetes.

Ce Framework permet d'exécuter des fonctions dans n'importe quel langage et sont coeur est écrit en Go.Fission supporte actuellement le NodeJS, Python, Ruby, Go, PHP, Bash et n'importe quel exécutable Linux. Le support d'autres langages est prévu.

Dans cet article, nous allons voir comment l'installer sur un Minikube. 

<br/>

## Installation 

On considère que Virtualbox, kubectl et minikube sont déjà installés sur votre poste.

Sinon voici les commandes pour une machine sous Ubuntu. 

```
# Installation de virtualbox
sudo apt install virtualbox

# Installation de Kubectl
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin

# Installation de Minikube
curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.14.0/minikube-darwin-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
```

Ensuite on démarre minikube:

```
# Démarrage de Minikube
minikube start

# On vérifie que minikube & kubernetes fonctionnent bien avec les commandes suivantes:
kubectl get nodes
# NAME       STATUS    AGE
# minikube   Ready     14s

kubectl config current-context
# minikube

minikube ip
# 192.168.99.100

kubectl cluster-info
# Kubernetes master is running at https://192.168.99.100:8443
# KubeDNS is running at https://192.168.99.100:8443/api/v1/proxy/namespaces/kube-system/services/kube-dns
# kubernetes-dashboard is running at https://192.168.99.100:8443/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard
```

On installer Helm:

```
# Installation de Helm
curl -Lo /tmp/helm-linux-amd64.tar.gz https://kubernetes-helm.storage.googleapis.com/helm-v2.1.3-linux-amd64.tar.gz
tar -xvf /tmp/helm-linux-amd64.tar.gz -C /tmp/
chmod +x  /tmp/linux-amd64/helm && sudo mv /tmp/linux-amd64/helm /usr/local/bin/

# Initialisation de helm et installation de Tiller (le serveur helm)
helm init

# On met à jour les derniers charts de Helm
helm repo update
# * Happy Helming * 

# On liste les packages Helm installés
helm ls
```

On installe Fission:

```
# Clone Fission Repo
git clone https://github.com/fission/fission.git
cd fission/charts/

# Installation de Fission Chart via Helm
helm install --name fission-sample --set serviceType=NodePort fission/

# Followup notes in output
curl http://fission.io/linux/fission > fission && chmod +x fission && sudo mv fission /usr/local/bin/

export FISSION_URL=http://$(minikube ip):31313
export FISSION_ROUTER=$(minikube ip):31314

echo $FISSION_URL $FISSION_ROUTER
# http://192.168.99.100:31313 192.168.99.100:31314

# Installation de fission CLI
curl -Lo /tmp/fission http://fission.io/linux/fission && chmod +x /tmp/fission && sudo mv /tmp/fission /usr/local/bin/
```

Création de son premier environnement Nodejs sur Fission:

```
# Création d'un environnement nodejs
fission env create --name nodejs --image fission/node-env

# Example de code Nodejs
echo 'module.exports = function(context, callback) { callback(200, "Hello, world!\n"); }' > hello.js

# Creation d'une fonction
fission function create --name hello --env nodejs --code hello.js

# Création d'une Route
fission route create --method GET --url /hello --function hello

fission env list
# NAME   UID                                  IMAGE
# nodejs 39c20a26-272a-402d-b384-53e48574c6fb fission/node-env

fission route list
# NAME                                 METHOD URL    FUNCTION_NAME FUNCTION_UID
# 47f15d32-ebce-4ab5-847d-bdee521bd597 GET    /hello hello         

fission function list
# NAME  UID                                  ENV
# hello e0aec068-4ff7-4e2d-8913-ed9283b6e81c nodejs

# Test requête
curl http://$FISSION_ROUTER/hello
# Hello, world!
```

