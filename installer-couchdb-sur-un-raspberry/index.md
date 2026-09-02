# Installer CouchDB sur un Raspberry

- Canonical URL: https://leandeep.com/installer-couchdb-sur-un-raspberry/
- Author: Olivier Eeckhoutte
- Published: 2012-12-22T19:47:00Z
- Updated: 2012-12-22T19:47:00Z
- Language: fr
- Tags: Linux, NoSQL, Raspberry, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Installation de CouchDB

```
sudo apt-get update
sudo apt-get install couchdb
```

<br/>

## Configuration

1. On configure le port et la bind_address

```
sudo vim /etc/couchdb/local.ini

# Port par defaut: 5984
port = 5984
# Changer le bind address to 0.0.0.0 pour que la base soit accessible de partout
bind_address = 0.0.0.0
```

<br/>

2. Pour que CouchDB puisse démarrer au boot du Pi, on modifie le fichier ` /var/init.d/couchdb` et on ajoute cette variable d'environnement pour ne plus être gêné par `sudo`:

```
COUCHDB_USER=couchdb
```

<br/>

3. Si vous aviez déjà créé votre DB, vous devrez changer les permissions du dossier database_dir pour l'utilisateur couchdb:

```
sudo chown -R couchdb /var/lib/couchdb/1.2.0
```

