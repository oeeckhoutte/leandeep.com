# Convertir les données catégorielles en integer pour sklearn

- Canonical URL: https://leandeep.com/convertir-les-donn%C3%A9es-cat%C3%A9gorielles-en-integer-pour-sklearn/
- Author: Olivier Eeckhoutte
- Published: 2019-02-02T22:13:18-07:00
- Updated: 2019-02-02T22:13:18-07:00
- Language: fr
- Tags: pandas, tips, ml_tips, sklearn
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Pré-requis

```
pip install pandas sklearn
# va installer pandas 1.1.0 et sklearn 0.0
```

<br/>

## Charger les librairies 
```
from sklearn import preprocessing
import pandas as pd
```

<br/>

## Création d'un faux dataset

```
raw_data = {
   'patient': [1, 1, 1, 2, 2],
   'observation': [1, 2, 3, 1, 2],
   'traitement': [0, 1, 0, 1, 0],
   'etat': ['vivant', 'mort', 'zombie', 'vivant', 'mort']
}

df = pd.DataFrame(raw_data, columns = ['patient', 'observation', 'traitement', 'etat'])
```

<br/>

## Fit the Label Encoder

```
# Créer un objet label (catégorie) encoder
le = preprocessing.LabelEncoder()

# Remplir l'encoder avec la colonne pandas
le.fit(df['state'])
```

<br/>

## Voir les labels (debug)

```
list(le.classes_)
```

<br/>

## Transformer les catégories en integers

```
# Appliquer l'objet encoder rempli à la colonne Pandas
le.transform(df['state'])
```

<br/>

> Inverse: Transformer les integers en catégories: <br/>
> `list(le.inverse_transform([2, 2, 1]))`
