# Renouveler son TLS cert

- Canonical URL: https://leandeep.com/renouveler-son-tls-cert/
- Author: Olivier Eeckhoutte
- Published: 2022-07-26T22:13:00Z
- Updated: 2022-07-26T22:13:00Z
- Language: fr
- Tags: TLS, Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Vérifier la validité d'un certificat depuis le fichier CRT

```
openssl x509 -enddate -noout -in server.crt
```

<br/>

## Vérifier la date de validité d'un service distant

```
openssl s_client -servername www.leandeep.com -connect www.leandeep.com:443
```

<br/>

## Renouveler le CSR à partir de la clé privée

> `csr` pour `Certificate Signing Request`

```
openssl req -new -key star_leandeep_com-private-key.key -out csr.txt
```
