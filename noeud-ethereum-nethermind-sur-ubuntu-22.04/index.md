# Noeud Ethereum Nethermind sur Ubuntu 22.04

- Canonical URL: https://leandeep.com/noeud-ethereum-nethermind-sur-ubuntu-22.04/
- Author: Olivier Eeckhoutte
- Published: 2022-08-14T23:49:00+02:00
- Updated: 2022-08-14T23:49:00+02:00
- Language: fr
- Tags: Ethereum, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons voir comment hoster un noeud light Ethereum mainnet avec Nethermind sur Ubuntu 22.04.

<br/>

## Installation

On commence par installer `.NET`:

```
sudo add-apt-repository ppa:nethermindeth/nethermind
sudo apt install nethermind
```

<br/>

Ensuite on installer Nethermind:

```
sudo add-apt-repository ppa:nethermindeth/nethermind
sudo apt install nethermind
```

<br/>


## Configuration 

On créer un répertoire qui contiendra nos data:

```
mkdir -p /data/eth-mainnet-nethermind
```

<br/>

On édite le fichier de configuration `/usr/share/nethermind/configs/mainnet.cfg` et on autorise les IPs, modules qui nous intéressent. Dans mon cas à titre d'exemple: 

```
{
  "Init": {
    "ChainSpecPath": "chainspec/foundation.json",
    "GenesisHash": "xxx",
    "BaseDbPath": "nethermind_db/mainnet",
    "LogFileName": "mainnet.logs.txt",
    "MemoryHint": 2048000000,
  },
  "Network": {
    "ActivePeersMaxCount": 100
  },
  "Sync": {
    "FastSync": true,
    "SnapSync": true,
    "PivotNumber": 15216000,
    "PivotHash": "xxx",
    "PivotTotalDifficulty": "xxx",
    "FastBlocks": true,
    "AncientBodiesBarrier": 11052984,
    "AncientReceiptsBarrier": 11052984,
    "WitnessProtocolEnabled": true
  },
  "EthStats": {
    "Server": "wss://ethstats.net/api"
  },
  "Metrics": {
    "NodeName": "Mainnet"
  },
  "HealthChecks": {
    "Enabled": true,
    "WebhooksEnabled": true,
    "WebhooksUri": "https://hooks.slack.com/services/...",
    "UIEnabled": true,
    "PollingInterval": 10,
    "Slug": "/api/health"
  },
  "JsonRpc": {
    "Enabled": true,
    "Host": "172.xxx.xxx.xxx",
    "Port": 8545,
    "EnabledModules": ["Eth", "Subscribe", "Trace", "TxPool", "Web3", "Personal", "Proof", "Net", "Parity", "Health"],

  }
}
```

<br/>

## Run

Aussi simple qu'exécuter cette command
```
/usr/bin/nethermind --datadir /data/eth-mainnet-nethermind/
```

<br/>

Pour vérifier si le noeud est synchronisé:

```
curl --data '{"method":"eth_syncing","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST 172.xxx.xxx.xxx:8545
```

<br/>

## Service

On crée un service via la commande:
```
sudo systemctl edit --force --full neithermind-mainnent-light-mainnet.service
```

Et on ajoute le contenu suivant

```
[Unit]
Description=Nethermind Eth Light Mainnet daemon
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
Restart=always
RestartSec=5
ExecStart=/usr/bin/nethermind --datadir /data/eth-mainnet-nethermind/

[Install]
WantedBy=multi-user.target
```

Et on démarre:

```
sudo systemctl enable neithermind-mainnent-light-mainnet.service
sudo systemctl start neithermind-mainnent-light-mainnet.service
```

<br/>

Voilà that's all. Next `pip install web3` or `npm i ethers` and we can call a RPC node directly. C'est bien suffisant pour certains besoins.

> Sync duration: ~5h 

> Logs: `journalctl -fu neithermind-mainnent-light-mainnet`
