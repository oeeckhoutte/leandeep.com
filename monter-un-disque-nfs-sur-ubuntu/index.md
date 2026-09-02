# Monter un disque NFS sur Ubuntu

- Canonical URL: https://leandeep.com/monter-un-disque-nfs-sur-ubuntu/
- Author: Olivier Eeckhoutte
- Published: 2020-08-15T19:49:00+02:00
- Updated: 2020-08-15T19:49:00+02:00
- Language: fr
- Tags: Ubuntu, NFS, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici la procédure très simple pour monter automatiquement un disque NFS sur Ubuntu. 

<br/>

## Installation

```
sudo apt install nfs-common
```

<br/>

## Configuration

Créer le répertoire pour le point de montage:

```
mkdir -p /mnt/smalldiskspool/Musique
```

<br/>

Editer le fichier `/etc/fstab` et ajouter une ligne comme celle ci par exemple:

```
192.168.0.42:/mnt/smalldiskspool/Musique/ /mnt/smalldiskspool/Musique nfs rw,sync,hard 0 0
```
<br/>

> 0 0 signifie que Linux ne va pas checker les erreurs disque (ce sera géré par le serveur)

Rebooter.
