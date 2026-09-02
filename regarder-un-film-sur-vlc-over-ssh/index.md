# Regarder un film sur vlc over SSH

- Canonical URL: https://leandeep.com/regarder-un-film-sur-vlc-over-ssh/
- Author: Olivier Eeckhoutte
- Published: 2020-10-08T18:49:00+02:00
- Updated: 2020-10-08T18:49:00+02:00
- Language: fr
- Tags: VLC, SSH, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Tout est dans le titre. Avec la commande ci-dessous, vous pouvez visionner sur VLC un film présent sur une machine distante via SFTP (Secure File Transfer Protocol).
C'est très pratique si vous avez du contenu vidéo sur une autre machine et vous ne voulez pas attendre de le télécharger pour le regarder. 

<br/>

```
vlc sftp://user@host:/path/to/file
```

<br/>

Bon visionnage.
