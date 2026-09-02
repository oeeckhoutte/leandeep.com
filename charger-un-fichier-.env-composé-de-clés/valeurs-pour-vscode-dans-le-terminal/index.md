# Charger un fichier .env composé de clés/valeurs pour VSCode dans le terminal

- Canonical URL: https://leandeep.com/charger-un-fichier-.env-compos%C3%A9-de-cl%C3%A9s/valeurs-pour-vscode-dans-le-terminal/
- Author: Olivier Eeckhoutte
- Published: 2015-07-02T22:23:00Z
- Updated: 2015-07-02T22:23:00Z
- Language: fr
- Tags: VSCode, Debugging
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Travailler avec des fichiers `.env` est très utile en développement. 

L'exemple le plus courant pourrait ressembler à ceci:
```
export SERVER_URL='blablabla'
...
```

Il suffit de *sourcer* ce fichier et tout l'environnement d'exécution est configuré avec les bonnes variables.

Par contre, ce pose problème avec des outils comme VSCode. Les mots clés comme `export` ne sont pas compatibles. VSCode attend en effet uniquement des fichiers composés de clés/ valeurs.

Par exemple, la configuration VScode `.vscode/launch.json` suivante n'est pas compatible avec ce genre de fichiers `.env`:

```
{
    "name": "Python: Current File",
    "type": "python",
    "request": "launch",
    "program": "${file}",
    "console": "integratedTerminal",
    "stopOnEntry": true,
    "python.envFile": ".env"
}
```

La solution à ce problème est de travailler avec des fichiers composés de clés/ valeurs uniquement comme ceci:

```
SERVER_URL='blablabla'
...
```

Ce sera compatible avec VSCode et pour que cela fonctionne dans un Terminal il ne faut plus utiliser la commande source mais la commande suivante:

```
# Cette commande gère les espaces grâce au -d et ignore les lignes commentées grâce au grep -v '^#'

$ export $(grep -v '^#' .env | xargs -d '\n')


Sur Mac, il faut utiliser la commande suivante:

$ export $(grep -v '^#' .env | xargs -0)

Ou alternative:

$ eval $(cat .env | sed 's/^/export /')
```

