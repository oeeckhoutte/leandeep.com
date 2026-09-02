# Eviter les variables temporaires pour intervertir 2 variables

- Canonical URL: https://leandeep.com/eviter-les-variables-temporaires-pour-intervertir-2-variables/
- Author: Olivier Eeckhoutte
- Published: 2018-06-05T22:12:03-07:00
- Updated: 2018-06-05T22:12:03-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


En Python, il n'est pas nécessaire d'utiliser une variable temporaire pour intervertir le contenu de 2 variables.

## Anti-pattern (Pas bien!)

```
enfant_1 = "riri"
enfant_2 = "fifi"
temp = enfant_1
enfant_2 = enfant_1
enfant_1 = temp
```

<br/>

## Bonne pratique (Bien!)

```
enfant_1 = "riri"
enfant_2 = "fifi"
(enfant_1, enfant_2) = (enfant_2, enfant_1)
```
