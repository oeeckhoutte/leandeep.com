# Rapidement backuper un fichier

- Canonical URL: https://leandeep.com/rapidement-backuper-un-fichier/
- Author: Olivier Eeckhoutte
- Published: 2014-05-04T23:05:00Z
- Updated: 2014-05-04T23:05:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie fichiers et répertoires:**

Vous êtes sur un serveur et vous voulez rapidement créer le backup d'une fichier. Les brackets permettent de le faire. Elles permettent de créer plusieurs arguments quand un argument est prévu par une commande. 

```
$ cp file{,.bak}
```

<br/>

Exemples: 

```
$ sudo cp ~/.ssh/id_rsa.pub{,.bak}
$ ls ~/.ssh/id_rsa.pub
~/.ssh/id_rsa.pub   ~/.ssh/id_rsa.pub.bak   ...

$ mkdir -p ~/Dev/{frontend,backend}
$ ls ~/Dev/
frontend   backend

$ echo 192.168.0.{0..4}
192.168.0.0   192.168.0.1   192.168.0.2   192.168.0.3   192.168.0.4
```





