# Demander Pardon plutôt que la permission

- Canonical URL: https://leandeep.com/demander-pardon-plut%C3%B4t-que-la-permission/
- Author: Olivier Eeckhoutte
- Published: 2020-01-04T21:20:04-07:00
- Updated: 2020-01-04T21:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


La communauté Python utilise le coding style appelé EAFP (**E**asier to **A**sk for **F**orgiveness than **P**ermission) au lieu du style LBYL (**L**ook **B**efore **Y**ou **L**eap). Ce coding style suppose que les fichiers et variables existent. En d'autres termes, plutôt que de tester toutes les pré-conditions, les problèmes éventuels sont "catchés" comme des exceptions. `EAFP` est plus pertinent que `LBYL` car il est presque impossible d'anticiper tous les problèmes. Le code Python est donc généralement plus concis, plus clair et rempli de `try` `except`.

<br/>

## Anti-pattern (Pas bien!)

```
import os

if os.path.exists("mon_fichier.txt"):
    os.unlink("mon_fichier.txt")
```

<br/>

## Bonne pratique (Bien!)

Contrairement au code ci-dessus qui check si mon_fichier.txt existe avant de l'utiliser, on suppose qu'il existe bien et on catch les éventuelles exceptions. 

```
import os

try:
    os.unlink("file.txt")
except OSError:
    pass
```
