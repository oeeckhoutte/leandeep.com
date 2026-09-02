# Obtenir les sous-titres d'un film en 2 secondes

- Canonical URL: https://leandeep.com/obtenir-les-sous-titres-dun-film-en-2-secondes/
- Author: Olivier Eeckhoutte
- Published: 2016-12-30T21:26:00Z
- Updated: 2016-12-30T21:26:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Aujourd'hui nous allons voir une petite astuce plutôt utile si vous aimez regarder des films ou séries en VO et avoir à disposition les sous-titres (en français ou anglais). 
J'ai trouvé un projet opensource permettant de télécharger automatiquement les sous-titres. https://github.com/Diaoul/subliminal

Si vous avez Docker, exécutez la commande suivante: 

```
docker run --rm --name subliminal -v /Users/olivier/Movies/Series/subliminal_cache:/usr/src/cache -v /Users/olivier/Movies/Series:/Users/olivier/Movies/Series -it diaoulael/subliminal download -l en /Users/olivier/Movies/Series/votre_serie_ou_film.mkv
```

Si vous voulez automatiser davantage, ce repository vous donne un snippet permettant de scanner le contenu d'un dossier et télécharger des sous-titres.

```
from datetime import timedelta

from babelfish import Language
from subliminal import download_best_subtitles, region, save_subtitles, scan_videos

# configure the cache
region.configure('dogpile.cache.dbm', arguments={'filename': 'cachefile.dbm'})

# scan for videos newer than 2 weeks and their existing subtitles in a folder
videos = scan_videos('/video/folder', age=timedelta(weeks=2))

# download best subtitles
subtitles = download_best_subtitles(videos, {Language('eng'), Language('fra')})

# save them to disk, next to the video
for v in videos:
    save_subtitles(v, subtitles[v])
```

