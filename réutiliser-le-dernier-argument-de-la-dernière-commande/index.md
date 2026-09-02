# Réutiliser le dernier argument de la dernière commande

- Canonical URL: https://leandeep.com/r%C3%A9utiliser-le-dernier-argument-de-la-derni%C3%A8re-commande/
- Author: Olivier Eeckhoutte
- Published: 2014-05-10T21:38:00Z
- Updated: 2014-05-10T21:38:00Z
- Language: fr
- Tags: Unix Tip, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie Historique Shell:**

Si vous voulez réutiliser le dernier argument de votre dernière commande pour votre nouvelle commande vous pouvez utiliser cette commande: 

```
!$
```

Exemple:

```
$ mv server.js backend/ 
$ du -sh !$ 
$ du -sh backend/ 
1.2G  backend/
```


