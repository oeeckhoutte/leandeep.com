# Passer de oh-my-zsh à oh-my-fish

- Canonical URL: https://leandeep.com/passer-de-oh-my-zsh-%C3%A0-oh-my-fish/
- Author: Olivier Eeckhoutte
- Published: 2019-05-23T15:07:00Z
- Updated: 2019-05-23T15:07:00Z
- Language: fr
- Tags: Terminal, OSX
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Dans cet article nous allons voir comment configurer le terminal Fish sur Mac.

> Si Homebrew n'est pas déjà installé sur votre poste, faites le via la commande. It's worth it ! `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

<br/>

# Pourquoi je teste Fish Shell ?

Pour ces features:

```
- Autosuggestions as you type
- Syntax highlighting with extensive error checking.
- Searchable command history.
- 256 terminal colors
- Advanced tab completion.
- Web-based configuration
- A special help command gives access to all the fish documentation in the user’s web browser
- Error messages designed to actually tell the user what went wrong and what can be done about it
- Universal variables
- Support for the X clipboard
- Change fish setting by editing the ~/.config/fish/config.fish file
- Man page completions
- Fully scriptable with syntax that is simple, clean, and consistent
- Features work out of the box without any configuration
```

<br/>

# Installation de oh-my-fish

## Installer Fish

```
brew install fish

# Ajoutez fish shell dans la liste des terminaux sur Mac
echo "/usr/local/bin/fish" | sudo tee -a /etc/shells

# Configurez fish pour qu'il soit utilisé par défaut
chsh -s /usr/local/bin/fish

# Si vous voulez retourner à zsh ou autre 
# $ cat /etc/shells
# $ chsh -s /bin/zsh ## pour retourner à zsh
```

<br/>

## Installer oh-my-fish

```
curl -L https://get.oh-my.fish | fish
```

<br/>

## Installer "bob the fish" theme

```
omf install bobthefish

# Installer les fonts utilisées par le thème
brew tap caskroom/fonts
brew cask install font-firacode-nerd-font

# ou si la dernière commande ne fonctionne pas
# brew install homebrew/cask-fonts/font-firacode-nerd-font
set -U theme_nerd_fonts yes
```

<br/>

## Configurer la font pour le Terminal

Dans l'apparence du terminal sélectionnez la police `FuraCode Nerd Font` en Regular taille 14.

<br/>

## Configurer la font pour VSCode 

Aller dans les préférences et cliquez sur settings. Cliquez sur le bouton pour éditer directement les settings au format json (on ne perd pas de temps) et ajoutez les lignes suivantes au JSON:

```
"terminal.integrated.shell.osx": "/usr/local/bin/fish",
"terminal.integrated.fontSize": 14,
"terminal.integrated.fontFamily": "FuraCode Nerd Font"
```

Cela donne ceci pour le terminal intégré à VSCode :

![image](/images/vscode_terminal.png)

Pas mal !

<br/>

# Advanced Tips

## Installer des plugins 

Avec fisher https://github.com/jorgebucaran/fisher
Voici une liste de plugins https://github.com/jorgebucaran/awesome-fish

```
curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish

# Puis 
fisher add jorgebucaran/fish-nvm
fisher add kennethreitz/fish-pipenv

# Uninstall plugin: fisher rm jorgebucaran/fish-nvm
```

Reload la config Fish

```
source ~/.config/fish/config.fish
```

<br/>

## Custom thème
Forkez le thème bob the fish et customizez le. Le README est très bien fait.

```
https://github.com/oh-my-fish/theme-bobthefish
```

<br/>

## Démarrer des sessions tmux automatiquement dans iTerm2

> Vérifiez que tmux est bien installé `brew install tmux`

```
omf install tmux-zen

# to uninstall tmux-zen
# omf uninstall tmux-zen
```

<br/>

## Les autres utilitaires indispensables

A mettre dans un fichier bash ceci en haut: `#!/usr/bin/env bash` 

```
# Install Xcode Command Line Tools.
xcode-select --install

# Install Homebrew.
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"


# Install brew basics (auto-updating).
brew install terminal-notifier
brew tap domt4/autoupdate
brew autoupdate --start --upgrade --cleanup --enable-notifications

brew install terraform
brew install caskroom/cask/virtualbox
brew install caskroom/cask/minikube
brew install openshift-cli
brew install kubernetes-cli
brew install kubernetes-helm

# Downloader
brew install youtube-dl
brew install wget

brew install fish
brew install grc
brew install direnv
brew install nnn
brew install thefuck
brew install autojump
brew install googler
brew install mas
brew install htop
brew install neofetch
brew install mosh

brew install pipenv

# Install git utilities.
brew install git-open
brew install gist

# Install fun stuff.
brew install fortune
brew install cowsay
brew install sl
gem install lolcat

# Install network utilities
brew install sshuttle
npm install --global speed-test
brew install tor
brew install torsocks
brew install telnet

# Twitter utilities.
gem install t

# AWS
brew install amazon-ecs-cli
brew install awscli

# Video
brew install ffmpeg

# Blog
brew install hugo
npm install -g hexo

# Dev
npm i -g http-server
brew install mongodb
brew install tree
brew install watch
```

