# Faire tourner un noeud Polygon Matic

- Canonical URL: https://leandeep.com/faire-tourner-un-noeud-polygon-matic/
- Author: Olivier Eeckhoutte
- Published: 2021-07-16T11:25:00Z
- Updated: 2021-07-16T11:25:00Z
- Language: fr
- Tags: Polygon, Matic, Node Hosting, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Ou comment diviser par 5000 ses frais de gas

Si comme moi vous tradiez sur le réseau Ethereum mais que les frais de transactions sont venus rogner votre marge, vous devriez passer sur Polygon... Il y a 1 an tout rond, il était encore possible de réaliser des transactions avec des gaz fees de max 1.50 / $2 mais maintenant ce n'est plus possible du tout. La solution, passer sur d'autres réseaux comme Tron, BSC ou encore Polygon. Dans cet article, nous allons voir comment installer un noeud Polygon.

Testé et approuvé. Trading bot connecté à mon noeud.

```
2021-07-16 11:27:55,633 | INFO     | Connecting to network matic-mainnet using NODE_URL=http://192.168.1.31:8545
2021-07-16 11:27:55,736 | INFO     | Is connected to Node: True
```

<br/>

## Mainnet

> Matériel: un SSD d'au moins 2To<br/>
> Docker version: 20.10.2<br/>
> Docker-compose version: 1.28.6, build 5db8d86f

**Optionnel: installer docker et docker-compose**

```
sudo apt install curl -y
sudo apt install docker.io
sudo usermod -aG docker <user>
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker–compose –version
# Pour désinstaller:
# sudo rm /usr/local/bin/docker-compose
# sudo apt remove docker-compose
# sudo apt autoremove
```

<br/>

**Optionnel: créer et monter une partition de 4TB**

```
parted /dev/sda
(parted) mklabel gpt
(parted) Warning: The existing disk label on /dev/sda will be destroyed and all data on this disk will be lost. Do you want to continue? Yes/No? yes
(parted) unit TB
(parted) mkpart primary 0.00TB 4.00TB
(parted) print
(parted) quit
# Information: You may need to update /etc/fstab.
mkfs.ext4 /dev/sda1
mkdir /data
mount /dev/sda1 /data

# Update /etc/fstab
lsblk -fe7
# sudo vim /etc/fstab et ajouter la ligne suivante:
UUID=YOUR_DISK_UUID /data ext4 defaults 0 0
```

<br/>



Télécharger le dernier snapshot full
```
wget -c https://matic-blockchain-snapshots.s3.amazonaws.com/matic-mainnet/bor-fullnode-snapshot-2021-06-16.tar.gz
wget -c https://matic-blockchain-snapshots.s3.amazonaws.com/matic-mainnet/heimdall-fullnode-snapshot-2021-06-16.tar.gz
```

<br/>
Récupérer le repo officiel:
```
mkdir matic && cd matic
git clone https://github.com/oeeckhoutte/launch (fork du repo officiel)
cd launch/docker 
```

<br/>
Editer le fichier `mainnet.env` et remplacer la varible d'env `BOR_MODE` par `full` au lieu d'`archive`.

<br/>

Créer la structure du noeud:
```
mkdir -p heimdall/snapshot
mkdir -p heimdall/scripts
mkdir -p bor/snapshot
mv <path-to-heimdall-snapshot-file> heimdall/snapshot
mv <path-to-bor-snapshot-file> bor/snapshot
mv heimdall-startup.sh heimdall/scripts
```

<br/>

Démarrer le noeud:

```
sudo docker-compose -f matic-sentry-with-snapshotting.yml --env-file mainnet.env up
```

<br/>

Checker le status:
```
curl http://localhost:26657/status
````

```
...
"sync_info": {
  "latest_block_hash": "3149E6CD5A21A08C40B7250F2D25BD76E3A72AFB3AE68E2538351FA579445AB1",
  "latest_app_hash": "328E6FADF7E34E63D1233A74C93FC816A994EEAD5009DECD37466573E8F61A1A",
  "latest_block_height": "5799322",
  "latest_block_time": "2021-07-16T11:45:57.013021476Z",
  "catching_up": false
}
...
```

<br/>

Tout est ok si vous avez `"catching_up": false`

