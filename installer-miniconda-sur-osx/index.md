# Installer (Mini)Conda sur OSX

- Canonical URL: https://leandeep.com/installer-miniconda-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2017-06-04T20:57:00Z
- Updated: 2017-06-04T20:57:00Z
- Language: fr
- Tags: Machine Learning, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Qu'est-ce que Conda ?

Conda est un outil permettant de gérer les packages scientifiques utiles notamment pour faire du Machine Learning. Il gère aussi les dépendances de ces packages; même celles en dehors de Python (Librairies C, Paquets R...). Il permet également de gérer des environnements virtuels comme virtualenv. C'est un outil très répandu que vous retrouverez dans beaucoup de cours ou tutoriels. Il est donc intéressant de l'installer sur votre poste. 

<br/>

## Qu'est-ce qu'Anaconda ?

Conda est le gestionnaire de paquets d'Anaconda. Anaconda est une distribution gratuite de Python délivré par la société Continuum Analytics qui contient plus d'un milliers de paquets permettant de faire des sciences, des mathématiques, de l'ingénierie et de l'analyse de données. C'est une sorte de gros package incluant tous les outils nécessaires pour faire du Machine Learning.

<br/>

## Qu'est-ce que Miniconda ?

C'est une alternative à Anaconda. C'est beaucoup plus léger car il ne contient que Conda et quelques dépendances nécessaires à son fonctionnement. 

<br/>

## Installer Miniconda sur OSX

Il faut commencer par télécharger un script bash disponible à l'[adresse suivante](https://conda.io/miniconda.html).

```
wget https://repo.continuum.io/miniconda/Miniconda3-latest-MacOSX-x86_64.sh
```

<br/>

Une fois téléchargé, il faut exécuter le script dans le terminal et suivre les instructions affichées à l'écran:

```
bash Miniconda3-latest-MacOSX-x86_64.sh
```

<br/>

Si comme moi vous utilisez ohmyzsh à la place bash, ajoutez la ligne suivante dans le fichier ~/.zshrc (prenez soin de changer l'utilisateur "olivier" par le votre):

```
# added by Miniconda3 installer
export PATH="/Users/olivier/miniconda3/bin:$PATH"
```

<br/>

Rechargez votre terminal pour prendre en compte la modification.

```
source ~/.zshrc
```

<br/>

Vérifiez enfin que l'installation s'est bien déroulée: 

```
conda -V
```

<br/>

## Commandes Conda utiles

**Lister les environnements virtuels**

```
conda env list
```

<br/>

**Supprimer un environnement et tous les packages**

```
conda env remove --name nom-environnement
```

<br/>

**Sortir de l'environnement actuel**

```
source deactivate
```

<br/>

**Activer un environnement**

```
conda activate nom-environnement
```

<br/>

**Créer un environnement à partir d'un fichier de config (.yml)**

```
conda env create -f environments.yml 
```

<br/>

Le fichier environnement ressemble à ceci:

```
name: self-driving
channels:
    - https://conda.anaconda.org/menpo
    - conda-forge
dependencies:
    - python==3.5.2
    - numpy
    - matplotlib
    - jupyter
    - opencv3
    - pillow
    - scikit-learn
    - scikit-image
    - scipy
    - h5py
    - eventlet
    - flask-socketio
    - seaborn
    - pandas
    - imageio
    - pip:
        - moviepy
        - tensorflow==1.1
        - keras==1.2
```

<br/>

Voici la spécification des numéros de version des paquets du fichier de configuration: 

* Fuzzy: "numpy=1.11" (1.11.0, 1.11.1, 1.11.2, 1.11.18 etc.)
* Exact: "numpy==1.11" (1.11.0)
* Greater than or equal to: "numpy>=1.11" (1.11.0 or higher)
* OR: "numpy=1.11.1|1.11.3" (1.11.1, 1.11.3)
* AND: "numpy>=1.8,<2" (1.8, 1.9, not 2.0)

