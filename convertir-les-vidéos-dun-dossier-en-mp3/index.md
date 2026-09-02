# Convertir les vidéos d'un dossier en mp3

- Canonical URL: https://leandeep.com/convertir-les-vid%C3%A9os-dun-dossier-en-mp3/
- Author: Olivier Eeckhoutte
- Published: 2013-05-13T23:03:00Z
- Updated: 2013-05-13T23:03:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Convertir les .mp4 d'un dossier en MP3:
```
mkdir outputs
for f in *.mp4; do ffmpeg -i "$f" -c:a libmp3lame "outputs/${f%.mp4}.mp3"; done
```

Convertir les .m4a, .mov et .flac d'un dossier en MP3:
```
mkdir outputs
for f in *.{m4a,mov,flac}; do ffmpeg -i "$f" -c:a libmp3lame "outputs/${f%.*}.mp3"; done
```

Convertir toutes les vidéos d'un dossier en MP3:
```
mkdir outputs
for f in *; do ffmpeg -i "$f" -c:a libmp3lame "outputs/${f%.*}.mp3"; done
```

