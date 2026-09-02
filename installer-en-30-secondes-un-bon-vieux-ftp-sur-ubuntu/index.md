# Installer en 30 secondes un bon vieux FTP sur Ubuntu

- Canonical URL: https://leandeep.com/installer-en-30-secondes-un-bon-vieux-ftp-sur-ubuntu/
- Author: Olivier Eeckhoutte
- Published: 2019-09-06T10:44:00Z
- Updated: 2019-09-06T10:44:00Z
- Language: fr
- Tags: Linux, FTP, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Besoin de transférer des fichiers entre un Linux et Windows ? Problème, docker ne peut pas être installé sur Windows (à cause d'un processeur non compatible), cygwin gère mal le rsync, impossible d'écrire un shell script pour reprendre le téléchargement interrompu, le scp de Powershell fini par crasher tellement la quantité de données à transférer est énorme. Rien de tel qu'un bon vieux serveur FTP :D . Voici les commandes pour en installer un en 30s top chrono.

<br/>

## Installation

```
sudo aptitude install vsftpd
```
Editer le fichier `/etc/vsftpd.conf` et modifier la configuration avec les paramètres suivants:

```
anonymous_enable=NO
local_enable=YES
write_enable=YES
```

Et redémarrer le service pour prendre en compte les modifications.

```
sudo /etc/init.d/vsftpd restart
```

<br/>

## Usage

Via GUI avec le logiciel Filezilla https://filezilla-project.org/

