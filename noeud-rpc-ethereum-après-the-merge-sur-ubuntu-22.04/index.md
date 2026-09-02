# Noeud RPC Ethereum après The Merge sur Ubuntu 22.04

- Canonical URL: https://leandeep.com/noeud-rpc-ethereum-apr%C3%A8s-the-merge-sur-ubuntu-22.04/
- Author: Olivier Eeckhoutte
- Published: 2022-09-15T04:49:00+02:00
- Updated: 2022-09-15T04:49:00+02:00
- Language: fr
- Tags: Ethereum, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article, nous allons voir comment hoster un noeud relais pour Ethereum mainnet après The Merge avec Nethermind sur Ubuntu 22.04.

> Cette procédure a été écrite très rapidement quelques heures après la release de The Merge pour remettre d'aplomb mes bots de trading. Désolé d'avance si des erreurs se sont glissées dans cet article.

<br/>

## Installation


On télécharge Nethermind:

```
mkdir -p /data/eth2-mainnet/{consensus,execution}
cd /data/eth2-mainnet/execution
wget https://github.com/NethermindEth/nethermind/archive/refs/tags/1.13.6.zip
unzip 1.13.6.zip
```

<br/>

On installe le client pour le consensus POS:

```
cd /data/eth2-mainnet/consensus
mkdir prysm && cd $_
curl https://raw.githubusercontent.com/prysmaticlabs/prysm/master/prysm.sh --output prysm.sh && chmod +x prysm.sh
```

<br/>

## Configuration

On créer un token JWT à coller dans le directory consensus: 

```
# Sur OSX
# On génère un token de 256 bit 32 Byte Hex
python3 -c "import secrets; print(secrets.token_hex(32))" | pbcopy

# On colle le token du presse papier dans ce fichier:
vim /data/eth2-mainnet/consensus/jwt.hex
```

<br/>


## Démarrage de la couche d'exécution

```
cd /data/eth2-mainnet/execution/
./Nethermind.Runner --JsonRpc.Enabled true --JsonRpc.EnginePort=8551 --JsonRpc.EngineHost=0.0.0.0 --HealthChecks.Enabled true --HealthChecks.UIEnabled true --JsonRpc.JwtSecretFile=/data/eth2-mainnet/consensus/jwt.hex
```

<br/>

## Démarrage du noeud relais via Prysm

```
cd /data/eth2-mainnet/consensus/prysm/
./prysm.sh beacon-chain --execution-endpoint=http://localhost:8551 --jwt-secret=/data/eth2-mainnet/consensus/jwt.hex --suggested-fee-recipient=VOTRE_OU_UNE_CLE_ETHEREUM_PUBLIQUE
```

<br/>

## Vérification du status de la synchro

```
curl http://localhost:3500/eth/v1/node/syncing | jq
```

<br/>

## Vérification la connectivité avec les clients

```
# Pour l'exécution client:
curl localhost:8545/health

# Pour le relais / consensus:
curl http://localhost:8080/healthz
```
