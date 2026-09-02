# Lister les process Linux dans une image redhat ubi-minimal

- Canonical URL: https://leandeep.com/lister-les-process-linux-dans-une-image-redhat-ubi-minimal/
- Author: Olivier Eeckhoutte
- Published: 2020-01-10T19:49:00+02:00
- Updated: 2020-01-10T19:49:00+02:00
- Language: fr
- Tags: Linux, Redhat, Docker, Openshift, Kubernetes
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


`ps` n'est pas disponible dans les nouvelles images minimales Redhat `ubi8-minimal`. Voici un article de RedHat expliquant ce que sont ces images https://www.redhat.com/en/blog/introducing-red-hat-universal-base-image

Pour réaliser un `ps aux`, cela va être compliqué... 

2 options s'offrent à nous:

* Option 1: Soit On veut ajouter *at vitam eternam* le binaire `ps` dans son container/ ou pod.

* Option 2: Ou soit on veut ajouter `ps` une fois que le container ou pod a démarré (juste une fois).

<br/>

## Option 1

Il faut surcharger l'image Docker `ubi8-minimal`. Il suffit de faire dans un nouveau Dockerfile:

```
FROM registry.access.redhat.com/ubi8-minimal
RUN microdnf update && microdnf install procps; 
```

Et suite, la builder et la pusher sur votre propre registry Docker.

<br/>

## Option 2

Entrer dans le container/ pod qui tourne et exécuter les commandes suivantes:

```
kubectl exec -it MON_POD_ID bash
microdnf update && microdnf install procps
```

<br/>

## Jouer avec ps

Voir l'utilisation de la mémoire des processes:
```
ps -o pid,user,%mem,command ax | sort -b -k3 -r
```

