# Utilitaires utiles OSX

- Canonical URL: https://leandeep.com/utilitaires-utiles-osx/
- Author: Olivier Eeckhoutte
- Published: 2019-11-18T11:08:00Z
- Updated: 2019-11-18T11:08:00Z
- Language: fr
- Tags: Dev, OSX
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici certains (le minimum vital) utilitaires de développement que j'utilise sur Mac. 

**[Oh-my-zsh](https://ohmyz.sh/)**

```
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

<br/>

**Installer [Node version manager](https://github.com/nvm-sh/nvm#installation-and-update) (NVM)**
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
```

Puis au moins les paquets suivants:

```
nvm install v12.13.0
nvm use v12.13.0
nvm alias default v12.13.0
npm i -g http-server
```

<br/>

**Installer Blockchain tools**

```
npm install -g truffle
npm install -g ganache-cli
```

<br/>

**Installer Xcode CLI**

```
xcode-select --install
sudo xcodebuild -license accept
```

<br/>

**[Homebrew](https://brew.sh/)**

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

<br/>

**Packages gratuits ou OpenSource Mac utiles pour travailler**

* Synology Drive (Peut être la plus importante)
* [Onyx](https://www.titanium-software.fr/fr/onyx.html) (Optimiser le Finder OSX)
* [Docker](https://docs.docker.com/docker-for-mac/install/) - Puis activer Kubernetes dans les settings
* [Iterm 2](https://www.iterm2.com/downloads.html)
* Xcode via l'App Store et l'utilitaire command line via la commande suivante `xcode-select --install`
* Vuze pour télécharger des Torrents. Installation via cette commande `sudo ./Vuze\ Installer.app/Contents/MacOS/JavaApplicationStub`
 car les droits root sont nécessaires
* [Visual Studio Code](https://code.visualstudio.com/download) (Mon IDE)
* [GitUp](https://gitup.co/) (GUI git)
* Google Keep (Prise de notes synchronisées avec tous mes devices)
* Audacity (Enregistrer via microphone)
* Sublime Text (En dépannage. Il reste toujours excessivement rapide)
* [AWS Workspaces](https://aws.amazon.com/fr/workspaces/)
* Google Chrome
* Firefox
* Office (Word, Excel, Powerpoint, Teams)
* Apple Pages
* Slack
* [MongoDB Compass](https://www.mongodb.com/products/compass)
* Skype for business
* Ultimaker Cura (Pour slicer des modèles 3D)
* [PG Admin 4](https://www.pgadmin.org/download/) (GUI admin postgres)
* [MySQLWorkbench](https://www.mysql.com/fr/products/workbench/) (GUI admin MySQL)
* Tunnelblick (Pour accéder à des réseaux VPN)
* The Unarchiver (Pour extraire des Rar)
* VirtualBox (Pour créer des VMs)
* [Cyberduck](https://cyberduck.io/) 
* [LuLu](https://github.com/objective-see/LuLu) (Firewall opensource)
* [Scroll Reverser](https://pilotmoon.com/scrollreverser/) (Inverser mon scroll de souris quand je travaille en double écran avec souris déportée)
* [Postman](https://www.getpostman.com/downloads/) (Communiquer avec des REST APIs)
* [Unetbootin](https://unetbootin.github.io/) (Pour créer des USB bootables)
* [LDAP Client](https://directory.apache.org/studio/download/download-macosx.html)
* [App Language Chooser](https://apps.apple.com/fr/app/app-language-chooser/id451732904?mt=12) (Disponible sur l'Apple Store pour changer la langue d'une seule application)
* Code Notes (Pour gérer ses snippets Github (gists) ou en local)
* Lepton (Pour gérer ses snippets Github (gists) uniquement)
* [HoRNDIS](https://github.com/jwise/HoRNDIS) Android USB tethering driver for Mac OS X
* [MySQL Server](https://dev.mysql.com/doc/mysql-osx-excerpt/5.7/en/osx-installation-pkg.html) Je préfère installer MySQL server via le .dmg plutôt que via brew pour avoir le bouton "Start MySQL Server" dans System Preferences.
* TimescaleDB (DB timeseries basée sur Postgres): `docker run -d --name timescaledb -p 5432:5432 -e POSTGRES_PASSWORD=password timescale/timescaledb:latest`
* [NetIQuette](https://objective-see.com/products/netiquette.html) (GUI pour voir toutes les connexions ouvertes entrantes et sortantes)
* [TaskExplorer](https://objective-see.com/products/taskexplorer.html) (Analyse les processus ouverts et effectue une analyse antivirus)
* [X2Go Client](https://wiki.x2go.org/doku.php) Client pour X2GO
* [Calibre](https://calibre-ebook.com/) (Gestionnaire d'ebooks et PDF. Synchronisation possible avec Kindle)
* Metatrader 4 et 5
* Spotify
* [IP in menu bar](https://www.monkeybreadsoftware.de/Software/IPinmenubar.shtml)
* [Android Studio](https://developer.android.com/studio) + flutter plugin depuis la marketplace + SDK 28, 29 et 30
* [Android NDK](https://developer.android.com/ndk/downloads)
* [MacPorts](https://distfiles.macports.org/MacPorts/MacPorts-2.6.3-10.15-Catalina.pkg)
* [Insomnia](https://insomnia.rest/download/) API Client et Design Plateforme pour GraphQL
* [Letsview](https://letsview.com/) Pour mirrorer votre iDevice sur Mac ou vice versa
* [Devutils](https://devutils.app/) Une boite à outils avec des convertisseurs JSON to YAML, time converter, JSON formater...
* Microsoft Remote Desktop: oui oui vous avez bien lu. Pour certains outils Azure
* [Raycast](https://www.raycast.com/)
* [Disk Inventory X](https://www.derlien.com/downloads/index.html): Analyser le disk space
* [UTM](https://docs.getutm.app/installation/macos/): Virtualization 

<br/>

**Packages Payant très utiles**
* [Paste](https://pasteapp.me/) (Gestionnaire avancé copier coller. Un must have!) -> Remplacé par Raycast
* [iNet](https://apps.apple.com/fr/app/inet-network-scanner/id403304796?mt=12) (GUI de scan réseau)
* [Gemini](https://macpaw.com/fr/gemini) (Détecteur de doublon très pratique)
* [Clean My Mac X](https://macpaw.com/fr/store/cleanmymac) (Permet de nettoyer son Mac)
* Screenflow (Pour enregistrer un screencast)
* AutoDesk (Pour modifier des modèles 3D)
* Divvy (Disponible sur l'Apple Store pour spliter facilement son écran)
* Final Cut Pro (Faire des montages vidéo)

<br/>

**Packages Homebrew**
```
brew install wget tree python@2 pkg-config poppler kubernetes-helm tmux socat 
brew cask update
brew cask install ip-in-menu-bar betterzipql
brew cask install qlcolorcode
brew cask install qlmarkdown qlstephen quicklook-json qlimagesize suspicious-package 
brew cask install keepassxc
brew cask install db-browser-for-sqlite
brew cask install vagrant
brew cask install vlc 
brew cask install bitbar # https://getbitbar.com/ Ajoute des fonctionnalités à sa barre de tâches OSX
brew cask install android-platform-tools # Ou installation via Android Studio
brew install htop
brew install tig # Voir l'historique git
brew install hadolint # Dockerfile linter
brew install openssl 
brew install sqlite3 
brew install xz 
brew install zlib
brew install azure-cli
brew install pyenv
brew install gpg
brew install git-crypt
brew install watch
brew install sshfs
brew install wakeonlan
brew install nmap
brew install git-lfs
brew install bazel
brew install p7zip
brew install postgresql
brew install direnv # Ou installation via git et manual build
brew install jq
brew install readline # A voir s'il ne faut pas plutôt l'installer via pip
brew install hugo
brew install gnupg
brew install youtube-dl
brew install telnet
brew install terraform
brew install colordiff
brew install ncdu

# Opencv 3.4.x
# Sur Python 3.9 (example avec brew)
brew install python@3.9
brew link python@3.9
brew install opencv@3
# Check:
# pip install virtualenv virtualenvwrapper
# echo "export WORKON_HOME=$HOME/.virtualenvs" >> ~/.zshrc
# echo "export WORKON_HOME=$HOME/.virtualenvs" >> ~/.bashrc
# echo "export PROJECT_HOME=$HOME/Devel" >> ~/.zshrc
# echo "export PROJECT_HOME=$HOME/Devel" >> ~/.bashrc
# echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.zshrc
# echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc
# mkvirtualenv -p python3 cv_env
# pip install numpy scipy matplotlib scikit-image scikit-learn ipython pandas
# ln -s /usr/local/opt/opencv@3/lib/python3.9/site-packages/cv2/python-3.9/cv2.cpython-39-darwin.so cv2.so
# python
# >>> import cv2
# >>> cv2._version_

# Sur Python 3.8 (example avec package pip)
brew install python@3.8
brew link python@3.8
pip install opencv-contrib-python==3.4.11.45
# >>> cv2.__version__

# EOS Blockchain
brew tap eosio/eosio # Note: Update May 2022 -> Dead Project
brew install eosio

# Installation de MongoDB 
# https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
brew tap mongodb/brew
brew install mongodb-community@4.2
brew services start mongodb-community # ou brew services start mongodb-community@4.2

# Installation de Redis
Voir cet article https://leandeep.com/Installer-redis-sur-OSX/

# Installation de Mysql client (si MySQL server pas installé)
brew install mysql-client
echo 'export PATH="/usr/local/opt/mysql-client/bin:$PATH"' >> ~/.zshrc

# Poetry
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python

# Cocoapods
sudo gem install cocoapods
```

<br/>

**Installer virtualenvwrapper ou direnv**

Lien vers [direnv](https://direnv.net/docs/installation.html)

> Pour une question de sécurité, je vous préconiserais de le compiler vous-même après avoir vérifié qu'il n'y a pas de vulnérabilité dans le code open source.

Lien vers [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/)

<br/>

**Configurer Git**

Ajouter le fichier `~/.gitconfig` avec le contenu suivant:

```
[push]
        default = current
[user]
        name = votre_nom
        email = votre_adresse_email

```

<br/>

**Configurer iTerm2**

Go to iTerm Preferences → Profiles, select your profile, then the Keys tab. Click Load Preset... and choose Natural Text Editing.

**Extensions VSCode**

* Back & Forth
* Better TOML
* C/C++
* Cloud Code
* Cron explained
* Code Runner
* Cucumber (Gherkin) Full Support
* Dart
* Docker
* Draw.io integration
* Excel viewer
* Flutter
* Formatting Toggle
* Gist
* Github Pull Requests and Issues
* Git Blame
* Git History
* Git Tree Compare
* GitLens - Git supercharged
* Go
* Hashicorp Terraform
* Intellicode
* Hugofy
* Jupyter
* Jupyter Keymap
* Jupyter Nodebook Renderers
* Language-Cython
* Nix
* OpenAPI (Swagger) Editor
* Pine Script Syntax Highlighting
* Prophet Debugger
* Protobuf text format
* Rest Client
* Pylance
* Python
* Service Bus Explorer
* Svelte for VS Code
* Solidity
* Visual Studio Intellicode
* vscode-elixir
* vscode-pdf
* Vue Language Deatures (Volar)
* Vyper
* XML
* YAML

> Mémo shortcuts utiles:
> * Lister les functions dans un fichier: `Cmd` + `shift` + `o` + `:`

<br/>

**Ouvrir VSCode depuis le terminal**

```
export PATH="$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
```

<br/>

**Java**

```
brew install openjdk@11
````

Editer `~/.zshrc` et ajouter la commande suivante:

```
sudo ln -sfn /usr/local/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk
```

<br/>

**Golang**

Obtenir et installer le .pkg depuis https://golang.org/doc/install


<br/>

**Customize iTerm2**

```
brew install bat
# bat .env
brew install exa
# exa --icons -l -g

brew install starship
brew tap homebrew/cask-fonts
brew install --cask font-hack-nerd-font

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

Editer le template `vim ~/.config/starship.toml`:

```
add_newline = false

[python]
format = 'via [${symbol}${pyenv_prefix}(${version} )(\($virtualenv\) )]($style)'
```

<br/>


**Autres customisation de iTerm**

* Désactiver la correction orthographique totalement inutile sur Notes:

`Edit > Spelling and Grammar > Correct Spelling Automatically`<br/>
`Edit > Spelling and Grammar > Check Spelling while typing`

<br/>

* Augmenter le buffer Iterm2

Dans `Preferences > Profiles > Terminal` changer la valeur de "Scrollback lines" de 1000 à 100000.

* Changer la Font

Dans `Preferences > Profiles > Text` choisir la font `Hack Nerd font`

