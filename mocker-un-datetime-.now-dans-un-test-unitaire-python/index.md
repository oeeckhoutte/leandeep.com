# Mocker un datetime .now() dans un test unitaire Python

- Canonical URL: https://leandeep.com/mocker-un-datetime-.now-dans-un-test-unitaire-python/
- Author: Olivier Eeckhoutte
- Published: 2021-02-23T21:01:00Z
- Updated: 2021-02-23T21:01:00Z
- Language: fr
- Tags: Python, python_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


La fonction datetime.now() peut parfois "poser problème" dans les tests unitaires.
En effet, lorsqu'on veut comparer le résultat d'une fonction comportant une date (now) à un objet pré-défini *expected*, cela peut poser problème...

<br/>

Si on essaye de patcher la fonction today() ou now() comme ceci
```
@mock.patch('datetime.date.today')
def test():
    datetime.date.today.return_value = date(2010, 1, 1)
    print datetime.date.today()
```
cela ne fonctionnera pas car les types *built-in* sont immutables. 

On aura alors une erreur du genre: `TypeError: can't set attributes of built-in/extension type 'datetime.date'`

**Pour contourner ce "problème", on peut utiliser le module `freezegun`.**

<br/>

Example:
```
from freezegun import freeze_time

@freeze_time("2021-02-23")
def test_my_function():

    from datetime import datetime
    print(datetime.now()) #  2021-02-23 00:00:00

    from datetime import date
    print(date.today()) #  2021-02-23
```
