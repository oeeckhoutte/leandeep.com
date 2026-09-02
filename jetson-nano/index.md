# Jetson Nano

- Canonical URL: https://leandeep.com/jetson-nano/
- Author: Olivier Eeckhoutte
- Published: 2019-12-22T16:35:00Z
- Updated: 2019-12-22T16:35:00Z
- Language: fr
- Tags: Jetson Nano, Nvidia, Edge Computing
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Découverte du Nvidia Jetson Nano

J'ai eu la chance de recevoir par Nvidia (encore un grand merci!) une board Jetson Nano pour la construction de mon robot autonome. Cette carte est un peu comme un Raspberry Pi en plus puissant avec une carte graphique intégrée. Et elle est vraiment très abordable. Elle coûte environ 140 €. Selon moi ses caractéristiques techniques en font une carte parfaitement adaptée à ceux qui veulent s'initier au **Edge Deep Learning**. Avec ce genre de carte, on n'a plus besoin du Cloud pour faire l'inférence de modèle de Machine Learinig utilisant des librairies GPU. Cette carte est parfaite pour les sujets IoT. *On aura besoin du Cloud juste au moment où il faudra upgrader ses modèles de Machine/ Deep Learning.*

Voici une première review de cette carte. D'autres articles viendront le compléter... 

<br/>

## Caractéristiques techniques

|| 
| ------------- | -----:|
|CPU|Quad-core ARM® Cortex®-A57 MPCore processor|
|GPU|NVIDIA Maxwell™ architecture with 128 NVIDIA CUDA® cores|
|RAM|4 GB 64-bit LPDDR4|
|Storage|16 GB eMMC 5.1 Flash|
|Camera|12 lanes (3×4 or 4×2) MIPI CSI-2 DPHY 1.1 (1.5 Gbps)|
|Connectivity|Gigabit Ethernet|
|Display Ports|HDMI 2.0 and DP 1.2|
|USB Ports|1 USB 3.0 and 3 USB 2.0|
|Other|1 x1/2/4 PCIE, 1x SDIO / 2x SPI / 6x I2C / 2x I2S / GPIOs|
|Size|69.6 mm x 45 mm|

<br/>

![image](/images/jetson-nano.png)

<br/>

## Alimentation électrique

Il y a 3 manières d'alimenter le Jetson Nano Developer Kit. 

Premièrement, on peut le faire avec un cable micro-USB qui va fournir 5V et 2A. 

Deuxièmement, on peut utiliser une ou deux pins du GPIO qui peuvent recevoir 5V et 3A chacune. On arrive donc à une intensité totale de 6A.

La troisième méthode consiste à utiliser le connecteur *Barrel Jack* qui reçoit du 5V et 4A. Personnellement, c'est la méthode que j'utilise. Pour que cela fonctionne, il faut relier entre elles les broches du jumper j48. Si vous branchez beaucoup de périphériques à votre Nano privilégiez cette option. Lorsque le Jumper est positionné sur la carte, le micro-USB passe en mode transfert de données. 

> Pour info, l'alimentation PoE (Power Over Ethernet) n'est pas supportée... Par contre les broches sont disponibles sur le connecteur j38

Deux modes d'alimentation sont disponibles: le mode 5W et le mode 10W.

Pour passer en mode 5W:
```
sudo nvpmodel -m 1
```

Pour passer en mode 10W:
```
sudo nvpmodel -m 0
```

<br/>

## Installation des Softs

**Création de la carte micro SD**

Des images Linux [Linux4Tegra](https://developer.nvidia.com/embedded/dlc/jetson-nano-dev-kit-sd-card-image) (Ubuntu 18.04 optimisé pour le hardware Nvidia) sont disponibles sur le site de Nvidia pour démarrer très vite. 
Avec un utilitaire comme [Unetbootin](https://unetbootin.github.io/) sur Mac (ou Win32 Disk Imager sur Windows), on peut créer une carte MicroSD bootable pour démarrer Linux sur son Jetson Nano. 

<br/>

**Installation d'un virtualenv**

```
sudo apt-get install virtualenv -y
mkdir ~/envs
cd ~/envs
virtualenv --python python3 ai_env
source ~/envs/ai_env/bin/activate
echo 'source ~/envs/ai_env/bin/activate' >> ~/.bashrc
```

<br/>

**OpenCV**

OpenCV est déjà installé sur cette distribution. Pour l'utiliser dans son projet Python à l'intérieur d'un environnement virtuel, il suffit d'exécuter les commandes suivantes:

```
sudo find / -name "cv2*"

[sudo] password for olivier:

find: '/run/user/1000/gvfs': Permission denied

/usr/lib/python2.7/dist-packages/cv2.so
/usr/lib/python3.6/dist-packages/cv2.cpython-36m-aarch64-linux-gnu.so

cd ~/envs/ai_env/lib/python3.6/site-packages/

ln -s /usr/lib/python3.6/dist-packages/cv2.cpython-36m-aarch64-linux-gnu.so
```

Pour vérfier que le symlink a bien fonctionné et qu'OpenCV est fonctionnel, vous pouvez exécuter les commandes suivantes:

```
python
>>> import cv2
>>> print(cv2.__version__)
3.3.1
```

<br/>

Sinon il peut être intéressant de réinstaller la librairie globalement pour ne plus perdre de temps:

```
sudo apt-get install python3-opencv

python3
Python 3.6.8
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import cv2
>>> cv2._version
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: module 'cv2' has no attribute '_version'
>>> cv2.__version__
'3.2.0'
```


<br/>

**Installation de modules de base**

```
sudo apt-get update
sudo apt-get upgrade
# Installer le moteur de polices FreeType 2
sudo apt-get install libfreetype6-dev -y
# Installer le gestionnaire de flags de compilation et d'édition de lien pour les libs
sudo apt-get install pkg-config -y
sudo apt-get install zlib1g-dev zip libjpeg8-dev libhdf5-dev -y
sudo apt-get install libssl-dev libffi-dev python3-dev -y
sudo apt-get install libhdf5-serial-dev hdf5-tools -y
# For numpy install https://packages.debian.org/jessie/liblapack-dev & https://packages.debian.org/jessie/libblas-dev & https://packages.debian.org/jessie/libatlas-base-dev (see below)
sudo apt-get install libblas-dev liblapack-dev libatlas-base-dev -y
# Installation d'un compilateur fortran 
sudo apt-get install gfortran
sudo apt-get install build-essential cmake libgtk-3-dev libboost-all-dev -y
sudo apt-get install nano vim tmux -y
pip install matplotlib
pip install scikit-build
# To do basic image processing functions
pip install imutils
# The Python Imaging Library pillow
pip install pillow
sudo apt-get install python3-setuptools -y
# Librairie d'algèbre linéaire
sudo apt-get install python3-pip libopenblas-base -y
```

<br/>

**Installation de Scipy, Scikit-learn, Keras, Jupyter notebook, opencv-python**

```
pip install scipy
pip install keras
pip install scikit-learn
pip install jupyter notebook	
pip install numpy # and wait forever... 
```

<br/>

**Installation de Tensorflow**

```
pip install --extra-index-url https://developer.download.nvidia.com/compute/redist/jp/v42/tensorflow-gpu version_de_tensorflow 

# Les dernières versions de Tensorflow sont disponibles:
tensorflow_gpu-1.15.0+nv19.11-cp36-cp36m-linux_aarch64.whl 217MB 2019-12-12 16:58:00
tensorflow_gpu-2.0.0+nv19.11-cp36-cp36m-linux_aarch64.whl 198MB 2019-12-12 16:58:00
```

<br/>

**Configuration du SWAP**

Par défaut, le SWAP n'est pas activé, ce qui provoque des `OOM Kills` (Out Of Memory kills). 

Il faut donc l'activer. Pour ce faire, exécutez les commandes suivantes: 

```
sudo swapon --show

# La taille idéale devrait être de deux fois celle de la RAM. Si vous avez une carte de 64 Go, fixez la taille du Swap à 8G.

sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
ls -lh /swapfile

# Création et activation du SWAP
sudo mkswap /swapfile
sudo swapon /swapfile

# Vérification
sudo swapon --show
free -h

# Rendre l'activation persistente après reboot
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

<br/>

**Installation de Pytorch**

```
wget https://nvidia.box.com/shared/static/ncgzus5o23uck9i5oth2n8n06k340l6k.whl -O torch-1.4.0-cp36-cp36m-linux_aarch64.whl
sudo pip3 install Cython
sudo pip3 install numpy
sudo pip3 install torch-1.4.0-cp36-cp36m-linux_aarch64.whl
```

<br/>

**Installation de torchvision**

```
sudo apt-get install libjpeg-dev zlib1g-dev
git clone --branch v0.5.0 https://github.com/pytorch/vision torchvision
cd torchvision
sudo python setup.py install
cd ../   # attempting to load torchvision from build dir will result in import error
```

<br/>

**Installation du driver GPIO**

```
pip install Jetson.GPIO
sudo groupadd -f -r gpio
sudo usermod -a -G gpio pi
sudo cp /opt/nvidia/jetson-gpio/etc/99-gpio.rules /etc/udev/rules.d/

Rebooter ou exécuter

sudo udevadm control --reload-rules && sudo udevadm trigger
```

<br/>

**Installation du modèle Yolo**

```
export GPU = 1
pip install yolo34py-gpu
```

<br/>

## Forum Nvidia officiel

[Accès au forum Nvidia](https://devtalk.nvidia.com/default/board/371/)

<br/>

## Commandes utiles

**Taux d'utilisation et température**
```
tegrastats
```

<br/>

**Power mode activé**
```
sudo /usr/sbin/nvpmodel -q
```

<br/>

**Booster le ventilateur**
```
# Le faire tourner au maximum
sudo sh -c 'echo 255 > /sys/devices/pwm-fan/target_pwm'
# L'arrêter
sudo sh -c 'echo 0 > /sys/devices/pwm-fan/target_pwm'
```

<br/>

**Jetson stats**
```
git clone https://github.com/rbonghi/jetson_stats.git
cd jetson_stats/
sudo ./install_jetson_stats.sh --s
ntop
jetson_release
```

<br/>

## Conclusion 

A part quels petits soucis rencontrés au niveau de l'alimentation de la carte, je ne lui trouve que des avantages. 
Les soucis au niveau de l'alimentation était dûs à un manque de connaissance de ma part sur le fonctionnement de cette carte. Une fois qu'on a compris comment bien aliementer sa carte, tout fonctionne parfaitement. 

Un GPIO composé de 40 pins est compatible avec celui du Raspberry Pi. Pour moi cela représente un énorme avantage. Si vous avez déjà construit des projets avec des Raspberry Pi vous pouvez reprendre vos montages existants et les porter sur le Nano. 

Et avec le GPU présent, vous pourrez sans doute construire de très beaux projets en y apportant des réseaux de neurones. Et la cela devient vraiment fun.

Je pense que c'est assez clair, je recommande très fortement cette carte.

