# Réduire la taille du contexte lors d'un Docker build

- Canonical URL: https://leandeep.com/r%C3%A9duire-la-taille-du-contexte-lors-dun-docker-build/
- Author: Olivier Eeckhoutte
- Published: 2016-02-01T21:26:00Z
- Updated: 2016-02-01T21:26:00Z
- Language: fr
- Tags: Docker
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Très simplement, il suffit d'ajouter un fichier `.dockerignore` au même niveau que votre Dockerfile.

Voici un exemple de *paths* à exclure du contexte.

```
.git
.ipynb_checkpoints/*
/notebooks/*
/unused/*
Dockerfile
.DS_Store
.gitignore
README.md
env.*
/devops/*

# To prevent storing dev/temporary container data
*.csv
/tmp/*
tmp/
```

