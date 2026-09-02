# Synchroniser 2 répertoires ou 2 disques en temps réel

- Canonical URL: https://leandeep.com/synchroniser-2-r%C3%A9pertoires-ou-2-disques-en-temps-r%C3%A9el/
- Author: Olivier Eeckhoutte
- Published: 2020-03-18T19:49:00+02:00
- Updated: 2020-03-18T19:49:00+02:00
- Language: fr
- Tags: Linux, Backup
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

L'objectif de cet article est de partager comment je backup mon raid `/dev/md0` vers `/dev/md1` grâce à l'utilitaire `lsyncd`. Cela peut être pratique si vous avez des données très sensibles que vous ne voulez pas perdre. Je ne sais pas si c'est la meilleure solution mais avec 2 x 2 disques répliquées, je prends peu de risque de voir disparaître mes données. A voir sur le long terme si c'est efficace en terme de stabilité ou performance. 

<br/>

## Installation

```
apt install lsyncd
```

<br/>

## Configuration

Créer les répertoires contenants les status et logs de la synchronisation.

```
mkdir /var/log/lsyncd
touch /var/log/lsyncd/lsyncd.{log,status}
```

<br/>

Modifier le fichier `/etc/lsyncd/lsyncd.conf.lua` et ajouter les règles décrivant les synchronisations. 

```
settings {
logfile = "/var/log/lsyncd/lsyncd.log",
statusFile = "/var/log/lsyncd/lsyncd.status"
}

sync{
default.rsync,
source="/mnt/md0",
target="/mnt/md1",
}
```

<br/>


## Activation le service

```
systemctl enable lsyncd
systemctl start lsyncd
# or 'systemctl restart lsyncd' to take into account the last configuration changes if the service was already running.

# Si tout est ok:
systemctl status lsyncd
● lsyncd.service - LSB: lsyncd daemon init script
   Loaded: loaded (/etc/init.d/lsyncd; generated)
   Active: active (running) since Thu 2020-03-19 00:02:27 CET; 5s ago
     Docs: man:systemd-sysv-generator(8)
  Process: 12729 ExecStop=/etc/init.d/lsyncd stop (code=exited, status=0/SUCCESS)
  Process: 12747 ExecStart=/etc/init.d/lsyncd start (code=exited, status=0/SUCCESS)
    Tasks: 4 (limit: 4915)
   CGroup: /system.slice/lsyncd.service
           ├─12765 /usr/bin/lsyncd -pidfile /var/run/lsyncd.pid /etc/lsyncd/lsyncd.conf.lua
           ├─12861 /usr/bin/rsync --delete --ignore-errors -slt -r /mnt/md0/ /mnt/md1/
           ├─12862 /usr/bin/rsync --delete --ignore-errors -slt -r /mnt/md0/ /mnt/md1/
           └─12863 /usr/bin/rsync --delete --ignore-errors -slt -r /mnt/md0/ /mnt/md1/

Mar 19 00:02:27 olivier-NUC7i7BNH systemd[1]: Starting LSB: lsyncd daemon init script...
Mar 19 00:02:27 olivier-NUC7i7BNH lsyncd[12747]:  * Starting synchronization daemon lsyncd
Mar 19 00:02:27 olivier-NUC7i7BNH lsyncd[12747]:    ...done.
Mar 19 00:02:27 olivier-NUC7i7BNH systemd[1]: Started LSB: lsyncd daemon init script.

```

<br/>

## Warning

**Attention**, lors d'un redémarrage de serveur toutes mes données ont été effacées sur le serveur de backup. Je synchronise le raid md0 vers md1. 
Après un reboot, le raid md1 a été remonté mais pas md0. Ne voyant plus le disque source, `lsyncd` a effacé le contenu de md1...

Pour éviter cela, ajouter l'option `delete = false,` dans le fichier `/etc/lsyncd/lsyncd.conf.lua` et redémarrer le service `systemctl start lsyncd`.

<br/>

## Ressource

https://linoxide.com/tools/setup-lsyncd-sync-directories/
