# Créer une clé USB bootable depuis OSX

- Canonical URL: https://leandeep.com/cr%C3%A9er-une-cl%C3%A9-usb-bootable-depuis-osx/
- Author: Olivier Eeckhoutte
- Published: 2019-01-03T22:19:00Z
- Updated: 2019-01-03T22:19:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici la procédure à suivre pour créer une clé USB bootable depuis un fichier iso. 


```
diskutil list

diskutil unmountDisk disk2

sudo dd if=/Users/olivier/Downloads/proxmox-ve_5.3-1.iso of=/dev/disk2 bs=8m

diskutil eject disk2
```

