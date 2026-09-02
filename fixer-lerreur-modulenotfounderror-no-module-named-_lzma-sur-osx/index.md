# Fixer l'erreur 'ModuleNotFoundError: No module named _lzma' sur OSX

- Canonical URL: https://leandeep.com/fixer-lerreur-modulenotfounderror-no-module-named-_lzma-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2023-08-21T23:49:00+02:00
- Updated: 2023-08-21T23:49:00+02:00
- Language: fr
- Tags: Python, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici un tip pour fixer l'erreur ennuyeuse `ModuleNotFoundError: No module named '_lzma'` sur OSX lorsqu'on utilise `torch` et `pyenv`.

Installer les packages suivants:

```
brew install zlib
brew install sqlite
brew install bzip2
brew install libiconv
brew install libzip
```

<br/>

Ouvrir le fichier `~/.zshrc` et ajouter les lignes suivantes:

```
export LDFLAGS="${LDFLAGS} -L/usr/local/opt/zlib/lib"
export CPPFLAGS="${CPPFLAGS} -I/usr/local/opt/zlib/include"
export LDFLAGS="${LDFLAGS} -L/usr/local/opt/sqlite/lib"
export CPPFLAGS="${CPPFLAGS} -I/usr/local/opt/sqlite/include"
export PKG_CONFIG_PATH="${PKG_CONFIG_PATH} /usr/local/opt/zlib/lib/pkgconfig"
export PKG_CONFIG_PATH="${PKG_CONFIG_PATH} /usr/local/opt/sqlite/lib/pkgconfig"
```

<br/>

Installer une nouvelle version de Python via pyenv. Par exemple:

```
pyenv install 3.10.11
```

<br/>

Et voilà `torch` fonctionne... Je peux finir mon script d'Upscaling d'anciennes photos de famille.
