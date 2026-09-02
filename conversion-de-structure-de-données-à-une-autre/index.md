# Conversion de structure de données à une autre

- Canonical URL: https://leandeep.com/conversion-de-structure-de-donn%C3%A9es-%C3%A0-une-autre/
- Author: Olivier Eeckhoutte
- Published: 2015-05-09T21:07:00Z
- Updated: 2015-05-09T21:07:00Z
- Language: fr
- Tags: Python Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Lorsque l'on fait du preprocessing sur les données en Python, il est utile de transformer des structures de données en d'autres. 
Voici quelques snippets utiles: 

## Liste vers dictionnaire

```
list = ["lun", "mer", "mar", "mer", "jeu", "jeu"]
dict = {}
for el in list:
    dict[e] = dict.get(el, 0) + 1
print(dict)
```

```
{'lun': 1, 'mer': 2, 'mar': 1, 'jeu': 2}
```

L'usage de la méthode [get](https://docs.python.org/3/library/stdtypes.html?highlight=get#dict.get) regarde si une clé appartient au dictionnaire, retourne la valeur associée ou une valeur par défault dans le cas contraire. 

Sans utiliser cette méthode, le code précédent devient:
```
list = ["lun", "mer", "mar", "mer", "jeu", "jeu"]
dict = {}
for el in list:
    if el in dict:
        dict[el] += 1
    else:
        dict[el] = 1
print(dict)
```

<br/>

## Dictionnaire vers liste

```
dict = {'lun': 1, 'mer': 2, 'mar': 1, 'jeu': 2}
list = []
for key, value in dict.items():
    for i in range(value):
        list.append(key)
print(list)
```

```
["lun", "mer", "mar", "mer", "jeu", "jeu"]
```

<br/>

## Dictionnaire vers 2 listes

```
dict = {'lun': 1, 'mer': 2, 'mar': 1, 'jeu': 2}
keys = []
values = []
for key, value in dict.items():
    keys.append(key)
    values.append(value)

print(keys)
print(values)
```

```
['mer', 'jeu', 'lun', 'mar']
[2, 2, 1, 1]
```

<br/>

## 2 listes vers 1 dictionnaire

```
keys, values = ['mer', 'jeu', 'lun', 'mar'], [2, 2, 1, 1]
dict = {x:y for x, y in zip(keys, values)}
print(dict)
```

```
{'lun': 1, 'mer': 2, 'mar': 1, 'jeu': 2}
```

<br/>

## Dictionnaire vers 2 listes

```
dict = {'lun': 1, 'mer': 2, 'mar': 1, 'jeu': 2}
keys = []
values = []
for key, value in dict.items():
    keys.append(k)
    values.append(v)
print(keys)
print(values)
```

```
['mer', 'jeu', 'lun', 'mar']
[2, 2, 1, 1]
```

Avec le zip reverse cela devient: 

```
dict = {'lun': 1, 'mer': 2, 'mar': 1, 'jeu': 2}
keys, values = zip(*dict.items())
print(keys)
print(values)
```

```
('mer', 'jeu', 'lun', 'mar')
(2, 2, 1, 1)
```

