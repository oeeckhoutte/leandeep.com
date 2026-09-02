# Utiliser un dictionnaire pour réaliser un switch case

- Canonical URL: https://leandeep.com/utiliser-un-dictionnaire-pour-r%C3%A9aliser-un-switch-case/
- Author: Olivier Eeckhoutte
- Published: 2018-06-07T23:43:06-07:00
- Updated: 2018-06-07T23:43:06-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Contrairement à d'autres langages de programmation, Python ne permet pas de faire des `switch` `case`. L'alternative naïve est de faire des `if...elif...else`. Une autre alternative plus idiomatique est d'utiliser les fonctions comme des objets et d'utiliser des dictionnaires.


<br/>

## Anti-pattern (Pas bien!)

```
def apply_operator(var_1, var_2, operator):
    if operator == '+':
        return var_1 + var_2
    elif operator == '*':
        return var_1 * var_2
    elif operator == '/':
        return var_1 / var_2
    elif operator == '-':
        return var_1 - var_2
```

<br/>

## Bonne pratique (Bien!)

```
import operator as op

def apply_operator(var_1, var_2, operator):
    operator_map = {
        '+': op.add,
        '*': op.mul,
        '/': op.truediv,
        '-': op.sub,
    }
    return operator_map[operator](var_1, var_2)
```
