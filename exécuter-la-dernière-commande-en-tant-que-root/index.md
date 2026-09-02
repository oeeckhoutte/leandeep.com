# Exécuter la dernière commande en tant que root

- Canonical URL: https://leandeep.com/ex%C3%A9cuter-la-derni%C3%A8re-commande-en-tant-que-root/
- Author: Olivier Eeckhoutte
- Published: 2014-06-15T22:07:00Z
- Updated: 2014-06-15T22:07:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie Historique Shell**

Si vous avez oublié d'exécuter une commande avec les privilèges root, vous pouvez simplement la répéter en utilisant:

```
$ sudo !!
$ su -c "!!"
```

Exemple: 

```
$ adduser bob
-bash: /usr/sbin/adduser: Permission denied 
$ sudo !! 
$ sudo adduser bob
id bob uid=1007(bob) gid=1007(bob) groups=1007(bob)

$ useradd bill
-bash: /usr/sbin/useradd: Permission denied 
$ su -c "!!" 
$ su -c "useradd bill" 
Password: 
id bill uid=1007(bill) gid=1007(bill) groups=1007(bill)
```

Cette syntaxe avec points d'exclamation est appelée *event designator*. Il désigne une référence dans l'historique des commandes shell. 
Bang-Bang (!!) répète la commande la plus récente. 
Il est également possible de rejouer en mode root la commande la plus récente qui débute avec un string donné.

Exemple:

```
$ whoami
olivier

$ uptime
15:19  up 7 days,  5:45, 3 users, load averages: 2.39 2.20 2.27

$ sudo !w
$ sudo whoami
root
```

