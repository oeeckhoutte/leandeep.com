# Convertir une video .webm en .mp4

- Canonical URL: https://leandeep.com/convertir-une-video-.webm-en-.mp4/
- Author: Olivier Eeckhoutte
- Published: 2018-12-02T11:14:00Z
- Updated: 2018-12-02T11:14:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Si comme moi vous aimez écouter en voiture des conférences enregistrées et que vous avez un iPhone, vous savez que le format mp4 est indispensable pour passer par iTunes. 

Pour convertir une vidéo .webm en .mp4, il suffit d'utiliser les commandes suivantes:

```
# Si vous ne l'avez pas déjà
# brew install ffmpeg

ffmpeg -i <votre-video>.webm <votre-video>.mp4
```

Il ne faut surtout pas de logiciel payant !

