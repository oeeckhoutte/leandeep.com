# Deployer un package sur github via curl

- Canonical URL: https://leandeep.com/deployer-un-package-sur-github-via-curl/
- Author: Olivier Eeckhoutte
- Published: 2020-04-20T19:49:00+02:00
- Updated: 2020-04-20T19:49:00+02:00
- Language: fr
- Tags: Github, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Cet bref article montre comment déployer un package sur Github via une simple commande `curl`. 

<br/>

Dans notre cas, il s'agit d'un jar mais cela s'applique à tous les types de packages supportés par Github:
* Docker
* Maven 
* Nuget
* Ruby gem
* npm

<br/>

## Commande

En pré-requis, il sera nécessaire de générer un Github personal access tocken (--> Settings --> Developer settings --> Personal access tokens)

```
export MON_REPO_GIT=oeeckhoutte/mon-package
export PACKAGE_NAME=mon-package
export PACKAGE_VERSION=0.0.1
export JAR_FILENAME=mon-package-0.0.1.jar
export LOCAL_JAR_PACKAGE_PATH=/tmp/mon-package-0.0.1.jar

curl -X PUT \
"https://maven.pkg.github.com/$MON_REPO_GIT/$PACKAGE_NAME/$PACKAGE_VERSION/$JAR_FILENAME" \
-H "Authorization: token YOUR_TOKEN" \
--upload-file $LOCAL_JAR_PACKAGE_PATH -vvv
```
