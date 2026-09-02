# Créer une archive zip sans .DS_Store

- Canonical URL: https://leandeep.com/cr%C3%A9er-une-archive-zip-sans-.ds_store/
- Author: Olivier Eeckhoutte
- Published: 2015-11-12T21:25:00Z
- Updated: 2015-11-12T21:25:00Z
- Language: fr
- Tags: OSX, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Utiliser tout simplement la commande:
```
zip -r <name>.zip . -x "*.DS_Store"
```

> `.DS_Store` est un fichier qui contient des attributs pour customiser le dossier dans lequel il se trouve comme par exemple la position des icônes ou l'image background.
