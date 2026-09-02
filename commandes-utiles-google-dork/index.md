# Commandes utiles Google Dork

- Canonical URL: https://leandeep.com/commandes-utiles-google-dork/
- Author: Olivier Eeckhoutte
- Published: 2016-12-29T06:48:00Z
- Updated: 2016-12-29T06:48:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici une liste de commandes utiles pour télécharger l'intégralité de *directory listings* trouvés grâce à des Google Dorks: 

Un google Dork est une signature typique d’une technologie Web parmi tout ce qui est indexé par Google. Ils sont lié à ce qu'on appelle plus généralement les Google Hacks. Vous savez les fameuses commandes comme par exemple `intitle:index.of? mkv <Movie Name>` ou `<Movie Name> -inurl:(htm|html|php|pls|txt) intitle:index.of "last modified" (mp4|wma|aac|avi)` ou `parent directory index of french dvdrip`


> Le Google hacking est une technique consistant à utiliser un moteur de recherche, généralement Google, en vue de chercher des vulnérabilités ou de récupérer des données sensibles. Cette technique s'appuie sur les résultats de l'exploration et de l'indexation des sites internet par le robot Googlebot. Source: Wikipédia

<br/>

Pour reprendre le téléchargement depuis là où il s'était arrêté:
```
wget -c www.myfileserver.com/file1.zip
```

<br/>

Pour télécharger depuis différents sites:
```
wget -i /path/to/inputfile
# /path/to/inputfile will contain:
http://www.myfileserver.com/file1.zip
http://www.myfileserver.com/file2.zip
http://www.myfileserver.com/file3.zip
```

<br/>

Pour faire 10 retries en cas d'arrêt de téléchargement:
```
wget -t 10 -i /path/to/inputfile
```

<br/>

Pour faire 10 retries en cas d'arrêt de téléchargement + timeout de 10 secondes entre 2 retries:
```
wget -t 10 -T 10 -i /path/to/inputfile
```

<br/>

Pour attendre entre 2 téléchargements: 
```
wget -w 60 -i /path/to/inputfile
```

<br/>

Pour ajouter un quota de 100m (en cas de limitation de bandwidth):
```
wget -q 100m -i /path/to/inputfile
```

<br/>

Pour télécharger tous les fichiers d'un dossier de manière récursive:
```
wget -r www.myfileserver.com
```

> if the TLS is not valid anymore: `--no-check-certificate`

<br/>

Pour télécharger tout le contenu d'un dossier
```
wget -np -r -l 2 --no-check-certificate www.myfileserver.com
```

<br/>

Par défaut la profondeur de téléchargement est de 5. Pour avoir un téléchargement de tout le contenu d'un site:
```
wget -r -l inf www.myfileserver.com
```

<br/>

Pour télécharger tous les fichiers d'un dossier de manière récursive et tout mettre dans le même dossier:
```
wget -nd -r
```

<br/>

L'inverse (i.e. créer l'arborescence de dossiers): 
```
wget -x -r
```

<br/>

Pour télécharger seulement certains types de fichiers: 
```
wget -A "*.mp3" -r
```

<br/>

L'inverse (télécharger tous les types de fichiers sauf):
```
wget -R "*.exe" -r
```

<br/>

Fake 302 redirects et Robots.txt
```
wget -x -P local_dir -U Mozilla --wait=60 --limit-rate=20K --convert-links -p -m <url-du-site-a-scraper>
```

Ajouter `-nH` à la commande précédente pour télécharger uniquement un dossier.

