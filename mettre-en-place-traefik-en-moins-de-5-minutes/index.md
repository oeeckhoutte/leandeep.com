# Mettre en place Traefik en moins de 5 minutes

- Canonical URL: https://leandeep.com/mettre-en-place-traefik-en-moins-de-5-minutes/
- Author: Olivier Eeckhoutte
- Published: 2019-03-29T21:44:00Z
- Updated: 2019-03-29T21:44:00Z
- Language: fr
- Tags: Docker, Traefik
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


# Introduction

Tout est dans le titre ! Dans cet article nous allons voir comment mettre en place le load balancer Traefik devant 2 applications. 

Nous allons déployer 2 nginx pour simuler 2 sites statiques et nous allons customiser la page d'accueil de chacun de nos Nginx avec les messages `Hello world 1` et `Hello world 2`. On ne peut pas plus simple !

<br/>

# Installtion

## Docker-compose

Créer un fichier `docker-compose.yml`:

```
version: "3.5"

services:

  traefik:d
  	restart: alwaysd
    image: traefik:1.7.10
    command: --api --docker --docker.domain=app.test --logLevel=DEBUG # Enables the web UI and tells Traefik to listen to docker
    depends_on:
    # our setup relies on the 2 apps running. Trying to spin up traefik will bring up those too
    - "app1"
    - "app2"
    ports:
      - "80:80"
      # Management UI
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik.toml:/etc/traefik/traefik.toml:ro
    networks:
      outside-world:
      internal-network:

  app1:
    image: nginx:alpine
    labels:
    - "traefik.port=80"
    - "traefik.frontend.rule=Host:app1.test"
    volumes:
      - ./app1/:/usr/share/nginx/html:ro
    networks:
      internal-network:
        # the aliases are not required, but are useful if the applications want to internally
        # reference each other by host name
        aliases:
        - "app1.test"

  app2:
    image: nginx:alpine
    labels:
    - "traefik.port=80"
    - "traefik.frontend.rule=Host:app2.test"
    volumes:
      - ./app2/:/usr/share/nginx/html:ro
    networks:
      internal-network:
        aliases:
        - "app2.test"

networks:
  # everything that is *only* on "internal network" cannot talk to WAN
  internal-network:
    internal: true
  # add this network to a container to make it talk to the rest of the world
  outside-world:

```

<br/>

## Contenus HTML des apps 

Créer 2 répertoires `app1` et `app2` contenant les fichiers index.html customisés.

Vous devriez obtenir l'arborescence suivante: 

```
├── app1
│   └── index.html # Contient le texte: Hello world 1
├── app2
│   └── index.html # Contient le texte: Hello world 2
└── docker-compose.yml
```

<br/>

## /etc/hosts

Si vous êtes en local, il vous faudra configurer votre /etc/hosts avec le nom de domaine permettant d'accéder aux apps et à Traefik.

Pour ce faire editez le fichier (en mode root) `/etc/hosts`, et ajoutez les 3 entrées suivantes: 

```
127.0.0.1       app.test
127.0.0.1       app1.test
127.0.0.1       app2.test
```

<br/>

## Test

Exécutez la commande: 

```
docker-compose up 
```

Puis rendez-vous sur `http://app.test:8080` pour accéder à l'admin de Traefik et sur vos apps `http://app1.test` et `http://app2.test`.

Et voilà !

![image](/images/traefik.png)


Pour aller plus loin, vous pouvez ajouter un fichier `acme.json` et le monter comme volume dans votre service Traefik pour avoir de l'HTTPS. `- ./acme.json:/acme.json` 

Voici la doc officielle (j'en ferais peut-être un article si le temps me le permet :D) https://docs.traefik.io/configuration/acme/

<br/>

# htpasswd

Il est également possible d'ajouter un htpasswd:

```
htpasswd -n username
```

Voici ce que l'on obtient avec admin/admin (à ne pas utiliser):

```
admin:$apr1$IBj9Hfsd$kf7vXLpY4/9XD365jcp/n1
```

Modifier le fichier `docker-compose.yml` et ajoutez le label suivant dans le service traefik:

```
labels:
      - "traefik.frontend.auth.basic=admin:$$apr1$$IBj9Hfsd$$kf7vXLpY

```

