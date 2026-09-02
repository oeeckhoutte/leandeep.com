# Installer MongoDB en tant que service sur Ubuntu 20.04

- Canonical URL: https://leandeep.com/installer-mongodb-en-tant-que-service-sur-ubuntu-20.04/
- Author: Olivier Eeckhoutte
- Published: 2021-05-02T21:25:00Z
- Updated: 2021-05-02T21:25:00Z
- Language: fr
- Tags: MongoDB
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


**Installation**

Importer la clé GPG
```
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
# Vérifier qu'elle est bien installée
# apt-key list
```

<br/>

Ajouter la source dans APT en créant un fichier relatif à MongoDB dans le répertoire `sources.list.d`
```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```

<br/>

Installer MongoDB
```
sudo apt update
sudo apt install mongodb-org
```

<br/>

Démarrer le service
```
sudo systemctl start mongod.service
sudo systemctl status mongod
sudo systemctl enable mongod
```

<br/>

Vérifier le bon fonctionnement 
```
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```
