# Reset syncthing Web GUI credentials

- Canonical URL: https://leandeep.com/reset-syncthing-web-gui-credentials/
- Author: Olivier Eeckhoutte
- Published: 2021-12-19T12:49:00+02:00
- Updated: 2021-12-19T12:49:00+02:00
- Language: fr
- Tags: Backup, Syncthing
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


**Stopper le service Syncthing**

```
systemctl status syncthing@olivier.service
systemctl stop syncthing@olivier.service
systemctl status syncthing@olivier.service
```

<br/>

**Retirer le username et password de la conf syncthing**

Retirer les lignes suivantes du fichier `~/.config/syncthing/config.xml`:
<br/>
`<user>...</user>`
<br/>
`<password>...</password>`


<br/>

**Démarrer le service Syncthing**

```
systemctl start syncthing@olivier.service
```

<br/>

**Ajout des nouveaux creds**

Ouvrez le Web GUI (généralement https://127.0.0.1:8384) et cliquez sur le bandeau rouge indiquant qu'il n'y a pas de mot de passe configuré pour le GUI. <br/>
Dans la fenêtre qui s'ouvre ajoutez des nouveaux credentials et sauvegardez.

