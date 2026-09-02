# Installer les dernières distros Linux avec PXE

- Canonical URL: https://leandeep.com/installer-les-derni%C3%A8res-distros-linux-avec-pxe/
- Author: Olivier Eeckhoutte
- Published: 2020-11-06T19:49:00+02:00
- Updated: 2020-11-06T19:49:00+02:00
- Language: fr
- Tags: PXE, Linux, TFTP
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Aujourd'hui j'ai besoin de réinstaller mon système. Je vais installer Ubuntu 20.04. 
Etant donné que c'est une tâche que je répète régulièrement car j'expérimente beaucoup, je préfère me passer de clés USB car cela me fait perdre du temps. 
Je préfère utiliser un amorçage PXE qui me permet de charger des ISOs depuis mon réseau local.
Dans cet article, nous allons rester simple et nous contenter de mettre à disposition des distro Linux.
je skip volontairement les machines Windows ou les machines Linux prêtes à l'emploi avec serveur NFS... 

<br/>

![pxe](/images/pxe.png)

<br/>

## Installation du serveur PXE

**Pré-requis**

- Une VM sous Debian 10
- Network bridge
- 8go d'espace libre

<br/>

**Installation du proxy DHCP**

Mon réseau local comporte déjà un serveur DHCP. Nous allons utiliser un proxy DHCP [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) qui va forwarder les requêtes au serveur DHCP déjà présent sur mon réseau et renverra les réponses en les adaptant si nécessaire.
Cette installation est temporaire puisque je vais bientôt me doter d'un [pfsense](https://www.pfsense.org/) physique pour mieux segmenter, sécuriser mon réseau local. Bref procédons à l'installation de notre proxy.

```
sudo apt install dnsmasq
```

<br/>

**Installation de serveur TFTP**

Pour réaliser un amorçage PXE il faut un serveur TFTP [(Trivial FTP)](https://fr.wikipedia.org/wiki/Trivial_File_Transfer_Protocol) et le package syslinux pour démarrer les OS.

```
sudo apt install pxelinux syslinux-common
```

<br/>

**Configuration du serveur TFTP et du menu PXE**

Création des répertoires de base et backup dnsmasq

```
# Création des répertoires de base
sudo mkdir -p /var/tftpboot/pxelinux.cfg
cd /var/tftpboot
sudo touch pxelinux.cfg/default

sudo cp /usr/lib/PXELINUX/pxelinux.0 .
sudo cp /usr/lib/syslinux/memdisk .
sudo cp /usr/lib/syslinux/modules/bios/* .

# Backup conf dnsmasq
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.old
```

<br/>

Configuration du proxy DHCP. 
On édite le fichier `/etc/dnsmasq.conf` et on ajoute la configuration suivante:

```
## On n'active pas le serveur DNS
port=0

## On initialise le serveur TFTP
enable-tftp
tftp-root=/var/tftpboot

## On initialise le proxy DHCP
dhcp-range=192.168.0.0, proxy

## On initialise le service PXE
dhcp-boot=pxelinux.0

## On initialise le menu du service PXE
pxe-prompt="Veuillez faire votre choix :"
pxe-service=x86PC, "Boot depuis le disque local", 30
pxe-service=x86PC, "Interface PXE", pxelinux

## On active le log du serveur DHCP
log-dhcp
```

<br/>

On redémarre le proxy:

```
sudo systemctl restart dnsmasq.service
```

L'amorçage PXE peut presque commencer. 
Si vous tentez de démarrer une distro ou un outils quelconque via réseau, le serveur TFTP va être détecté mais cela ne va pas fonctionner car notre PXE n'a pas encore de menu.

<br/>

## Configuration du menu PXE

On édite le fichier `/var/tftpboot/pxelinux.cfg/default` et on ajoute le contenu suivant:

```
DEFAULT menu.c32
MENU MARGIN 0
MENU ROWS -9
MENU TABMSG
MENU TABMSGROW -3
MENU CMDLINEROW -3
MENU HELPMSGROW -4
MENU HELPMSGENDROW -1
MENU COLOR SCREEN 30;47
MENU COLOR BORDER 30;47
MENU COLOR TITLE 30;47
MENU COLOR SCROLLBAR 30;47
MENU COLOR SEL 37;40
MENU COLOR UNSEL 30;47
MENU COLOR CMDMARK 30;47
MENU COLOR CMDLINE 30;47
MENU COLOR TABMSG 37;40
MENU COLOR DISABLED 37;40
MENU COLOR HELP 37;40
MENU TITLE Serveur d'installation PXE
LABEL hdt
 MENU LABEL ^Hardware Detection Tool
 KERNEL hdt.c32
LABEL reboot
 MENU DEFAULT
 MENU LABEL Reboot
 COM32 reboot.c32
LABEL debian
 MENU LABEL ^Debian 10.6 (Netboot)
 LINUX memdisk
 INITRD _iso/debian_10.6_netboot.iso
LABEL fedora33_http
 MENU LABEL ^Fedora 33 (HTTP)
 KERNEL _iso/fedora_33/vmlinuz
 INITRD _iso/fedora_33/initrd.img
 APPEND ip=dhcp inst.stage2=http://mirror.in2p3.fr/pub/fedora/linux/releases/33/Everything/x86_64/os/
LABEL netboot
 MENU LABEL ^Netboot.xyz
 LINUX memdisk
 INITRD _iso/netboot.xyz.iso
 APPEND iso raw
LABEL ubuntu_http
  MENU LABEL ^Ubuntu 20.04 Live (HTTP)
  KERNEL _iso/ubuntu_20.04/vmlinuz
  INITRD _iso/ubuntu_20.04/initrd
  APPEND root=/dev/ram0 ramdisk_size=1500000 ip=dhcp url=http://releases.ubuntu.com/focal/ubuntu-20.04.1-live-server-amd64.iso
```

<br/>

## Ajout des ISOs

On crée d'abord le répertoire qui contiendra les disques d'amorçage:
```
sudo mkdir /var/tftpboot/_iso
```

<br/>

On ajoute Debian 10.6:

```
cd /var/tftpboot/_iso
wget http://ftp.nl.debian.org/debian/dists/buster/main/installer-amd64/current/images/netboot/mini.iso
mv mini.iso debian_10.6_netboot.iso
```

<br/>

On ajoute Ubuntu 20.04:

```
wget http://releases.ubuntu.com/focal/ubuntu-20.04.1-live-server-amd64.iso
mount ubuntu-20.04.1-live-server-amd64.iso /mnt
cp /mnt/casper/{vmlinuz,initrd} /var/tftpboot/_iso/ubuntu_20.04/
cp /usr/lib/syslinux/modules/bios/ldlinux.c32 /var/tftpboot/_iso/ubuntu_20.04/
```

<br/>

On ajoute également Fedora et surtout Netboot qui permet d'aller chercher automatiquement un grand nombre de distro sur internet. 
