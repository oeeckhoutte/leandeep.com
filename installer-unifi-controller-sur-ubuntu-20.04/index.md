# Installer Unifi Controller sur Ubuntu 20.04

- Canonical URL: https://leandeep.com/installer-unifi-controller-sur-ubuntu-20.04/
- Author: Olivier Eeckhoutte
- Published: 2021-10-30T17:53:00Z
- Updated: 2021-10-30T17:53:00Z
- Language: fr
- Tags: Unifi, Ubiquiti
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir comment installer Unifi Controller sur Ubuntu 20.04. Cet utilitaire est nécessaire si vous avez un routeur Unifi et que vous souhaitez mettre en place plusieurs SSIDs et plusieurs VLANs.


> Attention l'installation de cet utilitaire va aussi installer un serveur MongoDB qui écoutera sur le port 27017

<br/>

## Installation

Ajouter le repo Ubiquiti et ajouter la clé GPG permettant de truster ce dernier.

```
echo 'deb https://www.ui.com/downloads/unifi/debian stable ubiquiti' | sudo tee /etc/apt/sources.list.d/100-ubnt-unifi.list
sudo wget -O /etc/apt/trusted.gpg.d/unifi-repo.gpg https://dl.ui.com/unifi/unifi-repo.gpg 
```

<br/>

Installer unifi controller et ses dépendences.
```
sudo apt update && sudo apt install ca-certificates openjdk-8-jdk apt-transport-https unifi -y
```

<br/>

Vérifier que le service a bien démarré:
```
systemctl status unifi.service
```

<br/>

Le GUI de Unifi controller est accessible à l'adresse suivante: https://VOTRE_IP:8443


> Pour connecter votre routeur Unifi (dans mon cas U6-lite) à Unifi controller, il ne doit pas avoir été précédemment associé ou être en mode standalone.

![image](/images/unifi-controller.png)


<br/>

## Désinstallation

```
sudo apt purge unifi -y
sudo service mongod stop
sudo apt purge mongodb-org*
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongodb
sudo rm /etc/apt/sources.list.d/mongod*.list
sudo apt purge oracle-java* -y
sudo apt autoremove
sudo apt clean
```
