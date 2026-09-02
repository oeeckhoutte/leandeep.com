# Créer un raid pour stocker ses précieux datasets

- Canonical URL: https://leandeep.com/cr%C3%A9er-un-raid-pour-stocker-ses-pr%C3%A9cieux-datasets/
- Author: Olivier Eeckhoutte
- Published: 2019-09-28T09:51:00Z
- Updated: 2019-09-28T09:51:00Z
- Language: fr
- Tags: Raid, Ubuntu, Dataset
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article nous allons voir comment créer un raid de type 1 pour répliquer nos données sur 2 disques. Si un disque venait à crasher, un second  est présent pour éviter de perdre nos précieuses données. J'ai plusieurs fois perdu mes datasets de Machine Learning et cela ma coûté cher en temps pour les retrouver et les recréer. Je me suis armé d'un système raid.

Voici donc la procédure d'installation. Dans un prochain article que j'intitulerai "Gérer ses datasets comme un pro" je parlerai de la manière dont j'organise mes données au sein de mon serveur. J'en ferais peut-être un autre sur le CICD du Data Scientist (différent de celui des développeurs).

<br/>

## Vérification des disques

Avant de commencer on va vérifier l'état des disques durs:
```
sudo apt-get install smartmontools
```

Lancer le test avec la commande suivante.
```
sudo smartctl -t short /dev/sdb
```

Voir le résultat (après l'heure indiquée par la commande précédente):
```
sudo smartctl -l selftest /dev/sdb
```

<br/>

## Installation


**Préparation des disques**


Identifier les disques sur lesquels vous voulez créer votre Raid:
```
sudo fdisk -l
sudo fdisk /dev/sdX
```

Formater ses disques puis créer une partition sur chacun d'eux:
```
# Exemple de création de partitions avec /dev/sdb et /dev/sdc
sudo gdisk /dev/sdb

# voir le menu "m" (vous trouverez ce qu'il faut si vous devez effacer une partition)
# p pour afficher les partitions
o # pour effacer toutes les partitions et créer une nouvelle "protective MBR".
y # valide
n # pour créer une nouvelle partition
1 # pour le numéro de la partition
Entrée # pour le début des blocks
Entrée # pour la fin des blocks
fd00 # pour le type de partition (Linux Raid)
w # save
y # confirm

# Recommander cette procédure avec /dev/sdc
```

<br/>

**Création du raid**

Installation de `mdadm`:
```
sudo apt install -y mdadm
```

Création du raid:
```
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb1 /dev/sdc1
```

**Attention, l'étape précédente va prendre du temps...** Vous pouvez voir sa progression avec la commande `cat /proc/mdstat`.


Créer un filesystem sur le nouvel Array :
```
sudo mkfs.ext4 -F /dev/md0
```

Créer un point de montage pour le nouveau filesystem:
```
sudo mkdir -p /mnt/md0
```

Monter le nouveau filesystem:
```
sudo mount /dev/md0 /mnt/md0
```

Vérifier qu'il est bien accessible:
```
df -h -x devtmpfs -x tmpfs
```

Pour que le Array soit automatiquement ré-assemblé à chaque reboot, on peut modifier le fichier de configuration de mdadm:
```
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
```

Rendre le Array accessible durant la phases de early boot en mettant `initramfs` (initial RAM file system) à jour:
```
sudo update-initramfs -u
```

Ajouter le disque raid dans fstab:
```
echo '/dev/md0 /mnt/md0 ext4 defaults,nofail,discard 0 0' | sudo tee -a /etc/fstab
```

<br/>

## Troubleshooting 

Voir le(s) raid(s) existant(s):
```
cat /proc/mdstat
```

Supprimer un raid:
```
sudo umount /dev/md0
mdadm -S /dev/md0
mdadm --remove /dev/md0
# Vérifier qu'il n'est pas présent dans /etc/fstab
```

Examiner les superblocks:
```
sudo mdadm -E /dev/sdd
```

Effacer les superblocks:
```
sudo mdadm --zero-superblock /dev/sdd
```

Lister les disques:
```
lsblk -o NAME,SIZE,FSTYPE,TYPE,MOUNTPOINT
```

Wiping the entire disk:
```
dd if=/dev/zero of=/dev/sdX bs=1M
```

<br/>

Bonus 1: Wiping the entire disk for security reasons (plus long):
```
dd if=/dev/urandom of=/dev/sdX bs=1M
```

> When you delete a file or format a hard drive you are basically just telling the computer that it can use this portion of the disk again if it is needed. If that portion of the disk is not every written over again. The data will remain indefinitely. So, in order to make deleted data unrecoverable we must write over it.

> If you are really paranoid or just want to be ultra secure you could write over the drive 7 times with random data. This is the same procedure the US Government uses to secure its own data.

Cadeau, le script associé:
```
#!/bin/bash 
for n in `seq 7`; do dd if=/dev/urandom of=/dev/sda bs=8b conv=notrunc; done
# chmod a+x wipeIt
```

<br/>

Bonus 2: Voir la progression de dd
```
Option 1:
sudo dd if=/dev/zero of=/dev/sdX bs=1M status=progress

Option 2:
# Dans un 1er terminal
sudo dd if=/dev/zero of=/dev/sdX bs=1M
 
# Dans un second terminal on récupère le pid du process dd et on le kill toutes les 10s
while sudo kill -USR1 `pidof dd` ; do sleep 10 ; done
 
# Retourner dans le 1er terminal pour voir la progression
# On voir que formater plusieurs tera de cette façon peut prendre pas mal de temps... 
```

