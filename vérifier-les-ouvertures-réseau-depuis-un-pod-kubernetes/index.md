# Vérifier les ouvertures réseau depuis un pod Kubernetes

- Canonical URL: https://leandeep.com/v%C3%A9rifier-les-ouvertures-r%C3%A9seau-depuis-un-pod-kubernetes/
- Author: Olivier Eeckhoutte
- Published: 2022-02-08T06:59:00Z
- Updated: 2022-02-08T06:59:00Z
- Language: fr
- Tags: Kubernetes, Network, Container, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article rapide, nous allons voir comment vérifier qu'un pod peut accéder à un serveur distant. Dans l'image Docker utiliséz dans le pod, aucun outil n'est installé (`ping command not found`...).

<br/>

## ICMP

Ping, c'est [ICMP](https://fr.wikipedia.org/wiki/Internet_Control_Message_Protocol), donc si ICMP est bloqué vous ne pourrez pas pinger votre serveur.

<br/>

## Connexion tcp/udp via device

Depuis le pod, `kubectl exec...`, exécuter les commandes suivantes:
```
export host=le_host_de_votre_serveur_distant
export port=le_port_de_votre_serveur_distant
(echo >/dev/tcp/${host}/${port}) &>/dev/null && echo "open" || echo "closed"
```

<br/>

## Rappel autres outils

**telnet:**
```
telnet IP_DE_VOTRE_HOST 80
```

<br/>

**Netcat:**
```
nc -nv ip_address port_number
```

<br/>

**tcpconnect:**
```
tcpconnect -v remote_host remote_port
# for i in seq 1 65535 ; do tcpconnect -v remotehost $i ; done
```

Et voilà.

