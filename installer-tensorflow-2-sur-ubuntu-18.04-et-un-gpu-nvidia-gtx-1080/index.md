# Installer Tensorflow 2 sur Ubuntu 18.04 et un GPU Nvidia GTX 1080

- Canonical URL: https://leandeep.com/installer-tensorflow-2-sur-ubuntu-18.04-et-un-gpu-nvidia-gtx-1080/
- Author: Lean Deep
- Published: 2019-09-25T22:39:00Z
- Updated: 2019-09-25T22:39:00Z
- Language: fr
- Tags: Tensorflow 2, Ubuntu, GPU, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Voici la procédure permettant d'installer Tensorflow 2 (RC2) sur Ubuntu 18.04 avec une carte graphique Nvidia GTX 1080 dans un eGPU Razer.

<br/>

## Installation

> Avant de démarrer je conseille de faire un backup de votre machine. On n'est jamais trop prudent avec l'installation des Drivers. Cela prend 1 minutes et en cas de problème, vous pourrez faire un rollback en 2 minutes.

<br/>

Créer un snapshot:
```
# Installation de Timeshift
sudo apt-add-repository -y ppa:teejee2008/ppa && sudo apt-get update && sudo apt-get install timeshift
# Créer un snapshot 
# sudo timeshift --create --comments "before cuda installation" --tags D
# Voir les snapshots
sudo timeshift --list
# Restaurer un snapshot 
# sudo timeshift --restore
```

> Pour démarrer Timeshift en mode graphique, il suffit d'exécuter la commande `sudo timeshift-gtk`. Timeshift est un bon outil mais ne permet pas les raids en backup destination. Je vais donc personnellement en recherche d'une alternative...

<br/>

Installer le Driver Nvidia:
```
# Ajouter le repository Nvidia
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-repo-ubuntu1804_10.0.130-1_amd64.deb
sudo dpkg -i cuda-repo-ubuntu1804_10.0.130-1_amd64.deb
# Ajouter le repository Cuda
sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
# Ajouter le repository Nvidia Machine-Learning
wget http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/nvidia-machine-learning-repo-ubuntu1804_1.0.0-1_amd64.deb
sudo apt install ./nvidia-machine-learning-repo-ubuntu1804_1.0.0-1_amd64.deb
# Mise à jour de la liste des paquets avec les nouveaux repo
sudo apt-get update

# Installation du driver NVIDIA
sudo apt-get install --no-install-recommends nvidia-driver-418
```

Redémarrer votre machine. 

<br/>

Activer le boitier eGPU branché au câble thunderbolt sur Ubuntu:
```
lspci | grep -i nvidia
# Si rien ne s'affiche alors que votre boitier eGPU est bien branché à votre PC, c'est sans doute que le port Thunderbolt n'est pas autorisé à être utilisé. Pour ce faire:
sudo sh -c 'echo 1 > /sys/bus/thunderbolt/devices/0-3/authorized'
# Dans mon cas j'ai exécuté les commandes suivantes:
# sudo sh -c 'echo 1 > /sys/bus/thunderbolt/devices/0-0/authorized'
# sudo sh -c 'echo 1 > /sys/bus/thunderbolt/devices/0-1/authorized'

lspci | grep -i nvidia
# Si le thunderbolt est bien activé et que les drivers sont bien pris en compte, vous devriez voir ceci:

06:00.0 VGA compatible controller: NVIDIA Corporation GP104 [GeForce GTX 1080] (rev a1)
06:00.1 Audio device: NVIDIA Corporation GP104 High Definition Audio Controller (rev a1)
```

Vérifier maintenant que le GPU est bien visible via la commande `nvidia-smi`.

<br/>

Installer les librairies de développement et d'exécution de cuda (~4GB)
```
sudo apt-get install --no-install-recommends \
    cuda-10-0 \
    libcudnn7=7.6.2.24-1+cuda10.0  \
    libcudnn7-dev=7.6.2.24-1+cuda10.0
```

<br/>

Installer TensorRT. (libcudnn7 au-dessus doit être installé)
```
sudo apt-get install -y --no-install-recommends libnvinfer5=5.1.5-1+cuda10.0 \
    libnvinfer-dev=5.1.5-1+cuda10.0
```

<br/>

Installer virtualenvwrapper:

```
sudo apt install python python-pip python3
sudo pip uninstall virtualenvwrapper
```

<br/>

Ajouter les lignes suivantes dans votre `~/.zshrc`:
```
export WORKON_HOME=~/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
```

<br/>

Reloader votre shell:
```
source ~/.zshrc
```

<br/>

Créer un virtualenv:
```
mkvirtualenv -p /usr/bin/python3 -a . test_env
```

<br/>

Installation de Tensorflow GPU
```
pip install tensorflow-gpu==2.0.0rc2
```

<br/>

Vérifier le bon fonctionnement de Tensorflow 2 en entrant le code suivant de votre Terminal ou dans Jupyter lab:
```
python
>>> import tensorflow
>>> from tensorflow.python.client import device_lib
>>> print(device_lib.list_local_devices())

[name: "/device:CPU:0"
device_type: "CPU"
memory_limit: 268435456
locality {
}
incarnation: 9076345463573208199
, name: "/device:XLA_CPU:0"
device_type: "XLA_CPU"
memory_limit: 17179869184
locality {
}
incarnation: 5504146488139860193
physical_device_desc: "device: XLA_CPU device"
, name: "/device:XLA_GPU:0"
device_type: "XLA_GPU"
memory_limit: 17179869184
locality {
}
incarnation: 18444695170601526018
physical_device_desc: "device: XLA_GPU device"
, name: "/device:GPU:0"
device_type: "GPU"
memory_limit: 7975714816
locality {
  bus_id: 1
  links {
  }
}
incarnation: 3513023963840157056
physical_device_desc: "device: 0, name: GeForce GTX 1080, pci bus id: 0000:06:00.0, compute capability: 6.1"
]
```

