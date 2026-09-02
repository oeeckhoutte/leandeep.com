# Utiliser Erigon pour ses Nodes sur Ubuntu 20.04

- Canonical URL: https://leandeep.com/utiliser-erigon-pour-ses-nodes-sur-ubuntu-20.04/
- Author: Olivier Eeckhoutte
- Published: 2022-07-12T21:03:00Z
- Updated: 2022-07-12T21:03:00Z
- Language: fr
- Tags: Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Installation Go

```
wget https://dl.google.com/go/go1.18.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.18.linux-amd64.tar.gz
```

Editer `~/.profile` et ajouter les commandes suivantes
```
export PATH=$PATH:/usr/local/go/bin
export GOPATH="${HOME}/.go/bin"
export PATH=$GOPATH:$PATH
```

```
source ~/.profile
```

```
go version
```

<br/>

## Installation Erigon

```
cd /data/
git clone --recurse-submodules -j8 https://github.com/ledgerwatch/erigon.git
cd erigon
make erigon
```

<br/>

## Run 

**Polygon**

```
mkdir /data/bor-mainnet
./build/bin/erigon --datadir="/data/bor-mainnet" --chain=bor-mainnet --port=30303 --http.port=8545 --torrent.port=42069 --private.api.addr=127.0.0.1:9090 --http --ws --http.api=eth,debug,net,trace,web3,erigon
```

<br/>

**BSC**

Archive Node:
```
mkdir /data/bsc
./build/bin/erigon --datadir="/data/bsc" --chain=bsc --port=30303 --http.port=8545 --torrent.port=42069 --private.api.addr=127.0.0.1:9090 --http --ws --http.api=eth,debug,net,trace,web3,erigon
```

<br/>

Pruned Node:
```
./build/bin/erigon --datadir="/data/bsc-prune" --chain=bsc --port=30303 --http.port=8545 --torrent.port=42069 --private.api.addr=127.0.0.1:9090 --http --ws --http.api=eth,debug,net,trace,web3,erigon --prune.h.older=90_000

# Or

./build/bin/erigon --datadir="/data/bsc-prune" --chain=bsc --port=30303 --http.port=8545 --torrent.port=42069 --private.api.addr=127.0.0.1:9090 --http --ws --http.api=eth,debug,net,trace,web3,erigon --prune.r.before=11184524 --prune htc
```

<br/>

**Service BNB Smart Chain**

Exécuter la commande suivante `sudo systemctl edit --force --full erigon-bsc-pruned-mainnet.service` pour créer un nouveau systemctl unit puis ajouter le contenu suivant (à titre d'example):

```
[Unit]
Description=Erigon BSC Pruned mainnet daemon
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
Restart=always
RestartSec=5
ExecStart=/home/olivier/Dev/erigon/build/bin/erigon --datadir="/data/bsc-prune" --chain=bsc --port=30303 --http.port=8545 --torrent.port=42069 --private.api.addr=127.0.0.1:9090 --http --ws --http.api=eth,debug,net,trace,web3,erigon --prune.r.before=11184524 --prune htc

[Install]
WantedBy=multi-user.target
```

<br/>

Activer le service via les commandes:

```
sudo systemctl enable erigon-bsc-pruned-mainnet.service
sudo systemctl start erigon-bsc-pruned-mainnet.service
sudo systemctl status erigon-bsc-pruned-mainnet.service
```

<br/>

Pour voir les logs il suffit d'exécuter la commande suivante `journalctl -fu erigon-bsc-pruned-mainnet`.

<br/>

**Ethereum**

```
mkdir /data/ethereum
./build/bin/erigon --datadir="data/ethereum" --chain=mainnet --port=30303 --http.port=8545 --torrent.port=42069 --private.api.addr=127.0.0.1:9090 --http --ws --http.api=eth,debug,net,trace,web3,erigon
```


<br/>

## Exploitation

Tout est écrit dans cette documentation: [RPC Daemon](https://pkg.go.dev/github.com/ledgerwatch/erigon/cmd/rpcdaemon#section-readme)

