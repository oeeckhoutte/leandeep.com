# Faire tourner un noeud Binance Smart Chain

- Canonical URL: https://leandeep.com/faire-tourner-un-noeud-binance-smart-chain/
- Author: Olivier Eeckhoutte
- Published: 2021-04-24T21:25:00Z
- Updated: 2021-04-24T21:25:00Z
- Language: fr
- Tags: BSC, Binance Smart Chain, Node Hosting, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Ce court article décrit comment faire tourner un noeud BSC (Binance Smart Chain) sur une machine Linux

<br/>

## Mainnet

```
mkdir ~/bsc && cd $_
wget https://github.com/binance-chain/bsc/releases/download/v1.0.7/geth_linux
wget $(curl -s https://api.github.com/repos/binance-chain/bsc/releases/latest |grep browser_ |grep mainnet |cut -d\" -f4)
mv ./geth_linux ./geth_bsc

# Note: you can eventually move the binary to /usr/bin/ 

sudo chmod +x ./geth_bsc
./geth_bsc --datadir node init genesis.json

# Start the full Node
./geth_bsc --config ./config.toml --datadir ./node --pprofaddr 0.0.0.0 --metrics --pprof --verbosity 6 --nousb --cache=8192

# Dans un autre terminal
cd ~/bsc/node
tail -f ./bsc.log
```

<br/>

> **August 2021 Update**<br/><br/>
> BREAKING CHANGE: Non-EIP155 transactions (i.e. transactions which are not replay-protected) are now rejected by the RPC API. You can disable this restriction using the --rpc.allow-unprotected-txs command-line flag.<br/><br/>
> `./geth_linux --config ./config.toml --datadir ./node  --cache 18000 --rpc.allow-unprotected-txs --txlookuplimit 0`
<br/><br/>
> Ou dans mon cas:<br/>
> `./geth_linux --config ./config.toml --datadir ./node  --cache 18000 --rpc.allow-unprotected-txs --http.api 8545 --http.addr 0.0.0.0 --http --ws --metrics --ws.addr 0.0.0.0 --verbosity 6  --txlookuplimit 0`
<br/><br/>
> *I use geth-linux version 1.1.1*


> **May 2022 Update**<br/><br/>
> Mise à jour de la procédure d'installation:
> ```
> wget https://github.com/binance-chain/bsc/releases/download/v1.1.10/geth_linux
> mv ./geth_linux ./geth_bsc
> sudo chmod +x ./geth_bsc
> wget $(https://api.github.com/repositories/265775217/releases/latest |grep browser_ |grep mainnet |cut -d\" -f4)
> unzip mainnet.zip
> ./geth_bsc --datadir node init genesis.json
> ./geth_bsc --config ./config.toml --datadir ./node --diffsync --cache 8000 --rpc.allow-unprotected-txs --txlookuplimit 0
> ```
> Pour voir les logs dans un autre terminal:
> ```
> cd ~/bsc/node
> tail -f ./bsc.log
> ```


## Troubleshooting

* `web3.exceptions.ExtraDataLengthError: The field extraData is 517 bytes, but should be 32.`: Web3 essaye de se connecter à une "POA chain". 
<br/>
<br/>
**Workaround:**
  ```
  from web3.middleware import geth_poa_middleware
  w3.middleware_onion.inject(geth_poa_middleware, layer=0)
  ```

<br/>

* `web3.exceptions.BadFunctionCallOutput: Could not transact with/call contract function, is contract deployed correctly and chain synced?`: utiliser `transact()` à la place de `call()`
