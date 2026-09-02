# Architecture applicative d'une application AR Copy Paste

- Canonical URL: https://leandeep.com/architecture-applicative-dune-application-ar-copy-paste/
- Author: Olivier Eeckhoutte
- Published: 2021-09-29T06:47:00+02:00
- Updated: 2021-09-29T06:47:00+02:00
- Language: fr
- Tags: Python, Torch, AR Copy Paste, React, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Peut-être êtes-vous tombé sur cette vidéo qui a fait le buzz sur Linkedin où l'on voyait une app mobile prendre une photo de n'importe quel objet, le détourait automatiquement et l'envoyait sur Photoshop. **Le concept est appelé "AR Copy Paste".**
Voici un <a href="" rel="noopener" target="_blank">article dédié au concept</a>



J'ai été très impressionné par la démo et me suis demandé comment c'était fait. J'ai donc codé un MVP qui refait exactement la même chose (au delta près du plugin Photoshop qui n'est qu'un wrapper autour de mon app web qui affichait déjà mon image détourée).

> Étant consultant Freelance (Architecte solutions/ Expert technique/ Tech Lead), n'hésitez pas à me contacter pour une démo ou voir si je suis disponible pour vous proposer mes services dans ce domaine.

> Le code n'est pas open source mais bien visible sur demande (le projet et ses deps fait 1.3 Go à cause de la partie Machine Learning)

Dans cet article, je vous présente l'architecture applicative de mon MVP et vous présente les résultats

<br/>

## Architecture applicative du MVP

![image](/images/architecture-ar-copy-paste-app.png)

<br/>

1. Prise de photo depuis un smartphone
2. Upload de la photo sur une API Python
3. Appel de la librairie de machine Learning permettant d'extraire le background d'une photo
4. Génération d'une photo temporaire sur l'API puis upload sur S3
5. Récupération de l'URL d'accès de la photo détourée sur S3 et on retourne l'URL au client
6. Affichage de la photo détourée depuis S3 via l'URL juste récupérée

> Schéma simplifié bien sûr. Il s'agit d'un MVP rapide de 3 soirées sans DB, sans realtime websoket server. 

<br/>

## Résultat sur quelques objets et mon chien

**Adaptateur de voyage sur mon bureau:**
![image](/images/ar-copy-demo-paste1.png)
**Tasse sale sur mon bureau:**
![image](/images/ar-copy-demo-paste2.png)
**Caméra Tapo dans mon salon:**
![image](/images/ar-copy-demo-paste3.png)
**Bouteille sur mon bureau:**
![image](/images/ar-copy-demo-paste4.png)
**Télécommande Freebox dans mon salon:**
![image](/images/ar-copy-demo-paste5.png)
**Mon chien (qui s'est roulé dans la boue) pris de très loin + un sac (2 objets):**
![image](/images/ar-copy-demo-paste6.png)
**Mon chien:**
![image](/images/ar-copy-demo-paste7.png)

Encore une fois merci le Machine Learning, le résultat est bluffant!..

<br/>

## Recommandations

* Pour la partie front mobile, j'ai encore pu tester le framework <a href="" rel="noopener" target="_blank">Expo</a> pour ce MVP et c'est vraiment top. Cela permet d'avoir un workflow de développement vraiment simplifié et d'être vraiment productif.
En gros, il n'y a pas à gérer la partie CI (mobile) du tout.

* Modèle Deep Learning utilisé: <a href="" rel="noopener" target="_blank">U2Net</a>
