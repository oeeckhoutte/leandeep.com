# Détecter des memory leaks en Python

- Canonical URL: https://leandeep.com/d%C3%A9tecter-des-memory-leaks-en-python/
- Author: Olivier Eeckhoutte
- Published: 2018-06-21T18:19:00Z
- Updated: 2018-06-21T18:19:00Z
- Language: fr
- Tags: Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans ce rapide article, nous allons voir comment détecter si notre programme Python contient des memory leaks. 
Pour ce faire, nous allons mesurer l'évolution de la consommation de la RAM en fonction du temps grâce au package `memory_profiler`. Il s'agit ici de détecter des memory leaks; pas de les corriger ou analyser dans le détail.

<br/>

## Installation de l'outil

```
pip install memory_profiler
pip install matplotlib
```

<br/>

## Profiling et affichage des résultats

Si d'habitude vous démarriez votre programme via la commande `python votre_programme.py` alors il vous suffit de suffixer cette commande avec `mprof run --include-children` comme ci-dessous:

> `--include-children` permet, comme son nom l'indique, de profiler également les sous processus

```
mprof run --include-children python votre_programme.py
```

<br/>

Dans un nouvel onglet, exécuter la commande suivante pour générer un chart de la consommation de RAM.

```
mprof plot --output ram-profile.png
# Sur Mac
open ram-profile.png

# ou

mprof plot -s
```

> `-s` permet d'avoir la trend line de la consommation mémoire.

<br/>

**Live reload "workaround"**

Ouvrir l'image ram-profile.png avec VSCode.

Puis dans le terminal utiliser `watch -n 60 mprof plot --output ram-profile.png` pour regénérer automatiquement le png toutes les 60 secondes. VSCode rafraîchira l'image tout seul dès qu'elle aura été modifiée.


<br/>

![image](/images/memory-profile.png)

Ici, pas de memory leak détectée sur une mesure de 10 minutes (seulement). Bien sûr, il nécessaire de monitorer beaucoup plus longtemps car on observe quand même une très légère montée de RAM sur la "dernière phase de consolidation".
