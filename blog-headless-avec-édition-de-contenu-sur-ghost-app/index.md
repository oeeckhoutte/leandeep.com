# Blog headless avec édition de contenu sur Ghost app

- Canonical URL: https://leandeep.com/blog-headless-avec-%C3%A9dition-de-contenu-sur-ghost-app/
- Author: Olivier Eeckhoutte
- Published: 2022-07-31T21:13:00Z
- Updated: 2022-07-31T21:13:00Z
- Language: fr
- Tags: Ghost, CMS, Headless
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons voir comment créer un blog headless à partir de Ghost en moins de 5 minutes. Des bonnes performances (pas de rendering nécessaire), pas besoin de serveur payant (juste un hosting de static content) et on garde la simplicité d'édition (authoring) via Ghost.

<br/>

## Installer Ghost

```
npm install ghost-cli@latest -g
```

<br/>

## Démarrer/créer un blog ghost

```
ghost install local
```

<br/>

## Nouveau thème 

Télécharger le fichier zip contenant un thème custom: https://github.com/eddiesigner/liebling/releases

> [Démo de ce thème](https://liebling.eduardogomez.io/)

Puis uploader le zip sur l'interface admin du blog http://127.0.0.1:2368/ghost et activer le nouveau thème.


<br/>

## Générer un site statique

Installer [ce package](https://github.com/Fried-Chicken/ghost-static-site-generator):

```
npm install -g ghost-static-site-generator
```

Puis générer le contenu statique en exécutant la commande suivante depuis le dossier root du blog:
```
gssg
```

<br/>

## Test 

Test du site statique [via le package](https://www.npmjs.com/package/http-server)

```
cd static/
http-server .
```

<br/>

Résultat pour un blog sur la micronutrition perso réalisé en 12 minutes (5 minutes de création de blog et 7 minutes pour écrire ce petit article):
![image](/images/headless-blog-ghost.png)

<br/>

## Démarrer un blog (arrêté) existant

```
ghost start
```
