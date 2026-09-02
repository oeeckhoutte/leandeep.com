# Installer un serveur Sentry en moins de 5 minutes en 2022

- Canonical URL: https://leandeep.com/installer-un-serveur-sentry-en-moins-de-5-minutes-en-2022/
- Author: Olivier Eeckhoutte
- Published: 2022-05-14T21:25:00Z
- Updated: 2022-05-14T21:25:00Z
- Language: fr
- Tags: Sentry, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment installer Sentry sur OSX via Docker. Il fait suite à un premier article sur le même sujet écrit en 2018. La procédure a totalement changé donc voici une mise à jour.

<br/>

## Installation
Installer le package suivant:

```
brew install coreutils
```

<br/>

Récupérer la dernière release de Sentry sur [ce lien](https://github.com/getsentry/self-hosted/releases/latest).

> Dans mon cas, j'ai téléchargé la version **self-hosted-22.5.0**

Ensuite, il suffit d'exécuter les commandes suivantes: 

```
cd self-hosted-22.5.0
./install.sh
# ou (en local)
# ./install.sh --no-user-prompt

# yes pour créer un compte admin
# ou pour en recréer un:
# docker-compose run --rm web createuser 

docker compose up -d
```

Une fois installé, rendez-vous à l'adresse [http://localhost:9000](http://localhost:9000) pour accéder à l'interface de Sentry.
