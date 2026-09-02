# Corriger l'erreur ADB no permissions sur Arch

- Canonical URL: https://leandeep.com/corriger-lerreur-adb-no-permissions-sur-arch/
- Author: Olivier Eeckhoutte
- Published: 2022-03-02T22:59:00Z
- Updated: 2022-03-02T22:59:00Z
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici la procédure pour installer ADB sur Arch, fixer le problème de permissions et uploader des fichiers en cli.
Je me sers de ces commandes pour copier des vidéos très lourdes filmées en 8K sur un Meta Quest 2 via USB.

<br/>

## Installation

```
sudo pacman -S android-tools
```

<br/>

## Permissions

```
# Si adb tourne déjà
# adb kill-server
# Puis démarrage avec sudo
sudo adb start-server
```

<br/>

## Upload de fichiers

```
# Lister les directories du device
# adb shell ls -R /
# adb shell ls /

adb push ./output-encoded.mp4 /sdcard/Movies/output-encoded.mp4
```

<br/>

## Download

Pour le download, utiliser `adb pull ...`
