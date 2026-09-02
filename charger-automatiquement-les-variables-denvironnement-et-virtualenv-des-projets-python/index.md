# Charger automatiquement les variables d'environnement et virtualenv des projets Python

- Canonical URL: https://leandeep.com/charger-automatiquement-les-variables-denvironnement-et-virtualenv-des-projets-python/
- Author: Olivier Eeckhoutte
- Published: 2021-07-20T21:25:00Z
- Updated: 2021-07-20T21:25:00Z
- Language: fr
- Tags: virtualenv, Python, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Dans cet article, nous allons voir comment charger (et décharger) automatiquement les variables d'environnements de vous projets lors d'un `cd` (et accessoirement comment sourcer et désactiver les virtualenv Python).

> D'autres solutions alternatives que je ne recommande pas existent: pipenv, autoenv 

<br/>

## direnv

Pour ce faire, nous allons utilise un utilitaire appelé **direnv** qui est disponible pour pas mal de distributions. 

> Le projet est accessible à l'adresse suivante: https://github.com/direnv/direnv

<br/>

Installation sur OSX:

```
brew install direnv
```

<br/>

Pour finir l'installation, il faut ajouter ensuite le code suivant dans votre fichier `~/.zshrc`:

```
eval "$(direnv hook zsh)"

realpath() {
    [[ $1 = /* ]] && echo "$1" || echo "$PWD/${1#./}"
}
layout_python-venv() {
    local python=${1:-python3}
    [[ $# -gt 0 ]] && shift
    unset PYTHONHOME
    if [[ -n $VIRTUAL_ENV ]]; then
        VIRTUAL_ENV=$(realpath "${VIRTUAL_ENV}")
    else
        local python_version
        python_version=$("$python" -c "import platform; print(platform.python_version())")
        if [[ -z $python_version ]]; then
            log_error "Could not detect Python version"
            return 1
        fi
        VIRTUAL_ENV=$PWD/.direnv/python-venv-$python_version
    fi
    export VIRTUAL_ENV
    if [[ ! -d $VIRTUAL_ENV ]]; then
        log_status "no venv found; creating $VIRTUAL_ENV"
        "$python" -m venv "$VIRTUAL_ENV"
    fi

    PATH="${VIRTUAL_ENV}/bin:${PATH}"
    export PATH
}

# Customiser le prompt
setopt PROMPT_SUBST

show_virtual_env() {
  if [[ -n "$VIRTUAL_ENV" && -n "$DIRENV_DIR" ]]; then
    echo "($(basename $VIRTUAL_ENV))"
  fi
}
PS1='$(show_virtual_env) '$PS1
```

<br/>

L'installation est maintenant terminée. Il vous suffit de créer un fichier `.envrc` dans votre dossier/ projet et il sera automatiquement chargé (après une autorisation de sécurité via la commande `direnv allow`). 

Exemple de contenu pour le fichier `.envrc`:
```
export MA_VAR0=...
export MA_VAR1=...
export MA_VAR2=...
# Charger un virtualenv
layout python
```

<br/>
Avec la ligne `layout python`, un virtualenv sera automatiquement créé dans le path `.direnv/python-3.9.5/bin/python` de votre projet.

> Plus d'info sur le virtualenv; comme par exemple le support de poetry ou pyenv à l'adresse suivante: https://github.com/direnv/direnv/wiki/Python

<br/>

## pyenv

`direnv` est compatible avec `pyenv`. A la place de la ligne `layout python` on peut spécifier la version de Python que l'on veut utiliser dans son projet. Par exemple: `layout pyenv 3.7.11`.

> Rappel pour installer pyenv:
> ```
> curl -L https://pyenv.run | bash
> echo 'export PATH="~/.pyenv/bin:$PATH"' >> ~/.zshrc
> $ echo 'eval "$(pyenv init -)"' >> ~/.zshrc
> $ echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc
> $ source ~/.zshrc
> pyenv install -l
> pyenv install 3.7.11
> ```

<br/>

En conclusion, c'est un projet simple et efficace.
