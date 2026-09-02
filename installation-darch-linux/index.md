# Installation d'Arch linux

- Canonical URL: https://leandeep.com/installation-darch-linux/
- Author: Olivier Eeckhoutte
- Published: 2022-02-04T06:34:00Z
- Updated: 2022-02-04T06:34:00Z
- Language: fr
- Tags: Development, Linux, Arch
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Instroduction

Dans cet article, nous allons voir comment installer Arch Linux de A à Z. 

<br/>

## Démarrage de l'installation

Créer une clé usb de boot contenant l'ISO d'archlinux puis booter dessus (presser F10 généralement).

Sur le premier menu, sélectionner `Arch Linux installation medium` et appuyer sur entrer.

Vous arriverez ensuite sur un terminal `zsh` en mode `root`.


<br/>

## Configuration le clavier

```
loadkeys fr-pc
```

> Voilà vous êtes maintenant en AZERTY.<br/>
> `localectl list-keymaps` pour voir les différents agencements du clavier FR disponibles.

<br/>

## Vérification du mode de démarrage

Si la commande suivante ne retourne pas d'erreur, c'est que le mode de démarrage est bien en UEFI. On est donc prêt à continuer l'installation.

```
ls /sys/firmware/efi/efivars
```

<br/>

## Connexion à internet

Voir l'état des interfaces réseau:

```
ip link
```

> Si vous voulez utiliser du Wifi , vérifier que votre carte n'est pas bloquée avec [rfkill](https://wiki.archlinux.org/title/Rfkill)<br/>
> Utiliser [iwctl](https://wiki.archlinux.org/title/Iwctl) pour vous authentifier aux réseaux wifi.<br/>
> Utiliser [mmcli](https://wiki.archlinux.org/title/Mmcli) pour vous connecter à un réseau mobile<br/>
> [DHCP](https://wiki.archlinux.org/title/DHCP) devrait fonctionner sans rien faire grâce aux services [systemd-networkd](https://wiki.archlinux.org/title/Systemd-networkd) et [systemd-resolved](https://wiki.archlinux.org/title/Systemd-resolved)<br/>
> Pour configurer une IP statique, c'est par [ici](https://wiki.archlinux.org/title/Network_configuration#Static_IP_address)<br/>
> Tout est configuré par défaut durant la phase d'installation d'Archlinux. Une fois le système installé et donc sorti du mode Live OS, il faudra tout réinstaller.

```
ping google.com
```

<br/>

## Configuration de l'heure

```
timedatectl status
timedatectl set-ntp true
timedatectl status
```

<br/>

# Partitionnement du disque

> Configuration simple pour un disque SSD de 2 To.

Dans un premier temps on efface tout:

```
fdisk -l
fdisk /dev/sdX
# Utiliser m pour obtenir de l'aide
i (voir les infos sur les partitions)
d (détruire les partitions une à une)
w (save)
fdisk -l (pour confirmer que les changements ont bien été pris en compte)
```


<br/>

Puis on recrée 3 nouvelles partitions:

* Première partition EFI

```
fdisk /dev/sda
g (pour créer une table de partition vide)
n (création d'une nouvelle partition EFI)
1
Enter (on n'entre pas de valeur pour le First sector)
+512M
y (oui on veut retirer la signateur vfat précédente liée à son ancienne installation)
t (pour changer le type de la partition)
1 (pour EFI system)
```


<br/>

* Deuxième partition de SWAP

```
n
2
enter
+4G
y
t (changer le type de la partition)
2 (sélection de la 2e partition)
19 (pour Linux Swap)
```


<br/>

* Troisième partition pour ROOT

```
n
3
enter
enter
y
t
3
23 (pour x86-64)
```


<br/>

Sauvegarder tous les changements et vérifier que tout est ok.

```
w
fdisk --list
```

Dans les Devices du disque `/dev/sda` vous devriez voir les 3 nouvelles partitions:<br/>
`/dev/sda1`, `/dev/sda2` et `/dev/sda3`


<br/>

## Création des filesystems

Nous allons utiliser `mkfs` et `mkswap` pour créer les file systems sur les nouvelles partitions.

```
mkfs.vfat /dev/sda1
mkswap /dev/sda2
mkfs.ext4 /dev/sda3
```


<br/>

## Installation des packages Arch

On commence par monter les partitions avant d'installer les packages:

```
mount /dev/sda3 /mnt
mkdir /mnt/efi
mount /dev/sda1 /mnt/efi
swapon /dev/sda2
```

<br/>

Installation des packages de base:

```
pacstrat /mnt base linux linux-firmware
pacstrat /mnt dhcpcd dhclient
```

<br/>

## Génération du fstab

```
genfstab -U /mnt >> /mnt/etc/fstab
cat /mnt/etc/fstab
```

<br/>

## chroot pour se logguer dans le nouveau système

```
arch-chroot /mnt
```

> La commande précédente permet de quitter l'environnement du live OS et d'atterir dans le nouveau système fraichement installé.

On peut donc maintenant utiliser `pacman` pour manager les applications (c'est l'équivalent de `apt` ou `yum`).

```
pacman -Syu
# Installation de git
pacman -Syu git nano vim
```


<br/>

## hostname et hosts

```
echo NomDeVotreMachine >> /etc/hostname
echo '127.0.0.1 NomDeVotreMachine.localdomain NomDeVotreMachine' >> /etc/hosts
```

<br/>

## Gestion du fuseau horaire

```
ls -al /etc/
ln -sf /usr/share/zoneinfo/Europe/Paris /etc/localtime
ls -al /etc/
```

<br/>

## Locale

Editer le fichier `/etc/locale.gen`, décommentez la locale `fr_FR.UTF-8 UTF8` et exécuter les commandes suivantes:
```
locale-gen
echo LANG="fr_FR.UTF-8" > /etc/locale.conf
# Pour la session courante
export LANG=fr_FR.UTF-8
echo KEYMAP=fr > /etc/vconsole.conf
```

<br/>

## Installation d'un Bootloader

```
pacman -Syu grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=GRUB
```

Ajout d'un microcode pour votre CPU:
```
pacman -Syu intel-ucode
```

Génération du grub.cfg:
```
grub-mkconfig -o /boot/grub/grub.cfg
```

<br/>

## Création d'un nouvel utilisateur et blocage du compte root

Création du nouvel utilisateur ayant accès root:
```
pacman -Syu sudo
useradd --create-home olivier
passwd olivier
```

<br/>

Blocage du compte root initialement créé par défaut:

Modifier le fichier `/etc/sudoers` et donner les droits et remplacer la ligne `root ALL=(ALL) ALL` par `olivier ALL=(ALL) ALL`

<br/>

Exécuter ensuite les commandes suivantes: 
```
# Effacer le mot de passe root
passwd --delete root
# Locker le compte root
passwd --lock root
```

Enfin editer le fichier `/etc/passwd` et remplacer la ligne `root:x:0:0::/root:/bin/bash` par `root:x:0:0::/:/usr/bin/nologin`

> A noter que dans les lignes précédentes, `:x:` équivaut à `: x :` sans espace. (Blog engine auto conversion...) 

<br/>

## First boot

```
exit
shutdown -r now
```

C'est maintenant qu'on croise les doigts ahahah.


<br/>

Passage du clavier en fr dans la session courante:
```
sudo loadkeys fr-pc
```

Pour rendre la keymap persistente, editer le fichier `/etc/vconsole.conf` et ajouter la ligne suivante:
```
KEYMAP=fr
```

<br/>

Configuration réseau:

* Récupérer le nom de vos interfaces réseau:

```
ip link
# Dans mon cas:
eno1 et wlp58s0
```

<br/>

* Editer le fichier `sudo vim /etc/systemd/network/10-wire-wireless.network` et ajouter la config suivante:

```
[Match]
Name=eno1 wlp58s0
[Network]
DHCP=yes
LLMNR=yes
MulticastDNS=yes
DNSSEC=yes
DNSOverTLS=yes
DNS=1.1.1.1 1.0.0.1 2606:4700:4700::1111 2606:4700:4700::1001
FallbackDNS=8.8.8.8 8.8.4.4 2001:4860:4860::8888 2001:4860:4860::8844
[DHCP]
UseDNS=no
```

> `DHCP=yes` pour que l'assignement d'une adresse IP se fasse automatiquement
> [LLMNR](https://en.wikipedia.org/wiki/Link-Local_Multicast_Name_Resolution)
> [MDNS](https://en.wikipedia.org/wiki/Multicast_DNS)
> [DNSSEC](https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions)
> [DNSOverTLS](https://en.wikipedia.org/wiki/DNS_over_TLS)
> `UseDNS=NO` pour ne pas utiliser le DNS de ma freebox

<br/>

* Editer maintenant le fichier `sudo vim /etc/systemd/resolved.conf`. C'est requis par Arch car nous avons créé un fichier `*.network` juste au dessus. Voici le contenu à insérer dans notre second fichier:
```
[Resolve]
DNS=1.1.1.1 1.0.0.1 2606:4700:4700::1111 2606:4700:4700::1001
FallbackDNS=8.8.8.8 8.8.4.4 2001:4860:4860::8888 2001:4860:4860::8844
LLMNR=yes
MulticastDNS=yes
DNSSEC=yes
DNSOverTLS=yes
```

<br/>

* Créer le symlink suivant:
```
sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
```

> Grâce à cela, toutes les applications vont appeler `127.0.0.53:53` pour le DNS. Le service `resolved` va à son tour contacter les DNS spécifier dans notre fichier `/etc/systemd/network/10-wire-wireless.network` et utiliser DNSSEC et DNS-over-TLS pour résoudre les noms de domaines.


<br/>

* Activation des services:

```
sudo systemctl enable --now systemd-networkd
sudo systemctl enable --now systemd.resolved
ping google.com
```


<br/>

## Backup installation sur périphérique externe

Voilà, on vient de passer presque 1h à installer notre système sous Arch. Avant d'aller plus loin, on va réutiliser la clé USB qui nous a permis d'installer l'ISO Arch pour faire un backup. On va la formater et tout backuper.

* Formatage de la clé:
```
sudo fdisk -l
sudo umount /dev/sdb1
sudo umount /dev/sdb2
sudo fdisk /dev/sdb
d
1
d
2
w
sudo fdisk /dev/sdb
g
n
1
enter
enter
w
sudo mkfs.ext4 /dev/sdb1
```


<br/>

* Backup:
```
mkdir /mnt/usbstick
sudo mount /dev/sdb1 /mnt/usbstick
sudo pacman -Syu rsync
sudo rsync -aAXv --delete --exclude=/dev/* --exclude=/proc/* --exclude=/sys/* --exclude=/tmp/* --exclude=/run/* --exclude=/mnt/* --exclude=/media/* --exclude="swapfile" --exclude="lost+found" --exclude=".cache" --exclude="Downloads" --exclude=".VirtualBoxVMs"--exclude=".ecryptfs" / /mnt/usbstick/
```

> Restauration:
> Boot sur Live ISO puis:<br/>
> `mkdir /mnt/system /mnt/usb` puis `lsblk` ou `fsdisk -l` pour voir le nom des devices connectés.<br/>
> Monter le file system et le backup: `mount /dev/sda1 /mnt/system` et `mount /dev/sdb1 /mnt/usb` <br/>
> Enfin, restaurer: `rsync -aAXv --delete --exclude="lost+found" /mnt/usb/ /mnt/system/`



<br/>

## Xorg

Déterminer le pilote graphique à utiliser:
```
lspci -v | grep -A1 -e VGA -e 3D
```

Suivant la marque, il faudra utiliser un package adapté. [Voici la liste](https://wiki.archlinux.org/title/Xorg) des packages à disposition.

Dans mon cas, ayant une carte Intel, je vais installer le package `xf86-video-intel` puis j'installe le package xorg group via la commande: `sudo pacman -Syu xorg`. 

<br/>

Je vérifie l'installation avec `sudo Xorg -version`.

<br/>

## Desktop environment

On va maintenant installer Gnome.
```
sudo pacman -Syu gnome gnome-extra xorg-xinit
```

On va ensuite configurer le système pour que la commande `startx` démarre une session gnome. Pour ce faire, on va créer un fichier `sudo vim ~/.xinitrc` et on va ajouter la ligne suivante: `exec gnome-session`. 

On redémarre et vérifie que tout fonctionne bien. Exécuter `startx` après s'être authentifié.

<br/>

## Keyring fix

```
sudo passwd
```

<br/>

## Bluetooth

```
pacman -Syu bluez bluez-utils
systemctl enable bluetooth.service
systemctl start bluetooth.service

```

<br/>

## Wifi

```
sudo pacman -Syu networkmanager
sudo systemctl enable NetworkManager.service
sudo systemctl start NetworkManager.service
```

<br/>

## Utilitaires 

* Via pacman
```
vlc base-devel firefox 
```

* Snapd:

```
git clone https://aur.archlinux.org/snapd.git
cd snapd
makepkg -si
sudo systemctl enable --now snapd.socket
sudo ln -s /var/lib/snapd/snap /snap
reboot
snap --version
```

* Spotify:
```
snap install spotify
```

* Paru:
```
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

* VS Code:
```
git clone https://aur.archlinux.org/visual-studio-code-bin.git
cd visual-studio-code-bin
makepkg -si
```

<br/>

## Openssh

```
sudo pacman -Syu openssh
ip address
sudo systemctl enable sshd.service
sudo systemctl start sshd.service
```

<br/>

## x2go

```
sudo pacman -Syu x2goserver
sudo x2godbadmin --createdb
sudo systemctl enable x2goserver.service
sudo systemctl start x2goserver.service
```

> Pour pouvoir utiliser x2go on va installer un second desktop env plus léger et sans bug. 

```
sudo pacman -Syu xfce4 xfce4-goodies
```


<br/>

Option pour pouvoir démarrer un server X au choix: 

* Editer le fichier `sudo vim ~/.xinitrc` et ajouter le contenu suivant:
```
# Here Gnome is kept as default
session=${1:-gnome}

case $session in
    gnome             ) exec gnome-session;;
    xfce|xfce4        ) exec startxfce4;;
    # No known session, try to run it as command
    *                 ) exec $1;;
esac
```

<br/>

* Démarrage d'un Desktop environment au choix via l'une des deux commandes suivantes:


```
xinit xfce
xinit gnome
```
