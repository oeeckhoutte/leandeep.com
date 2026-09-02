# Data Version Control pour vos projets data ou algo-trading

- Canonical URL: https://leandeep.com/data-version-control-pour-vos-projets-data-ou-algo-trading/
- Author: Olivier Eeckhoutte
- Published: 2023-01-02T12:00:00+02:00
- Updated: 2023-01-02T12:00:00+02:00
- Language: fr
- Tags: AlgoTrading, dvc, data science, data
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons voir comment versionner nos datasets et notre code. Les datasets ne seront pas stockés sur git car cet outil n'est pas fait pour stocker des fichiers volumineux. Il faut donc stocker les données ailleurs. Ici je vais les stocker sur Google Drive. DVC (Data Version Control) va permettre de versionner les data en créant une référence (un hash) qui sera stocké dans le commit git. C'est simple mais excessivement efficace. 

> Pourquoi Google Drive ?<br/>
> Il est possible de connecter DVC à plusieurs data storages. Minio est une alternative très intéressante. J'ai déjà utilisé cet outil plusieurs fois par le passé en remplacement d'un bucket s3 classique sur AWS. C'est qualitatif et donc je le recommande. Néanmoins il faut le maintenir. Un abonnement Google Drive à 2 To par an coûte 100€ par an. C'est largement *worth it* et on a largement de quoi voir venir avecc autant de stockage.

Voici l'arborescence des projets data/algo-trading que j'utilise:

```
├── README.md
├── data
│   └── raw
│       ├── BTCUSDT-2017-2022-1mth.csv
│       └── BTCUSDT-2017-2022-1mth.csv.dvc (generated)
├── docs.md
├── mypy.ini
├── processes
│   └── get_data.py
├── pyproject.toml
├── requirements.txt
├── results
│   ├── RSI-BTCUSDT-20170101-20201231-12h.csv
...
```

<br/>

## Setup dvc and add first dataset

```
# cd dans_mon_repo
git init
git remote add origin git@github.com:...
git branch -M master
git push -u origin master
git checkout -b votre_branch
dvc init
dvc add data/raw/BTCUSDT-2017-2022-1mth.csv 
# cette commande génère le fichier BTCUSDT-2017-2022-1mth.csv.dvc
# L'output de la commande dvc add affiche la commande suivante à exécuter:
git add data/raw/BTCUSDT-2017-2022-1mth.csv.dvc data/raw/.gitignore 
git commit
dvc remote add -d storage gdrive://uri_de_votre_dossier_sur_gdrive_le_folder_id
git commit .dvc/config -m "Configure remote storage on Google Drive"
git push origin votre_branch
dvc push
```

<br/>

## Récupérer ses data sur nouveau repo cloné

```
# cd /tmp
# git clone repo_url
# cd repo

tree
├── README.md
├── data
│   └── raw
│       └── BTCUSDT-2017-2022-1mth.csv.dvc
├── docs.md
├── mypy.ini
├── processes
│   └── get_data.py
├── pyproject.toml
├── requirements.txt
└── results
dvc pull

tree
├── README.md
├── data
│   └── raw
│       ├── BTCUSDT-2017-2022-1mth.csv
│       └── BTCUSDT-2017-2022-1mth.csv.dvc
├── docs.md
├── mypy.ini
├── processes
│   └── get_data.py
├── pyproject.toml
└── results
```


<br/>

## git checkout et récupérer les data lié au commit

```
git checkout mon_commit_hash
dvc checkout
# cela va automatiquement modifier le dataset
```

