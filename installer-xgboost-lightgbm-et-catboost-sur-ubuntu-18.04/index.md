# Installer XGBoost, LightGBM et CatBoost sur Ubuntu 18.04

- Canonical URL: https://leandeep.com/installer-xgboost-lightgbm-et-catboost-sur-ubuntu-18.04/
- Author: Olivier Eeckhoutte
- Published: 2019-07-19T11:14:00Z
- Updated: 2019-07-19T11:14:00Z
- Language: fr
- Tags: Boosting, GPU, XGBoost, LightGBM, CatBoost, Machine Learning, Data Science, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Installation de XGBoost

**Installation simple**

Exécuter la commande suivante: 
```
pip install xgboost
```

> "The default open-source XGBoost packages already include GPU support."

<br/>

**Build from source**

Si cela ne fonctionne pas, compiler et installer XGBoost depuis les sources.

Installer cmake pour builder xgboost. La version CMake 3.12 ou plus est requise.
```
sudo apt-get update
sudo apt install -y cmake
cmake --version
```

Si ce n'est pas la bonne version désinstallez le avant de le réinstaller manuellement:
```
sudo apt purge cmake

# Download source
version=3.14
build=5
mkdir ~/temp
cd ~/temp
wget https://cmake.org/files/v$version/cmake-$version.$build.tar.gz
tar -xzvf cmake-$version.$build.tar.gz
cd cmake-$version.$build/

# Build et installation
./bootstrap
make -j4 && sudo make install

# Vérification de la version
cmake --version
```

Déterminer le compute capability de votre carte graphique pour l'indiquer à la prochaine commande dans le flag `-DGPU_COMPUTE_VER=`:


```
cd ~/NVIDIA_CUDA-9.0_Samples/1_Utilities/deviceQuery
make 
./deviceQuery

./deviceQuery Starting...

 CUDA Device Query (Runtime API) version (CUDART static linking)

Detected 1 CUDA Capable device(s)

Device 0: "GeForce GTX 660 Ti"
  CUDA Driver Version / Runtime Version          9.1 / 9.0
  CUDA Capability Major/Minor version number:    3.0
  Total amount of global memory:                 2000 MBytes (2097086464 bytes)
  ( 7) Multiprocessors, (192) CUDA Cores/MP:     1344 CUDA Cores
  GPU Max Clock rate:                            980 MHz (0.98 GHz)
  Memory Clock rate:                             3004 Mhz
  Memory Bus Width:                              192-bit
  L2 Cache Size:                                 393216 bytes
  Maximum Texture Dimension Size (x,y,z)         1D=(65536), 2D=(65536, 65536), 3D=(4096, 4096, 4096)
  Maximum Layered 1D Texture Size, (num) layers  1D=(16384), 2048 layers
  Maximum Layered 2D Texture Size, (num) layers  2D=(16384, 16384), 2048 layers
  Total amount of constant memory:               65536 bytes
  Total amount of shared memory per block:       49152 bytes
  Total number of registers available per block: 65536
  Warp size:                                     32
  Maximum number of threads per multiprocessor:  2048
  Maximum number of threads per block:           1024
  Max dimension size of a thread block (x,y,z): (1024, 1024, 64)
  Max dimension size of a grid size    (x,y,z): (2147483647, 65535, 65535)
  Maximum memory pitch:                          2147483647 bytes
  Texture alignment:                             512 bytes
  Concurrent copy and kernel execution:          Yes with 1 copy engine(s)
  Run time limit on kernels:                     Yes
  Integrated GPU sharing Host Memory:            No
  Support host page-locked memory mapping:       Yes
  Alignment requirement for Surfaces:            Yes
  Device has ECC support:                        Disabled
  Device supports Unified Addressing (UVA):      Yes
  Supports Cooperative Kernel Launch:            No
  Supports MultiDevice Co-op Kernel Launch:      No
  Device PCI Domain ID / Bus ID / location ID:   0 / 6 / 0
  Compute Mode:
     < Default (multiple host threads can use ::cudaSetDevice() with device simultaneously) >

deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 9.1, CUDA Runtime Version = 9.0, NumDevs = 1
Result = PASS
```

La ligne qui nous intéresse est la suivante `CUDA Capability Major/Minor version number:    3.0`

Dans le flag `-DGPU_COMPUTE_VER=` vous pourrez indiquer la valeur `30`.

> **Cette carte graphique n'est plus compatible avec XGBoost. Le minimum requis d'après le site officiel est `CUDA 9.0, Compute Capability 3.5 required`**. https://xgboost.readthedocs.io/en/latest/gpu/

Builder XGBoost:
```
cd ~ && \
    git clone --recursive https://github.com/dmlc/xgboost && \
    cd xgboost && mkdir build && cd build && cmake -DCUDA_HOST_COMPILER=/usr/bin/gcc-6 -DGPU_COMPUTE_VER=35 -DUSE_CUDA=ON .. && make -j
```

Installer XGBoost:
```
cd ../python-package
sudo python3 setup.py install
```

<br/>

**Vérification du bon fonctionnement d'XGBoost**

```
git clone https://github.com/dmlc/xgboost
cd xgboost

python3 # ou workon votre_environnement_virtuel && python
Puis exécutez les commandes Python suivantes:

import xgboost as xgb
# read in data
dtrain = xgb.DMatrix('demo/data/agaricus.txt.train')
dtest = xgb.DMatrix('demo/data/agaricus.txt.test')
# specify parameters via map
param = {'max_depth':2, 'eta':1, 'silent':1, 'objective':'binary:logistic' }
num_round = 2
bst = xgb.train(param, dtrain, num_round)
# make prediction
preds = bst.predict(dtest)
print(preds)
```

<br/>

## Installation de LightGBM


Installation des dépendances:
```
sudo apt install -y \
    libboost-dev \
    libboost-system-dev \
    libboost-filesystem-dev
```

Build:
```
cd ~ && \
    git clone --recursive https://github.com/Microsoft/LightGBM && \
    cd LightGBM && mkdir build && cd build && \
    cmake -DUSE_GPU=1 -DOpenCL_LIBRARY=/usr/local/cuda-9.0/lib64/libOpenCL.so -DOpenCL_INCLUDE_DIR=/usr/local/cuda-9.0/include/ .. && \
    make -j
    
```

Installation:

```
cd ../python-package
sudo python setup.py install --precompile
```

Vérifier le bon fonctionnement de LightGBM:
```
cd ~/LightGBM/examples/python-guide/
pip install scikit-learn pandas matplotlib scipy -U
python3 simple_example.py

Loading data...
Starting training...
[1]	valid_0's l1: 0.492841	valid_0's l2: 0.243898
Training until validation scores don't improve for 5 rounds.
[2]	valid_0's l1: 0.489327	valid_0's l2: 0.240605
[3]	valid_0's l1: 0.484931	valid_0's l2: 0.236472
[4]	valid_0's l1: 0.480567	valid_0's l2: 0.232586
[5]	valid_0's l1: 0.475965	valid_0's l2: 0.22865
[6]	valid_0's l1: 0.472861	valid_0's l2: 0.226187
[7]	valid_0's l1: 0.469847	valid_0's l2: 0.223738
[8]	valid_0's l1: 0.466258	valid_0's l2: 0.221012
[9]	valid_0's l1: 0.462751	valid_0's l2: 0.218429
[10]	valid_0's l1: 0.458755	valid_0's l2: 0.215505
[11]	valid_0's l1: 0.455252	valid_0's l2: 0.213027
[12]	valid_0's l1: 0.452051	valid_0's l2: 0.210809
[13]	valid_0's l1: 0.448764	valid_0's l2: 0.208612
[14]	valid_0's l1: 0.446667	valid_0's l2: 0.207468
[15]	valid_0's l1: 0.444211	valid_0's l2: 0.206009
[16]	valid_0's l1: 0.44186	valid_0's l2: 0.20465
[17]	valid_0's l1: 0.438508	valid_0's l2: 0.202489
[18]	valid_0's l1: 0.435919	valid_0's l2: 0.200668
[19]	valid_0's l1: 0.433348	valid_0's l2: 0.19925
[20]	valid_0's l1: 0.431211	valid_0's l2: 0.198136
Did not meet early stopping. Best iteration is:
[20]	valid_0's l1: 0.431211	valid_0's l2: 0.198136
Saving model...
Starting predicting...
The rmse of prediction is: 0.44512434910807497
```

<br/>

## Installation de CatBoost

Simplement:
```
pip install catboost
```

Installer l'outil de visualisation:
```
pip install ipywidgets
```

```
# Turn on the widgets extension:
jupyter nbextension enable --py widgetsnbextension
```

Pour tester le bon fonctionnement vous pouvez créer un fichier `test.py` et y insérer le code suivant:
```
from catboost import Pool, CatBoostClassifier

train_data = [["summer", 1924, 44],
              ["summer", 1932, 37],
              ["winter", 1980, 37],
              ["summer", 2012, 204]]

eval_data = [["winter", 1996, 197],
             ["winter", 1968, 37],
             ["summer", 2002, 77],
             ["summer", 1948, 59]]

cat_features = [0]

train_label = ["France", "USA", "USA", "UK"]
eval_label = ["USA", "France", "USA", "UK"]


train_dataset = Pool(data=train_data,
                     label=train_label,
                     cat_features=cat_features)

eval_dataset = Pool(data=eval_data,
                    label=eval_label,
                    cat_features=cat_features)

# Initialize CatBoostClassifier
model = CatBoostClassifier(iterations=10,
                           learning_rate=1,
                           depth=2,
                           loss_function='MultiClass',
                           task_type="GPU")
# Fit model
model.fit(train_dataset)
# Get predicted classes
preds_class = model.predict(eval_dataset)
# Get predicted probabilities for each class
preds_proba = model.predict_proba(eval_dataset)
# Get predicted RawFormulaVal
preds_raw = model.predict(eval_dataset,
                          prediction_type='RawFormulaVal')

```

Après l'avoir exécuté le code précédent un training sera réalisé sur GPU. [Le lien suivant](https://catboost.ai/docs/features/training-on-gpu.html#training-on-gpu) décrit comment faire. Si tout est ok vous devriez obtenir le résultat suivant:

```
0:	learn: -0.9623099	total: 8.48ms	remaining: 76.3ms
1:	learn: -0.7421078	total: 14.6ms	remaining: 58.3ms
2:	learn: -0.5898572	total: 20.2ms	remaining: 47.2ms
3:	learn: -0.4816516	total: 26.3ms	remaining: 39.4ms
4:	learn: -0.4023528	total: 31.8ms	remaining: 31.8ms
5:	learn: -0.3545669	total: 37.2ms	remaining: 24.8ms
6:	learn: -0.3052314	total: 42.1ms	remaining: 18ms
7:	learn: -0.2666318	total: 47.6ms	remaining: 11.9ms
8:	learn: -0.2358041	total: 53ms	remaining: 5.89ms
9:	learn: -0.2107419	total: 57.9ms	remaining: 0us
```

<br/>

## Comparaison des 3 algorithmes de Boosting

Un article très intéressant comparant les 3 algorithmes est disponible [à l'adresse suivante](https://towardsdatascience.com/catboost-vs-light-gbm-vs-xgboost-5f93620723db).

Voici un tableau comparatif extrait de cet article:

![image](/images/lightGBM-vs-CatBoost-vs-XGBoost.png)

Au vu de ces résultats, je pencherais soit sur l'utilisation de CatBoost si les délais d'inférence sont un enjeu. Dans le cas contraire, vue les résultats de LightGBM et sa durée d'entrainement nécessaire par rapport à XGBoost je partirais sur LightGBM.

