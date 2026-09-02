# Différence entre append et extend

- Canonical URL: https://leandeep.com/diff%C3%A9rence-entre-append-et-extend/
- Author: Olivier Eeckhoutte
- Published: 2019-02-13T21:20:04-07:00
- Updated: 2019-02-13T21:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Append

Ajoute un object en bout de liste:

```
prenoms = ["titi", "tata", "toto"]
prenoms.append(["tete", "tutu"])
print(prenoms)
```

Résultat:
`["titi", "tata", "toto", ["tete", "tutu"]]`

<br/>

## Extend

Étend la liste en ajoutant les éléments d'un itérable

```
prenoms = ["titi", "tata", "toto"]
prenoms.extend(["tete", "tutu"])
print(prenoms)
```

Résultat:
`["titi", "tata", "toto", "tete", "tutu"]`

