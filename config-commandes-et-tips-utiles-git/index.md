# Config, Commandes et tips utiles Git

- Canonical URL: https://leandeep.com/config-commandes-et-tips-utiles-git/
- Author: Olivier Eeckhoutte
- Published: 2015-09-19T18:25:00Z
- Updated: 2015-09-19T18:25:00Z
- Language: fr
- Tags: Development, Git
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Indispensable à savoir

**Index**

L’index est une zone qui permet de préparer un commit. 

<br/>

**HEAD**

HEAD est la référence sur le commit sur lequel on se trouve actuellement. On le change avec git checkout.


<br/>

## Rebase vs Merge

Préférer le rebase pour garder un historique propre

<br/>

## Rebase

Eviter `git pull` pour éviter que Git ne considère notre branche locale et remote comme 2 branches différentes alors que ce sont les mêmes.

Faire un rebase:
```
git pull --rebase 
ou 
git rebase origin/master
```

Les commits qui n’existaient que sur la branche master sont supprimés et réappliqués/ rejoués à la suite des commits de la branche origin/master.

En rebasant vos branches avant de les fusionner, vous obtiendrez un historique tout plat et bien plus agréable à parcourir.

<br/>

**Exemple 1**

```
          F---G ← bug2
         /
A---B---E---H---I ← master
     \
      C---D ← bug1
```
   
En utilisant un rebase avant chaque fusion, on obtient l'historique suivant :
```
A---B---E---H---I---C---D---F---G ← master
```

Les commandes pour parvenir à ce résultat sont les suivantes, explications juste après.

```
git rebase master bug1
git checkout master
git merge bug1
git branch -d bug1
git rebase master bug2
git checkout master
git merge bug2
git branch -d bug2
```

Explications des commandes.

* Transplante bug1 sur l'actuelle branche master. **Si on est déjà en train de bosser sur bug1 on peut se contenter de taper git rebase master**
* Switche sur master
* Fusionne bug1 dans master
* Supprime la branche bug1 devenue inutile
* Transplante bug2 sur la branche master
* Switche sur master
* Fusionne bug2 dans master
* Supprime bug2 devenue inutile.

<br/>

**Exemple 2**

> Autre manière de faire, peut être plus simple...

En supposant que l'on veuille garder la feature branche synchronisée avec la branche develop, voici les commandes à suivre:

```
git fetch # depuis la feature branche (vérifier que la feature branche sur laquelle vous travaillez est à jour)

git rebase origin/develop

# S'il y a des conflits, il faut les résoudre un par un.

Utiliser git rebase --continue une fois que tous les conflits sont traités

git push origin feature_branch --force
```

<br/>

**Exemple 3 (ultra simple que je recommande)**

```
git checkout votre_feature_branch
git fetch
git rebase origin/master
```

Et c'est tout!

<br/>

## Merge (quand même)

```
git checkout master
git pull
git checkout your_feature_en_attente
git merge master
```

<br/>

## Stash 
Cette commande permet de mettre de côté des modifications de la copie de travail et de l’index.

<br/>

**Afficher tous les stash**
```
git stash list
```

<br/>

**Stash tous les fichiers dont les untracked**
```
git stash push -u -m "message descriptif"
```

<br/>

**Appliquer un stash**
```
# Exemple:
git stash apply stash@{0}
```

<br/>

**Annuler un `git stash pop` ou `git stash apply` si conflit**

```
git reset --merge
```

<br/>


**Annuler le conflit sur un fichier après git stash (reprendre version serveur)**

```
# Après un $ git stash pop
git add sur_le_fichier_avec_confict
git reset HEAD -- sur_le_fichier_avec_confict
git checkout sur_le_fichier_avec_confict

# Note perso: 
# Tester si git rm --cached sur_le_fichier_avec_confict peut faire le job
```

<br/>


**Créer un nouveau stash (stasher tous les fichiers)**
```
git stash save "<nom du stash>"
```

<br/>

**Créer seulement certains fichiers**


Add to index changes we don't want to stash and then stash with --keep-index option.
```
git add app/controllers/cart_controller.php
git stash --keep-index
git reset
```

<br/>

**Appliquer un stash**
```
git stash branch myfeature
```

<br/>

**Appliquer le dernier stash (LIFO)**
```
git stash pop
```

<br/>


**Voir le contenu du dernier stash**
```
git stash show -p
```

<br/>

**Voir le contenu d'un stash spécifique**
```
git stash show -p stash@{42}
```

<br/>


## Cherry-picking
Cherry-pick permet de sélectionner un commit quelconque et de l’appliquer sur la branche actuelle.
```
git checkout my-feature
git cherry-pick e32c529d
```

<br/>

## Résoudre un conflit 

**Pendant un merge**

Après un `git merge` ou `git pull`, on commence par exécuter la commande: 

```
git status # ou gss # ou git st # git stp (voir mes alias)
# On branch master
# Changes to be committed:
#
#       modified:   mon_fichier1
#
# Unmerged paths:
#   (use "git add/rm < file >..." as appropriate to mark resolution)
#
#       both modified:      mon_fichier2
#
```

Puis on corrige le problème de merge grâce à la commande `git mergetool` qui ouvrira l'outil de merge configuré sur votre poste. 
Autre possibilité, faire la correction manuellement, faire un `git add` ou `git stage` sur le fichier corrigé et enfin un `git commit`.

> En cas de problème, il est possible d'exécuter un `git reset --hard HEAD` pour revenir en arrière sur le merge
 
> Pour configurer git mergetool, il est possible d'utiliser la commande suivante: `git config --global merge.tool bc3` après avoir téléchargé et installé l'extension [vscode-ext-git-mergetool](https://marketplace.visualstudio.com/items?itemName=hung-vi.terminal-git-mergetool) pour OSX .

<br/>

**Pendant un rebase**

```
git checkout master # ou git co master
git rebase origin/master # ou git pull --rebase

git status
# Unmerged paths:
#   (use "git add/rm < file >..." as appropriate to mark resolution)
#
#       both modified:      mon_fichier
#

git mergetool

# On corrige

git rebase --continue
```

> Pour revenir en arrière (état du dépot) sur un rebase qui se passe mal: `git rebase --abort`


Un schéma vaut mieux qu'un long discours. Voici ce que fait un rebase:

![image](/images/rebase.png)

<br/>

**Gérer un conflit sur un binaire**

```
git checkout --ours -- path_binary_file
git checkout --theirs -- path_binary_file
```

<br/>

## Réécrire l'historique
```
git rebase --interactive HEAD~3
# ou 
# git rebase -i HEAD~3
# ou
# git rebase -i <sha-de-votre-commit> (via git log)
```

Plusieurs options s'offrent à nous pour les 3 commits: 
* Supprimer la ligne pour supprimer le commit de l’historique
* Changer l’ordre des lignes pour changer l’ordre d’application des commits
* Remplacer "pick" par "edit" pour pouvoir modifier le commit
* Remplacer "pick" par "squash" pour merger le commit avec le précédent pour n’en créer qu’un seul
* Remplacer "pick" par "reword" pour juste changer le message de commit

Pour poursuivre la réécriture de l’historique, terminer avec les commandes suivantes:
```
git stage
git rebase --continue
```

<br/>

## Config (en plus de oh-my-zsh)

A ajouter au fichier ~/.gitconfig:
```
[alias]
        st = status
        stp = status --porcelain
        ci = commit
        br = branch
        co = checkout
        rz = reset --hard HEAD
        pullr = pull --rebase
        unstage = reset HEAD
        lol = log --graph --decorate --pretty=oneline --abbrev-commit
        lolar = log --graph --pretty='format:%C(auto)%h %d %s %C(green)%an%C(bold blue) %ad' --all --date=relative
        lola = log --graph --decorate --pretty=oneline --abbrev-commit --all
        lpush = "!git --no-pager log origin/$(git currentbranch)..HEAD --oneline"
        lpull = "!git --no-pager log HEAD..origin/$(git currentbranch) --oneline"
        whatsnew = "!git diff origin/$(git currentbranch)...HEAD"
        whatscoming = "!git diff HEAD...origin/$(git currentbranch)"
        currentbranch = "!git branch | grep \"^\\*\" | cut -d \" \" -f 2"
...
[color]
        branch = auto
        diff = auto
        status = auto
        interactive = auto
```

<br/>

## Télécharger en local les Pull Requests

**Projet par projet**

Dans le fichier .git/config, localiser le code qui ressemble à ceci:
```
[remote "origin"]
	fetch = +refs/heads/*:refs/remotes/origin/*
	url = git@github.com:joyent/node.git
```

Maintenant ajouter la ligne suivante:
```
(pour Gitlab) fetch = +refs/merge-requests/*/head:refs/remotes/origin/merge-requests/*

# fetch = +refs/pull/*/head:refs/remotes/origin/pr/*
```

La section dans le fichier devrait resssemble à cela: 
```
[remote "origin"]
	fetch = +refs/heads/*:refs/remotes/origin/*
	url = git@github.com:joyent/node.git
	fetch = +refs/merge-requests/*/head:refs/remotes/origin/merge-requests/*
```

Maitenant vous pouvez récupérer toutes les PR en cours:

```
git fetch origin
From github.com:joyent/node
 * [new ref]         refs/pull/1000/head -> origin/pr/1000
 * [new ref]         refs/pull/1002/head -> origin/pr/1002
 * [new ref]         refs/pull/1004/head -> origin/pr/1004
 * [new ref]         refs/pull/1009/head -> origin/pr/1009
...
```

Vous pouvez faire un checkout sur une pull request en particulier:
```
git checkout pr/999
Branch pr/999 set up to track remote branch pr/999 from origin.
Switched to a new branch 'pr/999'
```

<br/>

**Ajouter automatiquement cette commande à tous les repos**

```
git config --global --add remote.origin.fetch "+refs/pull/*/head:refs/remotes/origin/pr/*"
```

<br/>

## Effacer git config globale

```
git config --global --unset user.name
git config --global --unset user.email
```

<br/>

## Vérifier la config globale

```
git config --global -l
```

<br/>

## git config local

```
git config user.name = "username"
git config user.email = "email"
git config core.sshCommand "ssh -i ~/.ssh/id_rsa_example -F /dev/null"
```

<br/>

## Préciser git ssh key globale

Editer le fichier ~/.ssh/config et ajouter le contenu suivant:
```
Host github.com
    HostName github.com
    IdentityFile ~/.ssh/id_rsa_example
```

<br/>

## Différences entre branches

**Différences entre branche actuelle et master:**
```
git diff master
```

<br/>

**Différences entre 2 branches (par exemple master et staging):**
```
git diff master..staging
```

<br/>

**Seulement montrer les fichiers différents entre 2 branches (sans les changements):**
```
git diff --name-status master..staging
```

<br/>

**Différence entre un fichier local (déjà en stage) et le dernier commit (ou l'avant dernier):**
```
git diff <commit> <path>
# Dernier commit:
git diff HEAD^ myfile
# Avant dernier commit:
git diff HEAD^^ myfile
# Equivalent à:
git diff HEAD~2 myfile

Example:
git diff HEAD~1 HEAD -- mon_fichier.js
git diff HEAD~2 HEAD -- mon_fichier.js
```

<br/>

## Commandes en vrac

**Annuler la commande `git commit` (et donc conserver/ récupérer tous les changements qui étaient prêts à être pushés:**
```
git reset --soft HEAD^
```

<br/>

**Modifier le dernier commit:**
```
git commit --amend
```

<br/>

**Annuler le dernier git amend:**
```
git reset --soft HEAD@{1}
```

<br/>

**Annuler le dernier git cherry-pick (successful):**
```
git reset --hard HEAD~1
```

<br/>


**Renommer une branche locale:**
```
git checkout ancien_nom
git branch -m nouveau_nom
git push origin nouveau_nom
```

<br/>

**Effacer une branche locale:**
```
git branch -d new-branch
```

<br/>

**Effacer une branche remote:**
```
git push origin --delete new-branch
```

<br/>

**Retourner sur la dernière branche:**
```
git checkout -
```

<br/>

**Contrôler le comportement de git push par default pour éviter de devoir specifier la branch (sur laquelle on est) avant de pusher:**
```
git config --global push.default current
```

<br/>

**Annuler les changements en local d'un fichier**
```
git checkout filename
```

<br/>

**Pusher un seul commit**
```
git push <remote_name> <commit SHA>:<remote_branch_name>
```
La branche <remote_branch_name> doit exister sur remote. (Si ce n'est pas le cas, il est possible d'utiliser `git push <remote_name> <commit SHA>:refs/heads/<remote_branch_name>` pour la créer automatiquement.)
  
> Note:
> `git push --set-upstream origin dev` ou `git push -u origin dev`
> Cette commande envoie la branche « dev » vers le dépôt « origin » (i.e. celui dont on a fait un clone au départ), et l'option --set-upstream permet de dire à Git de se souvenir qu'un « git push » de notre branche « dev » a été fait. Le prochain push pourra donc se faire simplement avec un simple `git push`.

<br/>

**Annuler le dernier commit**

Les commandes à appliquer dépendent du dernier commit: 

* Quand le dernier commit **n'est pas** le commit initial, il suffit d'exécuter la commance suivante: `git reset HEAD~`

* Quand le dernier commit **est** le commit initial, il faut exécuter les commandes suivantes: `git update-ref -d HEAD` puis `git rm --cached -r .` 

<br/>

**Annuler le dernier commit et garder tous les changements staged**
```
git reset --soft HEAD~
```

*C'est différent de `git reset HEAD~` qui ne garde pas staged les derniers changements.* 

<br/>

**Annuler le dernier git pull**

```
git reset HEAD~1 --hard
```

> `--hard` précise à git que l'on souhaite avoir notre répertoire de travail avec le contenu du commit choisi

<br/>

**Pull remote branch sans merge**

On suppose que l'on est déjà sur la branch que l'on souhaite resynchroniser

```
git pull --rebase
```

<br/>

**Retirer un commit particulier sur une branch**

```
git reset --hard commit-hash
```

<br/>

**Voir les derniers commits locaux pas encore pushé sur l'origin:**
```
git log --branches --not --remotes
```
<br/>

**Effacer les fichiers du working directory en incluant les nouveaux untracked files**

```
git clean -fd
```

<br/>

**Lister les tags sur un commit**

```
git tag --points-at HEAD
```

<br/>

**Tagguer (le dernier commit d') une branche**

```
git tag mon_tag
git push origin mon_tag

# (non recommandé) pousser tous les tags
git push --tags
```

<br/>

**Lister les fichiers modifiés dans une branche par rapport à master:**
```
git diff --name-only ma_branche $(git merge-base ma_branche master)
```

<br/>

**Ajouter un tag sur un commit particulier**

```
git tag -a v1.0 d613c59
git push origin v1.0
```

<br/>

**Effacer un tag local et remote**

```
# Effacement local
git tag -d v1.0

# Effacement remote
git push --delete origin v1.0
ou
git push origin :refs/tags/v1.0
```

<br/>

**Lister les commits entre un tag et HEAD**

```
git log --pretty=oneline HEAD...v1.0
```

> Alternative sans les commits de merge: `git log --pretty=oneline HEAD...v1.0 --no-merges`

> Alternative avec tous les détails: `git log HEAD...v1.0`

> Autre alternative: `git log --pretty=format:"%h; author: %cn; date: %ci; subject:%s" HEAD...v1.0`

<br/>

**Lister les commits de merge depuis le dernier tag et afficher uniquement le commit message**
```
git log $(git describe --abbrev=0 --tags)..HEAD --merges --pretty=format:"%b"
```

<br/>


**Lister les commits de merge entre les 2 derniers tags et afficher uniquement le commit message**
```
git log $(git describe --abbrev=0 --tags `git rev-list --tags --skip=1 --max-count=1`)..$(git describe --abbrev=0 --tags `git rev-list --tags --skip=0 --max-count=1`) --merges --pretty=format:"%b"
```

<br/>

**Récupérer le dernier tag**

```
git describe --abbrev=0 --tags `git rev-list --tags --skip=0 --max-count=1`
```
<br/>

**Récupérer l'avant dernier tag**

```
git describe --abbrev=0 --tags `git rev-list --tags --skip=0 --max-count=1`
```

<br/>

**Voir les commits par contributeur depuis la dernière release/tag**

```
git shortlog --merges $(git describe --abbrev=0 --tags)..HEAD
```

<br/>

**Get current branch**

```
git rev-parse --abbrev-ref HEAD
```

<br/>

**Voir les changements/ commits sur un fichier**

```
git log --follow -p -- full_path_mon_fichier
# --follow permet de suivre un fichier s'il a été renommé
```
 
> Alternative:
> `find . -name "*mon_fichier" | xargs git log`

> **Super Alternative:**  <br/>
> `tig full_path_mon_fichier` ou `tig '*mon_fichier'` <br/>
> Installation de tig via `brew install tig` ou `apt install tig` <br/>
> [Tig Full documentation](http://jonas.nitro.dk/tig/manual.html)

<br/>

## Naviguer dans tout son historique Git 

```
$ git init
Initialized empty Git repository in .git/

$ echo "testing reset" > file1
$ git add file1
$ git commit -m 'added file1'
Created initial commit 1a75c1d: added file1
 1 files changed, 1 insertions(+), 0 deletions(-)
 create mode 100644 file1

$ echo "added new file" > file2
$ git add file2
$ git commit -m 'added file2'
Created commit f6e5064: added file2
 1 files changed, 1 insertions(+), 0 deletions(-)
 create mode 100644 file2

$ git reset --hard HEAD^
HEAD is now at 1a75c1d... added file1

$ cat file2
cat: file2: No such file or directory

$ git reflog
1a75c1d... HEAD@{0}: reset --hard HEAD^: updating HEAD
f6e5064... HEAD@{1}: commit: added file2

$ git reset --hard f6e5064
HEAD is now at f6e5064... added file2

$ cat file2
added new file
```

<br/>

## Taille en local du repo

```
$ git count-objects -v -H

count: 6
size: 24.00 KiB
in-pack: 0
packs: 0
size-pack: 0 bytes
prune-packable: 0
garbage: 0
size-garbage: 0 bytes
```

<br/>

## Bisect 

> Le bisect permet de réaliser une dichotimie sur un range de commit afin d'identifier celui qui génère une régression.

```
$ git bisect start          # Start the binary search process
$ git bisect bad            # Identify the end of the range
$ git bisect good v4.2.0    # Identify the start of the range
```

Puis après un test sur votre app ou tests unitaires préciser soit `git bisect bad` ou `git bisect good`

<br/>


## Ajouter un submodule dans son repo

```
git submodule add https://github.com/<user>/mon_repo_as_submodule mon_repo_as_submodule
```

<br/>


## Cloner un repo git contenant un submodule

```
git clone --recursive https://github.com/<user>/mon_repo
```

<br/>


## Effacer un submodule du repo

```
git submodule deinit -f — mon_repo_as_submodule
rm -rf .git/modules/mon_repo_as_submodule
git rm -f mon_repo_as_submodule
```

<br/>

## Pull git submodules après avoir cloné un projet sur GitHub

> Normalement la commande suivante est automatiquement jouée par git sur les nouvelles versions

```
git submodule update --init --recursive
```

<br/>

## Importer les mises à jour d'un submodule dans le repo

```
git submodule update --recursive
```

<br/>

## Mettre à jour un submodule à la dernière version

```
cd mon_repo_as_submodule
git checkout master && git pull
cd ..
git add mon_repo_as_submodule
git commit -m "updating submodule to latest"
```

<br/>

## .gitignore global

```
touch ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```

<br/>

## Cherry-pick tous les commits d'une branche dans une autre

```
git checkout ma-branche-a-updater
git cherry-pick ma-branche-a-updater..source-branch
```

<br/>

## Différence entre git pull et git pull --rebase


Point de départ:

```
      D---E master
     /
A---B---C---F origin/master
```

Un `git pull` donnera:

```
      D--------E  
     /         \
A---B---C---F----G   master, origin/master
```

Un `git pull --rebase` donnera

```
A---B---C---F---D'---E'   master, origin/master
```

<br/>

## Ajouter un tag en 2s (shortcuts)

Ajouter ceci au fichier `~/.zshrc`

```
last_release ()
{
    git describe --abbrev=0 --tags `git rev-list --tags --skip=0 --max-count=1`
}

previous_release ()
{
    last_release
}

last_tag ()
{
    last_release
}

previous_tag ()
{
    last_release
}

last_branches ()
{
    git branch --sort=-committerdate
}

function new_release {
    readonly releaseversion=${1:?"The release version (i.e. new_release vX.X.X) must be specified."}
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$current_branch" != "master" ]; then
        echo "Your are not on master branch. Please switch to it to create a new tag"
    else
        git tag $releaseversion
        git push origin $releaseversion
    fi
}

```

<br/>

## Convertir la remote URL de HTTPS en SSH et vice-versa

```
alias git-https="git remote set-url origin https://github.com/$(git remote get-url origin | sed 's/https:\/\/github.com\///' | sed 's/git@github.com://')"

alias git-ssh="git remote set-url origin git@github.com:$(git remote get-url origin | sed 's/https:\/\/github.com\///' | sed 's/git@github.com://')"
```

<br/>

## Ajouter une clé privé dans une session SSH distante

```
eval `ssh-agent -s`
```

<br/>

## Commit convention

`<type>(<scope>): <short summary>`

With Type equals:
* Changes relevant to the API or UI:
    * **feat** Commits that add, adjust or remove a new feature to the API or UI
    * **fix** Commits that fix an API or UI bug of a preceded feat commit
* **refactor** Commits that rewrite or restructure code without altering API or UI behavior
* **perf** Commits are special type of refactor commits that specifically improve performance
* **style** Commits that address code style (e.g., white-space, formatting, missing semi-colons) and do not affect application behavior
* **test** Commits that add missing tests or correct existing ones
* **docs** Commits that exclusively affect documentation
* **build** Commits that affect build-related components such as build tools, dependencies, project version, ...
* **ops** Commits that affect operational aspects like infrastructure (IaC), deployment scripts, CI/CD pipelines, backups, monitoring, or recovery procedures, ...
* **chore** Commits that represent tasks like initial commit, modifying .gitignore, ...

<br/>

## Versioning 


Most of the time a `semver` (sementic versioning) approach is adapted.<br/>
-> `MAJOR.MINOR.PATCH`<br/>

(personaly I put a `v` in front: `vMAJOR.MINOR.PATCH` so that when we see `v4.2.3` somewhere there is no doubt we talk about a version)

<br/>

To determine if you need to increase the value of MAJOR or MINOR or PATCH just ask yourself this question:

**"Could an existing client need to modify its code or usage to continue functioning correctly?"**

NO -> PATCH or MINOR<br/>
YES / POSSIBLY -> MAJOR

<br/>

**Difference between PATCH & MINOR ?**

MINOR = Backward-compatible addition<br/>
PATCH = Fix without changing the expected behavior


<br/>

**Conclusion / Mental rule**

PATCH -> "I fixed something"<br/>
MINOR -> "I added somthing"<br/>
MAJOR -> "I changed / broken"


<br/>

## Workflow pour travailler en équipe

**Gitflow:**
http://danielkummer.github.io/git-flow-cheatsheet/


<br/>


*Edited 13 november 2016:*

**Better method: Github flow:**

https://blogs.technet.microsoft.com/devops/2016/06/21/a-git-workflow-for-continuous-delivery/

