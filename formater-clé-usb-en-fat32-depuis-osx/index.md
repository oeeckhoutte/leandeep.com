# Formater clé usb en fat32 depuis OSX

- Canonical URL: https://leandeep.com/formater-cl%C3%A9-usb-en-fat32-depuis-osx/
- Author: Olivier Eeckhoutte
- Published: 2014-05-15T19:54:00Z
- Updated: 2014-05-15T19:54:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Lister les disques pour récupérer le nom de la clé à formater**
```
diskutil list
```

<br/>

**Démonter la clé à formater**
```
diskutil unmountDisk /dev/disk2
```

<br/>

**Formater la clé au format fat32 et lui donner le nom "USB"**
```
diskutil eraseDisk FAT32 USB /dev/disk2
```

<br/>

**Formater la clé en FAT32 avec l’option de zone d’amorce en MBR pour qu’elle soit lisible sur tous les OS**
```
diskutil eraseDisk FAT32 USB MBR /dev/disk2
```

