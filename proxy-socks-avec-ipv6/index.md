# Proxy socks avec IPv6

- Canonical URL: https://leandeep.com/proxy-socks-avec-ipv6/
- Author: Olivier Eeckhoutte
- Published: 2026-08-07T22:45:00Z
- Updated: 2026-08-07T22:45:00Z
- Language: fr
- Tags: Network, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici la commande pour créer un proxy socks avec un serveur dédié qui n'a qu'une interface en ipv6

```
ssh -N \
  -D 127.0.0.1:1080 \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  user@IP_V6::1
```

Pour l'utiliser dans un navigateur il suffit de spécifier socks proxy `::1` sur port `1080`.
