# Ajouter un prefix sur les noms des fichiers d'un répertoire

- Canonical URL: https://leandeep.com/ajouter-un-prefix-sur-les-noms-des-fichiers-dun-r%C3%A9pertoire/
- Author: Olivier Eeckhoutte
- Published: 2023-01-07T07:00:00+02:00
- Updated: 2023-01-07T07:00:00+02:00
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petit tip du jour de 5 secondes pour ajouter un prefix devant tous les fichiers d'un répertoire:

```
for f in * ; do mv "$f" Prefix_"$f" ; done
```


