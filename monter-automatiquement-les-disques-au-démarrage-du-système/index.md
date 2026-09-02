# Monter automatiquement les disques au démarrage du système

- Canonical URL: https://leandeep.com/monter-automatiquement-les-disques-au-d%C3%A9marrage-du-syst%C3%A8me/
- Author: Olivier Eeckhoutte
- Published: 2014-05-02T22:59:00Z
- Updated: 2014-05-02T22:59:00Z
- Language: fr
- Tags: Unix Tip
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Afficher proprement les points de montage du système

**Dans la catégorie Administration Système:**

```
$ mount | column -t
```

<br/>

Pour filtrer sur un type de système de fichier, vous pouvez utiliser la commande suivante.

```
# Exemple pour un filesystem apfs
$ mount -t apfs | column -t
```

<br/>

## Monter automatiquement un disk interne

Créer vos répertoire de montage puis monter manuellement une première fois vos disques:

```
cd ~
mkdir hdd1_mount
sudo mount /dev/sda1 ~/hdd1_mount
```

Le disque va être monté. Ouvrez le fichier /etc/mtab et copiez la dernière ligne. 
<br/>
<br/>
Exemple: 
<br/>
`/dev/sda1 /home/olivier/hdd1_mount ext4 rw,relatime,data=ordered 0 0`

Editez ensuite le fichier /etc/fstab et ajouter en bas du fichoer la ligne que vous avez précédemment copié. 

<br/>

## Monter automatiquement un disque ou clé usb

Installez simplement le package suivant:

```
sudo apt-get install usbmount
```

