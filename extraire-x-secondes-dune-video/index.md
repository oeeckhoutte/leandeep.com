# Extraire x secondes d'une video

- Canonical URL: https://leandeep.com/extraire-x-secondes-dune-video/
- Author: Olivier Eeckhoutte
- Published: 2024-01-10T23:14:00Z
- Updated: 2024-01-10T23:14:00Z
- Language: fr
- Tags: ffmpeg, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici la commande pour extraire les 10 premières secondes d'une vidéo mp4:

**Retirer le son**
```
ffmpeg -i "source_file.mp4" -ss 00:00:0.0 -t 10 -an "target_file.mp4"

# ffmpeg -threads $(nproc) -i "source_file.mp4" -ss 00:00:0.0 -t 10 -an "target_file.mp4" 
```

<br/>

**Avec le son**
```
ffmpeg -i "source_file.mp4" -ss 00:00:0.0 -t 10 "target_file.mp4"
```

<br/>

**Avec le son et garder 10s à partir d'1min51**
```
ffmpeg -i "source_file.mp4" -ss 00:01:51.000 -t 10 "target_file.mp4"
```

