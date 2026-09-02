# Fonctions avec plusieurs types en Python 3.10

- Canonical URL: https://leandeep.com/fonctions-avec-plusieurs-types-en-python-3.10/
- Author: Olivier Eeckhoutte
- Published: 2020-12-08T21:01:00Z
- Updated: 2020-12-08T21:01:00Z
- Language: fr
- Tags: Python, python_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Python 3.10, sorti officiellement le 04 octobre 2021, permet d'écrire de manière plus lisible les différentes types que peuvent prendre les arguments et données retournées par les fonctions. 

<br/>

Example pour une fonction qui prend un argument de type `int` ou `str` et qui retourne un objet de type `int` ou `str`:

```
def ma_fonction(argument: int | str) -> int | str:
	pass

```
**On utilise le caractère: `|`.**


<br/>

Avant, de Python 3.5 à 3.9, il fallait utiliser `Union` du package `typing`:

```
from typing import Union
def ma_fonction(argument: Union[int, str]) -> Union[int, str]:
	pass

```

> Si la fonction peut retourner None et un autre type comme `int` par example, on continue à utiliser `Optional[int]`

