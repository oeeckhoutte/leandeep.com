# Installer Go

- Canonical URL: https://leandeep.com/installer-go/
- Author: Olivier Eeckhoutte
- Published: 2020-01-01T10:59:00Z
- Updated: 2020-01-01T10:59:00Z
- Language: fr
- Tags: Go
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Installation sur OSX

Rien de plus simple avec Homebrew mais avant d'utiliser cet utilitaire, il est utile d'ajouter les variables d'environnement suivantes dans votre `~/.zshrc`. 

```
export GOPATH="${HOME}/.go"
export GOROOT="$(brew --prefix golang)/libexec"
export PATH="$PATH:${GOPATH}/bin:${GOROOT}/bin"
```

<br/>

Recharger son terminal:
```
source ~/.zshrc
```

<br/>

Installer go:
```
brew install go
```

<br/>

Vérifier que l'installation a bien fonctionné:
```
go get golang.org/x/tools/cmd/godoc
go get golang.org/x/lint/golint
```

Pensez à installer [l'extension suivante pour VSCode](https://marketplace.visualstudio.com/items/lukehoban.Go).

<br/>

## Installation sur Ubuntu 18.04

Télécharger le binaire go:
```
wget https://dl.google.com/go/go1.13.linux-amd64.tar.gz
```

<br/>

Décompresser le binaire go dans `/usr/local`:
```
sudo tar -C /usr/local -xzf go1.13.linux-amd64.tar.gz
```

<br/>

Ajouter les lignes suivantes dans le fichier `~/.profile`:
```
export PATH=$PATH:/usr/local/go/bin
export GOPATH="${HOME}/.go/bin"
export PATH=$GOPATH:$PATH
```

<br/>

Recharger le fichier `~/.profile`:
```
source ~/.profile
```

<br/>

Vérifier que Go est bien installé:
```
go version
```
<br/>

> Installer au moins les packages suivants: `apt-get install build-essential git` pour avoir `gcc` et `g++`.

> Vérifier le bon fonctionnement de `go get`. Par exemple: `go get github.com/anacrolix/torrent/cmd/torrent`
