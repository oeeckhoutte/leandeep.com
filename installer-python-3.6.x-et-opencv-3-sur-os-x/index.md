# Installer Python 3.6.x et OpenCV 3 sur OS X

- Canonical URL: https://leandeep.com/installer-python-3.6.x-et-opencv-3-sur-os-x/
- Author: Olivier Eeckhoutte
- Published: 2018-02-06T23:05:00Z
- Updated: 2018-02-06T23:05:00Z
- Language: fr
- Tags: Python, OpenCV
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Comme l'installatin d'OpenCV n'est vraiment pas aisée. J'ai donc décidé d'écrire cet article. Si vous suivez cette procédure vous devriez pouvoir faire tourner OpenCV 3 sur OSX High Sierra dans un environnement virtuel.

Il s'agit du deuxième article que j'écris sur l'installation d'OpenCV. Cette article se focalise sur l'installation d'OpenCV 3 pour Python 3.6.x. Si vous souhaitez installer OpenCV 3 pour python 2.7.x, vous pouvez lire [mon autre article](http://blog.leandeep.com/installer-python-2-7-x-et-opencv-3-sur-os-x/).

<br/>

## Pré-requis
* Xcode doit être installé 
* Xcode a déjà dû être démarré et vous avez accepté les conditions générales 
* Les commandes lines tools ont déjà été installés. Si ce n'est pas le cas exécutez la commande suivante: $ sudo xcode-select --install
* [Homebrew](https://brew.sh/index_fr.html) doit être installé 

<br/>

## Installer Python 3

Même si Python est déjà installé sur votre Mac, installez le une nouvelle fois avec Homebrew:
```
$ brew install python3
```

Vérifiez que Python 3 et pip fonctionnent.
```
$ python3 --version
$ pip3 --version
```

Vérifiez aussi que ce sont bien les nouvelles versions de Python et pip qui sont utilisées 
```
$ which python3
$ which pip3
```

<br/>

## Créer un environnement virtuel 

```
$ pip3 install virtualenv virtualenvwrapper # /!\ il se peut que sudo soit nécessaire
```

Ajoutez les lignes suivantes dans votre ~/.zshrc (ou ~/.bash_profile)

```
# Support d'environnements virtuels pour Python 3
export VIRTUALENVWRAPPER_PYTHON=/usr/local/bin/python3
source /usr/local/bin/virtualenvwrapper.sh
```

Une fois ces lignes ajoutées, "rechargez" votre terminal en exécutant la commande suivante: 

```
$ source ~/.zshrc # ou $ source ~/.bash_profile
```

Vous pouvez maintenant créer votre environnement virtuel pour OpenCV 3 et Python 3
```
$ mkvirtualenv py3_cv3 -p python3
```

Une fois créé, fermez votre terminal et réouvrez en un nouveau.
Par défault vous n'êtes pas dans l'environnement Python que vous avez créé. Si vous souhaitez rentrer dedans, utilisez la commande suivante:

```
$ workon py3_cv3
```

Si tout se passe bien, votre prompt du terminal sera préfixé du nom de votre environnement entre parenthèses. 

*Remarquez que vous n'avez pas besoin d'utiliser pip3 dans cet environnement virtuel. La commande $ pip --version nous indique bien que pip est lié à Python 3.6.x. En dehors de cet environnement virtuel vous devrez utiliser pip3 pour que des librairies liées à Python 3 soient téléchargées.*

Si vous souhaitez quitter votre environnement virtuel utilisez la commande suivante: 

```
$ deactivate
```

*Pour tout ce qui suit, travaillez dans le nouvel environnement virtuel que l'on vient de créer*

<br/>

## Installer Numpy

Numpy est une bibliothèque très connue de calculs scientiques nécessaire pour OpenCV.

```
pip install numpy
```

<br/>

## Installer les pré-requis à OpenCV 3

Pour qu'on OpenCV 3 fonctionne certains pré-requis sont nécessaires. 
Heureusement l'installation de ces pré-requis est aisée grâce à Homebrew.

```
$ brew install cmake pkg-config # Nécessaire pour compiler OpenCV
$ brew install jpeg libpng libtiff openexr # Nécessaire pour manipuler les images 
$ brew install eigen # Nécessaire pour faire des calculs algébriques
$ brew install tbb # Nécessaire pour faire les calculs parallèles
```

<br/>

## Installer OpenCV

Commencez par télécharger OpenCV. Il y a 2 repositories git à cloner.
(Vous n'avez pas besoin de tout l'historique du repository)

```
$ cd
$ git clone https://github.com/opencv/opencv --depth 1
$ git clone https://github.com/opencv/opencv_contrib --depth 1
```

Vous allez maintenant pouvoir builder OpenCV. 

```
$ cd ~/opencv
$ mkdir build
$ cd build

# Configuration
$ cmake -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
    -D PYTHON3_LIBRARY=`python -c 'import subprocess ; import sys ; s = subprocess.check_output("python-config --configdir", shell=True).decode("utf-8").strip() ; (M, m) = sys.version_info[:2] ; print("{}/libpython{}.{}.dylib".format(s, M, m))'` \
    -D PYTHON3_INCLUDE_DIR=`python -c 'import distutils.sysconfig as s; print(s.get_python_inc())'` \
    -D PYTHON3_EXECUTABLE=$VIRTUAL_ENV/bin/python \
    -D BUILD_opencv_python2=OFF \
    -D BUILD_opencv_python3=ON \
    -D INSTALL_PYTHON_EXAMPLES=ON \
    -D INSTALL_C_EXAMPLES=OFF \
    -D BUILD_EXAMPLES=ON ..

# Compilation
$ make -j4 # -j4 permet d'utiliser les 4 cœurs de mon Mac lors de la compilation

# Installation
$ sudo make install

# Symlink
$ cd /usr/local/lib/python3.6/site-packages
$ ls -l | grep cv2.cpython-36m-darwin.so # Vérifiez que le fichier cv2.cpython-36m-darwin.so est bien présent
$ cd ~/.virtualenvs/py3_cv3/lib/python3.6/site-packages
$ ln -s /usr/local/lib/python3.6/site-packages/cv2.cpython-36m-darwin.so cv2.so
```

<br/>

## Vérification de l'installation

Ouvrez un nouveau terminal et vérifiez que l'installation d'OpenCV fonctionne dans votre environnement virtuel.

```
$ workon py3_cv3
$ python
>>> import cv2
>>> cv2.__version__
'3.4.0-dev'
>>> Ctrl-D
```

Et voilà l'installation d'OpenCV 3 pour Python 3.6.x est terminée!
J'espère que vous ne rencontrerez pas de problème et que je vous aurais fait gagner des heures; tout comme avec mon autre article sur l'[installation d'OpenCV 3 pour Python 2.7.x](http://blog.leandeep.com/installer-python-2-7-x-et-opencv-3-sur-os-x/) !

