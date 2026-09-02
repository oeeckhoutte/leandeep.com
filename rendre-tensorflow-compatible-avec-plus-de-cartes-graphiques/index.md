# Rendre Tensorflow compatible avec plus de cartes graphiques

- Canonical URL: https://leandeep.com/rendre-tensorflow-compatible-avec-plus-de-cartes-graphiques/
- Author: Olivier Eeckhoutte
- Published: 2018-09-29T19:50:00Z
- Updated: 2018-09-29T19:50:00Z
- Language: fr
- Tags: Machine Learning, Deep Learning, Tensorflow
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Installer les dépendances

Installer openjdk 8:
```
sudo apt-get install openjdk-8-jdk
```

Installer les autres dépendances:
```
sudo apt-get install pkg-config zip g++ zlib1g-dev unzip
```

<br/>

## Installer Bazel
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

## Install libcudnn

Télécharger le binaire directement depuis le site: https://developer.nvidia.com/cudnn. Cette étape nécessite de créer une compte chez Nvidia. 

Pour installer le binaire il suffit d'exécuter la commande suivante: 
```
sudo dpkg -i libcudnn7_7.3.0.29-1+cuda9.0_amd64.deb
sudo dpkg -i libcudnn7-dev_7.3.0.29-1+cuda9.0_amd64.deb
sudo dpkg -i libcudnn7-doc_7.3.0.29-1+cuda9.0_amd64.deb
```
<!-- more -->

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

Maintenons les paquets afin qu'ils ne soient pas updatés ou effacés:
```
sudo apt-mark hold libcudnn7 libcudnn7-dev libcudnn7-doc
```

<br/>

## Installer Tensorflow

Commencer par installer les dépendances:

```
sudo apt-get install python-numpy swig python-dev git python-pip
```

Puis cloner Tensorflow repo:
```
git clone --recurse-submodules https://github.com/tensorflow/tensorflow.git -b r1.11
```




Configurer le build pour que Tensorflow puisse fonctionner avec (dans mon cas) les cartes supportant cuda 3.0 compute:
Pour voir quelle version appliquer pour votre carte graphique rendez-vous sur https://developer.nvidia.com/cuda-gpus

Obtenir le modèle de sa carte graphique: 

```
sudo lshw -C display | grep product
```


```
cd tensorflow
TF_UNOFFICIAL_SETTING=1 ./configure

# Pour les questions suivantes répondre comme ceci: 

Do you wish to build TensorFlow with CUDA support? [y/N]: y
CUDA support will be enabled for TensorFlow.

Please specify the CUDA SDK version you want to use. [Leave empty to default to CUDA 9.0]:


Please specify the location where CUDA 9.0 toolkit is installed. Refer to README.md for more details. [Default is /usr/local/cuda]:


Please specify the cuDNN version you want to use. [Leave empty to default to cuDNN 7.0]:


Please specify the location where cuDNN 7 library is installed. Refer to README.md for more details. [Default is /usr/local/cuda]: /usr/lib/x86_64-linux-gnu/

```

Installer la dépendance Keras:
```
pip install keras_applications
pip install keras_preprocessing
```


Compiler Tensorflow: 
```
$HOME/bin/bazel build -c opt --config=cuda //tensorflow/cc:tutorials_example_trainer

bazel-bin/tensorflow/cc/tutorials_example_trainer --use_gpu
```

Installer l'interface Python.
On commence par créer un package pip avec Bazel:

```
$HOME/bin/bazel build -c opt --config=cuda //tensorflow/tools/pip_package:build_pip_package
```

On install ensuite le package:
```
bazel-bin/tensorflow/tools/pip_package/build_pip_package /tmp/tensorflow_pkg
```

Et on installe le package Tensorflow disponible dans /tmp/tensorflow_pkg/:
```
pip install /tmp/tensorflow_pkg/tensorflow-1.11.0-cp27-cp27mu-linux_x86_64.whl
```

On vérifie que cela fonctionne:
```
python
Python 2.7.12 (default, Dec  4 2017, 14:50:18)
[GCC 5.4.0 20160609] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import tensorflow as tf
>>> hello = tf.constant('Hello, TensorFlow!')
>>> sess = tf.Session()
2018-09-29 17:03:03.939989: I tensorflow/core/platform/cpu_feature_guard.cc:141] Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX
2018-09-29 17:03:03.981711: I tensorflow/stream_executor/cuda/cuda_gpu_executor.cc:964] successful NUMA node read from SysFS had negative value (-1), but there must be at least one NUMA node, so returning NUMA node zero
2018-09-29 17:03:03.982119: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1411] Found device 0 with properties:
name: GeForce GTX 660 Ti major: 3 minor: 0 memoryClockRate(GHz): 0.98
pciBusID: 0000:01:00.0
totalMemory: 1.95GiB freeMemory: 1.89GiB
2018-09-29 17:03:03.982143: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1490] Adding visible gpu devices: 0
2018-09-29 17:03:04.240898: I tensorflow/core/common_runtime/gpu/gpu_device.cc:971] Device interconnect StreamExecutor with strength 1 edge matrix:
2018-09-29 17:03:04.240938: I tensorflow/core/common_runtime/gpu/gpu_device.cc:977]      0
2018-09-29 17:03:04.240950: I tensorflow/core/common_runtime/gpu/gpu_device.cc:990] 0:   N
2018-09-29 17:03:04.241102: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1103] Created TensorFlow device (/job:localhost/replica:0/task:0/device:GPU:0 with 1663 MB memory) -> physical GPU (device: 0, name: GeForce GTX 660 Ti, pci bus id: 0000:01:00.0, compute capability: 3.0)
```

<br/>

Perfect! Maintenant je peux utiliser mon GPU sur mon serveur.

