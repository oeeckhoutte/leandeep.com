# Installer Argo workflow sur OSX

- Canonical URL: https://leandeep.com/installer-argo-workflow-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2022-07-26T22:13:00Z
- Updated: 2022-07-26T22:13:00Z
- Language: fr
- Tags: Docker, Kubernetes, Argo
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons voir comment installer Argo workflow localement sur OSX. Il s'agit d'une installation très simple utilisant Docker-desktop et Kubernetes. Cette installation n'est pas recommandée pour de la production. Elle permet de tester et d'évaluer l'outil ou de simplement créer/développer des workflows depuis votre poste local.

<br/>

## Installer Argo Cli 

```
curl -sLO https://github.com/argoproj/argo-workflows/releases/download/v3.2.6/argo-darwin-amd64.gz
gunzip argo-darwin-amd64.gz
chmod +x argo-darwin-amd64
mv ./argo-darwin-amd64 /usr/local/bin/argo
argo version
```

<br/>

## Déploiement d'Argo sur k8s 

```
kubectl create ns argo
kubectl apply -n argo -f https://raw.githubusercontent.com/argoproj/argo/stable/manifests/quick-start-postgres.yaml

```

<br/>

## Accès l'interface 

```
kubectl -n argo port-forward deployment/argo-server 2746:2746
```


<br/>


## Déploiement d'un worklow de test

```
argo submit -n argo --watch https://raw.githubusercontent.com/argoproj/argo/master/examples/hello-world.yaml
```

<br/>

## Debugging 

```
argo list -n argo
argo get -n argo @latest
argo logs -n argo @latest
```
