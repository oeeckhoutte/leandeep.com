# Démarrer un PC à distance à travers un VPN

- Canonical URL: https://leandeep.com/d%C3%A9marrer-un-pc-%C3%A0-distance-%C3%A0-travers-un-vpn/
- Author: Olivier Eeckhoutte
- Published: 2013-02-18T08:24:00Z
- Updated: 2013-02-18T08:24:00Z
- Language: fr
- Tags: Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Pour démarrer un PC à distance via VPN, c'est assez simple.

Il faut configurer le BIOS de la machine pour qu'elle accepte le boot via Wake-On-Lan. En général, c'est disponible sur tous les PCs.

Ensuite il faut un VPN. Dans mon cas j'utilise un OpenVPN Bridge pour avoir accès aux machines grâce aux IPs locales que je connais déjà.

Ensuite si mon PC distant est éteint il me suffit d'exécuter la commande suivante qui va *broadcaster* un paquet "magique" sur tout mon réseau domestique.

```
wakeonlan -i ip_broadcast -p 1234 adresse_mac_de_mon_pc

# ip_broadcast en général 192.168.1.255 ou 192.168.0.255 avec nos box ADSL classiques
```

