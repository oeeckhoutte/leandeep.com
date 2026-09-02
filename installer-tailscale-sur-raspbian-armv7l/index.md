# Installer tailscale sur raspbian armv7l

- Canonical URL: https://leandeep.com/installer-tailscale-sur-raspbian-armv7l/
- Author: Olivier Eeckhoutte
- Published: 2026-05-20T21:15:00Z
- Updated: 2026-05-20T21:15:00Z
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir comment installer Tailscale sur un Raspberry pi qui tourne sous Raspbian Bullseye (version 32 bits armv7l) afin qu'il serve d'exit node et permette d'accéder aux appareils de votre réseau local.

<br/>

## Installation

```
sudo apt update && sudo apt upgrade -y

curl -fsSL https://pkgs.tailscale.com/stable/raspbian/bullseye.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg > /dev/null

curl -fsSL https://pkgs.tailscale.com/stable/raspbian/bullseye.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list

sudo apt update
sudo apt install tailscale
```

<br/>

Editer le fichier `/etc/sysctl.d/99-tailscale.conf` et ajouter le contenu:

```
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

<br/>


## Démarrer Tailscale

```
sudo sysctl --system
sudo tailscale up --accept-dns=false --advertise-exit-node --advertise-routes=192.168.1.0/24
tailscale ip -4
sudo reboot
```

<br/>

## Configurer le service

```
sudo systemctl status tailscaled
sudo systemctl stop tailscaled
sudo systemctl edit tailscaled
```

Ajouter:

```
[Service]
Environment="TS_EXPERIMENTAL_VERSIONED_CONFIG_DIR=/etc/tailscale"
```

Puis créer `sudo mkdir /etc/tailscale/ &&` et ajouter le contenu suivant dans le fichier `/etc/tailscale/tailscaled.conf`:

```
address: 192.168.1.0/24
exit-node: true
dns: false
```

<br/>

## Vérification après reboot

```
# Vérifier que Tailscale est connecté
tailscale status

# Vérifier les routes activées
tailscale status | grep -i route

# Vérifier l'exit node
tailscale up --help | grep advertise
```
