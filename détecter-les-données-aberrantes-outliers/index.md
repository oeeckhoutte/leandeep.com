# Détecter les données aberrantes (outliers)

- Canonical URL: https://leandeep.com/d%C3%A9tecter-les-donn%C3%A9es-aberrantes-outliers/
- Author: Olivier Eeckhoutte
- Published: 2019-02-04T21:23:04-07:00
- Updated: 2019-02-04T21:23:04-07:00
- Language: fr
- Tags: sklearn, tips, ml_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Pré-requis

```
pip install numpy sklearn
# va installer numpy 1.19.1 et sklearn 0.0

```

<br/>

## Charger les librairies 
```
import numpy as np
from sklearn.covariance import EllipticEnvelope
from sklearn.datasets import make_blobs
```

<br/>

## Créer un faux dataset

```
# Create simulated data
X, _ = make_blobs(n_samples = 10,
                  n_features = 2,
                  centers = 1,
                  random_state = 1)

# Remplace les valeurs de la première observation avec des données extrèmes
X[0,0] = 10000
X[0,1] = 10000
```

Voici à quoi ressemble notre dataset composé de 10 observations: 

```
array([[ 1.00000000e+04,  1.00000000e+04],
       [-2.76017908e+00,  5.55121358e+00],
       [-1.61734616e+00,  4.98930508e+00],
       [-5.25790464e-01,  3.30659860e+00],
       [ 8.52518583e-02,  3.64528297e+00],
       [-7.94152277e-01,  2.10495117e+00],
       [-1.34052081e+00,  4.15711949e+00],
       [-1.98197711e+00,  4.02243551e+00],
       [-2.18773166e+00,  3.33352125e+00],
       [-1.97451969e-01,  2.34634916e+00]])
```       

<br/>

## Détecter les données aberrantes (outliers)

```
# Création du détecteur
outlier_detector = EllipticEnvelope(contamination=.1)

# Fit détecteur
outlier_detector.fit(X)

# Predire les outliers
outlier_detector.predict(X)
```

<br/>

**`outlier_detector.predict(X)` retourne `array([-1,  1,  1,  1,  1,  1,  1,  1,  1,  1])`**

<br/>

> `EllipticEnvelope` suppose que les données soient normalement distribuées et dessine une ellipse autour des données. A l'extérieur de l'ellipse les observations sont considérées comme aberrantes (labellisées -1). La limitation de cette approche est qu'il est nécessaire de spécifier le paramètre de contamination du dataset. **Cela suppose que l'on connaisse à l'avance la proportion de données aberrantes dans notre dataset; ce qui est impossible.**
