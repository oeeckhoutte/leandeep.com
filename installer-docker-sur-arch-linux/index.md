# Installer Docker sur Arch Linux

- Canonical URL: https://leandeep.com/installer-docker-sur-arch-linux/
- Author: Olivier Eeckhoutte
- Published: 2022-02-13T20:49:00+02:00
- Updated: 2022-02-13T20:49:00+02:00
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petit tip de 10 secondes décrivant comment installer Docker sur Arch Linux.

## Installation
```
sudo pacman -S docker	
sudo groupadd docker
sudo usermod -aG docker $USER
sudo chmod 666 /var/run/docker.sock
sudo systemctl enable docker.service
sudo systemctl start docker.service
```
<br/>

## Vérification

```
docker run hello-world
```
