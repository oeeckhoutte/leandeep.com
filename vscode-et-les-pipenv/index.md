# VSCode et les pipenv

- Canonical URL: https://leandeep.com/vscode-et-les-pipenv/
- Author: Olivier Eeckhoutte
- Published: 2019-05-22T18:19:00Z
- Updated: 2019-05-22T18:19:00Z
- Language: fr
- Tags: VSCode, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Introduction 

`Pipenv` est un utilitaire pratique permettant de gérer facilement les dépendances de ses projets avec des environnements virtuels.
C'est l'équivalent de `npm` en NodeJS. Il est un peu plus avancé que les `virtualenv`.

Voici comment utiliser pipenv avec Visual Studio Code. 

<br/>

## Virtual environment création & pipenv installation

Imaginez que vous cloniez un projet qui contient un fichier Pipfile. La première chose à faire est d'excuter la commande `pipenv install --dev --python version_installee_par_pyenv`. Cette commande va créer un environnement virtuel dans le répertoire suivant `~/.local/share/virtualenvs/` ou dans `~/.virtualenvs/` en fonction de votre OS et paramètres d'installation.

> Bien sûr pipenv doit être installé sur votre poste. Pour ce faire, il suffit d'exécuter la commande suivante: `pip3 install --user pipenv`.

<br/>

## pyenv

Pyenv vous permet d'installer des versions de Python très facilement. C'est l'équivalent de `nvm` en NodeJS. 

Par exemple `pyenv install 3.7.1` permet de télécharger et d'installer Python 3.7.1 sur son poste.

> Note: zlib et sqlite sont nécessaires pour que pyenv fonctionne. Il faut exécuter les commandes suivantes: `brew install zlib` et `brew install sqlite`

> Si vous utilisez Fish Shell la config suivante est à ajouter dans votre fichier `~/.config/fish/config.fish`:

```
# pyenv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
#pyenv init - | source ## permet de démarrer un virtualenv au démarrage d'une session d'un terminal
#pyenv rehash >/dev/null ^&1

# Build python

# For compilers to find zlib and sqlite you may need to set:
export LDFLAGS="$LDFLAGS -L/usr/local/opt/zlib/lib"
export LDFLAGS="$LDFLAGS -L/usr/local/opt/sqlite/lib"
export CPPFLAGS="$CPPFLAGS -I/usr/local/opt/zlib/include"
export CPPFLAGS="$CPPFLAGS -I/usr/local/opt/sqlite/include"

# For pkg-config to find zlib and sqlite you may need to set:
export PKG_CONFIG_PATH="$PKG_CONFIG_PATH /usr/local/opt/zlib/lib/pkgconfig"
export PKG_CONFIG_PATH="$PKG_CONFIG_PATH /usr/local/opt/sqlite/lib/pkgconfig"
```

<br/>

## VSCode config 

Exécutez la commande suivante pour configurer VSCode pour votre projet:

```
mkdir .vscode && touch .vscode/settings.json
```

<br/>

**Contenu du fichier `.vscode/settings.json`**. Je suppose que vos tests sont réalisés avec Pytest:

```
{
    "python.pythonPath": "/Users/olivier/.virtualenvs/MON_VIRTUAL_ENV/bin/python",
    "python.linting.enabled": true,
    "python.linting.flake8Enabled": true,
    "python.formatting.provider": "black",
    "editor.rulers": [
        79
    ]
}
```

Remplacez `/Users/olivier/.virtualenvs/MON_VIRTUAL_ENV/bin/python` par votre propre virtualenv créé lors de l'exécution de la commande `pipenv install --dev --python version_installee_par_pyenv`. Pour connaître le path de votre virtualenv vous pouvez utiliser la commande `pipenv --py`.

> Note: Si un terminal était déjà ouvert dans VSCode et que le virtualenv n'a pas été pris en compte, on peut utiliser la commande `pipenv shell` pour basculer dessus.

Et voilà c'est tout, c'est simple !

> Si vous allez dans l'onglet Tests dans VScode et que vos tests sont automatiquement détectés, c'est que tout est bien configuré.

<br/>

## Alternative (virtualenvwrapper)

Utiliser Virtualenvwrapper https://virtualenvwrapper.readthedocs.io. Cela fonctionne extrèmement bien.  

<br/>

Pour créer un environnement il suffit d'utiliser la commande suivante:

```
mkvirtualenv -p /usr/local/bin/python3.7 -a . ai_env
```

<br/>

Pour dire à VSCode de proposer un interprêteur Python créé dans un virtualenv(wrapper) lorsque l'on exécute la commande `cmd + shift + p --> Python: Select interpreter`, il suffit de lui ajouter la variable globale ci-dessous et de le redémarrer.

```
"python.venvPath": "$HOME/.virtualenvs",

# ou un autre répertoire si vous avez configuré autre chose comme répertoire par défaut pour virtualenvwrapper dans votre ~/.zshrc...
```

<br/>

## Quick tip

Il est possible de convertir un fichier `Pipfile.lock` en `requirements.txt` grâce à la commande suivante: 

```
jq -r '.default
        | to_entries[]
        | .key + .value.version' \
    Pipfile.lock > requirements.txt
    
```

<br/>

Le petit alias qui va bien pour son `~/.zshrc`:

```
alias pipfile_to_requirements='
jq -r ".default
        | to_entries[]
        | .key + .value.version" \
    Pipfile.lock > requirements.txt'

```


