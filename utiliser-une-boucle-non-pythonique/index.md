# Utiliser une boucle non Pythonique

- Canonical URL: https://leandeep.com/utiliser-une-boucle-non-pythonique/
- Author: Olivier Eeckhoutte
- Published: 2020-01-11T21:20:04-07:00
- Updated: 2020-01-11T21:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Pour accéder aux éléments d'une liste et afficher l'index des éléments, il vaut mieux privilégier l'utilisation d'`enumerate()` sur la liste plutôt que de créer une boucle et d'incrémenter la valeur de l'index.

<br/>

## Anti-pattern (Pas bien!)

```
prenoms = ["titi", "tata", "toto"]

for idx in range(0, len(prenoms)):
    prenom = l[idx]
    print(idx, prenom)
```

<br/>

## Bonne pratique (Bien!)

Voici la manière plus Pythonique d'itérérer sur une liste.

```
prenoms = ["titi", "tata", "toto"]

for idx, prenom in enumerate(prenoms):
    print(idx, prenom)
```
