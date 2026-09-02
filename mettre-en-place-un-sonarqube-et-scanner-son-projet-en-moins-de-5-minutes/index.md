# Mettre en place un Sonarqube et scanner son projet en moins de 5 minutes

- Canonical URL: https://leandeep.com/mettre-en-place-un-sonarqube-et-scanner-son-projet-en-moins-de-5-minutes/
- Author: Olivier Eeckhoutte
- Published: 2019-04-24T21:56:00Z
- Updated: 2019-04-24T21:56:00Z
- Language: fr
- Tags: Python, Sonar
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


# Introduction

Voici les étapes à suivre pour ajouter un sonar dans son projet. 
Dans le cas présent, le projet est un projet Python. 

<br/>

# Steps

## Déployer un sonar via Docker

```
$ docker pull sonarqube
$ docker run -d --name sonarqube -p 9000:9000 -p 9092:9092 sonarqube

# Si nécessaire pour ajouter des plugins

$ wget https://binaries.sonarsource.com/Distribution/sonar-python-plugin/sonar-python-plugin-1.13.0.2922.jar

$ docker cp ./sonar-python-plugin-1.13.0.2922.jar sonarqube:/opt/sonarqube/extensions/plugins/sonar-python-plugin-1.13.0.2922.jar  

$ docker restart sonarqube
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

# Comma-separated paths to directories with sources (required)
sonar.sources=PATH_DU_REPERTOIRE_A_SCANNER

# Language
sonar.language=py

# Encoding of the source files
sonar.sourceEncoding=UTF-8

sonar.host.url=http://IP_DU_SONAR:9000
```

<br/>

## Lancer le scan du projet 

```
docker run -ti -v $(pwd):/root/src zaquestion/sonarqube-scanner
```

(Docker image `zaquestion/sonarqube-scanner` source: https://github.com/oeeckhoutte/docker-sonarqube-scanner)

<br/>

# Résultat 

Voici ce que vous obtiendrez:

![image](/images/sonar-clean.png)




