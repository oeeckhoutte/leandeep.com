# Créer un script qui se lance au démarrage de Centos 7

- Canonical URL: https://leandeep.com/cr%C3%A9er-un-script-qui-se-lance-au-d%C3%A9marrage-de-centos-7/
- Author: Lean Deep
- Published: 2019-09-10T18:10:11Z
- Updated: 2019-09-10T18:10:11Z
- Language: fr
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Introduction

Dans cet article, nous allons voir comment créer un service systemd qui va s'exécuter automatiquement au démarrage d'une machine. L'IP de ma machine étant renouvelée à chaque redémarrage, je me sers de ce type de service pour mettre à jour automatiquement l'IP publique sur un de mes DNS.

<br/>

## Steps

Créer un fichier `/var/tmp/boot_script.sh` qui contient le code suivant:

```
#!/bin/bash
echo "Boot script sample" > /var/log/boot_script.log
echo "Started at `date`" >> /var/log/boot_script.log
```

Donner au script des droits d'exécution:
```
chmod +x /var/tmp/boot_script.sh
```

Créer une nouveau service systemd. Pour ce faire créer un fichier dans le répertoire `/etc/systemd/system/` et appelé le `boot_script.service` par exemple. Insérer le contenu suivant dans votre nouveau fichier:

```
[Unit]
Description=Description de ce que fait le script ici
After=network.target

[Service]
Type=simple
ExecStart=/var/tmp/boot_script.sh
TimeoutStartSec=0

[Install]
WantedBy=default.target
```

<br/>

Reloader le process systemd pour que notre nouveau service soit pris en compte: 
```
systemctl daemon-reload
```
> Si vous modifiez ce service, il vous faudra également reloader systemd/

<br/>

"Activer" le service pour qu'il se lance automatiquement au démarrage de la machine: 
```
systemctl enable boot_script.service
```

<br/>

Démarrer le service:
```
systemctl start boot_script.service
```

<br/>

Redémarrer votre machine pour vérifier que tout fonctionne bien. 
```
systemctl reboot
```

