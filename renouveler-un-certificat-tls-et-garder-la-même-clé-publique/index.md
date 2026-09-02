# Renouveler un certificat TLS et garder la même clé publique

- Canonical URL: https://leandeep.com/renouveler-un-certificat-tls-et-garder-la-m%C3%AAme-cl%C3%A9-publique/
- Author: Olivier Eeckhoutte
- Published: 2021-09-21T08:08:00Z
- Updated: 2021-09-21T08:08:00Z
- Language: fr
- Tags: TLS, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici la procédure à suivre pour renouveler un certificat TLS et garder la même clé publique que précédemment (donc pas changer la clé privée).

Pour ce faire, il vous faudra récupérer la clé privée précédemment utilisée. Dans notre exemple la clé privée sera contenue dans le fichier `private_key.key`.

Ensuite, il n'y a plus qu'à générer un CSR (Certificate Signing Request) et de l'uploader sur le site vous fournissant un certif valide (autorité de certification). 

Vous obtiendrez certainement un fichier `.crt` qu'il faudra installer sur le serveur où le certificat a expiré.

```
openssl req -new -key private_key.key -out new_csr.csr
```

> Le "challenge password" n'est pas indispensable. Il n'est pas utilisé comme une passphase. Il permet de s'identifier auprès de l'autorité de certification si nécessaire.
