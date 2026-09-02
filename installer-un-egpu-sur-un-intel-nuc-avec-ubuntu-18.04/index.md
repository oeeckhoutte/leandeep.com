# Installer un eGPU sur un Intel Nuc avec Ubuntu 18.04

- Canonical URL: https://leandeep.com/installer-un-egpu-sur-un-intel-nuc-avec-ubuntu-18.04/
- Author: Olivier Eeckhoutte
- Published: 2019-07-18T12:19:00Z
- Updated: 2019-07-18T12:19:00Z
- Language: fr
- Tags: Featured, Tensorflow, eGPU, Intel Nuc, Data Science, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

![image](/images/IMG_35783.JPG)

<br/>

## Introduction 

J'ai récemment fait l'acquisition d'un Intel Nuc (Core i7 et 32 go de RAM). Franchement je suis vraiment satisfait. Il est petit, leger, sobre, stylé, consomme peu et celui que j'ai choisi a du Thunderbolt 3. C'est d'ailleurs pour cela que je l'ai acheté.

Qui dit Thunderbolt 3 dit eGPU. Et qui dit eGPU dit tensorflow-gpu !..

J'ai recyclé une ancienne carte graphique qui trainaient dans un ancien PC. Il s'agit d'une `Geforce GTX 660 Ti` achetée en 2012 aux USA. Elle ne vaut sans doute plus grand chose aujourd'hui. Mais pourtant elle va nous être bien utile; soit pour miner (nouveau centre d'intérêt) soit pour entraîner mes modèles de Machine / Deep Learning.  
J'ai aussi fait l'acquisition d'un boitier eGPU. J'ai pris un Razer Core X. C'est la première fois que j'achète du Razer. Ce premier achat me satisfait vraiment car il est de très bonne qualité.

<br/>

**Dans cet article nous allons voir comment installer les drivers pour que la carte graphique utilisée dans le boitier eGPU soit reconnue et comment installer les outils nécessaires pour que Tensorflow puisse être compilé et fonctionner avec ce dernier. J'ai beaucoup galéré pour faire fonctionner le tout. J'espère que cet article pourra vous faire économiser des heures pour rien.**

<br/>

## Pré-requis

Le kernel que j'utilise est le `4.18.0`. Il y a pleins d'articles sur internet qui disent de mettre à jour le Kernel avant de commencer. Je l'ai fait et cela n'a pas fonctionné. J'ai testé le `5.2` et j'ai dû faire machine arrière... 

<br/>

## Questions!

**Comment connaître la version du kernel ?**

Tout simplement avec la commande:
```
cat /proc/version
```

<br/>

**Comment mettre à jour le kernel ?**

En ligne de commande ou via une petite interface graphique:
```
# Installer ukuu
sudo apt-add-repository ppa:teejee2008/ppa
sudo apt update
sudo apt-get install ukuu
# Lancer l'interface
sudo ukuu-gtk
```

<br/>

**Comment backuper sa machine avant de la bidouiller ?**

Très bonne question! Heureusement avant chaque manipulation délicate j'ai snapshoté ma machine. J'ai pris le risque de laisser le snapshot dessus en toute connaissance de cause. Vous pouvez le sortir si vraiment vous craignez de ne pas pouvoir réparer votre machine. Je vous conseille juste d'installer SSH pour pouvoir vous connecter dessus au cas où Gnome ne démarre même plus...

Je réalise mes snapshots avec Timeshift. Il y a une interface graphique mais apprenez à l'utiliser en lignes de commande. Ce n'est pas le jour où tout est crashé qu'il faut se demander comment faire :D .

```
# Installation de Timeshift
sudo apt-add-repository -y ppa:teejee2008/ppa && sudo apt-get update && sudo apt-get install timeshift
# Créer un snapshot 
# sudo timeshift --create --comments "after cuda installation" --tags D
# Voir les snapshots
sudo timeshift --list
# Restaurer un snapshot 
# sudo timeshift --restore
```

<br/>

**Est-ce que le GPU installé dans le boitier eGPU est bien détecté ?**

```
lspci | grep -i nvidia

06:00.0 VGA compatible controller: NVIDIA Corporation GK104 [GeForce GTX 660 Ti] (rev a1)
```

<br/>

## Installation

**Configurer GCC et G++**

Il vous faudra une utiliser la version 6 de `GCC` et `G++` pour builder Tensorflow. Si vous avez une version plus récente cela ne fonctionnera pas.
```
gcc --version
g++ --version
```

Installer gcc et g++ 6:
```
sudo apt install gcc-6 g++-6
```

Créer les variables d'environnement permettant de sélectionner la bonne version dans le fichier `~/.zshrc`.
```
export CC=/usr/bin/gcc-6
export CXX=/usr/bin/g++-6
```

<br/>

**Installer les Drivers Nvidia**

Enlever les nouveaux drivers qui viennent avec l'installation d'Ubuntu. Identifier les avec la commande:
```
lsmod | grep nouveau
```

Créer un fichier `/etc/modprobe.d/blacklist-nouveau.conf` et ajouter lui le contenu suivant: 

```
blacklist nouveau
options nouveau modeset=0
```

Régénérer le Kernel initramfs:
```
sudo update-initramfs -u
```

On peut maintenant installer le Driver Nvidia nécessaire au bon fonctionnement de mon GPU:
```
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt install nvidia-384 nvidia-384-dev
sudo reboot
```

Après le reboot vérifier que tout fonctionne avecc la commande `nvidia-smi`. Si vous avez un résultat similaire à celui-ci vous êtes sur la bonne voie.

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 390.116                Driver Version: 390.116                   |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 660 Ti  Off  | 00000000:06:00.0 N/A |                  N/A |
| 30%   26C    P8    N/A /  N/A |    162MiB /  1999MiB |     N/A      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|    0                    Not Supported                                       |
+-----------------------------------------------------------------------------+
```

<br/>

**Installer Cuda**

On peut maintenant passer à l'installation de Cuda. 
J'ai beaucoup galéré à cette étape car j'ai essayé d'installer les dernières versione de Cuda. Au moment où j'écris cet article il s'agissait de la version 10.1. Cette dernière n'a pas fonctionné car trop récente pour mon GPU. 
J'ai donc installé la `cuda version 9.0` à partir de ce fichier précisément `cuda_9.0.176_384.81_linux-run`.

```
wget https://developer.nvidia.com/compute/cuda/9.0/Prod/local_installers/cuda_9.0.176_384.81_linux-run
chmod +x cuda_9.0.176_384.81_linux.run 
sudo ./cuda_9.0.176_384.81_linux.run --override
```

* Pendant l'installation dire yes à "You are attempting to install on an unsupported configuration. Do you wish to continue?"

* Dire no à "Install NVIDIA Accelerated Graphics Driver for Linux-x86_64 384.81?"

* Dire yes à "Install the CUDA 9.0 Toolkit?"

* Dire yes à "Create symbolic links?"

* Dire yes à l'installation des examples Cuda et installer les dans le répertoire proposé par défaut. 

Vous pouvez vérifier la bonne installation de Cuda avec la commande:
```
nvcc -V

nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2017 NVIDIA Corporation
Built on Fri_Sep__1_21:08:03_CDT_2017
Cuda compilation tools, release 9.0, V9.0.176
```

<br/>

**Installer CudNN**

Connectez-vous au site https://developer.nvidia.com/cudnn et téléchargez le package suivant `cudnn-9.0-linux-x64-v7.3.0.29`. Ensuite installez le.

```
tar -xzvf cudnn-9.0-linux-x64-v7.3.0.29.tgz
sudo cp -P cuda/include/cudnn.h /usr/local/cuda-9.0/include
sudo cp -P cuda/lib64/libcudnn* /usr/local/cuda-9.0/lib64/
sudo chmod a+r /usr/local/cuda-9.0/lib64/libcudnn*
```

<br/>

**Installer libcudnn**

Connectez-vous au site https://developer.nvidia.com/cudnn et téléchargez les 3 packages `libcudnn7_7.3.0.29-1+cuda9.0_amd64.deb`, `libcudnn7-dev_7.3.0.29-1+cuda9.0_amd64.deb` et `libcudnn7-doc_7.3.0.29-1+cuda9.0_amd64.deb`. Attention les numéros de versions sont à respecter. J'ai aussi perdu beaucoup de temps sur cela. 

Installez les:

```
sudo dpkg -i libcudnn7_7.3.0.29-1+cuda9.0_amd64.deb
sudo dpkg -i libcudnn7-dev_7.3.0.29-1+cuda9.0_amd64.deb
sudo dpkg -i libcudnn7-doc_7.3.0.29-1+cuda9.0_amd64.deb
```

Vérifier que cudnn est bien installé:

```
# Copy the cuDNN sample to a writable path.
cp -r /usr/src/cudnn_samples_v7/ $HOME
# Go to the writable path.
cd  $HOME/cudnn_samples_v7/mnistCUDNN
# Compile the mnistCUDNN sample.
make clean && make
# Run the mnistCUDNN sample.
./mnistCUDNN
# If cuDNN is properly installed and running on your Linux system, you will see a message similar to the following:
$ Test passed!
```

Maintenons les paquets afin qu’ils ne soient pas updatés ou effacés:

```
sudo apt-mark hold libcudnn7 libcudnn7-dev libcudnn7-doc
```

<br/>

**Installer Bazel**

```
wget https://github.com/bazelbuild/bazel/releases/download/0.17.2/bazel-0.17.2-installer-linux-x86_64.sh
chmod +x bazel-0.17.2-installer-linux-x86_64.sh
./bazel-0.17.2-installer-linux-x86_64.sh --user
```

Pour pouvoir utiliser Bazel, modifier votre .bashrc ou .zshrc et ajouter cette commande:
```
export PATH="$PATH:$HOME/bin"
```

<br/>

**Builder/Installer/Tester Tensorflow GPU**

Rendez-vous ensuite sur un précédent article que j'ai écrit sur le sujet. Suivez la section "Installer TensorFlow". J'ai suivi mon propre tutorial et cela a fonctionné ! https://leandeep.com/rendre-tensorflow-compatible-avec-plus-de-cartes-graphiques/#Installer-Tensorflow

Cela fonctionne avec Python 2.7 et Python 3...

```
python
Python 3.6.8 (default, Jan 14 2019, 11:02:34)
[GCC 8.0.1 20180414 (experimental) [trunk revision 259383]] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
>>> import tensorflow as tf
>>> hello = tf.constant('Hello, TensorFlow!')
>>> sess = tf.Session()

2019-07-19 11:08:55.100940: I tensorflow/core/platform/cpu_feature_guard.cc:141] Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX AVX2 FMA
2019-07-19 11:08:55.170484: I tensorflow/stream_executor/cuda/cuda_gpu_executor.cc:964] successful NUMA node read from SysFS had negative value (-1), but there must be at least one NUMA node, so returning NUMA node zero
2019-07-19 11:08:55.171894: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1411] Found device 0 with properties:
name: GeForce GTX 660 Ti major: 3 minor: 0 memoryClockRate(GHz): 0.98
pciBusID: 0000:06:00.0
totalMemory: 1.95GiB freeMemory: 1.75GiB
2019-07-19 11:08:55.171908: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1490] Adding visible gpu devices: 0
2019-07-19 11:08:55.467370: I tensorflow/core/common_runtime/gpu/gpu_device.cc:971] Device interconnect StreamExecutor with strength 1 edge matrix:
2019-07-19 11:08:55.467397: I tensorflow/core/common_runtime/gpu/gpu_device.cc:977]      0
2019-07-19 11:08:55.467409: I tensorflow/core/common_runtime/gpu/gpu_device.cc:990] 0:   N
2019-07-19 11:08:55.467629: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1103] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 1523 MB memory) -> physical GPU (device: 0, name: GeForce GTX 660 Ti, pci bus id: 0000:06:00.0, compute capability: 3.0)
```

> Jupyter Lab fix:
> Après avoir installé Tensorflow j'avais un message d'erreur m'indiquant que la librairie `libcublas` n'existait pas (`No such file or directory`) alors que les variables d'environnement `LD_LIBRARY_PATH=/usr/local/cuda-9.0/lib64` et `PATH=$PATH:/usr/local/cuda-9.0/bin` étaient bien configurées. Cette erreur n'apparaissait que dans Jupyter Lab. Partout ailleurs Tensorflow fonctionnait. J'ai donc modifié la configuration de Jupyter Lab et ajouté l'import manuellement. En haut du fichier `~/.jupyter/jupyter_notebook_config.py` j'ai ajouté le code suivant: 

```
import os
c = get_config()
os.environ['LD_LIBRARY_PATH'] = '/usr/local/cuda-9.0/lib64:usr/local/cuda-9.0/lib64/libcudart.so.9.0'
c.Spawner.env.update('LD_LIBRARY_PATH')
```

