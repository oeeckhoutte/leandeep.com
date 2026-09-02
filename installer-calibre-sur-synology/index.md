# Installer Calibre sur Synology

- Canonical URL: https://leandeep.com/installer-calibre-sur-synology/
- Author: Olivier Eeckhoutte
- Published: 2024-11-19T07:00:00+02:00
- Updated: 2024-11-19T07:00:00+02:00
- Language: fr
- Tags: Calibre, Synology
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir comment installer Calibre sur un Synology.

<br/>

## Installation

Installer `Container Manager` depuis le `Package Center`.

Depuis `File Station`, ouvrir le dossier `docker` dans le menu de gauche. A l'intérieur de ce dossier `docker`, créer un nouveau dossier appelé `calibre`.

Créer un `User-defined script` permettant de démarrer le container Calibre Web. Pour se faire, aller dans `Control Panel / Task Scheduler / Create / Scheduled Task / User-defined script` puis créer la tâche dans la fenêtre qui s'ouvre comme ceci:

1. General: Dans le champ Task entrer `Install Calibre`. Décochez le bouton `Enabled` et sélectionner l'utilisateur `root`.
2. Schedule: Sélectionner `Run on the following date` et sélectionner `Do not repeat`.
3. Task Settings: Cocher `Send run details by email`, ajouter votre email et copier coller le code suivant dans la section Run avant de cliquer sur OK.

```
docker run -d --name=calibre \
-p 7080:8080 \
-p 7081:8081 \
-e PUID=0 \
-e PGID=0 \
-e TZ=Europe/Paris \
-e CUSTOM_USER=calibre \
-e PASSWORD=password_for_calibre \
-v /volume1/docker/calibre:/config \
--security-opt seccomp=unconfined \
--restart always \
ghcr.io/linuxserver/calibre
```

<br/>

## Vérification

Démarrer la task puis rendez-vous à l'adresse suivante: `http://Synology-ip-address:7080`
