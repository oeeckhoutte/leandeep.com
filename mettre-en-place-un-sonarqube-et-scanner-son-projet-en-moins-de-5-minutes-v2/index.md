# Mettre en place un Sonarqube et scanner son projet en moins de 5 minutes (v2)

- Canonical URL: https://leandeep.com/mettre-en-place-un-sonarqube-et-scanner-son-projet-en-moins-de-5-minutes-v2/
- Author: Olivier Eeckhoutte
- Published: 2021-12-10T06:56:00Z
- Updated: 2021-12-10T06:56:00Z
- Language: fr
- Tags: Python, Sonar
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


# Introduction

Voici les étapes à suivre pour ajouter un sonar dans son projet. 
Il s'agit d'une mise à jour de [l'article suivant](https://leandeep.com/mettre-en-place-un-sonarqube-et-scanner-son-projet-en-moins-de-5-minutes/) qui n'est plus forcément à jour car le projet Sonar a évolué positivement.

<br/>

# Steps

## Déployer un sonar via Docker

```
$ docker pull sonarqube
$ docker run -d --name sonarqube -p 9000:9000 -p 9092:9092 sonarqube
```
<br/>

## Installer sonar scanner cli

```
brew install sonar-scanner
```

> Note: Mot de passe par défault: admin/admin

<br/>

## Configurer le projet 

Créer un fichier `sonar-project.properties` à la racine du projet

```
# Required metadata
sonar.projectKey=org.sonarqube:python-sonar-scanner
sonar.projectName=Python :: PYTHON! : SonarQube Scanner
sonar.projectVersion=1.0
sonar.login=admin
sonar.password=admin
# Comma-separated paths to directories with sources (required)
sonar.sources=PATH_DU_REPERTOIRE_A_SCANNER

# Language
sonar.language=py

# Encoding of the source files
sonar.sourceEncoding=UTF-8

sonar.host.url=http://IP_DU_SONAR:9000
```

<br/>

## Créer un projet dans Sonar

Créer un projet de type manual dans Sonar et remplacer le `projectKey` et `projectName` dans le fichier `sonar-project.properties`.

<br/>

## Lancer le scan du projet 

```
sonar-scanner \
  -Dsonar.projectKey=org.sonarqube:python-sonar-scanner \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://192.168.43.5:9000 \
  -Dsonar.login=admin \
  -Dsonar.password=admin
```

<br/>

# Résultat 

Voici ce que vous obtiendrez:

![image](/images/sonar-clean.png)

