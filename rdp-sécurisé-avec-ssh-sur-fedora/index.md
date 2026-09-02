# RDP sécurisé avec SSH sur Fedora

- Canonical URL: https://leandeep.com/rdp-s%C3%A9curis%C3%A9-avec-ssh-sur-fedora/
- Author: Olivier Eeckhoutte
- Published: 2024-12-11T23:32:00+02:00
- Updated: 2024-12-11T23:32:00+02:00
- Language: fr
- Tags: tips, Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir comment mettre en place un Remote Desktop Protocol (RDP) avec du SSH sur une distribution Fedora.

<br/>

**Installation**

```
sudo dnf install -y xrdp
sudo systemctl enable xrdp --now
```


<br/>


**Configuration**

```
sudo firewall-cmd --add-port=3389/tcp --permanent
sudo firewall-cmd --reload
```

<br/>

**Connexion**

On finalise la configuration. On désactive Wayland:

> Wayland est un protocole et une architecture de serveur d'affichage pour les systèmes d'exploitation basés sur Linux. Il remplace ou complète le serveur d'affichage X11 (ou X Window System) utilisé traditionnellement sur Linux depuis des décennies.

```
ssh -L 3389:localhost:3389 user@adresse_ip_fedora
```

Editer le fichier `sudo nano /etc/gdm/custom.conf` et ajouter la ligne suivante:

```
WaylandEnable=false
```

```
sudo systemctl restart gdm
```

> GDM (pour GNOME Display Manager) est un gestionnaire de session et d'affichage utilisé principalement avec l'environnement de bureau GNOME

<br/>

**Utilisation**

Pour prendre le contrôle de votre Fedora depuis OSX par exemple, installez `Windows Apps` depuis l'AppStore et configurez votre connexion avec vos credentials SSH + `localhost:3389`
