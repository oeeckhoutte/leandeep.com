# Mount HFS+ volume sur Ubuntu

- Canonical URL: https://leandeep.com/mount-hfs-volume-sur-ubuntu/
- Author: Olivier Eeckhoutte
- Published: 2015-07-05T20:36:00Z
- Updated: 2015-07-05T20:36:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Déterminer le nom du volume HDF+
```
sudo fdisk -l
```

Installer le paquet permettant de faire du read/write sur HFS+:
```
sudo apt-get install hfsprogs
```

Checker le status d'un disque:
```
sudo fsck.hfsplus -f /dev/sdd1
```

Démonter un disque:
```
sudo umount /home/olivier/lacie_mount
```

Monter le disque avec les droits read/write:
(créer un dossier pour monter le disque au préalable)
```
sudo mount -t hfsplus -o force,rw /dev/sdd1 /home/olivier/lacie_mount
```

