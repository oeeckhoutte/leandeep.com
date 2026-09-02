# Debug des certificats SSL

- Canonical URL: https://leandeep.com/debug-des-certificats-ssl/
- Author: Olivier Eeckhoutte
- Published: 2015-07-01T19:43:00Z
- Updated: 2015-07-01T19:43:00Z
- Language: fr
- Tags: Unix Tip, tips, Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voir tous les SAN (Subjects Alternative Names) d'un CSR (Certificate Signing Request):

```
openssl req -noout -text -in my_csr.csr | grep DNS
```

<br/>

Voir tous les SAN dans un certificat pem:
```
cat my_pem.pem | openssl x509 -text | grep DNS
```

<br/>

Voir le certificat d'un site web:
```
openssl s_client -connect {HOSTNAME}:{PORT} -showcerts
```

<br/>

Sauvegarder le certificat d'un site web dans un fichier PEM:
```
openssl s_client -connect {HOSTNAME}:{PORT} -showcerts </dev/null 2>/dev/null|openssl x509 -outform PEM > dl_cert_file.pem
```

