# Profiler son programme Python

- Canonical URL: https://leandeep.com/profiler-son-programme-python/
- Author: Olivier Eeckhoutte
- Published: 2021-02-21T22:13:00Z
- Updated: 2021-02-21T22:13:00Z
- Language: fr
- Tags: Python, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Profiler son programme Python

Dans cet article rapide, nous allons voir la procédure à suivre pour profiler son programme Python pour identifier des problèmes de performance.

Pour se faire, nous allons utiliser les modules `cProfile` et `snakeviz`

cProfile est utilisé pour effectuer un profilage de code, ce qui permet d'analyser les performances d'un programme en mesurant le temps d'exécution de chaque fonction. Le profilage est utile pour identifier les parties du code qui prennent le plus de temps, afin d'optimiser les performances du programme.

cProfile est une version plus performante de la librairie profile standard de Python. Elle utilise une approche basée sur C pour minimiser l'impact du profilage sur le temps d'exécution global du programme.

SnakeViz est un visualiseur graphique Web pour la sortie du module cProfile de Python et une alternative à l'utilisation du module pstats de la bibliothèque standard.

<br/>

## Pré-requis

```
pip install snakeviz
```

<br/>

## Installation

Voici un exemple de code simple permettant de comprendre comment utiliser cProfile. 

```
import cProfile

def main():
    pass

if __name__ == "__main__":
    profiler = cProfile.Profile()
    profiler.enable()
    main()
    profiler.disable()
    profiler.dump_stats("example.prof")
```

<br/>

## Visualisation

```
snakeviz example.prof
```

