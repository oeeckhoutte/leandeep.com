# Créer un proxy MITM pour mesurer la performance des APIs

- Canonical URL: https://leandeep.com/cr%C3%A9er-un-proxy-mitm-pour-mesurer-la-performance-des-apis/
- Author: Olivier Eeckhoutte
- Published: 2020-10-26T20:44:00Z
- Updated: 2020-10-26T20:44:00Z
- Language: fr
- Tags: Linux, MITM, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Nous allons voir dans cet article comment mettre en place un proxy MITM pour mesurer la performance d'une API.
Nous parlons ici d'une solution basique "quick win" à mettre en place en 5 minutes. Je ne parle pas d'une solution APM évoluée où il faut installer un SDK... 

<br/>

## Installation

```
docker run --rm -it \
 -p 8080:8080 \
 -p 8081:8081 \
 oeeckhoutte/mitmproxy mitmweb \
  --web-host 0.0.0.0
```

<br/>

## Usage

```
watch -n 5 "curl -k --proxy http://127.0.0.1:8080 http://192.168.0.24:8000/"
```

<br/>

Rendez-vous sur [http://localhost:8081](http://localhost:8081) pour accéder à l'interface MITM proxy.

<br/>

```
watch -n 1 "ab -n 3 -v 3 https://mon_api/endpoint >> ab.txt"
```

<br/>

Pour compter le nombre d'erreurs 5xx, on peut utiliser vim:
```
:%s/HTTP\/1.1 5//n
```

<br/>

On peut compte aussi les "permanent moves" 3xx:
```
:%s/HTTP\/1.1 3//n
```


