# Installer pyenv sur Linux deepin 15 (debian like Linux)

- Canonical URL: https://leandeep.com/installer-pyenv-sur-linux-deepin-15-debian-like-linux/
- Author: Olivier Eeckhoutte
- Published: 2019-11-04T18:21:00Z
- Updated: 2019-11-04T18:21:00Z
- Language: fr
- Tags: Deepin, Python, virtualenv, pyenv
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction 

Je suis tombé en admiration pour Linux Deepin. Il est basée sur Debian. Son interface graphique est vraiment très agréable; aussi belle qu'OSX. Elle est certes un peu gourmande en ressources mais quand on a 64 Go de RAM ce n'est pas vraiment un problème :D. J'ai découvert cette distribution grâce à Huawei l'embarque maintenant dans ses matebook pro. 

*Je n'ai pas encore vérifié s'il y avait des spywares dans tous les sens mais je vais m'en occuper d'ici peu. J'ai un super proxy transparent pour voir tout ce qui transite sur le réseau. En attendant je ne me connecte à aucun site sensible.*

**Bref dans cet article nous allons voir comment installer pyenv sur cet Linux pour gérer plusieurs environnements Python pour ses environnements virtuels. 

<br/>

## Steps

Mise à jour des paquets:
```
sudo apt-get update && sudo apt-get upgrade
```

```
# Après un upgrade de système, j'ai pris l'habitude de rebooter mon système pour voir si tout s'est bien passé. Je vous invite à faire la même chose. Cela ne prend que quelques secondes et cela permet de ne pas chercher midi à quatorze heures si votre système ne fonctionne plus avant de passer à la suite.

sudo reboot
```

On installe les dépendances:
```
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev git
```

Installation de Pyenv:
```
curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash
```

On ajoute les lignes suivantes dans son `~/.zshrc` avant d'exécuter un `source ~/.zshrc`:
```
export PATH="~/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

Vérifier le bon fonctionnement de pyenv: 
```
pyenv versions 
```

Lister les versions de Python disponibles:
```
pyenv install --list
```

Installer une version spécifique:
```
pyenv install 3.7.5
```

Afficher la version actuellement utilisée:
```
pyenv version
```

Utiliser une version de Python globalement sur son système:
```
pyenv global 3.7.5
# Ou localement dans un répertoire
pyenv local 3.7.5
# Ou setter une versoin dans le shell actuel
pyenv shell 3.7.5
```

Après si vous voulez créer un virtualenv avec une version de Python spécifique c'est très simple. Il suffit si vous avez virtualenvwrapper d'exécuter la commande suivante: 

```
# Récupérer le path du Python que l'on souhaite utiliser
which python
/home/olivier/.pyenv/shims/python

# Créer le virtualenv
mkvirtualenv -p /home/olivier/.pyenv/shims/python -a . ai_env
```

