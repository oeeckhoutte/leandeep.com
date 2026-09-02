# Réutiliser le N-ième mot de la dernière commande

- Canonical URL: https://leandeep.com/r%C3%A9utiliser-le-n-i%C3%A8me-mot-de-la-derni%C3%A8re-commande/
- Author: Olivier Eeckhoutte
- Published: 2014-11-05T20:33:00Z
- Updated: 2014-11-05T20:33:00Z
- Language: fr
- Tags: Unix Tip, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie Historique Shell:**

Si vous voulez réutiliser un mot particulier de votre dernière commande pour votre nouvelle commande vous pouvez utiliser cette commande: 

```
!!:N
```

Exemple:

```
$ du -h ~/Dev
...

$ cd !!:2
$ cd ~/Dev
```

Il est également possible de désigner la dernière commande commencée par un string. (Comme abordé en dernière partie de [ce tip](http://leandeep.com/executer-la-derniere-commande-en-tant-que-root/).)

```
$ cd !d:2 
$ cd ~/Dev
```

