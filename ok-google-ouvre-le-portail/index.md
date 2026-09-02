# « Ok google… Ouvre le portail » !

- Canonical URL: https://leandeep.com/ok-google-ouvre-le-portail/
- Author: Olivier Eeckhoutte
- Published: 2017-01-08T20:28:00Z
- Updated: 2017-01-08T20:28:00Z
- Language: fr
- Tags: Javascript, Python, Raspberry, Domotique, Featured
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Pour bien commencer l’année et ce blog avec ce premier article, voici comment j’ai transformé mon portail en un portail connecté.

Lorsque je prononce les mots « Ok Google… Ouvre le portail » sur mon Smartphone, ce dernier déclenche une commande qui actionne le moteur du portail. Je peux ainsi en fonction des messages que j’ai programmé, ouvrir ou fermer le portail de n’importe où.

<br/>

## Description du fonctionnement

Voici un schéma qui décrit globalement le fonctionnement du système.

![image](/images/article-ok-google-portail.png)

<br/>

Comme l’indique le schéma ci-dessus, j’ai le choix entre 2 options pour actionner mon portail. Je peux le faire avec les commandes par défaut qui sont les télécommandes ou le visiophone. Et je peux le faire grâce à des commandes vocales.

Mon portail possède un actionneur de marque BFT (Ultra BT A 400). Ce dernier est fourni avec un moteur et sa carte électronique de commande qui me permettent d’ouvrir ou fermer le portail. Je me suis branché directement sur cette carte électronique et je la pilote grâce à un relais et un Raspberry Pi. Si on regarde le schéma de la carte électronique de commande du moteur ci-dessous, on peut voir qu’il y a deux inputs `IC1` et `IC2`.

<br/>

![image](/images/moteur-1.png)

<br/>

`IC1` permet d’ouvrir ou fermer le portail en grand et `IC2` permet de le faire en mode piéton.

Pour piloter le portail, il faut donc tirer 2 fils entre cette carte de commande et le relais et ensuite piloter le relais avec un Raspberry Pi. Le schéma du câblage est présent dans le paragraphe suivant.

<br/>

## Hardware

Voici le matériel que j’ai utilisé:

* Raspberry Pi 2
* Dongle Wifi Netgear
* Alimentation 220V
* Relay 5V
* Quelques fils électriques
* Une boite de dérivation


Finalement il y a assez peu de matériel. La boite de dérivation, n’est pas indispensable mais elle permet de cacher les cables et cartes et ainsi d’avoir quelque chose de propre. En gros, une fois terminé, il n’y a pas des fils qui pendent à côté du tableau électrique. Voici à quoi cela ressemble chez moi:

![image](/images/DSC_0051.jpg)



<br/> 

Voici comment j’ai câblé mon relais et Raspberry Pi avec la commande IC1:

![image](/images/schema-pi-relay.jpeg)

<br/>

## Software

Pour piloter le GPIO du Raspberry Pi, j’utilise un script que j’ai réalisé en Python. En exécutant le script, la PIN 17 du GPIO prend alternativement la valeur 0 ou 5V. A chaque fois que le relais reçoit une impulsion de 5V, il change d’état; ce qui crée une impulsion sur IC1.

J’ai également créé une API NodeJS qui me permet d’exposer l’exécution de mon script Python, de sécuriser le tout et de créer une interface WEB de contrôle du portail (je ne la présente pas dans cet article).

Tout est donc exécuté directement sur le Raspberry Pi qui est accessible sur internet via ma box internet.

<br/>

## Préparation environnement
### Installation de NodeJS

```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
```

Ajouter les 2 commandes suivantes dans votre ~/.bashrc pour activer NVM.

```
export NVM_DIR="$HOME/.nvm" 
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
```

Vous pouvez maintenant utiliser NVM et utiliser la version de NodeJS que vous souhaitez.
Exécutez simplement la commande suivante:

```
nvm use 6.9.1 # sélectionnez la version de NodeJS que vous voulez
```

<br/>

### Installation de Python

```
apt-get update
apt-get install gcc
apt-get install python-dev
apt-get install python-pip
pip install RPi.GPIO
```

<br/>

### API NodeJS

Voici un extrait de code. C’est le endpoint ExpressJS qui exécute mon script Python via un fork unix.

```
router.get('/portail/toggle', (req, res) => {
  var exec = require('child_process').exec;
  var cmd = 'python /home/pi/relay.py 2';
 
  exec(cmd, function(error, stdout, stderr) {
    if(error)
      return next(error);
    res.send({msg: 'Yeah it works!'});
  });
});
```

<br/>

### Script Python
```
#!/usr/bin/python
 
import sys
import time
import RPi.GPIO as GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
 
args = sys.argv
pin = 17 # GPIO PIN 17
GPIO.setup(pin, GPIO.OUT)
ctl = args[1]
 
# [...] Reste du code ici. En effet, mon Raspberry ne me sert pas qu'à piloter le portail.
 
if (int(ctl) == 2):
  GPIO.output(pin,GPIO.HIGH)
  time.sleep(2)
  GPIO.output(pin, GPIO.LOW)
```

<br/>

### Automatisation sur Android via Tasker
Voyons maintenant comment j’ai fait pour que mon téléphone comprenne ce que je lui dis et comment il communique avec  l’API NodeJS pour ouvrir ou fermer mon portail.

Pour avancer de façon Lean sur ce projet, j’ai commencé par quelque chose de simple. Je vous parlerais de la finalité de ce que je veux faire avec ce projet en conclusion de cet article.

J’ai utilisé les fonctionnalités de reconnaissance vocale de Google Now sans rien développer.

Pour ce faire, j’ai utilisé l’application d’automatisation de tâches appelée Tasker ainsi que son plugin AutoVoice.

Pour que mon téléphone envoie une requête à mon API Node pour ouvrir le portail quand je prononce la phrase: « Sésame ouvre-toi », il suffit de définir une tâche qui permet d’envoyer une requête vers une URL et définir des profils. Un exemple de profil peut être: si Google Now reconnait une phrase en particulier comme par exemple « Sésame ouvre-toi » alors j’exécute une tâche.

Beaucoup de tutoriaux sont disponibles sur internet. En voici un par exemple: http://lifehacker.com/how-to-create-custom-voice-commands-with-tasker-and-aut-1282209195

<br/>

### Tests et industrialisation

J’ai eu beaucoup de chance car je n’ai rencontré absolument aucun obstacle et avais tout ce qu’il me fallait sous la main. Après quelques tests tout a très vite fonctionné.

Ma dernière tâche, avant de ranger tous les câbles proprement dans le tableau électrique, a consisté à créer un script de démarrage et à installer un process manager pour NodeJS (PM2).

J’ai donc créé un script nodeStartupHomeAutomation dans /etc/init.d/ et installé les 2 librairies suivantes sur le Raspberry Pi.

 
```
apt-get install psmisc
npm install -g pm2
```

Voici à quoi peut ressembler le script de démarrage:

```
#! /bin/sh
# /etc/init.d/nodeStartupHomeAutomation
 
# If you want a command to always run, put it here
 
# Carry out specific functions when asked to by the system
case "$1" in
start)
echo "Starting Node Server"
 
export NVM_DIR="/home/pi/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
 
# run application you want to start
cd /home/pi/home-automation/
pm2 start app.js --name="homeAuto"
# node app.js &
;;
stop)
echo "Stopping Node Server"
 
# kill application you want to stop
pm2 stop homeAuto
# killall node
;;
*)
echo "Usage: /etc/init.d/nodeStartupHomeAutomation {start|stop}"
exit 1
;;
esac
 
exit 0
```

Pour vérifier que le service démarre convenablement, qu’il se stoppe bien et pour l’enregistrer aux services de démarrage, vous pouvez utiliser les commandes suivantes:

```
chmod 755 /etc/init.d/nodeStartupHomeAutomation
 
# Test du démarrage du script
/etc/init.d/nodeStartupHomeAutomation start
 
# Test de l'arrêt du script
/etc/init.d/nodeStartupHomeAutomation stop 
 
#Enregistrement du script pour être lancé au démarrage de la machine une fois qu'il est ok 
update-rc.d nodeStartupHomeAutomation defaults 
```

<br/>

## Conclusion

Voilà c’est à peu près tout pour cet article. Il n’en faut pas beaucoup plus pour piloter un portail avec des commandes vocales sur un Smartphone.

Pour ce projet, je ne veux pas en rester là. Je vais passer le tout sur Docker si bien sûr je peux accéder au GPIO depuis un container.

De plus aujourd’hui je dépends d’internet. Si je n’ai plus internet sur mon Smartphone, aucune commande ne peut être envoyée vers mon Raspberry Pi.

Pour palier à ce problème et faire du Deep Learning sur un cas concret, je vais mettre en place une caméra à l’extérieure de chez moi qui va filmer en permanence ce qui vient vers le portail. Si ma voiture est reconnue, alors je vais ouvrir le portail et allumer les lumières de chez moi. Pour ce faire, je vais utiliser TensorFlow et un réseau de neurones profond. Cela fera l’objet d’un autre article.

Si le temps me le permet et purement à des fins d’apprentissage, j’essayerai de mettre en place manuellement de la reconnaissance vocale et remplacer Google Now.

