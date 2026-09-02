# Enregistrer vos playlists Youtube en mp3 ou mp4 via le CLI

- Canonical URL: https://leandeep.com/enregistrer-vos-playlists-youtube-en-mp3-ou-mp4-via-le-cli/
- Author: Olivier Eeckhoutte
- Published: 2023-01-07T07:00:00+02:00
- Updated: 2023-01-07T07:00:00+02:00
- Language: fr
- Tags: python_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petit tip du jour de 25 secondes: pour enregistrer automatiquement via cli vos playlists Youtube en MP3, il vous suffit d'utiliser le package Python `yt-dlp`.

```
pip install yt-dlp
```

<br/>
**Enregistrement mp3**
```
yt-dlp -f 'ba' -x --audio-format mp3 lien_vers_votre_playlist
```

<br/>
**Enregistrement mp4**
```
# Best video quality
yt-dlp lien_vers_votre_playlist -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"

# Worst video quality mais high quality audio
yt-dlp lien_vers_votre_playlist -f "worstvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"
```

<br/>
**Enregistrement en qualité 720p**

```
-S "res:720,fps"
```

<br/>
**Enregistrement avec sous-titres anglais**

```
--write-sub --write-auto-sub --sub-lang "en.*"
```

