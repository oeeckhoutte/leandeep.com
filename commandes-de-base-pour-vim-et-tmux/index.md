# Commandes de base pour Vim et Tmux

- Canonical URL: https://leandeep.com/commandes-de-base-pour-vim-et-tmux/
- Author: Olivier Eeckhoutte
- Published: 2012-09-10T08:08:00Z
- Updated: 2012-09-10T08:08:00Z
- Language: fr
- Tags: tips, vim
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Je suis en train d'apprendre à utiliser Vim et Tmux. Cette page contient les commandes de base pour l'utiliser.

<br/>

# Vim

## Déplacements

**Mot suivant (next Word)**

`w`

<br/>

**Mot précédent (word Backward)**

`b`

<br/>

**Sélection verticale et insert**

```
ctrl + v // sélection verticale
shift + i // Entrer le texte à insérer
esc esc
```

<br/>

**Fin de ligne**

`$`

<br/>

**Début de ligne**

`0`

<br/>

**Début de fichier**

`gg`

<br/>

**Fin de fichier**

`G`

<br/>

**Help**

`:help word-motions`

<br/>

## Copier

**Copier la ligne**

`yy`

<br/>

**Copier du curseur jusqu'au prochain Word**

`yw`

<br/>

**Copier du curseur jusqu'à la fin de la ligne**

`y$`

<br/>

**Copier du curseur jusqu'au début de la ligne**

`y0`

<br/>

**Copier 4 lignes**

`4yy`

<br/>

**Copier les 3 prochains Words**

`3yw`

<br/>

## Coller

**Coller 1 fois**

`p`

<br/>

**Coller 4 fois**

`4p`

<br/>

## Annuler

**Annuler la dernière commande**

`u`

<br/>

**Annuler toutes les commandes faites sur la ligne**

`U`

<br/>

**Annuler l'annulation**

`ctrl + R`

<br/>

## Rechercher

**Recherche simple**

`/recherche`

<br/>

**Next occurrence**

`n`

<br/>

**Previous occurrence**

`N`

<br/>

**Rechercher fermeture parenthèse**

Placer le curseur sur une ouverture de parenthèse et appuyer sur `%`

> Fonctionne aussi avec les square brackets et curly braces


<br/>

# Tmux

**Démarrer une session et lui donner un nom**

`tmux new -s ma-session`

<br/>

**Renommer une session**

`tmux rename-session -t 0 ma-session-renommee`

<br/>

**Split window vertical**

`Ctrl + b + %`

<br/>

**Split window horizontal**

`Ctrl + b + "`

<br/>

**Switch to next panel**

`Ctrl + b + o`

<br/>

**Switch de panel dans n'importe quelle direction**

`Ctrl + b + Arrow`

<br/>

**Killer un panel**

`Ctrl + d`
