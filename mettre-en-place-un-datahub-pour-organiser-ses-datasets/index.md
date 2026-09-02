# Mettre en place un datahub pour organiser ses datasets

- Canonical URL: https://leandeep.com/mettre-en-place-un-datahub-pour-organiser-ses-datasets/
- Author: Olivier Eeckhoutte
- Published: 2020-09-12T19:49:00+02:00
- Updated: 2020-09-12T19:49:00+02:00
- Language: fr
- Tags: Dataset, Datahub, Data, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons créer voir comment créer un datahub pour organiser ses datasets. 
La solution open source que nous allons utiliser est [CKAN](https://ckan.org/). D'après leur site internet, il s'agit de "the world’s leading Open Source data portal platform". Je ne sais pas si c'est vrai mais c'est utilisé par pas mal de sites institutionnels comme data.gouv (USA), opendata.swiss, Government of Canada, Berlin open data... La solution est simple à installer et est très pratique. Elle permet d'organiser, d'avoir des stats d'utilisation et de centraliser tous ses datasets au même endroit.

<br/>

## Installation sur Ubuntu 18+

**Pré-requis**

```
sudo apt update
sudo apt install -y git docker.io docker-compose

# Add your user to the "docker" group
sudo usermod -aG docker <myUser>

# Restart the system
sudo shutdown -rf 0
```

<br/>

**Clonage du repo et configuration:**

```
mkdir ./ckan
cd ~/ckan

git clone https://github.com/oeeckhoutte/docker-ckan
cd docker-ckan

# dupliquer le fichier de config
cp .env.example .env
```

Editer le fichier `.env` et remplacer `CKAN_SITE_URL` par `http://localhost:5000`.


> Il y a un bug de permission sur l'image Docker: <br/>
> `Error - <type 'exceptions.OSError'>: [Errno 13] Permission denied: '/var/lib/ckan/storage/uploads'`<br/>
> Pour corriger ce problème, éditer le fichier `./ckan/Dockerfile` et ajouter les 2 lignes suivantes avant la dernière commande: 
> 
> ```
> RUN mkdir -p /var/lib/ckan/storage/uploads
> RUN chown -R ckan:ckan /var/lib/ckan/storage
> ```
**Builder l'image docker:**

```
docker-compose build
```

<br/>

**Démarrer CKAN:**

```
docker-compose up -d
```

<br/>

Une fois les containers initialisés, rendez-vous sur [http://localhost:5000/](http://localhost:5000/)

<br/>

> Credentials admin par défault: ckan_admin/test1234
<br/><br/>
> Exécuter [*paster*](https://docs.ckan.org/en/2.8/maintaining/paster.html) situé dans un container: `docker-compose -f docker-compose.yml exec ckan /bin/bash -c "paster ..."`

