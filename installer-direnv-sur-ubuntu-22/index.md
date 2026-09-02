# Installer direnv sur Ubuntu 22

- Canonical URL: https://leandeep.com/installer-direnv-sur-ubuntu-22/
- Author: Olivier Eeckhoutte
- Published: 2025-07-19T10:49:00+02:00
- Updated: 2025-07-19T10:49:00+02:00
- Language: fr
- Tags: tips, python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article très court, nous allons voir comment installer direnv sur Ubuntu 22.

<br/>

## Installation

```
sudo apt install direnv
curl https://pyenv.run | bash
```

<br/>

## Configuration

Ajouter les lignes suivantes dans votre `.zshrc`

```
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
eval "$(direnv hook zsh)"
```

Exécuter `soure ~/.zshrc` puis installer un package python de votre choix.

```
pyenv install 3.11.8
pyenv global 3.11.8

# Ou 
pyenv install miniconda3-3.11-23.5.0-3
pyenv global miniconda3-3.11-23.5.0-3
```

<br/>

That's all!
Vous pouvez maintenant exécuter `echo "layout pyenv 3.11.8" >> .envrc` où vous voulez

