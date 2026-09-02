# Retirer les commentaires et lignes vides

- Canonical URL: https://leandeep.com/retirer-les-commentaires-et-lignes-vides/
- Author: Olivier Eeckhoutte
- Published: 2014-06-16T21:25:00Z
- Updated: 2014-06-16T21:25:00Z
- Language: fr
- Tags: Unix Tip, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie Manipulation de textes**

Voici une commande permettant de nettoyer un fichier de configuration et retirer les commentaires et lignes vides inutiles.

```
grep -E -v "^#|^$" file
```

<br/>

Ces commandes utilisent une regex grâce à l'option -E de grep.
* "^#" permet de trouver toutes lignes qui commencent par un "#".
* "^$" permet de trouver toutes les lignes vides.

*Pour info l'option -v permet d'inverser la sélection.*

<br/>

Exemple: 
```
grep -E -v '^#|^$' nginx.conf | head
```

