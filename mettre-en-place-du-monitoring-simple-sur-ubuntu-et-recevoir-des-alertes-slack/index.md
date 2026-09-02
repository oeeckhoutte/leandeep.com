# Mettre en place du monitoring simple sur Ubuntu et recevoir des alertes Slack

- Canonical URL: https://leandeep.com/mettre-en-place-du-monitoring-simple-sur-ubuntu-et-recevoir-des-alertes-slack/
- Author: Olivier Eeckhoutte
- Published: 2020-01-19T22:49:00+02:00
- Updated: 2020-01-19T22:49:00+02:00
- Language: fr
- Tags: Monitoring, Ubuntu
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

L'objectif de cet article est de voir comment mettre en place du monitoring simple sur son serveur Ubuntu avec des alertes Slack et des rapports hebdomadaires.

<br/>

### Installation de monit 

```
sudo apt install monit -y
```

<br/>

### Commandes utiles 

Vérifier qu'il n'y a pas d'erreur dans la configuration.
```
sudo monit -t
```

Si tout est bon, on peut reloader la monit et prendre en compte les changements de configuration avec la commande: 
```
sudo monit reload
```

<br/>

### Envoi d'alertes sur Slack

**Configuration de l'URL du webhook sur le site de Slack**

* Go to https://<yourteam>.slack.com/apps/manage/custom-integrations

* Click Incoming WebHooks
* Click Add Configuration
* Select an existing channel or create a new one (e.g. #monit) - you can change it later
* Click Add Incoming WebHooks integration
* Copy the Webhook URL

<br/>

**Création du script permettant d'envoyer des messages sur Slack**

Créer un fichier `/usr/local/bin/slack.sh` et ajoutez ce contenu:

```
#!/bin/bash

URL=$(cat /etc/monit/slack-url)

COLOR=${MONIT_COLOR:-$([[ $MONIT_EVENT == *"succeeded"* ]] && echo good || echo danger)}
TEXT=$(echo -e "$MONIT_EVENT: $MONIT_DESCRIPTION" | python3 -c "import json,sys;print(json.dumps(sys.stdin.read()))")

PAYLOAD="{
  \"attachments\": [
    {
      \"text\": $TEXT,
      \"color\": \"$COLOR\",
      \"mrkdwn_in\": [\"text\"],
      \"fields\": [
        { \"title\": \"Date\", \"value\": \"$MONIT_DATE\", \"short\": true },
        { \"title\": \"Host\", \"value\": \"$MONIT_HOST\", \"short\": true }
      ]
    }
  ]
}"

curl -s -X POST --data-urlencode "payload=$PAYLOAD" $URL
```

> Ne pas oublier de donner les droits d'exécution sur ce fichier `sudo chmod +x /usr/local/bin/slack.sh`. 

<br/>

**Configuration de l'URL du webhook dans un fichier**

Créer un second fichier pour Slack `/etc/monit/slack-url` et ajouter l'URL du webhook. Ce fichier contiendra uniquement une URL du type `https://hooks.slack.com/services/XXXXXX/YYYYYY/XyXyY123xxxZ`.

<br/>

**Test du bon fonctionnement du script Slack:**

```
MONIT_EVENT="Oops il y a une erreur" MONIT_DESCRIPTION="Ceci est un test" MONIT_HOST=`hostname` MONIT_DATE=`date -R` \
  /usr/local/bin/slack.sh
```

<br/>

### Création d'alertes

**Running out of disk space**

Créer un fichier `/etc/monit/conf.d/diskspace` et ajouter le contenu suivant:

```
check filesystem rootfs with path /
  if space usage > 80% then exec "/usr/local/bin/slack.sh" else if succeeded then exec "/usr/local/bin/slack.sh"
```  

<br/>

**High load**

Créer le fichier suivant `/etc/monit/conf.d/system`:

```
check system $HOSTNAME
  if memory > 80% for 2 cycles then exec "/usr/local/bin/slack.sh" else if succeeded then exec "/usr/local/bin/slack.sh"
  if swap > 10% for 2 cycles then exec "/usr/local/bin/slack.sh" else if succeeded then exec "/usr/local/bin/slack.sh"
  if cpu > 80% for 2 cycles then exec "/usr/local/bin/slack.sh" else if succeeded then exec "/usr/local/bin/slack.sh"
  if loadavg (5min) > 1 for 2 cycles then exec "/usr/local/bin/slack.sh" else if succeeded then exec "/usr/local/bin/slack.sh"
```  

<br/>

**Open ports**

Créer le fichier suivant `/etc/monit/conf.d/ports`:

```
check program port21 with path "/bin/sh -c 'echo Port 21 is open ; nc -z $BLOGHOST 21 -w1'" every "5 * * * *"
  if status != 1 then exec "/usr/local/bin/slack.sh"

check program port25 with path "/bin/sh -c 'echo Port 25 is open ; nc -z $BLOGHOST 25 -w1'" every "5 * * * *"
  if status != 1 then exec "/usr/local/bin/slack.sh"

check program port3306 with path "/bin/sh -c 'echo Port 3306 is open ; nc -z $BLOGHOST 3306 -w1'" every "5 * * * *"
  if status != 1 then exec "/usr/local/bin/slack.sh"
```  

Vérifier la bonne syntaxe du fichier:
```
sudo monit -t
```

Reload monit:

```
sudo monit reload
```

<br/>

### Rapports hebdo

Créer le fichier suivant `/usr/local/bin/report.sh`:

```
#!/bin/bash

echo Uptime
echo '```'
w
echo '```'

echo Network
echo '```'
sudo netstat -nlput
echo '```'

echo Disk
echo '```'
df -h
echo '```'

echo Memory
echo '```'
free -h
echo '```'

echo Processes
echo '```'
ps auxf | egrep -v '\[.+\]'
echo '```'
```

Vérifier le bon fonctionnement du rapport en recevant une alerte Slack:

```
MONIT_EVENT=Report MONIT_DESCRIPTION=`/usr/local/bin/report.sh` \
MONIT_HOST=`hostname` MONIT_DATE=`date -R` MONIT_COLOR="#808080" \
  /usr/local/bin/slack.sh
```

<br/>

**Pour recevoir ce rapport chaque semaine**

Créer un fichier `/etc/cron.weekly/slack-report` et ajouter ce contenu suivant:

```
MONIT_EVENT=Report MONIT_DESCRIPTION=`/usr/local/bin/report.sh` \
MONIT_HOST=`hostname` MONIT_DATE=`date -R` MONIT_COLOR="#808080" \
  /usr/local/bin/slack.sh
```

Ne pas oublier de donner à ce fichier les droits d'exécution:
```
sudo chmod +x /etc/cron.weekly/slack-report
```
