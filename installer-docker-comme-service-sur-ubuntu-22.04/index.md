# Installer Docker comme service sur Ubuntu 22.04

- Canonical URL: https://leandeep.com/installer-docker-comme-service-sur-ubuntu-22.04/
- Author: Olivier Eeckhoutte
- Published: 2025-09-01T13:34:00Z
- Updated: 2025-09-01T13:34:00Z
- Language: fr
- Tags: Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici une procédure simple pour installer et activer le service Docker sur Ubuntu 22.04.

## Installation

**On met à jour l'OS**
```
sudo apt update -y && sudo apt upgrade -y
```

<br/>


**On désinstalle les anciennes versions de Docker installées:**
```
sudo apt remove docker docker-engine docker.io containerd runc
```

<br/>

**On ajoute le repo apt:**

```
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

<br/>

**Installation de Docker:**

```
sudo apt update -y
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

<br/>

**Pour vérifier que cela fonctionne:**
```
sudo docker run hello-world
sudo systemctl is-active docker
```

<br/>

**Pour démarrer docker sans sudo:**
```
sudo usermod -aG docker $USER
newgrp docker
```

<br/>

**On vérifie:**

```
docker run hello-world
```

