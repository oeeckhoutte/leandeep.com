# Manipuler les fréquences radio

- Canonical URL: https://leandeep.com/manipuler-les-fr%C3%A9quences-radio/
- Author: Olivier Eeckhoutte
- Published: 2020-04-18T15:20:00+02:00
- Updated: 2020-04-18T15:20:00+02:00
- Language: fr
- Tags: Hackrf, Security, Wireless, RadioFrequences
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons comment installer des outils permettant d'analyser des fréquences radio.

L'installation sera faite sur Ubuntu 18.04 avec un user non root. Le hardware permettant de recevoir et émettre des ondes est un HackRF.
<br/>

Les outils sont les suivants:
* Kalibrate
* Qspectrum
* Inspectrum
* Spectrum Analyzer GUI
* URH (Universal Radio Hack)
* Gnuradio

<br/>

**Pourquoi ces outils sont-ils utiles ?**
* Analyser la sécurité de vos objets connectés, ou votre porte de garage, votre portail motorisé... (malheureusement beaucoup comportent des failles)
* Comprendre comment fonctionnent les ondes GSM et mieux vous protéger (Attention aux ISMI catchers)
* Piloter des drones, voitures téléguidées qui n'ont pas d'API et que vous aimez bidouillez. Votre HackRF vous permet de les contrôler très simplement.
* Idem avec vos objets connectés propriétaires. Vous pouvez les contrôler même s'ils n'ont pas d'API ou de SDK mis à disposition par les constructeurs.
* Réaliser un projet LORA WAN
* etc.

<br/>

## Installation des drivers pour HackRF

```
sudo apt install build-essential cmake libfftw3-dev libusb-1.0-0-dev pkg-config

sudo apt install hackrf
```

<br/>

Si le paquet `hackrf` ne s'installe pas sur votre OS Linux vous pouvez utiliser les commandes suivantes:

```
git clone https://github.com/mossmann/hackrf.git
cd hackrf/
mkdir host/build/
cd host/build/
cmake ..
make -j8
make install
ldconfig
```

<br/>

Pour des raisons de sécurité, un utilisateur normal sur Linux n'a pas les permissions pour accéder à des devices USB arbitraires. Pour accéder au Hackrf sans droit root, on peut créer un fichier `/etc/udev/rules.d/52-hackrf.rules` et ajouter le contenu suivant:

```
ATTR{idVendor}=="1d50", ATTR{idProduct}=="604b", SYMLINK+="hackrf-jawbreaker-%k", MODE="660", GROUP="plugdev"
ATTR{idVendor}=="1d50", ATTR{idProduct}=="6089", SYMLINK+="hackrf-one-%k", MODE="660", GROUP="plugdev"
ATTR{idVendor}=="1fc9", ATTR{idProduct}=="000c", SYMLINK+="hackrf-dfu-%k", MODE="660", GROUP="plugdev"
```

*Le contenu de ce fichier permet de dire à `udev` de reconnaitre HackRF grâce au Vendor ID et Product ID
Il fixe les permissions UNIX à 660 et au groupe plugdev pour /dev. Enfin, il crée un symlink dans /dev pour le device HackRF.*

<br/>

Une fois le fichier de règle précédent créé, il faut reloader `udevadm`: 

```
sudo udevadm control --reload-rules
```

<br/>

Pour vérifier que HackRF est bien détecté, on peut utiliser la commande `hackrf_info`.

<br/>

## Kalibrate

**Analyse d'ondes GSM avec Kalibrate**

```
apt install libtool autoconf automake m4
```

```
#git clone https://github.com/scateu/kalibrate-hackrf.git
git clone https://github.com/rxseger/kalibrate-hackrf.git
cd kalibrate-hackrf/
./bootstrap
./configure 
make -j8
cd ../
```

```
kalibrate-hackrf/src/kal -h
kalibrate-hackrf/src/kal -s GSM900 -l 32 -g 20 -p 10 | tee GSM900.kal-hackrf

sort -rh -k7,7 GSM900.kal-hackrf
```

<br/>

Alternative pour analyser des ondes GSM: utiliser LTE-Cell-Scanner

```
git clone https://github.com/rxseger/LTE-Cell-Scanner.git
cd LTE-Cell-Scanner/build/src/
./CellSearch -h
./CellSearch --freq-start 1842.5e6 --freq-end 1842.5e6 --gain 20
./CellSearch --freq-start 1842.5e6 --freq-end 1842.5e6 --gain 20 --correction 1.000010337027486429
#1.0000089694805360807

python

>>> 1e6 * (1 - 1.0000101601567139564)
-10.160156713956425

>>> 1e6 * (1 - 1.0000089694805360807)
-8.96948053608071
However - don’t ask me why - it works best without any correction nor PPM

./LTE-Tracker -h
#./LTE-Tracker --gain 20 --freq 1842.5e6 --correction 1.0000089694805360807 --ppm 20
./LTE-Tracker --gain 20 --freq 1842.5e6
```

<br/>

## Qspectrum

```
git clone https://github.com/xmikos/qspectrumanalyzer.git
#less README.rst #--> Ubuntu
#apt install python3-pyqt5 python3-pyqtgraph

apt install python3-pip
pip3 install qspectrumanalyzer

which hackrf_sweep
qspectrumanalyzer 
```

<br/>

**Configurer Qspectrum**

File > Settings

settings/Backend: hackrf_sweep

settings/Sample rate: 20 Mhz

<br/>

Frequency: 10 or 450 - 7250 Mhz

Bin size:  1000 kHz

<br/>

-MAIN CURVE

MAX HOLD

AVERAGE

SMOOTHING


<br/>

## Inspectrum

```
git clone https://github.com/miek/inspectrum.git
cd inspectrum/
mkdir build/
cd build/
cmake ..
make -j8
sudo make install

hackrf_transfer -h
hackrf_transfer -r air.cs8 -f `arfcncalc -a $arfcn -d` -l 32 -g 20 -s 2e6
hackrf_transfer -r air.cs8 -f 1842.5e6 -l 32 -g 20 -s 11e6
#-C "$hppm"

inspectrum -h
inspectrum --rate 2e6 air.cs8
inspectrum --rate 11e6 air.cs8

```

Si vous avez l'erreur suivante "Couldn't transfer any bytes for one second", vous pouvez regarder dans la FAQ de HackRF et les issues ouvertes: https://github.com/mossmann/hackrf/issues/237 & https://github.com/mossmann/hackrf/wiki/FAQ

<br/>

## Spectrum Analyzer GUI

```
sudo apt install build-essential ant git libusb-1.0 libfftw3 libfftw3-dev openjdk-8-jdk

git clone --depth=1 --recurse-submodules https://github.com/pavsa/hackrf-spectrum-analyzer.git
cd hackrf-spectrum-analyzer/src/hackrf-sweep/
make -j8
build/hackrf_sweep_spectrum_analyzer.sh
```

<br/>

## Installation de URH

```
sudo apt install gr-osmosdr
sudo apt-get install libhackrf-dev

mkvirtualenv -p /usr/bin/python3 -a . sdr_env
pip install urh
```

<br/>

## Installation de GNU Radio

```
# Pour connaitre le Sample rate d'un WAV pour configurer la transmission 
sudo apt install mplayer
# example: 
# mplayer Jacky-Core-Encore-Plus-Fort-Captain-2015.wav


sudo add-apt-repository ppa:gnuradio/gnuradio-releases-3.7
sudo apt-get update
sudo apt install gnuradio
```

> Note: une fois votre workflow terminé sur Gnuradio, vous pouvez accéder au code Python pour aller plus loin et automatiser son utilisation. Example dans mon cas: `/usr/bin/python2 -u /home/olivier/Dev/SDR/top_block.py`

