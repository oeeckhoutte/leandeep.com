# Installer Tailscale sur Fedora

- Canonical URL: https://leandeep.com/installer-tailscale-sur-fedora/
- Author: Olivier Eeckhoutte
- Published: 2024-12-11T23:32:00+02:00
- Updated: 2024-12-11T23:32:00+02:00
- Language: fr
- Tags: tips, Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Pour installer Tailscale sur Fedora Desktop, suivez les étapes ci-dessous. Tailscale permet de configurer un réseau privé virtuel (VPN) de manière simple, en s'appuyant sur WireGuard.


**Installer Tailscale**
```
sudo dnf install tailscale
```

<br/>

**Démarrer et activer Tailscale**

```
sudo systemctl start tailscaled
sudo systemctl enable tailscaled
```

<br/>

**Connecter votre desktop à Tailscale**

Editer le fichier `sudo vim /etc/sysctl.conf`:

```
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

Et appliquer les changements:
```
sudo sysctl -p
```

<br/>

**Lancer l'authentification**

```
sudo tailscale up --advertise-exit-node
```

<br/>

**Troubleshooting**
```
tailscale status
```

<br/>

**Update**

Tailscale sera mis à jour automatiquement via dnf lors des mises à jour du système. Vous pouvez également le mettre à jour manuellement avec:
```
sudo dnf update tailscale
```

