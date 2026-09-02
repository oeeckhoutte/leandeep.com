# Comment exporter et restaurer un modèle Tensorflow ?

- Canonical URL: https://leandeep.com/comment-exporter-et-restaurer-un-mod%C3%A8le-tensorflow/
- Author: Olivier Eeckhoutte
- Published: 2018-08-26T20:49:00Z
- Updated: 2018-08-26T20:49:00Z
- Language: fr
- Tags: Tensorflow Tip, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


# 1. Exporter le modèle

Voici le contenu avant l'initialisation du modèle. Il n'y a presque rien.
```
$ ls

sample_data/
```

<br/>

On initialise des variables, on démarre une session Tensorflow et on sauvegarde un premier modèle:
```
import tensorflow as tf
import os

w1 = tf.Variable(tf.truncated_normal(shape=[10]), name='w1')
w2 = tf.Variable(tf.truncated_normal(shape=[20]), name='w2')
tf.add_to_collection('vars', w1)
tf.add_to_collection('vars', w2)

with tf.Session() as sess:
    sess.run(tf.global_variables_initializer())
    saver = tf.train.Saver()
    saver.save(sess, os.path.join(os.getcwd(), 'trained_variables.ckpt'))
```

<br/>

On affiche le contenu du dossier:

```
ls -l

checkpoint
trained_variables.ckpt.index
sample_data/
trained_variables.ckpt.meta
trained_variables.ckpt.data-00000-of-00001
```

<br/>

# 2. Restauration du modèle

```
sess = tf.Session()
new_saver = tf.train.import_meta_graph(os.path.join(os.getcwd(), 'trained_variables.ckpt.meta'))
new_saver.restore(sess, tf.train.latest_checkpoint(os.getcwd()))
all_vars = tf.get_collection('vars')
for v in all_vars:
    v_ = sess.run(v)
    print(v_)
```

<br/>

Output:

```
INFO:tensorflow:Restoring parameters from /content/trained_variables.ckpt
[ 1.1396145   1.6572006  -0.2603495  -0.09486181 -0.7648224  -1.34456
  0.14422925 -0.13617352  0.8662389   1.8259109 ]
[-0.15675354  0.22852097 -0.0374865   0.072795   -1.0221673  -0.75996536
  0.37354338 -0.38855395 -1.0035655   0.92454773 -1.2595061   0.13349424
 -1.2397587  -0.34336722  0.53958344  0.323387   -0.43925637 -0.088446
  0.18330242 -0.04366637]
[ 1.1396145   1.6572006  -0.2603495  -0.09486181 -0.7648224  -1.34456
  0.14422925 -0.13617352  0.8662389   1.8259109 ]
[-0.15675354  0.22852097 -0.0374865   0.072795   -1.0221673  -0.75996536
  0.37354338 -0.38855395 -1.0035655   0.92454773 -1.2595061   0.13349424
 -1.2397587  -0.34336722  0.53958344  0.323387   -0.43925637 -0.088446
  0.18330242 -0.04366637]
```

