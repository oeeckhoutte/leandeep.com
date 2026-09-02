# Utiliser des binaires NodeJS avec nvm et Xcode

- Canonical URL: https://leandeep.com/utiliser-des-binaires-nodejs-avec-nvm-et-xcode/
- Author: Olivier Eeckhoutte
- Published: 2023-01-15T07:00:00+02:00
- Updated: 2023-01-15T07:00:00+02:00
- Language: fr
- Tags: Xcode, Node, NVM, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Lorsqu'on utilise un binaire NodeJS sur xcode mais qu'on n'utilise pas NodeJS "classiquement" installé avec brew ou curl, on obtient la magnifiquer error "command not found" lorsque que Xcode build

<br/>

## Correctif

Pour remédier à ce problème, il suffit d'ajouter le script suivant dans la section `build phase` de son projet Xcode, avant bien sûr que la commande node soit exécutée.

```
if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
. "$HOME/.nvm/nvm.sh"
elif [[ -x "$(command -v brew)" && -s "$(brew --prefix nvm)/nvm.sh" ]]; then
. "$(brew --prefix nvm)/nvm.sh"
fi
```

![image](/images/nvm-binaire-node-xcode.png)

<br/>

Et voilà
