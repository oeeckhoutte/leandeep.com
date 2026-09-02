# Utiliser une IP fixe dans son terminal via proxy socks

- Canonical URL: https://leandeep.com/utiliser-une-ip-fixe-dans-son-terminal-via-proxy-socks/
- Author: Olivier Eeckhoutte
- Published: 2023-09-05T23:46:00+02:00
- Updated: 2023-09-05T23:46:00+02:00
- Language: fr
- Tags: Python, tips, Starlink
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici un tip pour utiliser une IP fixe depuis son terminal quand son FAI ne fournit pas d'adresse IP statique. C'est le cas par exemple avec Starlink, SFR ou Orange...

Pour ce faire, il suffit d'utiliser un proxy socks. Si vous avez une VM sur le cloud accessible directement via SSH, vous pouvez utiliser les commandes suivantes:

<br/>

Dans un premier onglet de votre terminal exécuter la commande suivante:
```
ssh -D 6006 -q -C -N user@ip_or_reverse_dns
```

<br/>

Puis dans un second onglet:

```
curl https://ipinfo.io/ip # Résultat: IP dynamique
export http_proxy=http://127.0.0.1:6006
export https_proxy=http://127.0.0.1:6006
curl https://ipinfo.io/ip # Résultat: IP de votre remote VM
```

<br/>

That's it as simple as that.

<br/>

> Si vous utilisez Python, vous aurez besoin du package `pip install pysocks`

