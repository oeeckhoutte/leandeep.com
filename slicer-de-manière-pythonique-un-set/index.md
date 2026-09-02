# Slicer de manière Pythonique un set

- Canonical URL: https://leandeep.com/slicer-de-mani%C3%A8re-pythonique-un-set/
- Author: Olivier Eeckhoutte
- Published: 2020-01-15T15:20:04-07:00
- Updated: 2020-01-15T15:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Ce tip décrit comment slicer (découper) un set de manière Pythonique.

Les sets sont des *iterables*. On peut donc utiliser la méthode `itertools.islice` qui va nous permettre de créer un *iterator* construit à partir d'un sous-ensemble du set de départ. 


```
import itertools

prenoms_list = ['titi', 'tata', 'totot', 'titi']
prenoms_set = set(prenoms_list)
small_prenoms_set = set(itertools.islice(prenoms_set, 2))
```


