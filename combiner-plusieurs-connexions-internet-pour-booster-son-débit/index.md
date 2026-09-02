# Combiner plusieurs connexions internet pour booster son débit

- Canonical URL: https://leandeep.com/combiner-plusieurs-connexions-internet-pour-booster-son-d%C3%A9bit/
- Author: Olivier Eeckhoutte
- Published: 2020-03-08T17:49:00+02:00
- Updated: 2020-03-08T17:49:00+02:00
- Language: fr
- Tags: Tip, Network
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article nous allons voir comment booster son débit internet entrant et sortant en combinant son forfait internet et son forfait mobile. 

<br/>

## Analyse des réseaux

**Box ADSL**

Voici un speed test réalisé en connectant mon ordinateur à ma box internet via Wifi. 

![image](/images/speedtest-box.png)

<br/>

**4G**

Voici un speed test réalisé en connectant mon ordinateur à mon smartphone via USB. 

![image](/images/speedtest-4g.png)

<br/>


## Configuration

Pour combiner le réseau de votre box et le réseau de votre Smartphone sur votre ordinateur, il vous faut créer un proxy socks local. 

Pour ce faire, vous pouvez utiliser un utilitaire comme [go-dispatch-proxy](https://github.com/extremecoders-re/go-dispatch-proxy) qui agira comme proxy entre vos 2 connexions. 

```
# Lister les connexions disponibles
./go-dispatch-proxy -list

# Combiner 2 connexions
./go-dispatch-proxy ip1 ip2

# Combiner 2 connexions avec un ratio de contention
./go-dispatch-proxy ip1@2 ip2@3
```

Sur OSX rendez vous dans la section réseau --> Avancé --> Proxy et ajoutez 127.0.0.1:8080 comme proxy SOCKS. 


<br/>


## Résultat Box + 4g

En plus de pouvoir observer toutes les URLs externes appelées par votre système, vous pouvez observer que votre débit internet sera plus important car il combinera vos 2 connexions. 

```
...

[DEBUG] spclient.wg.spotify.com:443 -> 192.168.42.70:0
[DEBUG] clients4.google.com:443 -> 192.168.0.24:0
[DEBUG] github.com:443 -> 192.168.0.24:0
[DEBUG] github.githubassets.com:443 -> 192.168.42.70:0
[DEBUG] github.com:443 -> 192.168.42.70:0
[DEBUG] avatars1.githubusercontent.com:443 -> 192.168.0.24:0
[DEBUG] camo.githubusercontent.com:443 -> 192.168.42.70:0
[DEBUG] clients1.google.com:443 -> 192.168.0.24:0
[DEBUG] github.com:443 -> 192.168.42.70:0
[DEBUG] github.com:443 -> 192.168.42.70:0
[DEBUG] www.google-analytics.com:443 -> 192.168.0.24:0
[DEBUG] github.com:443 -> 192.168.42.70:0
[DEBUG] live.github.com:443 -> 192.168.0.24:0
[DEBUG] collector.githubapp.com:443 -> 192.168.42.70:0
[DEBUG] api.github.com:443 -> 192.168.42.70:0
[DEBUG] secure-us.imrworldwide.com:443 -> 192.168.42.70:0
[DEBUG] aax.amazon-adsystem.com:443 -> 192.168.0.24:0
...

```

![image](/images/speedtest-box-4g.png)

