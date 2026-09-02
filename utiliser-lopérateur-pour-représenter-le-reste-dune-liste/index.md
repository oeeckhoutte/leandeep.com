# Utiliser l'opérateur * pour représenter le reste d'une liste

- Canonical URL: https://leandeep.com/utiliser-lop%C3%A9rateur-pour-repr%C3%A9senter-le-reste-dune-liste/
- Author: Olivier Eeckhoutte
- Published: 2018-06-06T12:20:04-07:00
- Updated: 2018-06-06T12:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Python 3 a introduit l'opérateur `*` permettant d'extraire plusieurs éléments au début ou à la fin d'une liste. 

<br/>

## Anti-pattern (Pas bien!)

```
my_list = ["titi", "tata", "toto", "riri", "fifi", "loulou"]
(enfant_1, enfant_2, reste_enfants) = my_list[0], my_list[1], my_list[2:]
print(reste_enfants)

(enfant_1, enfants_milieu, dernier_enfant) = my_list[0], my_list[1:-1], my_list[-1]
print(enfants_milieu)

(premier_enfants, enfants_milieu, dernier_enfants) = my_list[:-2], my_list[-2], my_list[-1]
print(premier_enfants)
```

<br/>

## Bonne pratique (Bien!)

```
my_list = ["titi", "tata", "toto", "riri", "fifi", "loulou"]
(enfant_1, enfant_2, *reste_enfants) = my_list
print(reste_enfants)

(enfant_1, *enfants_milieu, dernier_enfant) = my_list
print(enfants_milieu)

(*premier_enfants, enfants_milieu, dernier_enfants) = my_list
print(premier_enfants)
```
