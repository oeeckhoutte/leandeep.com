# Gérer plusieurs environnements virtuels sans se prendre la tête

- Canonical URL: https://leandeep.com/g%C3%A9rer-plusieurs-environnements-virtuels-sans-se-prendre-la-t%C3%AAte/
- Author: Olivier Eeckhoutte
- Published: 2016-05-13T21:36:00Z
- Updated: 2016-05-13T21:36:00Z
- Language: fr
- Tags: Python, Tooling
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**virtualenvwrapper** est un utilitaire intéressant pour pouvoir switcher d'un environnement à un autre très simplement sur le même projet ou sur des projets différents. 

> Cet outil ne fonctionne pas sur Windows

## Installation 

```
pip install virtualenv
pip install --user virtualenvwrapper
```
Ensuite il faut rajouter quelques lignes dans `~/.zshrc` (ou `~/.bashrc` ou `~/.bash_profile`):

```	
export WORKON_HOME=~/.virtualenvs
mkdir -p $WORKON_HOME
source ~/.local/bin/virtualenvwrapper.sh
```

> Selon où vous avez installé virtualenvwrapper, la dernière ligne peut changer.
> Vérifiez que votre PATH contient bien le répertoire `~/.local/bin`. Si ce n'est pas le cas, ajoutez la commande suivante à votre fichier `~/.zshrc`: `export PATH=$PATH:~/.local/bin`

--- Update du 15/11/2019 ---

**Installer virtualenvwrapper sur OS X Catalina:**

Installer Python 2.x:
```
brew install python@2
```

Ajouter la ligne suivante dans votre `~/.zshrc`:
```
export PATH="/usr/local/opt/python/libexec/bin:/usr/local/bin:$PATH"
```

Installer virtualenv et virtualenvwrapper:
```
pip install virtualenv
pip install virtualenvwrapper
```

Vérifier le bon fonctionnement:
```
mkvirtualenv -p /usr/bin/python3 -a . ai_env
```

## Commandes de base 

On a maintenant accès à de nouvelles commandes: 
```
# Créer un virtualenv dans le dossier ~/.virtualenvs, où que vous soyez
mkvirtualenv [-p /Users/olivier/.pyenv/shims/python] [-a .] nom_de_votre_env


# Activer automatiquement un env, où que vous soyez.
workon nom_de_votre_env 

# supprimer un environnement 
rmvirtualenv nom_de_votre_env 
```

**Les options de `mkvirtualenv` sont les mêmes que pour la commande `virtualenv`, vous n’avez juste plus à vous souciez de où sont vos environnements, ni de où vous êtes.**


## Autres commandes utiles

Lister tous les environnements:
```
lsvirtualenv
```

Naviguez dans le répertoire de l’environnement virtuel activé:
```
cdvirtualenv
```

Accéder au répertoire site-packages de l'environnement activé:
```
cdsitepackages
```

Montre le contenu du répertoire site-packages:
```
lssitepackages
```

Redéfinir le répertoire par défault du virtualenv
```
cd /votre/nouveau/repertoire/par/defaut
setvirtualenvproject
```

Liste complète des commandes:
http://virtualenvwrapper.readthedocs.org/en/latest/command_ref.html

