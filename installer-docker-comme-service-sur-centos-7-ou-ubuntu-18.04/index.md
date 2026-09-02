# Installer Docker comme service sur Centos 7 ou Ubuntu 18.04

- Canonical URL: https://leandeep.com/installer-docker-comme-service-sur-centos-7-ou-ubuntu-18.04/
- Author: Olivier Eeckhoutte
- Published: 2019-08-31T12:34:00Z
- Updated: 2019-08-31T12:34:00Z
- Language: fr
- Tags: Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici une procédure simple pour installer et activer le service Docker sur Centos 7 ou Ubuntu 18.04.


## Installation 

**Centos 7**

Commencer par installer les pré-requis:

```
yum install -y yum-utils device-mapper-persistent-data lvm2
```

Ajouter ensuite le repository Docker à yum:

```
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

Installer Docker:

```
yum install -y docker-ce docker-ce-cli containerd.io
```

Démarrer le service Docker
```
systemctl start docker
```

Activer le service au démarrage du système:
```
systemctl enable docker
```

<br/>

**Ubuntu 18.04**

```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
sudo apt update
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
```

<br/>

## Configuration des droits

Pour éviter de devoir toujours ajouter `sudo` devant vos commandes `docker` on peut changer les droits et ajouter votre utilisateur linux au groupe docker.
```
sudo usermod -aG docker $USER
```

Rechargez votre terminal pour que les droits soient pris en compte.

> Si vous rencontrez ce problème `dial unix /var/run/docker.sock: connect: permission denied`, vous avez un problème de droit sur la socket docker.

> Voici le fix: ``` sudo chown root:docker /var/run/docker.sock ```

<br/>

## Installation de docker-compose

Télécharger le binaire et le placer dans `/usr/local/bin`:
```
curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

On donne les droits d'exécution:
```
  chmod +x /usr/local/bin/docker-compose
```

Vérification du bon fonctionnement:
```
docker-compose --version
```

