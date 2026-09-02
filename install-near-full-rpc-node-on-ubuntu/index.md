# Install Near full RPC node on Ubuntu

- Canonical URL: https://leandeep.com/install-near-full-rpc-node-on-ubuntu/
- Author: Olivier Eeckhoutte
- Published: 2026-01-01T21:00:00+02:00
- Updated: 2026-01-01T21:00:00+02:00
- Language: fr
- Tags: Blockchain, Near
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In the article we are going to see how to setup a full RPC node for Near blockchain

<br/>

## Setup

```
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip clang cmake make pkg-config libssl-dev llvm jq
sudo reboot
```

<br/>

**Configure system limits**

```
echo "fs.file-max=1000000" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
ulimit -n 1000000
```

<br/>

**Install Rust**

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustup update stable
```

<br/>

**Download NEAR Core**

```
git clone https://github.com/near/nearcore.git
cd nearcore
git checkout 2.10.3
```

<br/>

**Compile**

```
# Option 1
# cargo build -p neard --release
make release

# check 
$ ./target/release/neard run
$ (In another tab) sudo ss -lun | grep 24567
> Expected:
> udp   UNCONN  0  0  0.0.0.0:24567   0.0.0.0:*
> Or expected:
> udp   UNCONN  0  0  [::]:24567      [::]:*

If it's empty it is an issue with Near itself not a network misconfiguration
$ ctrl-c

sudo cp target/release/neard /usr/local/bin/

# Option 2
cd ~
rm -rf nearcore
wget https://github.com/near/nearcore/releases/latest/download/neard-linux-x86_64.tar.gz
tar -xvf neard-linux-x86_64.tar.gz
sudo mv neard /usr/local/bin/
neard --version
```

<br/>

**Init node**

```
mkdir -p ~/.near
# Mainnet init
neard init --chain-id mainnet --download-genesis --download-config

# It will create both files:
# ~/.near/config.json
# ~/.near/genesis.json
```

<br/>

**Configure the Node in full RPC node**

```
vim ~/.near/config.json

-> Activate public RPC
"rpc": {
  "addr": "0.0.0.0:3030",
  "cors_allowed_origins": ["*"]
}
```

<br/>

**Configure kernel network parameters**

```
cd nearcore
chmod +x scripts/set_kernel_params.sh
sudo scripts/set_kernel_params.sh
```

<br/>


**Start the node**

```
neard run
```

<br/>


**Check logs**

```
tail -f ~/.near/logs/neard.log
```

<br/>


**Check node**

```
curl http://127.0.0.1:3030/status

# expected response:
{
  "chain_id": "mainnet",
  "sync_info": {
    "syncing": false
  }
}
```

<br/>


## Create a service


sudo vim /etc/systemd/system/neard.service

```
[Unit]
Description=NEAR RPC Node
After=network.target

[Service]
User=ubuntu
ExecStart=/usr/local/bin/neard run
Restart=always
LimitNOFILE=1000000

[Install]
WantedBy=multi-user.target
```

<br/>


```
sudo systemctl daemon-reload
sudo systemctl enable neard
sudo systemctl start neard
```

<br/>


**Useful RPC Endpoints**

-> Health: http://localhost:3030/status

-> JSON-RPC: http://localhost:3030


<br/>

Exemple:

```
curl -X POST http://localhost:3030 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"block","params":{"finality":"final"}}'
```
