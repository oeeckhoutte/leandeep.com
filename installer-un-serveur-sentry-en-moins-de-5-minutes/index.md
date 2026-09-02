# Installer un serveur Sentry en moins de 5 minutes

- Canonical URL: https://leandeep.com/installer-un-serveur-sentry-en-moins-de-5-minutes/
- Author: Olivier Eeckhoutte
- Published: 2018-06-13T21:25:00Z
- Updated: 2018-06-13T21:25:00Z
- Language: fr
- Tags: Sentry, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment mettre en place Sentry pour vos projets. Il s'agit ici d'un Hosting simple en local via docker-compose. Je ne recommande pas cette façon de faire pour de la production. Je me sers de ce Sentry pour du développement en local.

Créer un fichier `docker-compose.yml` avec le contenu suivant:

Remplacer la chaine `!!MON_SECRET!!` pour une chaine de 32 caractères aléatoires. Sur Mac, exécuter simplement: `python -c "import random; import string; chars = string.ascii_uppercase + string.digits; print(''.join(random.choice(chars) for _ in range(32)))" | pbcopy`

```
version: '2'

volumes:
   pgdb:

services:
  redis:
    image: redis

  postgres:
    image: postgres
    environment:
      POSTGRES_USER: sentry
      POSTGRES_PASSWORD: sentry
      POSTGRES_DB: sentry
    volumes:
     - pgdb:/var/lib/postgresql/data

  sentry:
    image: sentry
    links:
     - redis
     - postgres
    ports:
     - 9000:9000
    environment:
      SENTRY_SECRET_KEY: '!!MON_SECRET!!'
      SENTRY_POSTGRES_HOST: postgres
      SENTRY_DB_USER: sentry
      SENTRY_DB_PASSWORD: sentry
      SENTRY_REDIS_HOST: redis

  cron:
    image: sentry
    links:
     - redis
     - postgres
    command: "sentry run cron"
    environment:
      SENTRY_SECRET_KEY: '!!MON_SECRET!!'
      SENTRY_POSTGRES_HOST: postgres
      SENTRY_DB_USER: sentry
      SENTRY_DB_PASSWORD: sentry
      SENTRY_REDIS_HOST: redis

  worker:
    image: sentry
    links:
     - redis
     - postgres
    command: "sentry run worker"
    environment:
      SENTRY_SECRET_KEY: '!!MON_SECRET!!'
      SENTRY_POSTGRES_HOST: postgres
      SENTRY_DB_USER: sentry
      SENTRY_DB_PASSWORD: sentry
      SENTRY_REDIS_HOST: redis
```

Puis exécuter la commande `docker-compose up -d`.

Créer ensuite un compte admin. Pour ce faire, exécuter la commande `docker-compose exec sentry sentry upgrade`

Restart Sentry avec `docker-compose restart sentry`

Puis rendez-vous à l'adresse: [http://localhost:9000](http://localhost:9000)
