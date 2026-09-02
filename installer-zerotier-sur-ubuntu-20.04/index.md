# Installer ZeroTier sur Ubuntu 20.04

- Canonical URL: https://leandeep.com/installer-zerotier-sur-ubuntu-20.04/
- Author: Olivier Eeckhoutte
- Published: 2022-07-12T20:25:00Z
- Updated: 2022-07-12T20:25:00Z
- Language: fr
- Tags: Networking
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Installation

```
curl -s https://install.zerotier.com | sudo bash
curl -s 'https://raw.githubusercontent.com/zerotier/ZeroTierOne/master/doc/contact%40zerotier.com.gpg' | gpg --import && \
if z=$(curl -s 'https://install.zerotier.com/' | gpg); then echo "$z" | sudo bash; fi
sudo apt update
sudo apt install -y zerotier-one
```

<br/>

## Configuration

Récupérer votre `network_id` sur https://my.zerotier.com/ puis connecter votre serveur à votre réseau.

```
sudo zerotier-cli join <network_id>
```

Retourner sur https://my.zerotier.com/ pour autoriser le nouveau noeud ajouté à accéder à votre réseau.

<br/>

Editer `/etc/ssh/sshd_config` et remplacer `ListenAddress 0.0.0.0` par `ListenAddress IP_DE_VOTRE_RANGE` pour sécuriser davantage votre serveur SSH.

<br/>

## Vérification

```
sudo zerotier-cli status
```

<br/>

## Stopper le service

```
systemctl status zerotier-one
systemctl stop zerotier-one
sudo systemctl disable zerotier-one
```
