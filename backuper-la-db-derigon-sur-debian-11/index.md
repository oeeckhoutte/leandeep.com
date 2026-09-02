# Backuper la DB d'Erigon sur Debian 11

- Canonical URL: https://leandeep.com/backuper-la-db-derigon-sur-debian-11/
- Author: Olivier Eeckhoutte
- Published: 2023-02-03T07:49:00+02:00
- Updated: 2023-02-03T07:49:00+02:00
- Language: fr
- Tags: Blockchain, Linux, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Pour backuper les data de votre Node Erigon, rien de tel qu'un disque externe. Après minimum une semaine de synchronisation rien de tel qu'un petit backup si vous devez restaurer votre système. Dans mon cas, je dois passer d'Erigon 2.36 à une version 2.37 forkée avec un dev perso permettant d'ajouter un endpoint RPC non disponible dans l'API de base. Comme je ne suis pas certain que mon dev est 100% safe car c'est mon premier développement sur un client Ethereum, je préfère faire un backup de ma DB. 

Dans cet article très court nous allons donc voir comment formater un disk de backup (ici `sda`), le monter sur Debian et l'utiliser pour backuper Erigon.

> Pré-requis: `apt-get install progress` (petit utilitaire utile pour suivre la progression de la copie entre 2 disques tellement la DB est volumineuse)

<br/>

## Lister les disques présent

```
lsblk -f
```

<br/>

## Formatage en ext4

```
mkfs -t ext4 /dev/sda1
lsblk -f
```

<br/>

## Montage

```
mkdir -p /backup
mount -t auto /dev/sda1 /backup
```

<br/>

## Backup

```
systemctl stop erigon-rpc.service
systemctl stop erigon.service
cp -R /backup/erigon /backup/erigon-$(date +"%d-%m-%Y")
rm -r /backup/erigon
cp -R /erigon /backup/erigon & progress -mp $!
# Alternative
# time rsync -a --info=progress2 --stats /erigon /backup/erigon
systemctl start erigon.service
systemctl start erigon-rpc.service
```

Voilà maintenant je peux tester l'upgrade d'Erigon sans trop de risque.
