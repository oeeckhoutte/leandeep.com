# Créer une VM sur Google Cloud Platform en cli

- Canonical URL: https://leandeep.com/cr%C3%A9er-une-vm-sur-google-cloud-platform-en-cli/
- Author: Olivier Eeckhoutte
- Published: 2020-06-03T09:15:00Z
- Updated: 2020-06-03T09:15:00Z
- Language: fr
- Tags: DevOps, GCP
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons voir comment créer une VM dans google cloud avec gcloud en cli.

<br/>

## Setup

**Accès à Cloud Shell**

Ouvrir `google cloud console` et cliquer sur `cloud shell` et exécuter les commandes suivantes:

```
# Verify your active account
gcloud auth list

# You can list your project ID
gcloud config list project
```

<br/>

**Renseigner un région et zone**

Voici les régions et zones disponibles pour les instances E2 (comme `e2-medium`) :

| Région            | Zones disponibles                                      |
|-------------------|--------------------------------------------------------|
| **Western US**    | `us-west1-a`, `us-west1-b`                            |
| **Central US**    | `us-central1-a`, `us-central1-b`, `us-central1-d`, `us-central1-f` |
| **Eastern US**    | `us-east1-b`, `us-east1-c`, `us-east1-d`              |
| **Western Europe**| `europe-west1-b`, `europe-west1-c`, `europe-west1-d` |
| **Eastern Asia**  | `asia-east1-a`, `asia-east1-b`, `asia-east1-c`        |

<br/>

```
gcloud config set compute/region europe-west1
export REGION=europe-west1
export ZONE=europe-west1-b
```

<br/>

**Création de la VM**

```
gcloud compute instances create my_vm_test --machine-type e2-medium --zone=$ZONE
gcloud compute ssh my_vm_test --zone=europe-west1-b
```

<br/>

Voilà.
