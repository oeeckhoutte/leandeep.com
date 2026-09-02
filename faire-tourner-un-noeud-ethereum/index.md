# Faire tourner un noeud Ethereum

- Canonical URL: https://leandeep.com/faire-tourner-un-noeud-ethereum/
- Author: Olivier Eeckhoutte
- Published: 2020-12-16T21:25:00Z
- Updated: 2020-12-16T21:25:00Z
- Language: fr
- Tags: Docker, Ethereum, Node Hosting, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Ce court article décrit comment faire tourner un noeud Ethereum sur n'importe quel OS.

<br/>

## Noeud sur Rinkeby

**With Docker**
```
docker pull ethereum/client-go:latest
mkdir ~/.geth-rinkeby
docker run --name eth -p 8546:8546 -v ~/.geth-rinkeby:/geth -it \
           ethereum/client-go --rinkeby --ws --ipcdisable \
           --wsaddr 0.0.0.0 --wsorigins="*" --datadir /geth
```

Pour détacher le running container, sans le stopper, vous pouvez utiliser les commandes suivantes: `Ctrl + P, Ctrl + Q`

> Si le container est stoppé, vous pouvez le relancer avec la commande suivante: `docker start -i eth`

<br/>

Si vous avez un résultat similaire à ceci dans le terminal, vous êtes tout bon:

```
INFO [12-16|21:24:32.532] Block synchronisation started
INFO [12-16|21:24:32.589] Looking for peers                        peercount=1 tried=61 static=0
INFO [12-16|21:24:36.260] Imported new block headers               count=192 elapsed=52.722ms  number=192 hash="8c570c…ba360c" age=3y8mo3w
INFO [12-16|21:24:36.262] Downloader queue stats                   receiptTasks=0 blockTasks=0 itemSize=639.74B throttle=8192
INFO [12-16|21:24:36.262] Migrated ancient blocks                  count=1   elapsed="111.458µs"
INFO [12-16|21:24:36.283] Imported new block receipts              count=54  elapsed=20.916ms    number=54  hash="dafe6e…02bf13" age=3y8mo3w size=34.33KiB
INFO [12-16|21:24:36.684] Imported new state entries               count=222 elapsed="4.869µs"   processed=222 pending=3553 trieretry=0 coderetry=0 duplicate=0 unexpected=0
INFO [12-16|21:24:36.694] Imported new block receipts              count=138 elapsed=40.089ms    number=192 hash="8c570c…ba360c" age=3y8mo3w size=86.38KiB
INFO [12-16|21:24:36.725] Imported new block headers               count=192 elapsed=77.269ms    number=384 hash="6d95fa…a59e49" age=3y8mo3w
```

<br/>

**Without Docker**

```
# Install Geth
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum

# Verify Geth version
geth version-check

# Upgrade Geth
sudo apt-get upgrade geth
```
```
mkdir ~/.rinkeby-ethereum
geth --rinkeby --datadir ~/.rinkeby-ethereum  --syncmode "fast" --graphql --cache=2048 --maxpeers=128 --metrics --rpc --rpcapi "eth,net,web3,personal,web3" --rpcaddr "0.0.0.0" --rpcport 9545 --ws --ws.addr "0.0.0.0" --ws.port 9546
```

<br/>

**Run 2 nodes Rinkeby on the same machine**

```
mkdir ~/.rinkeby-ethereum-docker-ethereum-one
docker run --name ethereum-one-rinkeby \
           -p 8545:8545 -p 8546:8546 -p 30303:30303 \
           -v ~/.rinkeby-ethereum-docker-ethereum-one:/geth \
           ethereum/client-go --rinkeby --datadir /geth --graphql  --rpcapi "eth,net,web3,personal,web3" --rpcaddr "0.0.0.0" --ws --ws.addr "0.0.0.0" --syncmode "fast" 


mkdir ~/.rinkeby-ethereum-docker-ethereum-two
docker run --name ethereum-two-rinkeby \
           -p 9545:8545 -p 9546:8546 -p 30304:30303 \
           -v ~/.rinkeby-ethereum-docker-ethereum-two:/geth \
           ethereum/client-go --rinkeby --datadir /geth --graphql  --rpcapi "eth,net,web3,personal,web3" --rpcaddr "0.0.0.0" --ws --ws.addr "0.0.0.0" --syncmode "fast" 
```

<br/>

## Mainnet

**With Docker**

```
docker pull ethereum/client-go:latest
mkdir ~/.geth
docker run --name eth -p 8546:8546 -v ~/.geth:/geth -it \
           ethereum/client-go --syncmode fast --ws --ipcdisable \
           --wsaddr 0.0.0.0 --wsorigins="*" --datadir /geth
```

<br/>

> Dev purpose below. Attention `--rpcaddr "0.0.0.0"` n'est pas secure dans une environnement live

```
mkdir -p ~/ethereum/data
cd ~/ethereum
sudo docker run --name geth -itd -p 8546:8546 -p 8545:8545 -p 30303:30303 -v data:/root/.ethereum ethereum/client-go:latest --rpc --rpcaddr "0.0.0.0"
sudo docker update --restart unless-stopped geth
sudo docker logs -f geth
```

<br/>

* 8545 TCP: HTTP JSON RPC API
* 8546 TCP: WebSocket JSON RPC API
* 30303 TCP et UDP: P2P protocol running the network
* 30304 UDP: P2P protocol's new peer discovery overlay


<br/>
<br/>

**Without Docker**

```
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

```
geth --syncmode "fast"
# Pour un récupérer un testnet
# geth --ropsten --syncmode "fast" 

geth --syncmode "fast" --graphql --cache=2048 --maxpeers=128 --metrics --rpc --rpcapi "eth,net,web3,personal,web3" --rpcaddr "0.0.0.0" --rpcport 8545 --ws --ws.addr "0.0.0.0" --ws.port 8546

# --rpcvhosts "geth.domain.com"

```

<br/>

"Full" Sync: Récupère les block headers, les block bodies et valide chaque élément depuis le block genesis.

Fast Sync: Récupère les block headers, les block bodies, et ne process que les transactions à partir du block actuel - 64. Ensuite il récupère un snapshot state et réalise une sorte synchronization  full.

Light Sync: Ne récupère que le current state. Pour vérifier les éléments, il a besoin de demander aux full (archive) nodes les 3 feuilles correspondantes.

> Dans les dernières version de Geth `- 64` est paramétrable avec le paramètre `fsMinFullBlocks`.

<br/>

**Vérifier l'état de synchronisation**

```
geth attach
eth.syncing
eth.blockNumber
```

<br/>

**Se connecter à son noeud local via Javascript**

```
# Installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
echo "export NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist" >> ~/.bashrc
source ~/.bashrc
nvm ls-remote

# Installer NodeJS
nvm install v12.22.0
nvm use v12.22.0
nvm use default v12.22.0

# Installer Web3
npm install web3 --save
```

<br/>

Créer un fichier `test.js` et ajouter le contenu suivant:

```
const Web3 = require("web3")
//const web3 = new Web3("https://cloudflare-eth.com")
const web3 = new Web3("http://localhost:8545")

/*
web3.eth.isSyncing((error, sync) => {
  if (!error && sync) {
    console.log(sync.currentBlock);
    console.log(sync.highestBlock);
  }
});
*/

async function getBlockNumber() {
  const latestBlockNumber = await web3.eth.getBlockNumber()
  console.log(latestBlockNumber)
  return latestBlockNumber
}
getBlockNumber()

```

Exécuter la commande suivante `node test.js`


<br/>

**Lire les informations d'un Smart Contract (CALL)**

Ajouter le code suivant avant de relancer la commande `node test.js`:

```
const ERC20TransferABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f"
const daiToken = new web3.eth.Contract(ERC20TransferABI, DAI_ADDRESS)
const senderAddress = "0x8bfb847d85b7bde4596888ae08fa7863752ffcf6"
daiToken.methods.balanceOf(senderAddress).call(function (err, res) {
  if (err) {
    console.log("An error occured", err)
    return
  }
  console.log("The balance is: ", res)
})
```

<br/>

Output:

12154947
The balance is:  12558880673328618209762

Adresse prise au hasard sur Etherscan.
Cela correspond à environ 12,558.880673328618209762 DAI

<br/> 


**La même chose en Python**

```
sudo apt-get install python3-dev
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3 1
curl https://bootstrap.pypa.io/pip/2.7/get-pip.py --output get-pip.py
sudo python get-pip.py
sudo apt install ipython3
pip install web3
pip install 'web3[tester]'
python -m ipython
In [1]: from web3 import Web3
In [2]: Web3.toWei(1, 'ether')
Out[2]: 1000000000000000000
In [3]: Web3.fromWei(500000000, 'gwei')
Out[3]: Decimal('0.5')
#In [4]: w3 = Web3(Web3.EthereumTesterProvider())
In [4]: w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
In [5]: w3.isConnected()
Out[5]: True
In [6]: w3.eth.getBlock('latest')
Out[6]:
AttributeDict({'difficulty': 17179869184,
 'extraData': HexBytes('0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa'),
 'gasLimit': 5000,
 'gasUsed': 0,
 'hash': HexBytes('0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
 'logsBloom': HexBytes('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'),
 'miner': '0x0000000000000000000000000000000000000000',
 'mixHash': HexBytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
 'nonce': HexBytes('0x0000000000000042'),
 'number': 0,
 'parentHash': HexBytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
 'receiptsRoot': HexBytes('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'),
 'sha3Uncles': HexBytes('0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'),
 'size': 540,
 'stateRoot': HexBytes('0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544'),
 'timestamp': 0,
 'totalDifficulty': 17179869184,
 'transactions': [],
 'transactionsRoot': HexBytes('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'),
 'uncles': []})
In [7]: w3.eth.get_block(12345)
Out[7]:
AttributeDict({'difficulty': 735512610763,
 'extraData': HexBytes('0x476574682f76312e302e302f6c696e75782f676f312e342e32'),
 'gasLimit': 5000,
 'gasUsed': 0,
 'hash': HexBytes('0x767c2bfb3bdee3f78676c1285cd757bcd5d8c272cef2eb30d9733800a78c0b6d'),
 'logsBloom': HexBytes('0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'),
 'miner': '0xad5C1768e5974C231b2148169da064e61910f31a',
 'mixHash': HexBytes('0x31d9ec7e3855aeba37fd92aa1639845e70b360a60f77f12eff530429ef8cfcba'),
 'nonce': HexBytes('0x549f882c5f356f85'),
 'number': 12345,
 'parentHash': HexBytes('0x4b3c1d7e65a507b62734feca1ee9f27a5379e318bd52ae62de7ba67dbeac66a3'),
 'receiptsRoot': HexBytes('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'),
 'sha3Uncles': HexBytes('0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'),
 'size': 539,
 'stateRoot': HexBytes('0xca495e22ed6b88c61714d129dbc8c94f5bf966ac581c09a57c0a72d0e55e7286'),
 'timestamp': 1438367030,
 'totalDifficulty': 3862140487204603,
 'transactions': [],
 'transactionsRoot': HexBytes('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'),
 'uncles': []})
In [8]: w3.eth.get_balance('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
Out [8]: 0
```

<br/>

Voilà, nous avons vu comment démarrer un noeud Ethereum sur différents réseaux et comment nous y connecter via du code JS ou du code Python. Nous verrons dans un prochain article comment suivre les changements dans des Smart Contracts avec des WebSockets.

<br/>

## Monitoring

Je vous recommande d'installer une solution de monitoring comme Grafana InfluxDB pour monitorer et avoir de l'alerting sur votre noeud.

![image](/images/ethereum-node-monitoring.png)

Il faudra alors démarrer Geth avec les flags suivants: `--metrics --metrics.influxdb --metrics.influxdb.endpoint "http://0.0.0.0:8086" --metrics.influxdb.username "" --metrics.influxdb.password ""`


<br/>

## Troubleshooting

`Checkpoint challenge timed out, dropping`: Start a timer to disconnect if the peer doesn't reply in time (cf. https://github.com/ethereum/go-ethereum/blob/master/eth/handler.go)

`snapshot extension registration failed geth`: Geth client is probably outdated

`Imported new chain segment`: means geth has downloaded some amount of blocks to be added to the chain. **Look at `age` key to figure out the remaining quantity of blocks to download**

`Invalid merkle root`: Geth is certainly outdated. Just upgrade it (worked for me for 1.10.7 -> 1.10.8)
