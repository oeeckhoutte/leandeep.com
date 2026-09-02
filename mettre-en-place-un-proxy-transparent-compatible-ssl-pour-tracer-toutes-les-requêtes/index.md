# Mettre en place un proxy transparent compatible SSL pour tracer toutes les requêtes

- Canonical URL: https://leandeep.com/mettre-en-place-un-proxy-transparent-compatible-ssl-pour-tracer-toutes-les-requ%C3%AAtes/
- Author: Olivier Eeckhoutte
- Published: 2018-12-06T22:22:00Z
- Updated: 2018-12-06T22:22:00Z
- Language: fr
- Tags: Security, Web, Dev, Mobile
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article nous allons voir comment rapidement mettre en place un proxy transparent pour "*logguer*" tous les sites appelés par un device. 
C'est extrèmement pratique lorsqu'on fait du développement mobile lorsqu'on veut analyser les requêtes faites par notre application. (Je n'ai pas encore d'enfant mais cela pourrait permettrer de surveiller les sites sur lesquels ils vont :D... Bref il y a beaucoup de use cases. 

L'idée ici est de créer un hotspot Wifi. Lorsqu'un device s'y connecte tout le traffic qu'il va générer sera "*loggué*". Il sera alors facile de voir toutes les requetes et réponses faites par le device. 

Ce proxy permet de tracker le traffic HTTP et HTTPS. 
Pour la partie HTTPS il faudra installer un Root CA sur le device. 

J'ai utilisé un dongle USB type Atheros Alfa AWUS... 

<br/>

## Installation du proxy Man-In-The-Middle 

- Commencez par télécharger la version complète de kali linux (~3Go) https://kali.org/downloads/

- Je suis sur Mac du coup j'ai créé une VM avec VirtualBox (outil simple et gratuit). Faites de même et n'oubliez pas de brancher votre dongle et de l'associer à votre VM. Pour le réseau, montez le en mode Bridge (cela permettra de facilement faire un SSH sur la VM)

- Démarrez votre VM et donc Kali en mode Live. 

- Après le démarrage de Kali, vous pourrez vous y connecter en utilisant les credentials par défaut: `root/toor`.

- Créer un hotspot Wifi. Pour cela, cliquez sur l'icône réseau en haut à droite puis cliquez sur "Wi-Fi", puis "Wi-Fi Settings", sélectionnez la carte sans fil que vous souhaitez utiliser pour le hotspot et enfin cliquez sur "Use as Hotspot". Bravo vous avez créé en quelques minutes un hotspot wifi avec avec des rêgles de routage. Vous pouvez d'ors et déjà utiliser Wireshark ou d'autres outils du genre...

- Connectez votre device au hotspot "kali".

- De retour sur votre Kali, activez l'IP forwarding dans le kernel avec la commande suivante `sysctl -w net.ipv4.ip_forward=1`.

- En supposant que votre hotspot utilise `wlan0`, on va configurer des rêgles `iptables` qui vont rediriger tout le traffic TCP des ports 80 et 443 sur le proxy Mitmproxy. 

```
iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j REDIRECT --to-port 8080
iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 443 -j REDIRECT --to-port 8080
```

- Maintenant vous pouvez démarrer le proxy avec la commande suivante:

```
mitmproxy --mode transparent --listen-port 8080
```

- Mitmproxy va démarrer et vous pourrez voir tout le traffic HTTP. 
Par contre dès que vous essayerez de voir le contenu des sites en HTTPS vous aurez une erreur comme celle-ci:

![image](/images/https-error.png)

<br/>

## Configuration HTTPS pour iOS

- Lorsque Mitmproxy démarre pour la première fois il crée automatiquement des CA certificates dans le répertoire ~/.mitmproxy.

- Récupérer les CA de la VM sur votre Host via scp. Pour cela démarrez le service SSH: 

```
systemctl start ssh.service
# scp... ou faite un cat (il n'y a que 2 fichiers)
```

- Une fois les 2 CA `mitmproxy-ca.pem` et `mitmproxy-ca-cert.pem` récupérés, créez un server web (un simple directory listing) et exposez les CA. L'idée est de vous rendre sur le serveur web avec votre device (iPhone) et de cliquer sur les CA. Une fois que vous aurez cliqué dessus vous pourrez les "truster". 

- Une fois que vous les aurez "trusté", vous pourrez lire le contenu des requêtes HTTPS dans l'interface mitmproxy :D. Voici à quoi cela ressemble lorsque je me rends avec mon iPhone sur la page "Tweets" de ce site.

<br/>

![image](/images/leandeep-browsing-ios.png)

<p style="text-align:center;">*Certificat HTTPS valide*</p>

<br/>

![image](/images/mitmproxy-demo.png)

<p style="text-align:center;">*Interface de mitmproxy*</p>

<br/>

- Pour Android je n'ai pas encore testé. Il semblerait qu'il y ait un domaine permettant d'installer plus facilement les CA. http://mitm.it (cela ne fonctionnait pas pour iOS mais pour Android il faudrait tester). Si cette URL ne nous aide pas à installer les CA, la méthode ci-dessus devrait fonctionner également sur Android.

