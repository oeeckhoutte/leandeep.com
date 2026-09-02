# Importer des données depuis Numpy et Pandas dans Tensorflow

- Canonical URL: https://leandeep.com/importer-des-donn%C3%A9es-depuis-numpy-et-pandas-dans-tensorflow/
- Author: Olivier Eeckhoutte
- Published: 2016-02-26T07:31:00Z
- Updated: 2016-02-26T07:31:00Z
- Language: fr
- Tags: Tensorflow Tip, pandas
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Exemple avec le jeu de données Iris:

On importe le dataset:

```
!mkdir /content/data
!ls
!wget https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data -P /content/data
```

<br/>

Output:
```
data  sample_data
--2018-11-16 09:37:26--  https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data
Resolving archive.ics.uci.edu (archive.ics.uci.edu)... 128.195.10.249
Connecting to archive.ics.uci.edu (archive.ics.uci.edu)|128.195.10.249|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 4551 (4.4K) [text/plain]
Saving to: ‘/content/data/iris.data’

iris.data           100%[===================>]   4.44K  --.-KB/s    in 0s      

2018-11-16 09:37:27 (102 MB/s) - ‘/content/data/iris.data’ saved [4551/4551]
```

On crée le modèle Tensorflow en réutilisant les données que l'on vient de télécharger:
```
import tensorflow as tf 
import numpy
import pandas as pd
df = pd.read_csv('/content/data/iris.data', usecols = [0,1,2,3], header=None)
d = df.values
l = pd.read_csv('/content/data/iris.data', usecols = [4], header=None)
labels = l.values
data = numpy.float32(d)
labels = numpy.array(l, 'str')


#tensorflow
x = tf.placeholder(tf.float32,shape=(150, 4))
x = data
w = tf.random_normal([100,150], mean=0.0, stddev=1.0, dtype=tf.float32)
y = tf.nn.softmax(tf.matmul(w,x))

with tf.Session() as sess:
    print(sess.run(y))
```

<br/>

Output:

```
[[6.05230798e-06 9.99951363e-01 4.28714886e-09 4.25937251e-05]
 [9.99996185e-01 1.03216182e-13 3.80070583e-06 6.39829425e-19]
 [1.64993300e-17 2.94252706e-04 7.82768490e-14 9.99705732e-01]
...
 [9.99661326e-01 1.44316881e-15 3.38725222e-04 6.10780423e-15]
 [1.43875854e-31 1.99823014e-13 3.74144286e-19 1.00000000e+00]
 [8.89758050e-01 7.39052707e-22 1.10241950e-01 8.98781819e-22]]
```

