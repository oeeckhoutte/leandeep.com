# Construire une voiture téléguidée autonome - part 1

- Canonical URL: https://leandeep.com/construire-une-voiture-t%C3%A9l%C3%A9guid%C3%A9e-autonome-part-1/
- Author: Olivier Eeckhoutte
- Published: 2018-12-21T22:30:00Z
- Updated: 2018-12-21T22:30:00Z
- Language: fr
- Tags: Voiture Autonome, Deep Learning, AI
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

# Introduction

Mon objectif est de construire une voiture téléguidée autonome. Réaliser ce projet me permettra de développer davantage mes compétences sur le sujet de la conduite autonome et plus généralement du Deep Learning. J'ai déjà réalisé un premier projet sur ce sujet (j'ai publié un article et une vidéo Youtube) mais mon expérimentation utilisait le simulateur Unity. Maintenant avec ce nouveau projet, je veux sortir du virtuel et aller un cran plus loin en passant au monde réel. 

Pour ce faire, j'ai donc acheté une petite voiture téléguidée. J'ai démonté la télécommande et je l'ai "*hackée*". J'ai en effet réalisé 4 dérivations sur le circuit de commande. Les 4 boutons poussoirs que l'on retrouve dans presque toutes les télécommandes de ces voitures sont maintenant *bypassés*/ remplacés par mon Raspberry Pi 3 via le GPIO. 

J'ai pas mal de Micro-controleurs et de Micro-ordinateurs (Arduino Uno, Mega, Yun, Orange Pi, Banana Pi, Raspberry Pi 1, 2, 3, et pleins d'autres...). J'ai opté pour le Raspberry Pi 3 pour ce projet tout simplement parce qu'il a du Wifi intégré et parce qu'il devrait être assez puissant pour faire tourner Tensorflow et la vidéo (+ broadcast sur Webapp et API hostée). L'avenir me dira s'il sera suffisant puissant pour tout faire tourner. Pour le moment j'en suis encore à la partie hardware. L'idée, pour ce projet, est de ne pas avoir besoin d'une connexion internet pour que le voiture roule de façon autonome. 

## Résultat de mon travail

<u>Première vidéo:</u> Premiers tests juste après la soudure des composants et branchement des fils

    <iframe 
        width="100%" 
        height="400" 
        src="//www.youtube.com/embed/1-nuFU3drXo?rel=0" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>





<u>Deuxième vidéo:</u> Tout est branché et semble opérationnel. On peut maintenant tester la voiture et la piloter avec son Smartphone. Yeah cela fonctionne parfaitement et sans aucune latence (Websocket). 


    <iframe 
        width="100%" 
        height="400" 
        src="//www.youtube.com/embed/flYpdOYJOQw?rel=0" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>





## Schéma de cablage

Voici le schéma de cablage:
![image](/images/schema-cablage.png)


Matériel nécessaire (presque rien):
![image](/images/IMG_2746.JPG)

- 1 breadboard (pour v1 prototypage. Pas viable dans le temps. je vais tout souder (dès que j'ai reçu les pièces))
- Fer à souder et étain
- 4 opto coupleurs
- 1 voiture téléguidée
- 1 Raspberry Pi 3
- Des fils male / male et male / femelle
- 1 carte Micro SD
- 1 batterie externe (pour le Raspberry Pi)

Montage terminé:
![image](/images/IMG_2749.JPG)

## Pilotage de la voiture

J'ai réalisé une petite interface Web très simple qui me permet de piloter la voiture. 
Il y a aussi un petit serveur NodeJS qui permet de transmettre les commandes de l'interface au GPIO du Raspberry Pi via Websocket et de servir les fichiers statiques (html et js).

Tout est opensource et disponible [ici](https://github.com/oeeckhoutte/RC-Car).

Voici à quoi ressmemble l'interface qui ne va pas me servir très longtemps puisque mon objectif est que la voiture soit autonome. 

![image](/images/IMG_2747.PNG)

