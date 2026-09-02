# Créer des Pull Requests sur Github depuis son terminal

- Canonical URL: https://leandeep.com/cr%C3%A9er-des-pull-requests-sur-github-depuis-son-terminal/
- Author: Olivier Eeckhoutte
- Published: 2022-04-24T22:45:00Z
- Updated: 2022-04-24T22:45:00Z
- Language: fr
- Tags: Git, Github, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans ce court article, nous allons voir comment créer des PRs automatiquement via le cli; toujours dans le but de booster sa productivité.
 
## Installation du client cli Github 

> [Adresse officielle](https://github.com/cli/cli) du package

```
brew install gh
gh auth login
```

<br/>

## Création de la PR

```
gh pr create --base master --head your_branch --title "$(git log -1 --pretty=format:'%s')" --body "$(cat pull_request_template.md)"
```

<br/>

## Raccourcis pour récupérer les infos du dernier commit

Editer le fichier `~/.zshrc` et ajouter les fonctions suivantes:

```
function get_last_commit_message ()
{
  text=$(git log -1 --pretty=format:'%s%n%n%b') && echo $text | pbcopy
}

function get_last_commit_title ()
{
  text=$(git log -1 --pretty=format:'%s') && echo $text | pbcopy
}
```
