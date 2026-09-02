# Sortir dans un pays particulier avec Tor 

- Canonical URL: https://leandeep.com/sortir-dans-un-pays-particulier-avec-tor/
- Author: Olivier Eeckhoutte
- Published: 2019-08-24T20:38:00Z
- Updated: 2019-08-24T20:38:00Z
- Language: fr
- Tags: Tor, Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Si vous avez besoin de sortir dans un pays particulier avec Tor c'est faisable facile. Voici la procédure pour OSX.

Pour ce faire, éditez le fichier `~/Library/Application\ Support/TorBrowser-Data/Tor/torrc` et ajoutez la ligne suivante: 

```
ExitNodes {us} StrictNodes 1

# StrictNodes 0 est plus permissif
# Il est possible d'avoir plusieurs pays {us},{fr}
```

Dans l'exemple précédent, on sort aux US mais il est possible de sortir ailleurs. Il suffit de changer le code pays. https://web.archive.org/web/20180328074444/http://www.b3rn3d.com/blog/2014/03/05/tor-country-codes/


Vous pouvez vérifier si cela a bien fonctionné en vous rendant sur ce site: https://www.where-am-i.co/my-ip-location



