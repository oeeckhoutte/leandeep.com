# Activer l'IP forwarding sur une instance GCP après sa création

- Canonical URL: https://leandeep.com/activer-lip-forwarding-sur-une-instance-gcp-apr%C3%A8s-sa-cr%C3%A9ation/
- Author: Olivier Eeckhoutte
- Published: 2022-11-20T09:22:00Z
- Updated: 2022-11-20T09:22:00Z
- Language: fr
- Tags: tips, gcloud
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article très rapide nous allons voir comment activer l'IP forwarding sur une instance GCP déjà créée. L'idée est d'éviter de l'effacer et de la recréer comme on peut le voir dans trop d'articles 

<br/>


## Exporter la config de votre VM
```
./gcloud compute instances export instance-name \
    --project VOTRE-PROJET \
    --zone LA-ZONE-CONTENANT-VOTRE-VM \
    --destination=instance-name_export
```


<br/>

## Modification de la config exportéee

Editer le fichier `instance-name_export` et changer `canIpForward: false` par `canIpForward: true`


<br/>

## Update de votre instance

```
./gcloud compute instances update-from-file instance-name \
    --project VOTRE-PROJET \
    --zone LA-ZONE-CONTENANT-VOTRE-VM \
    --source=instance-name_export
```

