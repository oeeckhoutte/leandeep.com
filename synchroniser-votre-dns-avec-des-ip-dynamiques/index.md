# Synchroniser votre DNS avec des IP dynamiques

- Canonical URL: https://leandeep.com/synchroniser-votre-dns-avec-des-ip-dynamiques/
- Author: Lean Deep
- Published: 2019-09-17T17:39:19Z
- Updated: 2019-09-17T17:39:19Z
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

J'ai créé une petite image Docker permettant de mettre à jour l'IP publique de son instance sur Cloudflare.
Même s'il existe des Elastic IP (EIP), cela peut parfois être utile de ne pas les utiliser si votre instance est presque tout le temps éteinte. Comme on ne paye les EIP que lorsqu'elles ne sont pas attachées à des instances qui tournent cela peut faire grimper la facture inutilement; surtout quand on a pas mal d'instances dans cet état.  

Bref avec l'image Docker suivante `docker pull oeeckhoutte/cloudflare-dns` vous pouvez si vous avez un startup script toujours avoir accès à votre instance via votre DNS chez cloudflare. 

<br/>

Le code source est accessible sur Github à [l'adresse suivante](https://github.com/oeeckhoutte/cloudflare-dns-update-server-startup)


Si éventuellement vous avez besoin d'un startup script je vous renvoie [sur un précédent article que j'avais écrit](https://leandeep.com/cr%C3%A9er-un-script-qui-se-lance-au-d%C3%A9marrage-de-centos-7/).

<br/>

Pour utiliser cette image il suffit d'exécuter la commande suivante:

```
docker run --rm -e CF_API_KEY='0000000000000000000000000000000000000' -e CF_API_EMAIL='your.email@domain.com' -e DNS_TO_UPDATE='your_dns_or_subdns' -it cloudflare-dns
```

<br/>

Have fun.

