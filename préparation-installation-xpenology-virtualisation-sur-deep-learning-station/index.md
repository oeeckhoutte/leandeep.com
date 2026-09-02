# Préparation installation Xpenology - Virtualisation sur Deep Learning Station

- Canonical URL: https://leandeep.com/pr%C3%A9paration-installation-xpenology-virtualisation-sur-deep-learning-station/
- Author: Olivier Eeckhoutte
- Published: 2019-01-04T16:11:00Z
- Updated: 2019-01-04T16:11:00Z
- Language: fr
- Tags: Virtualization
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

# Introduction 

Il y a quelques temps j'ai investi dans du matériel informatique et me suis construit une station pour faire du Deep Learning. Depuis quelques semaines et surtout depuis qu'on m'a parlé du projet Xpenology (Synology maison) je pense à me construire un NAS. Mais débourser environ 800 euros (TTC) sans être certain du résultat ne m'enchante guère...

Je vais donc expérimenter Xpenology sur ma station de Deep Learning qui possède un grand nombre de disques durs et qui est allumée 24/7. Initialement, je voulais installer Proxmox (hyperviseur type 1) et réinstaller ma config de Deep Learning mais ce dernier n'est pas compatible avec ma carte graphique pour faire du `passthrough GPU`. Et finalement, après réflexion, c'est *overkill* pour réaliser une expérimentation. Bref avec cette installation, je vais pouvoir vérifier si ce nouveau NAS maison est bien stable avant d'investir. 

Je vais installer l'hyperviseur type 2 qemu-kvm pour créer une VM sur laquelle j'installerai Xpenology. 

J'ai passé tellement de temps à configurer ma station de Deep Learning que je ne veux pas prendre le risque d'installer n'importe quoi sur mon disque dur actuel. Je commence donc par faire un backup de mon SSD et travailler sur le clone pour vérifier qu'il a bien fonctionné. 

Voici la photo d'un boitier assez pratique qui me sert pour cloner mes disques... 

![image](/images/IMG_2801.JPG)


Dans cet article, nous allons voir comment installer l'hyperviseur et dans un prochain article voir comment installer Xpenology sur une VM.

<br/>

# Installation

## Installation de l'hyperviseur
On vérifie que le hardware est compatible. 
```
sudo apt-get install cpu-checker
sudo kvm-ok

INFO: /dev/kvm exists
KVM acceleration can be used

# ou $ egrep '^flags.*(vmx|svm)' /proc/cpuinfo
# Si un résultat s'affiche, c'est good !
```

Installation du paquet `qemu-kvm`

```
sudo apt-get install qemu-kvm
```

On ajoute l'utilisateur courant au groupe kvm
```
sudo adduser $USER kvm
```

On télécharge un ISO pour faire nos tests. Par exemple, Ubuntu server 18.04 LTS: http://releases.ubuntu.com/bionic/ 


Il est possible de créer des VMs via le CLI mais il y a tellement d'options possibles avec qemu-kvm qu'il est quand même plus simple d'utiliser le gui `virt-manager`. 

> Si comme moi vous vous connectez à votre machine en SSH n'oubliez pas le flag `-X`.

Voici néanmoins, si vous êtes curieux, les commandes qu'il est possible d'utiliser: 


On crée un fichier image:
```
cd ~
mkdir virtual_images
qemu-img create -f qcow2 /home/olivier/virtual_images/ubuntu_1804.img 10G
```

Et on peut crée une VM:
```
kvm -m 256 -cdrom ~/ubuntu-18.04.1.0-live-server-amd64.iso -boot d /home/olivier/virtual_images/ubuntu_1804.img
```

<br/>

## Installation du GUI 

```
sudo apt-get install virt-manager
sudo apt-get install libvirt-bin
sudo adduser $USER libvirtd
reboot
sudo service libvirt-bin start
virt-manager
```

Et voilà il est maintenant possible de créer vos VMs... 

![image](/images/virtmanager.png)

Pour accéder en SSH à votre nouvelle VM, sélectionner `Host device eno1: macvtap` comme Network source et `Bridge` comme Source mode.

Note:
Pour customiser certains paramètres comme la `vram` par exemple (impossible à faire via virt-manager), il faut le faire via la commande suivante `sudo virsh edit <nom-de-la-vm>`.

