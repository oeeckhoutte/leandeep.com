# Premier ConvNet avec Tensorflow 2

- Canonical URL: https://leandeep.com/premier-convnet-avec-tensorflow-2/
- Author: Olivier Eeckhoutte
- Published: 2019-12-10T19:49:00+02:00
- Updated: 2019-12-10T19:49:00+02:00
- Language: fr
- Tags: Tensorflow 2, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Tensorflow 2 beta est récemment sorti. 
Beaucoup de choses ont changé et il est maintenant beaucoup plus simple à utiliser.
Keras a aussi été pleinement intégré. On peut l'utiliser pour des applications large-scale.
Le graphe d'exécution est maintenant automatiquement créé par le framework. Le Python est converti est graphe. Dans cet article, nous allons créer un simple Convnet avec 3 couches en quelques lignes de codes pour se rendre compte à quel point l'utilisation de Tensorflow a été simplifiée.

<br/>

## ConvNet

**Chargement des modules**

```
from __future__ import absolute_import, division, print_function, unicode_literals
import numpy as np
import tensorflow as tf
from tensorflow import keras as ks
print(tf.__version__)
```

<br/>

**Chargement du dataset opensource Zalando Fashion-MNIST**

```
mnist_fashion = ks.datasets.fashion_mnist
(training_images, training_labels), (test_images, test_labels) = mnist_fashion.load_data()
print('Training Dataset Shape: {}'.format(training_images.shape))
print('Number of Training Dataset Labels: {}'. format(len(training_labels)))
print('Test Dataset Shape: {}'.format(test_images.shape)) 
print('Number of Test Dataset Labels: {}'.format(len(test_labels)))
```

<br/>

**Normalisation des valeurs**

Comme la valeur des pixels varie entre 0 et 255, on va normaliser ces valeurs entre 0 et 1 avant de les pousser dans le modèle. On normalise ces valeurs (training and test data) en les divisant par 255.
```
training_images = training_images / 255.0
test_images = test_images / 255.0
```

<br/>

**Remaniement des training et tests data**

On modifie la forme des training et tests matrices en 28x28x1
```
training_images = training_images.reshape((60000, 28, 28, 1))
test_images = test_images.reshape((10000, 28, 28, 1))
print('Training Dataset Shape: {}'.format(training_images.shape))
print('Number of Training Dataset Labels: {}'.format(len(training_labels)))
print('Test Dataset Shape: {}'.format(test_images.shape))
print('Number of Test Dataset Labels: {}'.format(len(test_labels)))
```

<br/>

**Construction des couches du modèle**

Keras est utiliser pour construire les différentes couches de notre CNN. <br/>Pour faire simple, on va créer seulement 3 couches. 

<br/>

Première couche: couche convolutionnelle avec une fonction d'activation ReLU
* Cette couche prend un tableau en 2D (28 × 28 pixels) comme input. 
* Elle prend 50 kernels (filtres) convolutionnels de forme 3 × 3 pixels. 
* La sortie de cette couche qui va passer par une fonction d'activation ReLU avant de passer à la prochaine couche

```
cnn_model = ks.models.Sequential()
cnn_model.add(ks.layers.Conv2D(50, (3, 3), activation='relu', input_shape=(28, 28, 1), name='Conv2D_layer'))
```

<br/>

Deuxième couche:

<br/>

Cette couche prend 50 26x26 tableaux à 2D comme input et les transforme comme 50 tableaux qui ont des dimensions divisés par 2 (c'est-à-dire: de 26×26 à 13×13 pixels).
```
cnn_model.add(ks.layers.MaxPooling2D((2, 2), name='Maxpooling_2D'))
```

<br/>

Troisième couche "fully connected layer": 

<br/>

Cette couche prend 50 13x13 tableaux de 2D comme input et les transform en un tableau à 1D comprenant 8450 élements (50×13×13). Ces 8450 élements d'input sont passés à travers un réseau de neuronne "fully connected" qui donne des scores de probabilité pour chacune des 10 outputs.
```
cnn_model.add(ks.layers.Flatten(name='Flatten'))
cnn_model.add(ks.layers.Dense(50, activation='relu', name='Hidden_layer'))
cnn_model.add(ks.layers.Dense(10, activation='softmax', name='Output_layer'))
```

<br/>

**Synthèse des couches**

On observe le détail des différentes couches grâce à la commande suivante:
```
cnn_model.summary()
```

<br/>

**Création de la fonction d'optimisation**

Maintenant on utiliser une fonction d'optimisation grâce à la méthode compile. On utiliser un optimiseur Adam avec la fonction d'objectif sparse_categorical_crossentropy pour optimiser la métrique accuracy. 
```
cnn_model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
```

<br/>

**Entraintement du modèle**
```
cnn_model.fit(training_images, training_labels, epochs=10)
```

<br/>

**Modèle évaluation**

```
# 1. Training évaluation
training_loss, training_accuracy = cnn_model.evaluate(training_images, training_labels)
print('Training Accuracy {}'. format(round(float(training_accuracy), 2)))

# 2. Test évaluation
test_loss, test_accuracy = cnn_model.evaluate(test_images, test_labels)
print('Test Accuracy {}'.format(round(float (test_accuracy), 2)))
```

<br/>

**Output**

Training Accuracy 0.97<br/>
Test Accuracy 0.91

