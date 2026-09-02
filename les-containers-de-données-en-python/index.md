# Les containers de données en Python

- Canonical URL: https://leandeep.com/les-containers-de-donn%C3%A9es-en-python/
- Author: Olivier Eeckhoutte
- Published: 2015-05-03T23:24:00Z
- Updated: 2015-05-03T23:24:00Z
- Language: fr
- Tags: Python Tip
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Python propose différents containers pour stocker des éléments. Voici les plus courants:

* [list](https://docs.python.org/3.4/tutorial/datastructures.html#more-on-lists): tableau d’éléments indexés de 0 à n-1 auquel on peut ajouter ou retirer des éléments
* [dict](https://docs.python.org/3.4/tutorial/datastructures.html#dictionaries): tableau d’éléments indexés par des types immuables auquel on peut ajouter ou retirer des éléments
* [tuple](https://docs.python.org/3.4/tutorial/datastructures.html#tuples-and-sequences): tableau d’éléments indexés de 0 à n-1 qu’on ne peut pas modifier
* [set](https://docs.python.org/3.4/tutorial/datastructures.html#sets): tableau d’éléments uniques non indexés
* [frozenset](https://docs.python.org/3.4/tutorial/datastructures.html#sets): set immuables (non modifiable)
* [deque](https://docs.python.org/3.4/library/collections.html#collections.deque): presque équivalent à une liste, la différence vient de l’implémentation, les mêmes opérations n’auront pas les mêmes coûts (deque = liste chaînée)

D’autres containers sont disponibles via le module [collections](https://docs.python.org/3.4/library/collections.html).

```
N = 1000000

list_example = list(range(0,1000))
for i in range(0,N) :
    if i in list_example : s += 1
    
tuple_example = tuple(list_example)
for i in range(0,N) :
    if i in tuple_example : s += 1
    
set_example = set(list_example)
for i in range(0,N) :
    if i in set_example : s += 1
    
frozenset_example = frozenset(list_example)
for i in range(0,N) :
    if i in frozenset_example : s += 1

list_example = list()
# Insertion à la fin
for i in range(0,N):
    list_example.append(i)
# Insertion au début
for i in range(0,N):
    list_example.insert(0,i)
        

import collections

collection_example = collections.deque()
# Insertion au début
for i in range(0,N) :
    collection_example.appendleft(i)
# Insertion à la fin
for i in range(0,N):
    collection_example.append(i)
```


Notez que les ensembles **set** ou **frozenset** sont beaucoup plus rapides que tuples et lists.

