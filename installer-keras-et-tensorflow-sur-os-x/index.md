# Installer Keras (et Tensorflow) sur OS X

- Canonical URL: https://leandeep.com/installer-keras-et-tensorflow-sur-os-x/
- Author: Olivier Eeckhoutte
- Published: 2018-02-10T19:11:00Z
- Updated: 2018-02-10T19:11:00Z
- Language: fr
- Tags: Deep Learning, Python, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment installer Keras sur OS X (High Sierra) pour faire du Deep Learning.

## Pré-requis
Si vous voulez utiliser Keras, vous allez sans doute avoir besoin d'OpenCV.
J'ai réalisé un article sur l'installation d'OpenCV 3 pour Python 3.6. Cela explique également comment installer des environnements virtuels; ce qui est vraiment très utile. Si vous voulez installer Keras en suivant cet article et ne rencontrer aucun problème, je vous recommande de suivre le tutoriel suivant: [installer OpenCV 3 sur Python 3.6](http://blog.leandeep.com/installer-python-3-et-opencv-3-sur-os-x/).

<br/>

## Installation de Keras

Commencez par créez un nouvel environnement virtuel (même si vous en avez déjà créé un auparavant) et donnez lui un nom explicite.

```
$ mkvirtualenv py3_keras_tf -p python3
```

Dans votre nouvel environnement virtuel, installez les librairies suivantes: 

```
$ pip install scipy #Librairie dédiée aux méthodes numériques (Résolution de système d'équations linéaire, Transformée de Fourier, Interpolation...)
$ pip install pillow imutils # Librairie de manipulation d'image 
$ pip install h5py # Permet de gérer les binaires au format HDF5
$ pip install requests progressbar2 # Utilitaires
$ pip install scikit-learn scikit-image # Librairie de machine learning

$ pip install matplotlib # Permet de tracer et visualiser des données sous formes de graphiques
# Les 3 commandes qui suivent permettent de gérer l'affichage sur OSX 
$ mkdir ~/.matplotlib
$ touch ~/.matplotlib/matplotlibrc 
$ echo "backend: TkAgg" >> ~/.matplotlib/matplotlibrc 
```

Nous utiliserons Keras avec Tensorflow comme backend. Il est possible d'en utiliser d'autres comme [Theano](http://deeplearning.net/software/theano/) ou encore [CNTK](https://www.microsoft.com/en-us/cognitive-toolkit/) mais ce n'est pas l'objet de cet article.

Il faut donc installer Tensorflow
```
$ pip install tensorflow
```

Vous pouvez maintenant installer Keras
```
$ pip install keras
```

<br/>

## Vérification de l'installation

```
$ python
>>> import keras
Using TensorFlow backend.
>>> Ctrl-D
```

Voilà c'est tout !
Nous ne verrons pas dans cet article comment utiliser le GPU pour optimiser la phase d'apprentissage de votre réseau de neurones. Je ne vous recommande pas de le faire avec un Mac ou Macbook. Utilisez plutôt des machines conçues pour cela avec des vraies GPU faits pour cela.

