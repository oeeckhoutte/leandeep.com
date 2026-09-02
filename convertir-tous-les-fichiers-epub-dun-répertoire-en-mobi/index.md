# Convertir tous les fichiers epub d'un répertoire en mobi

- Canonical URL: https://leandeep.com/convertir-tous-les-fichiers-epub-dun-r%C3%A9pertoire-en-mobi/
- Author: Lean Deep
- Published: 2019-06-27T23:00:00Z
- Updated: 2019-06-27T23:00:00Z
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici la commande pour convertir tous les fichiers epub d'un répertoire en fichiers mobi.

En pré-requis, il faut installer le logiciel calibre.

```
# Pour Linux
apt-get install calibre

# Pour OSX
brew cask install calibre
```

<br/>

Ensuite, on peut utiliser le script suivant:

```
for book in *.epub; do echo "Converting $book"; ebook-convert "$book" "$(basename "$book" .epub).mobi"; done
```

