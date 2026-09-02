# Installer Docker et mitmproxy sur Ubuntu 22.04

- Canonical URL: https://leandeep.com/installer-docker-et-mitmproxy-sur-ubuntu-22.04/
- Author: Olivier Eeckhoutte
- Published: 2022-08-01T20:59:00Z
- Updated: 2022-08-01T20:59:00Z
- Language: fr
- Tags: Docker, Ubuntu, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Tips très très rapide montrant comment installer Docker et Mitmproxy sur Ubuntu 22.04.

<br/>

## Installation de Docker sur Ubuntu 22.04

```
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null


sudo apt-get update
sudo apt install docker-ce docker-ce-cli containerd.io -y
sudo usermod -aG docker $USER
newgrp docker
```

<br/>

## Vérification de l'installation de Docker

```
docker version
```

<br/>

## Démarrage du proxy mitm sur VM distante

```
tmux
docker run --rm -it -v ~/.mitmproxy:/home/mitmproxy/.mitmproxy -p 8080:8080 mitmproxy/mitmproxy
# ou mieux, binding sur machine locale:
docker run --rm -it -v ~/.mitmproxy:/home/mitmproxy/.mitmproxy -p 127.0.0.1:8080:8080 mitmproxy/mitmproxy
```

<br/>

## Vérification du bon fonctionnement de votre proxy sur VM distante

```
https_proxy=http://localhost:8080/ curl http://example.com/
https_proxy=http://localhost:8080/ curl -k https://example.com/
```


<br/>

## Vérification depuis un autre host du bon fonctionnement du proxy

```
https_proxy=http://PUBLIC_IP:8080/ curl -k https://example.com/
```
