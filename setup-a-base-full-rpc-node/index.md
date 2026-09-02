# Setup a Base full RPC Node

- Canonical URL: https://leandeep.com/setup-a-base-full-rpc-node/
- Author: Olivier Eeckhoutte
- Published: 2026-01-01T23:59:00+02:00
- Updated: 2026-01-01T23:59:00+02:00
- Language: fr
- Tags: Blockchain, Base, Ethereum
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In the article we are going to see how to setup a Base full RPC node.

<br/>

## Setup Base

**Clone project**
```
git clone https://github.com/base-org/node.git base-node
cd base-node
```

<br/>

**Configure node**

```
cp .env.mainnet .env
```

Edit the config `vim .env`:
```
OP_NODE_L1_ETH_RPC=http://eth-l1:8545
OP_NODE_L1_BEACON=http://eth-l1-beacon:5052
OP_NODE_SEQUENCER_ENABLED=false
OP_NODE_P2P_STATIC=http://...
# Optionnel: RPC host/port
OP_GETH_HTTP_ADDR=0.0.0.0
OP_GETH_HTTP_PORT=8545
```

<br/>

**Run node**

```
docker-compose pull
docker-compose up -d
```

<br/>

**Verify**

```
docker-compose ps

curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"eth_blockNumber",
    "params":[]
  }'

docker-compose logs -f
```

