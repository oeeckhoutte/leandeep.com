# Classification avec Tensorflow 2

- Canonical URL: https://leandeep.com/classification-avec-tensorflow-2/
- Author: Olivier Eeckhoutte
- Published: 2020-01-04T18:12:00+02:00
- Updated: 2020-01-04T18:12:00+02:00
- Language: fr
- Tags: Tensorflow 2, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons entrainer un modèle à classifier les Iris avec 2 algorithmes différents présents dans Tensorflow 2:
* Régression logistique
* Gradient boosting

Nous allons utiliser le dataset opensource Iris.

> Attention l'algorithme "Régression logistique" prête à confusion. Même si le nom de cet algorithme contient régression, il permet de faire de la classification et donc de prédire une catégorie et non une valeur continue.

<br/>

## Régression logistique

**Chargement des modules:**

```
from __future__ import print_function, division, unicode_literals, absolute_import

import seaborn as sb
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.estimator import LinearClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, recall_score, precision_score
```

<br/>


**Chargement du dataset Iris:**

```
columns_names = ['SepalLength', 'SepalWidth', 'PetalLength', 'PetalWidth', 'Species']
target_dimensions = ['Setosa', 'Versicolor', 'Virginica']

training_data_path = tf.keras.utils.get_file("iris_training.csv", "https://storage.googleapis.com/download.tensorflow.org/data/iris_training.csv")
test_data_path = tf.keras.utils.get_file("iris_test.csv", "https://storage.googleapis.com/download.tensorflow.org/data/iris_test.csv")

training = pd.read_csv(training_data_path, names=columns_names, header=0)
training = training[training['Species'] >= 1]
training['Species'] = training['Species'].replace([1,2], [0,1])
test = pd.read_csv(test_data_path, names=columns_names, header=0)
test = test[test['Species'] >= 1]
test['Species'] = test['Species'].replace([1,2], [0,1])

# On retire l'index
training.reset_index(drop=True, inplace=True)
test.reset_index(drop=True, inplace=True)

iris_dataset = pd.concat([training, test], axis=0)

iris_dataset.describe()
```

<br/>

**Affichage des corrélations entre les données:**

```
sb.pairplot(iris_dataset, diag_kind="kde")

correlation_data = iris_dataset.corr()
correlation_data.style.background_gradient(cmap='coolwarm', axis=None)
```

<br/>


**Statistiques (Tendence générale et dispersion):**

```
stats = iris_dataset.describe()
iris_stats = stats.transpose()
iris_stats
```

<br/>


**Sélection des colonnes:**

```
X_data = iris_dataset[[m for m in iris_dataset.columns if m not in ['Species']]]
Y_data = iris_dataset[['Species']]
```

<br/>


**Split Train Test:**

```
training_features , test_features ,training_labels, test_labels = train_test_split(X_data , Y_data , test_size=0.2)

print('Number of rows in Training Features: ', training_features.shape[0])
print('Number of rows in Test Features: ', test_features.shape[0])
print('Number of columns in Training Features: ', training_features.shape[1])
print('Number of columns in Test Features: ', test_features.shape[1])

print('Number of rows in Training Label: ', training_labels.shape[0])
print('Number of rows in Test Label: ', test_labels.shape[0])
print('Number of columns in Training Label: ', training_labels.shape[1])
print('Number of columns in Test Label: ', test_labels.shape[1])

stats = training_features.describe()
stats = stats.transpose()
print(stats)

stats = test_features.describe()
stats = stats.transpose()
print(stats)
```

<br/>

**Normalisation des données:**

```
def normalize(x):
  stats = x.describe()
  stats = stats.transpose()
  return (x - stats['mean']) / stats['std']

normed_train_features = normalize(training_features)
normed_test_features = normalize(test_features)
```

<br/>

**Construction de la pipeline d'input:**

```
def feed_input(features_dataframe, target_dataframe, num_of_epochs=10, shuffle=True, batch_size=32):
  def input_feed_function():
    dataset = tf.data.Dataset.from_tensor_slices((dict(features_dataframe), target_dataframe))
    if shuffle:
      dataset = dataset.shuffle(2000)
    dataset = dataset.batch(batch_size).repeat(num_of_epochs)
    return dataset
  return input_feed_function

train_feed_input = feed_input(normed_train_features, training_labels)
train_feed_input_testing = feed_input(normed_train_features, training_labels, num_of_epochs=1, shuffle=False)
test_feed_input = feed_input(normed_test_features, test_labels, num_of_epochs=1, shuffle=False)
```

<br/>

**Entrainement du modèle:**

```
feature_columns_numeric = [tf.feature_column.numeric_column(m) for m in training_features.columns]

logistic_model = LinearClassifier(feature_columns=feature_columns_numeric)

logistic_model.train(train_feed_input)
```

<br/>

**Prédictions:**

```
train_predictions = logistic_model.predict(train_feed_input_testing)
test_predictions = logistic_model.predict(test_feed_input)

train_predictions_series = pd.Series([p['classes'][0].decode("utf-8")   for p in train_predictions])
test_predictions_series = pd.Series([p['classes'][0].decode("utf-8")   for p in test_predictions])

train_predictions_df = pd.DataFrame(train_predictions_series, columns=['predictions'])
test_predictions_df = pd.DataFrame(test_predictions_series, columns=['predictions'])

training_labels.reset_index(drop=True, inplace=True)
train_predictions_df.reset_index(drop=True, inplace=True)

test_labels.reset_index(drop=True, inplace=True)
test_predictions_df.reset_index(drop=True, inplace=True)

train_labels_with_predictions_df = pd.concat([training_labels, train_predictions_df], axis=1)
test_labels_with_predictions_df = pd.concat([test_labels, test_predictions_df], axis=1)
```

<br/>

**Validation:**

```
def calculate_binary_class_scores(y_true, y_pred):
  accuracy = accuracy_score(y_true, y_pred.astype('int64'))
  precision = precision_score(y_true, y_pred.astype('int64'))
  recall = recall_score(y_true, y_pred.astype('int64'))
  return accuracy, precision, recall

train_accuracy_score, train_precision_score, train_recall_score = calculate_binary_class_scores(training_labels, train_predictions_series)
test_accuracy_score, test_precision_score, test_recall_score = calculate_binary_class_scores(test_labels, test_predictions_series)

print('Training Data Accuracy (%) = ', round(train_accuracy_score*100,2))
print('Training Data Precision (%) = ', round(train_precision_score*100,2))
print('Training Data Recall (%) = ', round(train_recall_score*100,2))
print('-'*40)
print('Test Data Accuracy (%) = ', round(test_accuracy_score*100,2))
print('Test Data Precision (%) = ', round(test_precision_score*100,2))
print('Test Data Recall (%) = ', round(test_recall_score*100,2))
```

<br/>

**Output:**

Training Data Accuracy (%) =  93.75<br/>
Training Data Precision (%) =  93.02<br/>
Training Data Recall (%) =  95.24<br/>
----------------------------------------<br/>
Test Data Accuracy (%) =  90.0<br/>
Test Data Precision (%) =  80.0<br/>
Test Data Recall (%) =  100.0

<br/>

# Gradient boosting

**Second entrainement d'un modèle avec Gradient boosting:**

```
feature_columns_numeric = [tf.feature_column.numeric_column(m) for m in training_features.columns]
from tensorflow.estimator import BoostedTreesClassifier
btree_model = BoostedTreesClassifier(feature_columns=feature_columns_numeric, n_batches_per_layer=1)
btree_model.train(train_feed_input)
```

<br/>

**Prédictions:**

```
train_predictions = btree_model.predict(train_feed_input_testing)
test_predictions = btree_model.predict(test_feed_input)
train_predictions_series = pd.Series([p['classes'][0].decode("utf-8") for p in train_predictions]) 
test_predictions_series = pd.Series([p['classes'][0].decode("utf-8") for p in test_predictions])

train_predictions_df = pd.DataFrame(train_predictions_series, columns=['predictions'])
test_predictions_df = pd.DataFrame(test_predictions_series, columns=['predictions']) 
training_labels.reset_index(drop=True, inplace=True)
train_predictions_df.reset_index(drop=True, inplace=True)

test_labels.reset_index(drop=True, inplace=True)
test_predictions_df.reset_index(drop=True, inplace=True)
train_labels_with_predictions_df = pd.concat([training_labels, train_predictions_df], axis=1)
test_labels_with_predictions_df = pd.concat([test_labels, test_predictions_df], axis=1)
```

<br/>

**Validation:**

```
def calculate_binary_class_scores(y_true, y_pred): 
  accuracy = accuracy_score(y_true, y_pred.astype('int64')) 
  precision = precision_score(y_true, y_pred.astype('int64')) 
  recall = recall_score(y_true, y_pred.astype('int64')) 
  return accuracy, precision, recall

train_accuracy_score, train_precision_score, train_recall_score = calculate_binary_class_scores(training_labels, train_predictions_series)
test_accuracy_score, test_precision_score, test_recall_score = calculate_binary_class_scores(test_labels, test_predictions_series)
print('Training Data Accuracy (%) = ', round(train_accuracy_score*100,2))

print('Training Data Precision (%) = ', round(train_precision_score*100,2))
print('Training Data Recall (%) = ', round(train_recall_score*100,2))
print('-'*40)
print('Test Data Accuracy (%) = ', round(test_accuracy_score*100,2))
print('Test Data Precision (%) = ', round(test_precision_score*100,2))
print('Test Data Recall (%) = ', round(test_recall_score*100,2))
```

<br/>

**Output:**

Training Data Accuracy (%) =  100.0<br/>
Training Data Precision (%) =  100.0<br/>
Training Data Recall (%) =  100.0<br/>
----------------------------------------<br/>
Test Data Accuracy (%) =  95.0<br/>
Test Data Precision (%) =  100.0<br/>
Test Data Recall (%) =  91.67
