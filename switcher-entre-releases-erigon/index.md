# Switcher entre releases Erigon

- Canonical URL: https://leandeep.com/switcher-entre-releases-erigon/
- Author: Olivier Eeckhoutte
- Published: 2023-02-18T07:49:00+02:00
- Updated: 2023-02-18T07:49:00+02:00
- Language: fr
- Tags: Blockchain, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


J'ai déjà écrit plusieurs articles très similaires sur le sujet. Cette procédure décrit comment rapidement switcher de release Erigon pour tester une nouvelle feature ou vérifier qu'un fix fonctionne bien. En gros, cela me permet de switcher de release en release avec Erigon. 

Voir l'article suivant pour [une full installation](https://leandeep.com/erigon-full-node-sur-debian-11/).

Bien sûr commencer par un backup. Voir [cet article](https://leandeep.com/backuper-la-db-derigon-sur-debian-11/)

<br/>

## Erigon build

```
mkdir /root/erigon_release_2_38_1/
cd /root/erigon_release_2_38_1/
git clone https://github.com/ledgerwatch/erigon.git
cd erigon
git checkout 52fd6d60e180a267e99a25662f169797570e356e
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
WorkingDirectory=/root/erigon_release_2_38_1/erigon/
ExecStart=/root/erigon_release_2_38_1/erigon/build/bin/erigon --datadir=/erigon --private.api.addr=localhost:9090 --prune=hrtc --prune.h.older=90000 --prune.r.older=90000 --prune.t.older=90000 --prune.c.older=90000 --metrics --metrics.addr=localhost --metrics.port=6060 --http=false --authrpc.jwtsecret /root/ethereum/consensus/prysm/jwt.hex
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

<br/>

**Création du second service**

`vim /etc/systemd/system/erigon-rpc.service`

```
[Unit]
Description=Erigon RPC Daemon

[Service]

WorkingDirectory=/root/erigon_release_2_38_1/erigon/
ExecStart=/root/erigon_release_2_38_1/erigon/build/bin/rpcdaemon --datadir=/erigon --private.api.addr=localhost:9090 --http.vhosts '*' --http.port 8545 --http.addr 0.0.0.0 --http.corsdomain '*' --http.api=eth,erigon,web3,net,debug,trace
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
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc": "2.0", "method":
"eth_blockNumber", "params": [], "id":1}' localhost:8545 | jq -r ".result" | awk '{ printf "%d\n", $1 }'
```
