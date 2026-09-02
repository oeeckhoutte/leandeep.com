# Exécuter une action sur tous les fichiers ayant un pattern dans leur nom

- Canonical URL: https://leandeep.com/ex%C3%A9cuter-une-action-sur-tous-les-fichiers-ayant-un-pattern-dans-leur-nom/
- Author: Olivier Eeckhoutte
- Published: 2013-07-23T15:46:00Z
- Updated: 2013-07-23T15:46:00Z
- Language: fr
- Tags: Linux, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Tout est dans le titre. Il s'agit d'un *quick tip* qui montre comment exécuter une command linux sur les fichiers qui respectent un pattern particulier:

```
find . -name '*.png' -exec echo {} \;
```

