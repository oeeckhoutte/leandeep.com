# Install ohmyzsh on Ubuntu 18.04

- Canonical URL: https://leandeep.com/install-ohmyzsh-on-ubuntu-18.04/
- Author: Olivier Eeckhoutte
- Published: 2019-07-05T12:14:00Z
- Updated: 2019-07-05T12:14:00Z
- Language: fr
- Tags: Ubuntu, ohmyzsh, zsh
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

We are going to assume that nothing is installed on your Ubuntu. When I created this tutorial I installed ohmyzsh on a brand new Intel Nuc.

<br/>

## Install Zsh
```
sudo apt-get update
sudo apt-get install -y zsh
```

<br/>

## Install the custom fonts
```
sudo apt-get install -y powerline fonts-powerline
```

<br/>

## Install Git
```
sudo apt-get install -y git
```

<br/>

## Install ohmyzsh
```
git clone https://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh
cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc
```

<br/>

## Install custom theme

Inside the ~/.zshrc file comment the line `ZSH_THEME="robbyrussell"` and add this new line just below `ZSH_THEME="agnoster"`.

<br/>

## Change the default shell

```
chsh -s /bin/zsh
```

> Note: You can still revert and go back to bash using the command `chsh -s /bin/bash
`.

<br/>

## Plugin installation

In case you want syntax highlighting you can install this plugin:
```
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "$HOME/.zsh-syntax-highlighting" --depth 1

echo "source $HOME/.zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> "$HOME/.zshrc"
```

