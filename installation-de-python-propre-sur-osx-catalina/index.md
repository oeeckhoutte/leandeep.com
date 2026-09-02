# Installation de Python propre sur OSX Catalina

- Canonical URL: https://leandeep.com/installation-de-python-propre-sur-osx-catalina/
- Author: Olivier Eeckhoutte
- Published: 2020-10-01T19:49:00+02:00
- Updated: 2020-10-01T19:49:00+02:00
- Language: fr
- Tags: Python, OSX
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Il existe tellement d'outils pour gérer son installation de Python sur OSX que cela peut vite devenir un cauchemar. 
Nous sommes début octobre 2020, peu de temps avant la sortie de OSX Big Sur, cet article dédié à Catalina peut paraître déjà dépassé mais je vous recommande vraiment d'attendre avant de l'installer. Personnellement j'attends toujours minimum 6 mois à 1 an avant d'upgrader OSX, le temps que les premiers correctifs en tous genres aient été réalisé. 

OSX Catalina a souffert d'un problème avec openssl. Dans cet article, nous allons voir comment installer proprement Python avec virtualenvwrapper. C'est simple et efficace et on peut switcher d'environnements en environnements avec 2 versions de Python 3. Nous allons aussi appliquer le fix pour openssl.

<br/>

# Installation 

**Installation de Python et OpenSSL**

```
brew update && brew upgrade
brew doctor
# S'il y a un problème:
brew missing

# Installation de openssl@1.1 1.1.1g
brew install openssl

brew install python@3.7
brew install python@3.8
```

<br/>

**Installation de virtualenvwrapper**

```
python3 -m pip install virtualenv
python3 -m pip install virtualenvwrapper
```

<br/>

Ajouter les lignes suivantes dans `~/.zshrc`:

```
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/Devel
source /usr/local/bin/virtualenvwrapper.sh
```

<br/>

Mettre à jour zsh:

```
source ~/.zshrc
```

<br/>

**Création d'un environnement virtuel**

```
mkvirtualenv py3_env -p python3 -a .
```

<br/>

**Fix OpenSSL issue**

**Option 1**

> Erreur system: `"Invalid dylib load. Clients should not load the unversioned libcrypto dylib as it does not have a stable ABI."`

```
cd /usr/local/Cellar/openssl@1.1/1.1.1g/lib
sudo cp libssl.*.dylib libcrypto.*.dylib /usr/local/lib/
cd /usr/local/lib
mv libssl.dylib libssl_bak.dylib
# ou mv libssl3.dylib libssl3_bak.dylib
mv libcrypto.dylib libcrypto_bak.dylib
# ou mv libcrypto3.dylib libcrypto3_bak.dylib
sudo ln -s libcrypto.1.1.dylib libcrypto.dylib
sudo ln -s libssl.1.1.dylib libssl.dylib
```

<br/>

**Option 2**

Rendez-vous sur https://www.openssl.org/source/old/ et télécharger la version d'openssl que vous avez besoin.

Allez dans le dossier nouvellement créé après avoir extrait l'archive. Exécuter ensuite les commandes suivantes:

```
make clean
./Configure darwin64-x86_64-cc -shared
make
make install
```

Placer enfin `libcrypto.1.0.0.dylib` et `libssl.1.0.0.dylib` dans le répertoire `/usr/local/Cellar/openssl/lib/` ou `/usr/local/Cellar/openssl@1.1/lib/` si le précédent n'existe pas.
