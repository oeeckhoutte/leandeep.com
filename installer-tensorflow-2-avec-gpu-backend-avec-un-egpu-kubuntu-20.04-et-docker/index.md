# Installer Tensorflow 2 avec GPU backend avec un eGPU, Kubuntu 20.04 et Docker

- Canonical URL: https://leandeep.com/installer-tensorflow-2-avec-gpu-backend-avec-un-egpu-kubuntu-20.04-et-docker/
- Author: Olivier Eeckhoutte
- Published: 2020-11-15T12:19:00Z
- Updated: 2020-11-15T12:19:00Z
- Language: fr
- Tags: Featured, Tensorflow, eGPU, Intel Nuc, Data Science, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans deux articles précédents, nous avions vu comment installer Tensorflow 1 et 2 avec GPU support sur Ubuntu 18.04 avec une carte graphique Gefore GTX 1080 ou une plus ancienne carte plus supportée, la Geforce GTX 660 Ti.

<br/>

J'ai récemment fait un système upgrade et suis passé sur Kubuntu 20.04. Il est excellant et très stable, je le recommande grandement. Je suis toujours partisan des stations de Deep Learning personnelles (non dans le Cloud). D'un point de vue économique, c'est beaucoup plus rentable d'avoir sa propre station. Il vous faut juste un boitier EGPU 300€ (pour un haut de gamme type Razer), un PC (gratuit, quel dev ou data engineer n'en a pas? Idéalement il vous faudrait un PC secondaire) et un GPU (entre 150€ et 700€ pour une bête voire 1500€ pour un monstre). 
La location d'une machine avec GPU sur AWS vous revient à minimum $300 par mois (min $0.5/heure * 24h * 7 jours * 4 semaines). Il n'y a pas photo...
Après AWS vous permet d'avoir des instances avec plusieurs GPUs, cela peut être utile dans certains cas. Peut-être qu'un build avec plusieurs eGPU pourrait faire l'affaire pour ce use case... Je ne ferai pas l'essai, je n'ai pas ce besoin... 

<br/>

**Dans cet article nous allons voir comment installer Tensorflow 2 sur sa propre machine reliée a un EGPU Nvidia Geforce GTX 1080, Kubuntu 20.04 et Docker. Il n'y a plus l'installation complexe de Cuda à gérer :) .**

<br/>

## Installation

```
sudo apt-get update
sudo apt-get dist-upgrade
```

<br/>

**Autoriser la communication via Thunderbolt, et donc le EGPU**

```
sudo sh -c 'echo 1 > /sys/bus/thunderbolt/devices/0-0/authorized'
sudo sh -c 'echo 1 > /sys/bus/thunderbolt/devices/0-1/authorized'
```

<br/>

Vérifier que le EGPU est détecté:

```
lspci | grep -i nvidia
```

<br/>

**Installation de Cuda toolkit (ce n'est pas Cuda)**

```
sudo apt-get install nvidia-cuda-toolkit
```

> Si vous utilisez Ubuntu 20.04 et pas Kubuntu 20.04 vous devrez désactiver l'utilisation de Wayland en commmentant la ligne suivante `#WaylandEnable=false` dans le fichier `/etc/gdm3/custom.conf`.

<br/>

**Installation le driver Nvidia**

```
# Désinstaller les drivers déjà installés
sudo dpkg -P $(dpkg -l | grep nvidia-driver | awk '{print $2}')
sudo apt autoremove
# Installer les nouveaux drivers Nvidia propriétaire (pas les "nouveau" opensource)
sudo apt-get install --no-install-recommends nvidia-driver-418
```

<br/>

**Configurer Grub pour booter en mode runlevel 3**

Le fichier grub original `/etc/default/grub` ressemble à ceci:

```
#If you change this file, run 'update-grub' afterwards to update
# /boot/grub/grub.cfg.
# For full documentation of the options in this file, see:
#   info -f grub -n 'Simple configuration'
 
GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=0
GRUB_DISTRIBUTOR=`lsb_release -i -s 2> /dev/null || echo Debian`
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_CMDLINE_LINUX=""
```

Remplacer la variable `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"` par `GRUB_CMDLINE_LINUX_DEFAULT="3"`.

<br/>

Mettre à jour Grub et redémarrer

```
sudo update-grub
sudo reboot
```

<br/>

## Autoriser le Driver Nvidia a accélérer le server X.

Pour ce faire, éditer le fichier `/usr/share/X11/xorg.conf.d/10-nvidia.conf` et ajouter les lignes suivantes: 

```
Section "OutputClass"
   Identifier "nvidia"
   MatchDriver "nvidia-drm"
   Driver "nvidia"
   Option "AllowExternalGpus" "True"
   Option "AllowEmptyInitialConfiguration"
   ModulePath "/usr/lib/x86_64-linux-gnu/nvidia/xorg"
EndSection
```

<br/>

Redémarrer votre machine pour vérifier que tout est bon. Après identification et exécution de la commande `startx`, le X server doit démarrer et vous devriez voir le desktop KDE.

<br/>

## (Optionel) Reconfigurer GRUB

Vous pouvez éventuellement reconfigurer GRUB et "setter" la variable `GRUB_CMDLINE_LINUX_DEFAULT` à `"quiet splash"`.

<br/>

## Vérifier le bon fonctionnement des Drivers Nvidia

Après le redémarrage du PC, le X server ne va plus démarrer, c'est normal. Identifiez-vous puis vérifier que les drivers Nvidia fonctionnent.

```
nvidia-smi
```

<br/>

Si vous avez un output qui ressemble à ceci, vous êtes bon:

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 455.38       Driver Version: 455.38       CUDA Version: 11.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  GeForce GTX 1080    Off  | 00000000:06:00.0 Off |                  N/A |
| 27%   27C    P8     5W / 180W |    441MiB /  8119MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A      1487      G   /usr/lib/xorg/Xorg                215MiB |
+-----------------------------------------------------------------------------+
```

<br/>

## Installer Docker 

Si ce n'est pas déjà fait, installer Docker:

```
curl https://get.docker.com | sh \
  && sudo systemctl start docker \
  && sudo systemctl enable docker
```

<br/>

## Installer Nvidia-docker

```
sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
```

<br/>

## Démarrer un base container CUDA et vérifier que tout est ok 

```
sudo docker run --rm --gpus all nvidia/cuda:11.0-base nvidia-smi
```

<br/>

Si vous avez le même output que moi, c'est que tout est bon

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 455.38       Driver Version: 455.38       CUDA Version: 11.1     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  GeForce GTX 1080    Off  | 00000000:06:00.0 Off |                  N/A |
| 27%   27C    P8     6W / 180W |    443MiB /  8119MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
+-----------------------------------------------------------------------------+
```

<br/>

## Installer Tensorflow 2

```
sudo docker run --rm -it --gpus all nvidia/cuda:11.0-base /bin/bash
apt-get update
apt-get install python3-dev python3-pip
pip3 install tensorflow-gpu
python3 
>>> import tensorflow
>>> from tensorflow.python.client import device_lib
>>> print(device_lib.list_local_devices())
```
