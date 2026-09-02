# Near Protocol full RPC Node behind CGNAT

- Canonical URL: https://leandeep.com/near-protocol-full-rpc-node-behind-cgnat/
- Author: Olivier Eeckhoutte
- Published: 2026-01-01T23:19:00+02:00
- Updated: 2026-01-01T23:19:00+02:00
- Language: fr
- Tags: Blockchain, Near
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In the previous article we saw how to setup a Near protocol full RPC node. The node will sync only if you are not behind a firewall or behind a network like a CGNAT (the UDP P2P port has to be exposed). In this article we are going to see how to have Near protocol node synchronized behind Starlink (I.E. behind a CGNAT).

We are going to use a tiny VPS that will act as proxy UDP proxy (or P2P tunnel).

```
Local Node (Starlink)
        ^
        |  UDP P2P to VPS
        |
VPS Relay (1 Go RAM, Public IP)
        ^
        |  UDP P2P to Mainnet NEAR nodes
        |
     NEAR Mainnet
```

<br/>

## VPS setup

The VPS listen to 24567 and redirect to the local node via a SSH reverse tunnel and tailscale

```
curl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up --auth-key=tskey-auth-...-... --advertise-exit-node
tailscale status
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-tailscale.conf
curl -4 icanhazip.com # Get vps public IP to verify later the local server has the same one.

sudo apt update && sudo apt install socat -y
sudo socat UDP4-LISTEN:24567,fork UDP4:PRIVATE_TAILSCALE_IP_OF_LOCAL_NEAR_NODE:24567
```

<br/>

## Local Node

**Setup tailscale**

```
curl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up --auth-key=tskey-auth-...-...
curl -4 icanhazip.com
tailscale status
sudo tailscale up \ --exit-node=TAILSCALE_PRIVATE_IP_OF_VPS --exit-node-allow-lan-access=true
curl -4 icanhazip.com
```

<br/>

**Retrieve peer address to setup boot nodes**
```
curl -s -X POST https://rpc.mainnet.near.org -H "Content-Type: application/json" -d '{ "jsonrpc": "2.0", "method": "network_info", "params": [], "id": "dontcare"}' | jq -r '.result.active_peers[] | "\(.id)@\(.addr)"'
```

<br/>


**Boot node config**

Edit `vim ~/.near/config.json` and change:

```
"boot_nodes": [
  "v2.near.org:24567"   // Previously retrieved peer id
]
```

<br/>

**Run Near**

```
neard run
```

<br/>

**Verify sync**

```
curl -s http://127.0.0.1:3030/status | jq

#"sync_info": {
#  "syncing": false
#}
# -> Sync is over

# Compare with public node
curl -s https://rpc.mainnet.near.org/status | jq '.sync_info.latest_block_height' && curl -s http://127.0.0.1:3030/status | jq '.sync_info.latest_block_height'
```
