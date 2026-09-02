# Réutiliser le 1er argument de la dernière commande

- Canonical URL: https://leandeep.com/r%C3%A9utiliser-le-1er-argument-de-la-derni%C3%A8re-commande/
- Author: Olivier Eeckhoutte
- Published: 2014-05-08T15:23:00Z
- Updated: 2014-05-08T15:23:00Z
- Language: fr
- Tags: Unix Tip, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie Historique Shell**

Si vous voulez réutiliser le premier argument de votre dernière commande pour votre nouvelle commande vous pouvez utiliser cette commande: 

```
!^
```

Exemple:

```
$ host www.google.com 8.8.8.8
Using domain server:
Name: 8.8.8.8
Address: 8.8.8.8#53
Aliases: 

www.google.com has address ...
www.google.com has IPv6 address ...

# Envoyer 1 seul ping
$ ping -c1 !^ 
$ ping -c1 www.google.com
PING www.google.com ...
```


