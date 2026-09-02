# Reverse Proxy manager Nginx

- Canonical URL: https://leandeep.com/reverse-proxy-manager-nginx/
- Author: Olivier Eeckhoutte
- Published: 2020-03-16T23:49:00+02:00
- Updated: 2020-03-16T23:49:00+02:00
- Language: fr
- Tags: Nginx
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article nous allons voir comment installer le reverse proxy manager Nginx [nginxproxymanager](https://nginxproxymanager.com/). Ce manager est vraiment très bien. Il permet par exemple de facilement créer des ACLs, définir des proxy hosts, rediretions, page custom 404, d'avoir de l'audit, créer des certificats let's encrypt, activer l'HTTP/2, l'HSTS. Il est vraiment top gun ce projet. C'est un concurrent de Traefik.

<br/>

## Installation

Dans un répertoire par exemple `mkdir ~/nginxproxymanager && cd ~/nginxproxymanager`, créer les 2 dossiers suivants: `data` et `letsencrypt`

<br/>

Créer ensuite un fichier `docker-compose.yml`:

```
version: "3"
services:
  app:
    image: jc21/nginx-proxy-manager:2
    restart: always
    ports:
      # Public HTTP Port:
      - '80:80'
      # Public HTTPS Port:
      - '443:443'
      # Admin Web Port:
      - '81:81'
    volumes:
      # Make sure this config.json file exists as per instructions above:
      - ./config.json:/app/config/production.json
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    depends_on:
      - db
  db:
    image: jc21/mariadb-aria:10.4
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: "npm"
      MYSQL_DATABASE: "npm"
      MYSQL_USER: "npm"
      MYSQL_PASSWORD: "npm"
    volumes:
      - ./data/mysql:/var/lib/mysql
```

<br/>

Enfin créer un fichier `config.json`:

```
{
  "name": "Nginx Proxy Manager",
  "version": "6093335",
  "slug": "nginxproxymanager",
  "description": "Manage Nginx proxy hosts with a simple, powerful interface",
  "url": "https://github.com/hassio-addons/addon-nginx-proxy-manager",
  "webui": "http://[HOST]:[PORT:81]",
  "startup": "application",
  "arch": [
    "aarch64",
    "amd64",
    "armhf",
    "armv7",
    "i386"
  ],
  "services": [
    "mysql:need"
  ],
  "ports": {
    "80": 80,
    "81": 81,
    "443": 443
  },
  "ports_description": {
    "80": "HTTP Entrance port",
    "81": "Proxy management web interface",
    "443": "HTTPS/SSL Entrance port"
  },
  "boot": "auto",
  "hassio_api": true,
  "hassio_role": "default",
  "map": [
    "ssl:rw",
    "backup:rw"
  ],
  "options": {},
  "schema": {
    "log_level": "list(trace|debug|info|notice|warning|error|fatal)?"
  },
  "image": "hassioaddons/nginxproxymanager-{arch}"
}
```

<br/>

Configurer le port forward pour les ports 80 et 443 sur votre box vers le host sur lequel est installé le reverse proxy.

<br/>


## Démarrer du proxy 

```
docker-compose up -d
```

<br/>

## Résultat 

![image](/images/reverse-proxy-nginx-gui.png)

<br/>

Rendez vous à l'adresse suivante pour accéder à l'interface d'admin: http://DNS_HOST:81/nginx/proxy


