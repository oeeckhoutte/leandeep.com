# Diagnostiquer les dysfonctionnements DNS

- Canonical URL: https://leandeep.com/diagnostiquer-les-dysfonctionnements-dns/
- Author: Olivier Eeckhoutte
- Published: 2015-04-27T19:59:00Z
- Updated: 2015-04-27T19:59:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Rappel des différents type d’enregistrements DNS:

```
A : Renvoie une adresse IPv4 pour un nom de host donné.
AAA : Renvoie une adresse IPv6 pour un nom de host donné.
NS : Délègue la gestion d’une zone à un serveur de nom faisant autorité.
CNAME : Permet de réaliser un alias d’un host vers un autre.
SOA : Définit le serveur maître du domaine.
PTR : Réalise l’inverse de l’enregistrement A ou AAAA, donne un nom de host (FQDN) pour une adresse IP.
MX : Définit le nom du serveur de courrier du domaine.
TXT : Une chaîne de caractères libres.
```

<br/>

Utiliser la command dig pour :

1. Voir les serveurs de messagerie d'un domaine (MX) :
```
dig mx leandeep.com +short
1 mx1.ovh.net.
5 mx2.ovh.net.
100 mxb.ovh.net.
```

<br/>

2. Connaitre l'IP du serveur DNS:

```
dig leandeep.com

; <<>> DiG 9.10.6 <<>> leandeep.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 52800
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4000
;; QUESTION SECTION:
;leandeep.com.			IN	A

;; ANSWER SECTION:
leandeep.com.		200	IN	A	174.138.9.130

;; Query time: 2 msec
;; SERVER: 10.0.0.1#53(10.0.0.1)
;; WHEN: Thu Nov 08 10:40:29 CET 2018
;; MSG SIZE  rcvd: 57
```

<br/>

3. Résolution inverse à partir de l'IP

```
dig -x 8.8.8.8 +short
google-public-dns-a.google.com.
```

<br/>

4. Tester la résolution de nom avec un autre serveur DNS

```
dig @193.173.98.151 lean-deep.com +short
```

<br/>

5. Avoir le plus d'informations possible

```
dig leandeep.com ANY
; <<>> DiG 9.10.6 <<>> leandeep.com ANY
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 35656
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 4

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4000
;; QUESTION SECTION:
;leandeep.com.			IN	ANY

;; ANSWER SECTION:
leandeep.com.		2797	IN	A	174.138.9.130
leandeep.com.		2870	IN	MX	5 mx2.ovh.net.
leandeep.com.		2870	IN	MX	100 mxb.ovh.net.
leandeep.com.		2870	IN	MX	1 mx1.ovh.net.

;; ADDITIONAL SECTION:
mx2.ovh.net.		7380	IN	A	87.98.132.45
mxb.ovh.net.		7380	IN	A	46.105.45.21
mx1.ovh.net.		39570	IN	A	188.165.47.122

;; Query time: 3 msec
;; SERVER: 10.0.0.1#53(10.0.0.1)
;; WHEN: Thu Nov 08 10:57:36 CET 2018
;; MSG SIZE  rcvd: 172
```

