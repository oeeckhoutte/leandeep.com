# Réaliser un one-hot encoding avec Tensorflow

- Canonical URL: https://leandeep.com/r%C3%A9aliser-un-one-hot-encoding-avec-tensorflow/
- Author: Olivier Eeckhoutte
- Published: 2016-01-20T19:05:00Z
- Updated: 2016-01-20T19:05:00Z
- Language: fr
- Tags: Tensorflow Tip, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


On exécute la fonction tf.nn.embedding_lookup (qui permet d'exécuter l'opération de recherche tensorielle) entre la matrice identité et ses données:

```
import numpy as np
a = 5 
b = [1, 2, 3]

# one hot an integer
one_hot_a = tf.nn.embedding_lookup(np.identity(10), a)

# one hot a list of integers
one_hot_b = tf.nn.embedding_lookup(np.identity(max(b)+1), b)

with tf.Session() as sess:
    print(sess.run([one_hot_a, one_hot_b]))
```

<br/>

Output: 

```
[array([0., 0., 0., 0., 0., 1., 0., 0., 0., 0.]), array([[0., 1., 0., 0.],
       [0., 0., 1., 0.],
       [0., 0., 0., 1.]])]
```

