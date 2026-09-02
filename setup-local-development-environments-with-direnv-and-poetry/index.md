# Setup local development environments with direnv and poetry

- Canonical URL: https://leandeep.com/setup-local-development-environments-with-direnv-and-poetry/
- Author: Olivier Eeckhoutte
- Published: 2024-01-02T23:43:00Z
- Updated: 2024-01-02T23:43:00Z
- Language: fr
- Tags: Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this short article we are going to configure direnv to be able to use poetry smoothly.

<br/>
## Poetry installation

## Option 1
```
brew install pipx
pipx ensurepath
pipx install poetry
```

<br/>

## Option 2 (The option I prefer)

If you have `pyenv` and `zsh`:

Select the Python version you want to use:
```
# for example
pyenv global 3.11.2
```

Then add the following line in your `~/.zshrc` file:

```
eval "$(pyenv init --path)"
```

Finally install poetry with a simple `pip install poetry`


<br/>

## direnv configuration

Edit the global `.direnvrc` file located vim in your home directory and add the following code:

```
layout_poetry() {
  if [[ ! -f pyproject.toml ]]; then
    log_error 'No pyproject.toml found.  Use `poetry new` or `poetry init` to create one first.'
    exit 2
  fi

  local VENV=$(dirname $(poetry run which python))
  export VIRTUAL_ENV=$(echo "$VENV" | rev | cut -d'/' -f2- | rev)
  export POETRY_ACTIVE=1
  PATH_add "$VENV"
}
```

<br/>


Now each time you have a project created with Poetry you simply need to execute the following commands:

```
echo "layout poetry" >> .envrc
direnv allow
```

<br/>

That's all folks !


