# Proxies HTTP et SOCKS via gcloud

- Canonical URL: https://leandeep.com/proxies-http-et-socks-via-gcloud/
- Author: Olivier Eeckhoutte
- Published: 2022-09-23T09:22:00Z
- Updated: 2022-09-23T09:22:00Z
- Language: fr
- Tags: tips, Proxy, socks5, gcloud
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article très rapide nous allons voir comment créer une proxy SOCKS ou HTTP via une instance Google Cloud. On va juste utiliser le cli `gcloud` et un binaire open source. 

<br/>


## Lancement du proxy Socks

> Récupérer l'ID de son instance `./gcloud compute instances list`
```
cd PATH_TO_GCLOUD_SI_PAS_DANS_$PATH
export PORT_DU_PROXY=
./gcloud compute ssh NOM_DE_VOTRE_INSTANCE --project NOM_DE_VOTRE_PROJET --zone LA_ZONE_QUI_CONTIENT_VOTRE_INSTANCE --ssh-flag="-D" --ssh-flag="$PORT_DU_PROXY" --ssh-flag="-N"
```


<br/>

## Vérification

`curl --socks5 127.0.0.1:$PORT_DU_PROXY https://ipinfo.io/ip`


<br/>

## Besoin d'un proxy http ?

Pas de souci, vous pouvez utiliser le projet Rust suivant https://github.com/KaranGauswami/socks-to-http-proxy (licence MIT) qui convertit votre proxy SOCKS en proxy HTTP. Vous pouvez aussi utiliser le fork que j'ai créé oeeckhoutte/socks-to-http-proxy. Je n'ai pas détecté de vulnérabilité jusqu'au commit 3323c5809b38db4425ae11b935651e8abccf4875 (commit de mon fork)


```
git clone https://github.com/KaranGauswami/socks-to-http-proxy # ou oeeckhoutte/socks-to-http-proxy
cd socks-to-http-proxy
cargo build --release
cargo install cargo-audit
cargo audit
cd ~/Dev/Leandeep/socks-to-http-proxy/target/release

# J'ai analysé le code à la recherche de faille applicative et je n'ai rien trouvé. J'ai aussi modifié le code pour changer quelques options: interface d'écoute et ports par défaut (modifs non poussées).
./sthp
```

<br/>

## Seconde vérification

`curl --proxy localhost:PORT_HTTP_PROXY https://ipinfo.io/ip`

<br/>


## Configurer tout le terminal

> On exécute les 2 commandes suivantes pour que tout le terminal utilise le proxy http

```
export http_proxy=http://127.0.0.1:8090
export https_proxy=http://127.0.0.1:8090
```

<br/>

**Vérifications**

* `curl https://ipinfo.io/ip` -> OK
* `python3 -c "import json; import urllib.request; url_data='https://ipinfo.io/ip'; webURL = urllib.request.urlopen(url_data); data = webURL.read(); print(data)"` -> OK

