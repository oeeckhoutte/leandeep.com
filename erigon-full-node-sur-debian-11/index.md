# Erigon full node sur Debian 11

- Canonical URL: https://leandeep.com/erigon-full-node-sur-debian-11/
- Author: Olivier Eeckhoutte
- Published: 2023-01-27T07:49:00+02:00
- Updated: 2023-01-27T07:49:00+02:00
- Language: fr
- Tags: Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Installation des pré-requis

**Installation de go**
```
wget https://dl.google.com/go/go1.19.5.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.19.5.linux-amd64.tar.gz
```

Editer `/root/bashrc` et ajouter les commandes suivantes
```
export PATH=$PATH:/usr/local/go/bin
export GOPATH="${HOME}/.go/bin"
export PATH=$GOPATH:$PATH
```

<br/>

**Autres outils et consensus mechanism**

```
# Prevent Debian sleep or hibernation
systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target

apt vim curl install git make supervisor build-essential software-properties-common net-tools jq

mkdir -p ethereum/consensus/prysm
cd $_
curl https://raw.githubusercontent.com/prysmaticlabs/prysm/master/prysm.sh --output prysm.sh && chmod +x prysm.sh
```

Ouvrir le fichier `/root/.bashrc` et ajouter le contenu suivant:

```
export USE_PRYSM_VERSION=v3.1.1
```

Reload du bash `source ~/.bashrc`


<br/>


**Génération d'un token JWT**
```
cd ethereum/consensus/prysm/
./prysm.sh beacon-chain generate-auth-secret
```

<br/>


**Création d'un manifest pour lancer prysm**


Créer le fichier `/etc/supervisor/conf.d/prysm.conf` et ajouter le contenu suivant:
```
[program:beacon_eth]
command=/root/ethereum/consensus/prysm/prysm.sh beacon-chain --execution-endpoint=http://localhost:8551 --jwt-secret=/root/ethereum/consensus/prysm/jwt.hex --verbosity=debug
user=root
numprocs=1
autostart=true
autorestart=true
stderr_logfile=/var/log/prysm.log
```

<br/>
```
systemctl restart supervisor
supervisorctl

systemctl enable systemd-timesyncd
systemctl start systemd-timesyncd
timedatectl status
```

<br/>

## Erigon installation

```
git clone --branch stable --single-branch https://github.com/ledgerwatch/erigon.git
cd erigon
make erigon
make rpcdaemon
````

<br/>

**Création du service**

`vim /etc/systemd/system/erigon.service`

```
[Unit]
Description=Erigon Node
After=network.target network-online.target
Wants=network-online.target

[Service]
WorkingDirectory=/root/erigon/
ExecStart=/root/erigon/build/bin/erigon --datadir=/erigon --private.api.addr=localhost:9090 --prune=hrtc --prune.h.older=90000 --prune.r.older=90000 --prune.t.older=90000 --prune.c.older=90000 --metrics --metrics.addr=localhost --metrics.port=6060 --http=false --authrpc.jwtsecret /root/ethereum/consensus/prysm/jwt.hex
User=root
Restart=always
RestartSec=5s

# Output to syslog
StandardOutput=syslog
StandardError=syslog
#Change this to find app logs in /var/log/syslog
SyslogIdentifier=erigon

[Install]
WantedBy=multi-user.target
```

> Enable debug logs and format logs as JSON with flags: `--log.console.json --log.console.verbosity debug`

<br/>

**Création du second service**

`vim /etc/systemd/system/erigon-rpc.service`

```
[Unit]
Description=Erigon RPC Daemon

[Service]

WorkingDirectory=/root/erigon/
ExecStart=/root/erigon/build/bin/rpcdaemon --datadir=/erigon --private.api.addr=localhost:9090 --http.vhosts '*' --http.port 8545 --http.addr 0.0.0.0 --http.corsdomain '*' --http.api=eth,erigon,web3,net,debug,trace
User=root
Restart=always
RestartSec=5s

# Output to syslog
StandardOutput=syslog
StandardError=syslog
#Change this to find app logs in /var/log/syslog
SyslogIdentifier=erigon-rpc

[Install]
WantedBy=multi-user.target
```

<br/>

> Optional flag: `--rpc.accessList=/root/rpc-rules.json`
> with content:
> ```
> {
>   "allow": {
>      "eth_newBlockFilter",
>      ...
>   } 
> }
> ```
> Methods: [https://ethereum.github.io/execution-apis/api-documentation/](https://ethereum.github.io/execution-apis/api-documentation/)

<br/>

**On active et démarre les services**
```
systemctl daemon-reload
systemctl enable erigon
systemctl enable erigon-rpc
systemctl start erigon
systemctl start erigon-rpc
```

<br/>

## Troubleshooting

```
journalctl -f -u erigon
journalctl -f -u erigon-rpc
tail -f /var/log/prysm.log
```


<br/>

**Vérifier la synchronisation**

```
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id":1}' localhost:8545 | jq -r ".result" | awk '{ printf "%d\n", $1 }'
```
