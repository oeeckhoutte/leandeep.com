# Remote Desktop over SSH avec X2GO sur Ubuntu

- Canonical URL: https://leandeep.com/remote-desktop-over-ssh-avec-x2go-sur-ubuntu/
- Author: Olivier Eeckhoutte
- Published: 2020-09-25T18:59:00+02:00
- Updated: 2020-09-25T18:59:00+02:00
- Language: fr
- Tags: XServer, SSH
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons voir comment mettre en place du remote desktop sur Ubuntu 18.04.
On ne va pas installer un serveur VNC. Ici, on va faire du X11 forwarding. Le protocole NX va nous permettre de transmettre des données vidéos, audio, etc. via une connexion SSH.

<br/>

## Installation de la partie serveur sur Ubuntu

**Installation de X2GO**

```
# On ajoute le package permettant d'ajouter des PPA
sudo apt-get install software-properties-common

# On ajoute X2Go PPA
sudo add-apt-repository ppa:x2go/stable

# On met à jour la base de données contenant les packages disponibles
sudo apt-get update

# On installe X2GO
sudo apt-get install x2goserver x2goserver-xsession
```

<br/>

**Installation d'un desktop environment**

Même si votre Ubuntu 18.04 contient déjà un desktop environment, vous devrez en installer un nouveau compatible avec le client de X2GO. Je recommande l'installation de XFCE ou LXDE qui sont légers. Il vous permettra d'avoir des meilleurs performances que d'autres desktop environments plus lourds ou que Ubuntu Desktop installé par défaut.

```
# Installation de XFCE
sudo apt-get install xfce4

# Ou LXDE
# sudo apt-get install lxde

# Ou Mate
sudo apt install mate-core mate-desktop-environment mate-notification-daemon
```

> Si vous trouvez XFCE ou LXDE trop moches, vous pouvez toujours installer Mate Desktop ou KDE Plasma Desktop:
> <br/>`sudo apt-get install mate-core mate-desktop-environment mate-notification-daemon` <br/> ou <br/> `sudo apt install kde-plasma-desktop`

<br/>

## Installation du client

**Linux**

```
# Ubuntu
sudo apt-get install x2goclient

# Fedora
sudo yum install x2goclient
```

<br/>

**OSX**

Rendez-vous sur https://wiki.x2go.org/doku.php/doc:installation:x2goclient pour avoir de la documentation.
Les packages .dmg sont disponibles ici: https://code.x2go.org/releases/binary-macosx/x2goclient/


<br/>

Il est également nécessaire d'installer (XQuartz)[https://www.xquartz.org/] et de rebooter votre Mac!

<br/>


## Troubleshooting

Si lors de la connexion à votre serveur vous obtenez le message suivant `Connection failed. stdin: is not a tty`, éditez le fichier `/home/votre_user/.profile` et changer la ligne `mesg n`
par `tty -s && mesg n`.

<br/>


## Autres

* Connexion SSH et forward X11: `ssh -X`. Il est ensuite possible de démarrer n'importe quelle application avec interface graphique.
* Lister les desktop environments: `ls -l /usr/share/xsessions/`
* Sur Debian 8 (cf "jessie" via la commande `lsb_release -a`), l'installation de X2GO se fait via les commandes suivantes:
  ```
  sudo apt-key adv --recv-keys --keyserver keys.gnupg.net E1F958385BFE2B6E
  echo 'deb http://packages.x2go.org/debian jessie main' | sudo tee /etc/apt/sources.list.d/x2go.list
  sudo apt-get install x2goserver x2goserver-xsession
  ```
* Si vous installez X2GO sur Kubuntu 20.04+ et que vous démarrez une session vous aurez sans doute l'erreur suivante: `Unable to execute: startkde`. La commande `startkde` n'existe plus dans Kubuntu 20.04. Si vous avez cette erreur, changez le type de session en sélectionnant `Custom desktop` et  entrez `/usr/bin/startplasma-x11` dans le champ commande.

