# Utiliser zip pour itérer sur deux listes

- Canonical URL: https://leandeep.com/tips/utiliser-zip-pour-iterer-sur-deux-listes-copy/
- Author: Olivier Eeckhoutte
- Published: 2020-01-14T21:20:04-07:00
- Updated: 2020-01-14T21:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


La bonne approche pour itérer sur deux listes est de créer deux variables, par exemple `liste_un` et `liste_deux` et d'utiliser `zip` en passant en paramètre les 2 variables.

## Anti-pattern (Pas bien!)

```
nombres = [1, 2, 3]
prenoms = ["titi", "tata", "toto"]


for idx in range(len(nombres)):
    print(nombres[idx], prenoms[idx])
```

## Bonne pratique (Bien!)

Dans les 2 cas, le résultat est identique à savoir:
```
1 titi
2 tata
3 toto
```
Mais voici une manière plus Pythonique d'itérer sur ces 2 listes.


```
nombres = [1, 2, 3]
prenoms = ["titi", "tata", "toto"]

for nombre, prenom in zip(nombres, prenoms):
    print(nombre, prenom)

```


