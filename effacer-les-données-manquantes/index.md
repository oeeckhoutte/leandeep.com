# Effacer les données manquantes

- Canonical URL: https://leandeep.com/effacer-les-donn%C3%A9es-manquantes/
- Author: Olivier Eeckhoutte
- Published: 2018-12-30T22:13:18-07:00
- Updated: 2018-12-30T22:13:18-07:00
- Language: fr
- Tags: pandas, tips, ml_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Pré-requis

```
pip install numpy pandas
# va installer numpy 1.19.1 et pandas 1.1.0
```

<br/>

## Charger les librairies 
```
import numpy as np
import pandas as pd
```

<br/>

## Création d'une matrice de données

```
# Création de la feature matrice
X = np.array([[1, 2], 
              [6, 3], 
              [8, 4], 
              [9, 5], 
              [np.nan, 4]])
```

<br/>

## Effacer les données manquantes

**Avec Numpy**

```
X[~np.isnan(X).any(axis=1)]
```

Résultat:

```
array([[1., 2.],
       [6., 3.],
       [8., 4.],
       [9., 5.]])
```

<br/>

**Avec Pandas**

```
# On transforme les données en dataframe Pandas
df = pd.DataFrame(X, columns=['feature_1', 'feature_2'])

# On efface les observations avec des données manquantes
df.dropna()
```

Résultat:

```
   feature_1  feature_2
0        1.0        2.0
1        6.0        3.0
2        8.0        4.0
3        9.0        5.0
```
