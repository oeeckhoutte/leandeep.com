# Effacer toutes les images et containers Docker

- Canonical URL: https://leandeep.com/effacer-toutes-les-images-et-containers-docker/
- Author: Olivier Eeckhoutte
- Published: 2013-10-20T22:03:00Z
- Updated: 2013-10-20T22:03:00Z
- Language: fr
- Tags: Docker, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Effacer tous les containers

```
docker rm $(docker ps -a -q)
```

## Effacer toutes les images

```
docker rmi $(docker images -q)
```

