# Commandes pour redimensionner le disque d'une VM sous Linux

- Canonical URL: https://leandeep.com/commandes-pour-redimensionner-le-disque-dune-vm-sous-linux/
- Author: Olivier Eeckhoutte
- Published: 2025-09-04T13:34:00Z
- Updated: 2025-09-04T13:34:00Z
- Language: fr
- Tags: Linux, unix_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici quelques commandes très utiles pour redimensionner le disque d'une VM sous Debian 13. 

## Ajouter l'user actuel au fichier sudoers
```
su -
EDITOR=vim visudo
# Ajouter votre user au fichier sudoers si vous avez l'erreur: 
# "monuser is not in the sudoers file."
# monuser    ALL=(ALL:ALL) ALL
```

<br/>

## Visualiser
```
sudo apt update
sudo apt install util-linux
echo 'export PATH=$PATH:/sbin:/usr/sbin' >> ~/.bashrc
source ~/.bashrc
sudo cfdisk
```

<br/>

## Resize

```
# Etends la partition
parted /dev/sda
print
print free
resizepart 2 100%
# resizepart 2 1611GB
quit 
# Etends le filesystem 
resize2fs /dev/sda2
```

<br/>

## Effacer une partition si nécessaire

```
parted /dev/sda
rm 3
# Agrandis une partition comme la 2 avec toute la place libre
resizepart 2 100%
# ou mieux avec la taille en GB. Par exemple:
resizepart 2 1611GB (sur un total de 1617 pour créer un swap de 6GB par exemple)
quit
```

<br/>

## Recréer partition swap si nécesssaire

```
parted /dev/sda mkpart primary linux-swap 1605GB 1611GB
# Format la partition en SWAP
mkswap /dev/sda3

# active le swap
swapon /dev/sda3
```

<br/>

## fstab

```
blkid /dev/sda3 (pour récupérer le UUID du nouveau SWAP)
vim /etc/fstab
```

