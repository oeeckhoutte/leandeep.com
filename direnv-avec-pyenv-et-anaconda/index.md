# direnv avec pyenv et anaconda

- Canonical URL: https://leandeep.com/direnv-avec-pyenv-et-anaconda/
- Author: Olivier Eeckhoutte
- Published: 2023-08-21T21:49:00+02:00
- Updated: 2023-08-21T21:49:00+02:00
- Language: fr
- Tags: Python, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment installer Anaconda3 sur OSX et l'utiliser directement dans direnv.

## Pré-requis

- direnv installé

<br/>


## Installation

On commence par installer Anaconda via brew

```
brew install --cask anaconda
```

<br/>

On édite `~/.zshrc` et on ajoute le path vers les binaires d'Anaconda.

```
export PATH="/opt/homebrew/anaconda3/bin:$PATH"
```

<br/>

# Nouvel environnement anaconda

Si votre projet contient un fichier environment.yml, les packages s'installeront automatiquement lors de la première exécution du `direnv allow`.

Créer un fichier `.envrc` et ajouter simplement le layout suivant: `layout anaconda`.

Et c'est tout, c'est aussi simple que cela. Enregistrer les modifications de votre fichier .envrc, exécuter la fameuse commande `direnv allow` et vous voilà dans un environnement anaconda.
