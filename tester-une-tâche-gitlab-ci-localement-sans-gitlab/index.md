# Tester une tâche Gitlab CI localement sans Gitlab

- Canonical URL: https://leandeep.com/tester-une-t%C3%A2che-gitlab-ci-localement-sans-gitlab/
- Author: Olivier Eeckhoutte
- Published: 2018-11-18T21:18:00Z
- Updated: 2018-11-18T21:18:00Z
- Language: fr
- Tags: Gitlab
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Dans cet article nous allons voir comment tester une pipeline Gitlab CI en local. Il n'est pas nécessaire d'installer un Gitlab en local; ce qui peut être ennuyeux avec la gestion des certificats SSL. Pouvoir tester son fichier `.gitlab-ci.yml` en local est très utile pour 2 raisons. D'un côté c'est plus rapide car il ne faut pas pousser son code sur un Gitlab distant et attendre qu'un runner soit disponible. D'un autre côté on ne pollue pas le repository Git distant avec d'innombrables commits de tests (on peut réécrire l'historique je sais bien) ou avec des notifications aux collègues.

<br/>

Prenons par exemple le fichier `.gitlab-ci.yml` suivant:

```
build:
    image: nodejs:8
    stage: build
    before_script:
        - npm i
    script:
        - npm run build

```

<br/>

Avec la commande suivante on peut directement tester sa tâche build en local:

```
gitlab-runner exec docker build
```

<br/>
Lorsqu'on utilise Gitlab CI on faut parfois faire appel à du cache entre les stages. C'est possible d'en avoir avec la commande suivante:

```
gitlab-runner exec docker --docker-volumes `pwd`/cache:/cache build
```

<br/>

On peut aussi se faire un petit `Makefile` pour se simplifier la vie:

```
.PHONY: clean

.DEFAULT: cache
    gitlab-runner exec docker --docker-volumes `pwd`/cache:/cache $@

cache:
    mkdir $@

clean:
    rm -rf cache
```

<br/>

Enfin, si vous voulez passer des variables d'environnement dans un stage de votre pipeline cela se fait ainsi:

```
gitlab-runner exec docker --env YOUR_ENV_VAR="" build
```

