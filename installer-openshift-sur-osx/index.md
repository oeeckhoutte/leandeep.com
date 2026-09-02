# Installer OpenShift sur OSX

- Canonical URL: https://leandeep.com/installer-openshift-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2018-02-28T22:13:00Z
- Updated: 2018-02-28T22:13:00Z
- Language: fr
- Tags: Docker, Openshift
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Qu'est-ce qu'OpenShift ?

OpenShift est une plateforme de PAAS développée par RedHat qui repose sur [Kubernetes](https://kubernetes.io/). En gros, c'est Kubernetes avec des outils en plus faits pour simplifier la vie des développeurs. Et en plus c'est opensource... 

<br/>

## MiniShift

Si vous voulez tester l'outil ou avoir un environnement local qui ressemble un peu à votre cluster de production, il existe un outil appelé MiniShift.

Ce dernier permet de faire tourner un cluster Openshift sur un seul noeud dans une VM en local. 

<br/>

## Installation de MiniShift

Voici la procédure pour l'installer avec les dépendances nécessaires:
* Docker CE pour OSX
* docker-machine
* Minikube
* xhyve (hyperviseur par défault pour OSX)
* xhyve driver
* MiniShift

```
# Installer docker
# Rendez à l'adresse suivante https://docs.docker.com/docker-for-mac/install/ pour télécharger Docker CE. Il suffit de déplacer le binaire dans /Applications 

# Installer docker-machine
$ curl -L https://github.com/docker/machine/releases/download/v0.13.0/docker-machine-`uname -s`-`uname -m` >/usr/local/bin/docker-machine && \
  chmod +x /usr/local/bin/docker-machine

# Installer Minikube
$ brew cask install minikube

# Installer MiniShift
$ brew cask install minishift

# Installer xhyve
$ brew install --HEAD xhyve 

# Installer xhyve driver
$ brew install docker-machine-driver-xhyve
$ sudo chown root:wheel $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
$ sudo chmod u+s $(brew --prefix)/opt/docker-machine-driver-xhyve/bin/docker-machine-driver-xhyve
```

<br/>

## Création de la VM 

```
# Créer une VM dans xhyve et créer un cluster OpenShift sur cette dernière
minishift start

# Pour utiliser minishift avec virtualbox 
# minishift start --vm-driver=virtualbox
```

Si tout se passe bien, vous devriez avoir ceci: 

![image](/images/oc-login.png)

<br/>

## Test avec une application exemple

Dans cette section, nous allons déployer une application NodeJS fournie par OpenShift qui nous permettra de vérifier que tout fonctionne. 

Il y a 3 manières de "piloter" OpenShift. Vous pouvez le faire avec le CLI, l'interface Web ou directement via l'API. Bien que l'interface Web soit très simple à utiliser, on va utiliser le CLI pour la suite de cet article. 

<br/>

Pour l'installer, il suffit d'exécuter la commande suivante: 

```
$ brew install openshift-cli

# Vérifier l'installation
$ oc version
oc v3.7.1+ab0f056
kubernetes v1.7.6+a08f5eeb62
features: Basic-Auth

Server https://192.168.64.5:8443
openshift v3.7.1+a8deba5-34
kubernetes v1.7.6+a08f5eeb62
```

<br/>

Si vous souhaitez obtenir des informations sur l'interface Web, il y a un [très bon tutoriel sur le site d'OpenShift](https://learn.openshift.com/introduction/getting-started/) qui vous expliquera les points ci-dessous en vous aidant à déployer la webapp qui ressemble à cela: 

![image](/images/map-app-openshift.png)

<br/>

* Comment déployer une image disponible sur dockerhub
* Comment *scaler* votre application extrèmement rapidement
* Comment fonctionne le Routing HTTP avec HaProxy pour les services créés automatiquement lors du déploiement de l'image. (Prenez le temps de regarder, sécuriser vos routes par TLS est vraiment très simple. C'est limite une case à cocher...)
* Comment *builder* une image à partir de votre code source sur Git (via l'outil S2I opensource. La documentation de cet outil est disponible [ici](https://docs.openshift.org/latest/creating_images/s2i.html))

<br/>

```
oc login
# Utilisez developer/developer comme credentials

# Création d'un pod et déploiement de l'application test (git clone, build et push de l'image)
oc new-app https://github.com/openshift/nodejs-ex -l name=myapp

# Surveiller le déploiement en accédant aux logs
oc logs -f bc/nodejs-ex

# Création d'un service Kubernetes 
# i.e: Exposer le port 80 en configurant un reverse proxy qui pointe sur le port 8080 du Pod précédement créé. 
oc expose svc/nodejs-ex
```

<br/>

Si tout s'est bien passé, une URL "publique" va être générée et vous permettra d'accéder à l'application juste déployée. L'application d'exemple déployée **via le CLI** ressemble à ceci:

![image](/images/front-app-example-openshift.png)

<br/>

## Commandes utiles pour le CLI

**Switcher de compte OpenShift**
```
oc login --username developer 

# oc login --username <username> --password <password>
# oc login --token <token>
```

<br/>

**Lister les clusters sur lesquels on s'est déjà connecté**
```
oc config get-clusters
```

<br/>

**Se connecter à un cluster spécifique avec un compte particulier**
```
oc login https://clusterA.leandeep.com --username superadmin
```

<br/>

**Lister tous les contextes**
```
oc config get-contexts
```

<br/>

**Who am I ?**
```
oc whoami

# oc whoami --token (voir le token actuel)
# oc whoami --show-server (voir le cluster actuel)
```

<br/>

**Lister les projets**
```
oc get projects
```

<br/>

**Créer un projet**
```
oc new-project mon_super_projet
```

<br/>

**Accéder à un projet**
```
oc project <nom-du-projet>
```

<br/>

**Créer une app s2i (source 2 image)**

```
oc new-app --source-secret <nom-de-votre-secret-pour-se-connecter-a-votre-source-control> <image-docker-permettant-de-faire-du-s2i>~https://bitbucket.org/user/repo-avec-du-nodejs-et-un-dockerfile.git --name nom-de-votre-app-dans-votre-projet
```

<br/>
Les ressources suivantes vont être automatiquement créées:

```
--> Creating resources ...
    imagestream "image-docker-permettant-de-faire-du-s2i" created
    imagestream "nom-de-votre-app-dans-votre-projet" created
    buildconfig "nom-de-votre-app-dans-votre-projet" created
    deploymentconfig "nom-de-votre-app-dans-votre-projet" created
    service "nom-de-votre-app-dans-votre-projet" created
```

<br/>

**Update une app s2i**
```
oc start-build <nom-du-build-pour-votre-app>
```

<br/>

**Delete une app**
```
oc delete all -l app=bla-bla-bla-https
```

<br/>

**Donner les droits en lecture à un utilisateur**
```
oc adm policy add-role-to-user view developer -n mon_super_projet

# oc adm policy add-role-to-user edit <username> -n <project> (donne les droits d'écriture + création de déploiements + effacement d'applications)

# oc adm policy add-role-to-user admin <username> -n <project> (donne tous les droits sur le projet)
```

<br/>

**Lister toutes les ressources d'un projet (dont DNS exposé)**
```
oc get all

# Plus direct pour obtenir la route exposée
# oc get routes

# Lister et filtrer sur un label
oc get all -o name --selector app=apinodejs
```

<br/>

**Obtenir plus d'information sur une ressource**
```
oc describe route/apinodejs
# alternative 
# oc describe route apinodejs
```

<br/>

**Comprendre OpenShift (obtenir des informations sur les ressources)**
```
oc get 
# ou 
# oc types
# ou
# oc explain route.spec.host (utile lorsqu'on sort les réponses au format JSON. Exemple oc get route/apinodejs -o json ==> lire l'arborescence) 
```

<br/>

**Editer une ressource**
```
oc edit route/apinodejs 

ou 
oc edit route/apinodejs -o json
```

<br/>

**Créer une ressource (formats json ou yml acceptés)**
```
oc create -f apinodejs-fqdn.json

# Commande disponible pour la création de route
# oc create route edge apinodejs-fqdn --service apinodejs --insecure-policy Allow --hostname www.example.com
```

<br/>

**Editer une ressource**
```
oc replace -f apinodejs-fqdn.json

# Erreur si la ressource n'existe pas. L'alternative: oc apply 
```

<br/>

**Editer à la volée**
```
oc patch route/apinodejs-fqdn --patch '{"spec":{"tls": {"insecureEdgeTerminationPolicy": "Allow"}}}'

# Erreur si la ressource n'existe pas. L'alternative: oc apply
```

<br/>

**Ajouter/Retirer un label sur un service**
```
# Ajouter le label
oc label service/apinodejs web=true

# Retirer le label
oc label service/apinodejs web-
```

<br/>

**Effacer une ressource**
```
oc delete route/apinodejs-fqdn

# Effacer plusieurs ressources
# oc delete all [--all] --selector app=apinodejs
```

<br/>

**Créer un environnement from scratch**
```
conda create --name py35 python=3.5 
```

<br/>

**Connect as Minishift superadmin**
```
oc login -u system:admin
```

<br/>

**Accéder à Minishift en local**
```
oc login https://<IP>:8443 -u system:admin --insecure-skip-tls-verify=true
```

<br/>

**Obtenir l'IP de Minishift**
```
minishift ip
```

<br/>

## Troubleshooting

**Un pod en terminating state ne se kill pas**

```
oc get po 
oc delete pod <pod-name> -n <pod-namespace> --grace-period=0 --force
```

<br/>

**Un provisioned service "marked for deletion" ne s'efface pas**

```
oc edit serviceinstance <provisioned-service> -n <namespace>
# Effacer metadata.finalizers de l'instance comme workaround
```

<br/>

**L'application ne s'affiche pas**

Si vous avez l'erreur suivante, c'est qu'il y a un problème de résolution DNS sur votre Mac:

<br/>

![image](/images/openshift-app-unreachable.png)

<br/>

Pour corriger le problème, changez le DNS de votre Mac et utilisez celui de Google.
Pour ce faire, allez dans Préférences Système --> Network --> Cliquez sur le bouton avancé en bas à droit après avoir sélectionné l'interface réseau que vous utilisez --> Cliquez sur l'onglet DNS --> Ajoutez 8.8.8.8 dans la section DNS

<br/>

**Vous avez tout crashé et vous voulez tout recommencer de 0**

En cas d'erreur avec votre VM, cette commande peut être utile pour effacer les dossiers en cache. Supprimer la VM dans VirtualBox ne suffit pas.

```
# Effacer le cache et la VM
minishift delete --clear-cache

# recréer votre VM
minishift start delete

# Si éventuellement vous ne pouvez pas recréer votre nouvelle VM car il reste des fichiers persistants, effacer le dossier suivant:
rm -rf ~/.minishift/machines/*
```

