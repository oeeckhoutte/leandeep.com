# Créer et activer une partition swap sur Centos 7

- Canonical URL: https://leandeep.com/cr%C3%A9er-et-activer-une-partition-swap-sur-centos-7/
- Author: Olivier Eeckhoutte
- Published: 2019-08-30T14:36:36Z
- Updated: 2019-08-30T14:36:36Z
- Language: fr
- Tags: Unix
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Dans cet article nous allons voir comment créer et activer une partition SWAP sur Centos 7 / Red Hat 7. Si vous avez oublié d'en créer une lors de l'installation d'une VM sur AWS par exemple vous pouvez suivre cette procédure.

```
sudo dd if=/dev/zero of=/swapfile count=4096 bs=1MiB
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

<br/>

Editer le fichier `/etc/fstab` et ajouter la ligne suivante pour que la partition soit montée de manière persistente. 
```
/swapfile   swap    swap    sw  0   0
```

<br/>

Puis exécutez la commande suivante: 
```
sudo sysctl vm.swappiness=10
```

<br/>

Enfin éditez le fichier suivant `/etc/sysctl.conf` et ajoutez les lignes qui suivent:
```
vm.swappiness = 10
vm.vfs_cache_pressure = 50
```

<br/>

Pour vérifier la taille du swap vous pouvez utiliser les commandes qui suivent: 
```
swapon --summary
free -h
```

<br/>

Redémarrez votre machine pour vérifier que la machine est bien opérationnelle et que la partition swap est bien toujours présente et active.

