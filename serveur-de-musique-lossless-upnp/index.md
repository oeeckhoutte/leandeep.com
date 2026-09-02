# Serveur de musique lossless UPNP

- Canonical URL: https://leandeep.com/serveur-de-musique-lossless-upnp/
- Author: Olivier Eeckhoutte
- Published: 2020-08-13T19:49:00+02:00
- Updated: 2020-08-13T19:49:00+02:00
- Language: fr
- Tags: Music, Lossless, Streaming, UPNP
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

<br/>

## Introduction

Dans cet article nous allons voir comment installer un serveur UPNP sur OSX et Linux pour streamer des musiques FLAC. Cela peut être utile pour certaines enceintes connectées comme les fameuses KEF LSX. Ce genre de serveur peut vous permettre d'éviter de payer des abonnements Tidal, Spotify ou Deezer pour vos titres favoris. 

<br/>

![image](/images/enceintes-kef-lsx.jpg)

<br/>

## Installation sur OSX

```
brew tap gerbera/homebrew-gerbera
brew install gerbera
```
<br/>

## Installation sur Linux

**Option 1 sur Debian et Ubuntu (1.0):**

```
sudo apt install gerbera
```

Le fichier de configuration est situé ici:
```
sudo vi /etc/gerbera/config.xml
```

<br/>
**Option 2 sur Debian et Ubuntu (build pour obtenir la dernière version) :**

```
sudo apt install cmake
sudo apt install g++
sudo apt-get install autoconf
sudo apt-get install libtool
sudo apt-get install pkg-config
sudo apt install libavutil-dev libavcodec-dev libavformat-dev libavdevice-dev \
libavfilter-dev libavresample-dev libswscale-dev libswresample-dev libpostproc-dev
sudo apt install uuid-dev libsqlite3-dev libmysqlclient-dev \
libmagic-dev libexif-dev libcurl4-openssl-dev libspdlog-dev libpugixml-dev
git clone https://github.com/gerbera/gerbera.git
cd gerbera
sudo ./scripts/install-taglib111.sh
sudo ./scripts/install-pupnp.sh
mkdir build
cd build
cmake ../gerbera -DWITH_MAGIC=1 -DWITH_MYSQL=1 -DWITH_CURL=1 -DWITH_JS=1 \
-DWITH_TAGLIB=1 -DWITH_AVCODEC=1 -DWITH_FFMPEGTHUMBNAILER=1 -DWITH_EXIF=1 -DWITH_LASTFM=1
make -j4
sudo make install
```
<br/>

**Sur Fedora :**

```
sudo dnf install gerbera
```

<br/>

## Configuration et démarrage du serveur (pour version 1.4+)

```
mkdir ~/.config/gerbera
gerbera --create-config | sed 's/accounts enabled="no"/accounts enable="yes"/' > ~/.config/gerbera/config.xml
gerbera &

# sur OSX
open -a Safari http://0.0.0.0:49152/
```
