# Monter un raid existant sur une nouvelle installation d'Ubuntu

- Canonical URL: https://leandeep.com/monter-un-raid-existant-sur-une-nouvelle-installation-dubuntu/
- Author: Olivier Eeckhoutte
- Published: 2019-11-15T13:31:00Z
- Updated: 2019-11-15T13:31:00Z
- Language: fr
- Tags: Raid, mdadm, Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Si vous aviez créé votre raid avec l'utilitaire `mdadm` (comme expliqué dans l'article suivant https://leandeep.com/creer-un-raid-pour-stocker-ses-precieux-datasets/ ), les commandes pour le remonter ou réassembler sur un Ubuntu tout neuf sont les suivantes:

```
# Installation de mdadm
sudo apt-get update
sudo apt-get install -y mdadm

# On détecte le raid 
sudo mdadm --assemble --scan

# On monte le raid en local
sudo mkdir /mnt/md0
sudo mount /dev/md0 /mnt/md0

# Vérifier qu'il est bien monté
df -h
```

<br/>

## Troubleshooting

**Avoir des informations (type et disques utilisés) sur les raids existants**

* Option 1:
```
cat /proc/mdstat

Personalities : [linear] [multipath] [raid0] [raid1] [raid6] [raid5] [raid4] [raid10]
md0 : active raid1 sdb1[0] sdc1[1]
      976761472 blocks [2/2] [UU]
      bitmap: 0/8 pages [0KB], 65536KB chunk

```

<br/>

* Option 2:

```
grep 'md' /proc/mdstat | tr ' ' '\n' | sed -n 's/\[.*//p'
```

<br/>

**Lister les disques**

```
fdisk -l
```

<br/>

**Obtenir le serial number d'un disque**

```
sudo hdparm -I /dev/sdb1 | grep 'Serial\ Number'

Serial Number:      S246J9FC405870
```

Cela peut être pratique si vous avez plein de disques dans une tour et que vous voulez identifier les disques HS.

![image](/images/serial-disque-dur.png)

<br/>

**Error: "mdadm: Duplicate MD device names in conf file were found"**

Editer le fichier `/etc/mdadm/mdadm.conf` et vérifier qu'un raid n'est pas référencé 2 fois. 

Puis exécuter la commande suivante pour prendre en compte la modification: 

```
update-initramfs  -u -k all
```

Vous pouvez ensuite rebooter pour vérifier que cela fonctionne toujours...

