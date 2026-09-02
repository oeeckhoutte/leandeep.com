# Eviter les if ou try/except avec les dictionnaires

- Canonical URL: https://leandeep.com/eviter-les-if-ou-try/except-avec-les-dictionnaires/
- Author: Olivier Eeckhoutte
- Published: 2020-01-16T01:20:04-07:00
- Updated: 2020-01-16T01:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Manipuler des dictionnaires Python est facile.
Pour les transformer on peut utiliser des *dict comprehension*. Par exemple, pour inverser un dictionnaire on peut le faire en une ligne de code. 

```
prenoms = {'titi': 1, 'tata': 2, 'toto': 3}
invert_prenoms = {v: k for k, v in prenoms.iteritems()}
print(invert_prenoms)
{1: 'titi', 2: 'tata', 3: 'toto'}
```

Pour sélectionner une valeur à partir d'une clé, on peut 
* soit tester si une clé existe dans le dict ou catcher l'exception `KeyError` avec `try`/`except` 
* **ou on peut utiliser un `defaultdict`**, ce qui permet d'avoir du code plus propre, et plus facilement testable. 


## Anti-pattern (Pas bien!)

```
>>> prenom_occurrences = {'titi': [], 'tata': []}
>>> prenom_occurrences['toto']
KeyError: 'toto'

# Option 1
>>> if 'toto' not in prenom_occurrences:
    prenom_occurrences['c'] = []

>>> prenom_occurrences['toto']
[]

# Option 2
>>> try:
        print(prenom_occurrences['tutu'])
    except: 
        print("There is no character 'tutu' in the string")
```

## Bonne pratique (Bien!)

Utiliser defaultdict du module `collections`.

```
>>> from collections import defaultdict
>>> prenom_occurrences = {'titi': [], 'tata': []}
>>> prenoms = defaultdict(dict)
>>> prenoms.update(prenom_occurrences)
>>> prenoms['titi']
[]

>>> prenoms['tata'].append('toto')
>>> prenoms['tata'].append('tutu')
>>> prenoms['tata']
['toto', 'tutu']
```
