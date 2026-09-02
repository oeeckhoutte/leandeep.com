# Installer Neo4j 4.1 sur Ubuntu 20.04

- Canonical URL: https://leandeep.com/installer-neo4j-4.1-sur-ubuntu-20.04/
- Author: Lean Deep
- Published: 2022-05-30T00:46:43Z
- Updated: 2022-05-30T00:46:43Z
- Language: fr
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici la procédure à suivre pour installer Neo4j 4.1 sur Ubuntu 20.04.


<br/>

**Truster le repo Neo4j**
```
curl -fsSL https://debian.neo4j.com/neotechnology.gpg.key |sudo gpg --dearmor -o /usr/share/keyrings/neo4j.gpg
```

<br/>

**Ajouter le repo Neo4j dans la liste des packages APT**

```
echo "deb [signed-by=/usr/share/keyrings/neo4j.gpg] https://debian.neo4j.com stable 4.1" | sudo tee -a /etc/apt/sources.list.d/neo4j.list
```

<br/>

**Prendre en compte la nouvelle source**

```
sudo apt update
```

<br/>

**Installer le package**

```
sudo apt install neo4j
```

<br/>

**Enable le service**

```
sudo systemctl enable neo4j.service
```

<br/>

**Démarrer le service**

```
sudo systemctl start neo4j.service
```

<br/>

**Vérifier que le service est UP**
```
sudo systemctl status neo4j.service
```

<br/>

**Vérifier l'installation et changer le mot de passe par défaut**
```
cypher-shell
```

> Neo4j sera disponible sur localhost (`neo4j://127.0.0.1:7687`) uniquement. Rendez-vous dans `/etc/neo4j/neo4j.conf` pour binder Neo4j aux interfaces IPv4 ou IPv6 de votre serveur.
