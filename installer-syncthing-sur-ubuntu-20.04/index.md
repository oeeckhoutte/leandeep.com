# Installer Syncthing sur Ubuntu 20.04

- Canonical URL: https://leandeep.com/installer-syncthing-sur-ubuntu-20.04/
- Author: Olivier Eeckhoutte
- Published: 2021-08-10T19:49:00+02:00
- Updated: 2021-08-10T19:49:00+02:00
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Syncthing solution très intéressante de synchronisation de fichiers ou backup entre différents devices. Je l'utilise principalement pour backuper les photos de mon Smartphone sur 2 disques dans différentes localisations. Cela fonctionne à travers les NATs via des relays sans devoir ouvrir quoique ce soit et c'est simple comme bonjour. 

<br/>

## Installation

```
sudo apt install curl apt-transport-https
curl -s https://syncthing.net/release-key.txt | sudo apt-key add -
echo "deb https://apt.syncthing.net/ syncthing release" > /etc/apt/sources.list.d/syncthing.list
sudo apt-get update
sudo apt-get install syncthing
syncthing --version
```

Création d'un service

```
sudo vim /etc/systemd/system/syncthing@.service
```

```
[Unit]
Description=Syncthing - Open Source Continuous File Synchronization for %I
Documentation=man:syncthing(1)
After=network.target

[Service]
User=%i
ExecStart=/usr/bin/syncthing -no-browser -gui-address="0.0.0.0:8384" -no-restart -logflags=0
Restart=on-failure
SuccessExitStatus=3 4
RestartForceExitStatus=3 4

[Install]
WantedBy=multi-user.target
```

```
sudo systemctl daemon-reload
sudo systemctl start syncthing@$USER
sudo systemctl status syncthing@$USER
sudo systemctl enable syncthing@$USER
```

> Malheureusement à la place de `-gui-address="0.0.0.0:8384"` il n'est pas possible de spécifier un /24 ou /16 `-gui-address="192.168.0.0/16:8384"`. [Rappel CIDR](https://www.freecodecamp.org/news/subnet-cheat-sheet-24-subnet-mask-30-26-27-29-and-other-ip-address-cidr-network-references/)

<br/>

Rendez-vous ensuite à l'adresse de votre GUI Syncthing: https://192.168.1.82:8384 . Ajouter un mot de passe et bloquer l'accès global. N'autoriser que la synchro sur le LAN pour plus de sécurité.

