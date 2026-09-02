# Installer Docker sur Ubuntu 26

- Canonical URL: https://leandeep.com/installer-docker-sur-ubuntu-26/
- Author: Olivier Eeckhoutte
- Published: 2026-08-05T07:00:00+02:00
- Updated: 2026-08-05T07:00:00+02:00
- Language: fr
- Tags: Docker, Ubuntu, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Effacer l'installation précédente

**Désinstaller les packages précédemment installés**
```
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc;
  do sudo apt-get remove -y $pkg
done
```

<br/>

```
rm -rf /var/lib/docker && rm -rf /var/lib/containerd
```

<br/>

## Ajouter la clé Docker GPG

```
apt-get install -y ca-certificates curl gnupg lsb-release

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
```

<br/>

## Ajouter le dépot officiel Docker
```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

<br/>

## Installer Docker

```
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

<br/>

## Activer Docker
```
systemctl enable docker
systemctl start docker
systemctl status docker
```

<br/>

## Vérification 

```
docker ps
docker compose ps
```

<br/>

## Utiliser Docker sans sudo

```
sudo usermod -aG docker $USER
newgrp docker
```
