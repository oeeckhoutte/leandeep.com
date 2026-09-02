# Faire un Dual-Boot Linux sur Mac

- Canonical URL: https://leandeep.com/faire-un-dual-boot-linux-sur-mac/
- Author: Olivier Eeckhoutte
- Published: 2019-04-13T09:51:00Z
- Updated: 2019-04-13T09:51:00Z
- Language: fr
- Tags: Linux, Mac
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons voir comment installer refind, un bootloader custom pour Mac qui permet de détecter les disques internes et externes pour booter sur différents OS.

<br/>

## Pré-requis

- Disque dur externe ou clé USB ayant suffisamment d'espace disque pour contenir un OS comme Fedora par exemple. 
- Formater votre disque grâce à *Disk Utility*. Sélectionnez votre disque, cliquez erase et sélectionnez le format MS-DOS, et "GUID Partition Map".
- Via des utilitaires comme `Unetbootin`, `BalenaEtcher` (anciennement Etcher), `Fedora Media Writer` créez une clé USB contenant un Live CD de Linux.

<br/>

## Installation

- Redémarrer votre Mac et désactivez le `System Integrity Protection (SIP)`.

- Lors du redémarrage, maintenez les touchez `Command + R` pour passer en mode recovery.

- Un fois démarré en mode recovery, ouvrez un terminal (Utilities --> Terminal)

- Exécutez la commande `csrutil disable`

- Rebootez

- Téléchargez [Refind](http://sourceforge.net/projects/refind/files/0.11.2/refind-bin-0.11.2.zip/download)

- Unzip le fichier téléchargé.

- Ouvrir un Terminal et exécutez le fichier "refind-installer" contenu dans le dossier que vous venez d'extraire.

- Et voilà. Rebootez pour vérifier que cela fonctionne.

<br/>

## Désinstallation

Ouvrez un Terminal et exécutez les commandes suivantes:

```
sudo mkdir /Volumes/efi
sudo mount -t msdos /dev/disk0s1 /Volumes/efi
sudo rm -rf /Volumes/efi/EFI/refind
```

Et voilà. Rebootez. Vous devriez voir ceci:

![image](/images/dual-boot.JPG)

