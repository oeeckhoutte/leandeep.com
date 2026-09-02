# Changer d'adresse MAC sur Android

- Canonical URL: https://leandeep.com/changer-dadresse-mac-sur-android/
- Author: Olivier Eeckhoutte
- Published: 2019-01-17T21:59:00Z
- Updated: 2019-01-17T21:59:00Z
- Language: fr
- Tags: Android, Network, Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## 1. Qu'est-ce qu'une adresse MAC ? 

Une *Media Access Control address* (adresse MAC) est un identifiant unique composé de 12 caractères assigné aux cartes réseau. En d'autres termes, une adresse MAC peut être utilisée pour identifier de manière unique votre téléphone Android phone sur Internet ou dans un réseau local.

<br/>

## 2. Spoof Mac Address

Nous allons maintenant votre comment spoofer (modifier) votre adresse MAC.

> Il faut que votre Smartphone soit rooté sinon le changement sera temporaire.

Allez dans Settings> System> About phone> Status> WiFi MAC Address pour votre l'adresse MAC de la carte Wifi de votre Smartphone. Notez la, nous allons la modifier. 

Téléchargez et installez l'application Busybox https://play.google.com/store/apps/details?id=stericson.busybox .

Allez sur l'application Busybox et cliquez sur le bouton Install en bas à gauche. Cela va installer un binaire (busybox) dans votre Smartphone que nous allons utiliser via un terminal directement sur Android.

<br/>

### 2.1. Option 1

Téléchargez et installez maintenant le fameux terminal dont je viens de parler appelé "Su / Root Command" et disponible à l'adresse suivante: https://play.google.com/store/apps/details?id=com.myapkapp.surootcommand 

Démarrez le terminal sur votre Smartphone et entrez les commandes suivantes: 

```
busybox ip link show wlan0

# si wlan0 n'existe pas vous pouvez lister toutes les interfaces via la commande: ip link show

busybox ifconfig wlan0 hw ether XX:XX:XX:YY:YY:YY # Remplacez YY:YY:YY par ce que vous voulez et gardez comme avant la partie XX:XX:XX
```

Pour vérifier que cela a fonctionné:

Soit en entrant la commande: 

```
busybox iplink show wlan0
```

Ou en retournant dans Settings> System> About phone> Status> WiFi MAC Address

<br/>

### 2.2. Option 2

Téléchargez l'app https://play.google.com/store/apps/details?id=net.xnano.android.changemymac&rdid=net.xnano.android.changemymac

C'est une bonne alternative qui permet de créer des profils, restaurer votre ancienne MAC...

Vérifiez que cela a fonctionné en allant dans Settings> System> About phone> Status> WiFi MAC Address

