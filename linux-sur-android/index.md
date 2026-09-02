# Linux sur Android

- Canonical URL: https://leandeep.com/linux-sur-android/
- Author: Olivier Eeckhoutte
- Published: 2020-03-29T00:49:00+02:00
- Updated: 2020-03-29T00:49:00+02:00
- Language: fr
- Tags: Android
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Ce weekend j'ai découvert qu'il était possible d'installer Linux sur Android. Je pensais qu'il était necessaire de rooter son téléphone mais pas du tout. Avec l'application [UserLand](https://play.google.com/store/apps/details?id=tech.ula), on peut installer directement ses distributions préférées. Mon besoin était de pouvoir directement brancher mon téléphone à ma télé pour regarder des films. Les solutions comme Kodi ou Plex sont intéressantes mais j'ai souvent des coupures car je regarde des films en UHD. En plus de cela, cela occupe de la bande passante sur mon réseau local (j'en ai besoin pour d'autres choses). 

Avoir un Linux sur mon Android me permet de démarrer quand j'ai en envi et directement de mon téléphone un serveur multimédia maison basé sur Python, JavaScript et NodeJS. 

Mon téléphone est un Huawei p30, (Et oui, bye bye Apple !). L'intérêt de ce téléphone, en plus d'être sous Android, c'est d'avoir nativement un mode desktop . En effet, quand je branche mon téléphone ou usb-c (ou via un adaptateur HDMI <-> usb-c) sur une télévision l'affichage passe en mode desktop. Comme ce téléphone est très puissant, on a presque l'impression d'être sur un PC Linux classique. 

Il est possible de faire "transiter" des fichiers entre Ubuntu et Android et d'y accéder directement dans l'application "Fichiers". Pour ce faire, il suffit d'écrire les fichiers dans le répertoire `/storage/internal`.

<br/>

## Outils installés et remarques

* Termux

* bVNC Free

* Ubuntu dans Userland

  * J'ai installé les packages suivants:
`sudo apt-get install python-dev python3-dev nodejs npm vim openssh-server git curl net-tools rsync`

  * nvm est "installable" mais les versions de NodeJS installées ne sont pas compatible avec l'architecture arm64 du téléphone.

  * `/etc/hosts` fonctionne parfaitement

  * Démarrer des serveurs Python et Nodejs et y accéder sur le réseau local: ok

  * SSH vers serveurs distants: ok

  * SSH vers Ubuntu dans téléphone: ok **--> port 2022** 
  
  > [Dropbear](https://matt.ucc.asn.au/dropbear/dropbear.html) est utilisé comme serveur SSH

  * "Durée de vie" d'un serveur démarré: pas de coupure en activant la fonctionnalité *Wakelock* d'Android.

  * Installation de vscode (même procédure que pour Jetson Nano): ko
```
git clone https://github.com/JetsonHacksNano/installVSCode.git
cd installVSCode
./installVSCode.sh
sudo apt install --fix-broken
sudo apt-get install libasound2
./installVSCode.sh
```

L'installation semble aller au bout sans erreur mais au démarrage de `code-oss` l'erreur suivante apparaît: `Error: Cannot find module './bootstrap'`. Je ne suis pas le seul à rencontrer le problème. Il y a [ce bug ouvert sur Github](https://github.com/headmelted/codebuilds/issues/97)...

  * Création de hotspot dans Kali: ko --> `/sys/class/net` inaccessible

  * USB support: ko
  
  * Docker: ko

