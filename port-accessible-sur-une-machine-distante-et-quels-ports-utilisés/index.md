# Port accessible sur une machine distante et quels ports utilisés ?

- Canonical URL: https://leandeep.com/port-accessible-sur-une-machine-distante-et-quels-ports-utilis%C3%A9s/
- Author: Olivier Eeckhoutte
- Published: 2015-06-30T07:04:00Z
- Updated: 2015-06-30T07:04:00Z
- Language: fr
- Tags: Unix Tip, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

# Ports accessibles ?

## Via Telnet
Sur les anciens systèmes telnet est installé. 
Il suffit de faire: 

```
telnet hostname port
```

<br/>

## Alternatives à telnet

Sur les machines plus récentes, telnet n'est plus installé pour une question de sécurité. Il est alors possible d'utiliser d'autres outils.

### NC

```
nc -zv hostname port
nc -zv 127.0.0.1 22 80 8080 # multiple ports
nc -zv 127.0.0.1 20-30 # range of ports
```

> Note: pour tester une port sur le protocole UDP, utiliser `nc -u`

<br/>

### bash

```
cat < /dev/tcp/hostname/port
-bash: connect: Connection refused # closed
```

<br/>

### curl 

```
curl http://hostname:port

curl: (7) couldn't connect to host #closed
curl: (7) Failed connect to hostname:port; Connection refused #closed
ou
curl: (56) Failure when receiving data from the peer #opened
```

<br/>

## Nmap 

```
# Usage: 
# nmap [scan type(s)] [Options] {target(s)}
sudo nmap -Pn -A 192.168.99.100

# Useful scan types:
# -Pn: skip ping probes
# -sS: SYN scan
# -A: Aggressive <=> OS fingerprinting, service versions, traceroutes, runs script scans
# -p <port>: pour scanner un port particulier
```

![image](/images/syn-syn-ack-ack.png)

<br/>

# Quel port est utilisé par un service ?

Exemple avec le service ntp:

```
netstat -tulpn | grep ntpd
```

<br/>

On voit que le service ntp utilise le port 123:
```
udp 0 0 192.168.87.144:123 0.0.0.0:* 1885/ntpd
udp 0 0 127.0.0.1:123 0.0.0.0:* 1885/ntpd
udp 0 0 0.0.0.0:123 0.0.0.0:* 1885/ntpd
udp 0 0 fe80::20c:29ff:fe62:f03:123 :::* 1885/ntpd
udp 0 0 ::1:123 :::* 1885/ntpd
udp 0 0 :::123 :::* 1885/ntpd 
```

