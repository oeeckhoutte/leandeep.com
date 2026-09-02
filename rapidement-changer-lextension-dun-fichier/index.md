# Rapidement changer l'extension d'un fichier

- Canonical URL: https://leandeep.com/rapidement-changer-lextension-dun-fichier/
- Author: Olivier Eeckhoutte
- Published: 2014-05-06T22:14:00Z
- Updated: 2014-05-06T22:14:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie fichiers et répertoires:**

Pour rapidement renommer un fichier avec une nouvelle extension, on peut utiliser les *brackets*. 

<br/>

Exemple: 

```
$ ls fichier*
fichier.rtf

$ mv fichier.{rtf,txt}
$ ls fichier*
fichier.txt
```

<br/>

Cette commande permet également d'ajouter une extension à un fichier s'il n'y en a pas.

```
$ ls file*
file
$ mv file{,.docx}
$ ls file*
file.docx
```

