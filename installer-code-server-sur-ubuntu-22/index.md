# Installer code server sur Ubuntu 22

- Canonical URL: https://leandeep.com/installer-code-server-sur-ubuntu-22/
- Author: Olivier Eeckhoutte
- Published: 2025-03-28T10:49:00+02:00
- Updated: 2025-03-28T10:49:00+02:00
- Language: fr
- Tags: VSCode, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article très court, nous allons voir comment installer code-server sur Linux. Code-server est un vscode en remote.

<br/>

## Installation

Rendez-vous sur https://github.com/coder/code-server/releases pour sélectionner la version que vous souhaitez installer.

```
export VERSION=4.102.1
# Sur Fedora
curl -fOL https://github.com/coder/code-server/releases/download/v$VERSION/code-server-$VERSION-amd64.rpm
sudo rpm -i code-server-$VERSION-amd64.rpm
# Sur Ubuntu 22
wget https://github.com/coder/code-server/releases/download/v4.102.1/code-server_4.102.1_amd64.deb
sudo dpkg -i code-server_4.102.1_amd64.deb
sudo systemctl enable --now code-server@$USER
```


<br/>

## Configuration

Editer le fichier de config `~/.config/code-server/config.yaml` pour activer l'utilisation d'un certificat HTTPS (même en local) et récupérez le mot de passe d'accès à votre instance code-server.

Un fois la config modifiée, redémarrer le service avec la commande: `sudo systemctl restart code-server@$USER`


<br/>

That's all!

Rendez-vous sur https://SERVER_IP:8080 (`8080` est le port par défaut)


