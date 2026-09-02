# Installer quickemu sur Ubuntu 22.04

- Canonical URL: https://leandeep.com/installer-quickemu-sur-ubuntu-22.04/
- Author: Olivier Eeckhoutte
- Published: 2025-02-07T07:32:00+02:00
- Updated: 2025-02-07T07:32:00+02:00
- Language: fr
- Tags: tips, Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir comment installer Quickemu sur Ubuntu 22.04 pour créer des VM sur Ubuntu.

<br/>


**Installation de quickemu**

```
# check if python3 is installed 
# python3 --version
# sudo apt install python3 # si nécessaire
sudo apt install qemu bash coreutils ovmf grep jq lsb procps genisoimage usbutils util-linux sed spice-client-gtk swtpm wget xdg-user-dirs zsync unzip

sudo apt-add-repository ppa:flexiondotorg/quickemu
sudo apt update
sudo apt install quickemu
```

<br/>

**Installation du GUI**

```
sudo add-apt-repository ppa:yannick-mauray/quickgui
sudo apt update
sudo apt install quickgui
```

<br/>


**CLI usage**

```
quickget ubuntu-mate 20.04
quickemu --vm ubuntu-mate-20.04.conf

# doc: https://github.com/quickemu-project/quickemu/wiki/06-Advanced-quickget-features
```

<br/>

> Tip: Cliquez sur `Ctrl` + `Alt` + `f` pour quitter le mode fullscreen

