# Rapidement remplacer des chaines de caractères dans Vim

- Canonical URL: https://leandeep.com/rapidement-remplacer-des-chaines-de-caract%C3%A8res-dans-vim/
- Author: Olivier Eeckhoutte
- Published: 2013-07-24T23:14:00Z
- Updated: 2013-07-24T23:14:00Z
- Language: fr
- Tags: vim, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Raccourci clavier

Il est possible d'ajouter un raccourci clavier pour rapidement remplacer une chaine de caractère sélectionnée en mode visuel.

Editer le fichier ~/.vimrc et ajouter la ligne suivante:

```
vnoremap <C-r> "hy:%s/<C-r>h//gc<left><left><left>
```

En pressant `ctrl + r` en mode visuel, un *prompt* va s'afficher pour entrer le texte qui remplacer l'ancien. Appuyer sur `enter` et confirmer ou annuler chaque changement par `y` ou `n`. 

> Si vous ne voulez pas confirmer les changements vous pouvez aussi supprimer le `c` à la fin de la commande VIM `:%s/old_text/new_text/gc`

<br/>

## Sélection verticale

Sélectionner la première colonne et entrer cTEXT_REMPLACEMENT<Esc>.

Example:

```
[a]aa
[b]bb
[c]cc
[d]dd

c123<Esc>

123aa
123bb
123cc
123dd
