# Faire tourner un noeud Nervos Network

- Canonical URL: https://leandeep.com/faire-tourner-un-noeud-nervos-network/
- Author: Olivier Eeckhoutte
- Published: 2021-08-13T09:25:00Z
- Updated: 2021-08-13T09:25:00Z
- Language: fr
- Tags: Nervos, Nervos Network, Node Hosting, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Ce court article décrit comment faire tourner un noeud Nervos Network testnet sur Ubuntu 20.04.

<br/>

## Noeud sur Aggron


**Installation du CKB Node**

```
mkdir -p nervos
cd ./nervos
curl -LO https://github.com/nervosnetwork/ckb/releases/download/v0.43.1/ckb_v0.43.1_x86_64-unknown-linux-gnu.tar.gz
tar xzf ckb_v0.43.1_x86_64-unknown-linux-gnu.tar.gz
mv ckb_v0.43.1_x86_64-unknown-linux-gnu ckb_v0.43.1
cd ckb_v0.43.1
./ckb init --chain testnet
```

<br/>

**Installation du CKB Indexer**

```
cd ./nervos
mkdir ckb-indexer-0.2.1/
cd ckb-indexer-0.2.1/
curl -LO https://github.com/nervosnetwork/ckb-indexer/releases/download/v0.2.1/ckb-indexer-0.2.1-linux.zip
unzip ckb-indexer-0.2.1-linux.zip
tar xzf ckb-indexer-linux-x86_64.tar.gz
RUST_LOG=info ./ckb-indexer -s ./indexer-data
```

<br/>

Vérifier que le noeud est bien synchronisé en comparant les blocks avec les derniers trouvés dans l'explorer https://explorer.nervos.org/aggron/

<br/>

Le noeud et l'indexeur seront accessibles aux adresses suivantes:

- CKB Node RPC URL: http://localhost:8114

- CKB Indexer RPC URL: http://localhost:8116

