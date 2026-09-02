# Installer un VNC Server sur Linux

- Canonical URL: https://leandeep.com/installer-un-vnc-server-sur-linux/
- Author: Olivier Eeckhoutte
- Published: 2014-07-27T23:03:00Z
- Updated: 2014-07-27T23:03:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans cet article nous allons voir comment installer un serveur VNC sur Linux. 

<br/>

## Steps

**Désinstaller le serveur Vino (souvent présent par défaut)**
```
sudo apt-get -y remove vino
```

<br/>

**Installer x11vnc**
```
sudo apt-get -y install x11vnc
```

<br/>

**Créer le mot de passe encrypté**
```
x11vnc -storepasswd "votre_mot_de_passe" ~/.vnc_passwd
```

<br/>

**Créer un service x11vnc dans systemd**
```
sudo vim /lib/systemd/system/x11vnc.service
```

<br/>

Et copier/coller le code suivant à l'intérieur du nouveau fichier:
```
[Unit]
Description=x11vnc remote desktop server
After=multi-user.target

[Service]
Type=simple
ExecStart=/usr/bin/x11vnc -auth guess -forever -loop -noxdamage -repeat -rfbauth /home/olivier/.vnc/passwd -rfbport 5900 -shared

Restart=on-failure

[Install]
WantedBy=multi-user.target
```

<br/>

**Reloader les services**
```
sudo systemctl daemon-reload
```

<br/>

**Activer le service x11vnc au boot**
```
sudo systemctl enable x11vnc.service
```

<br/>

**Démarrer le service (ou reboot)**
```
sudo systemctl start x11vnc.service
```

<br/>

Rebooter puis vérifier que vous pouvez établir une connection VNC sur le port 5900.

<br/>

## Troubleshooting

Si vous rencontez l'erreur suivante:
```
xauth:  unable to generate an authority file name
```

<br/>

Utiliser le bureau lightgdm:
```
cat /etc/X11/default-display-manager 
sudo apt install ubuntu-unity-desktop
# Si ubuntu-unity-desktop est déjà installé
# sudo dpkg-reconfigure gdm3 
```

<br/>

Selectionner donc le bureau lightgdm puis rebooter pour vérifier que cela fonctionne.

Pour vérifier que le serveur VNC est bien démarré:
```
// make sure 5900 port is listening:
$ netstat -antp | grep 5900
(Not all processes could be identified, non-owned process info
 will not be shown, you would have to be root to see it all.)
tcp        0      0 0.0.0.0:5900            0.0.0.0:*               LISTEN      -
tcp6       0      0 :::5900                 :::*                    LISTEN      -
```

