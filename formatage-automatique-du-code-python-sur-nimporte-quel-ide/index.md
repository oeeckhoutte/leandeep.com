# Formatage automatique du code Python sur n'importe quel IDE

- Canonical URL: https://leandeep.com/formatage-automatique-du-code-python-sur-nimporte-quel-ide/
- Author: Olivier Eeckhoutte
- Published: 2016-04-15T21:14:00Z
- Updated: 2016-04-15T21:14:00Z
- Language: fr
- Tags: IDE, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Editorconfig est un formidable outil pour laisser aux développeurs le choix d'utiliser l'IDE qu'ils préfèrent sans avoir des problèmes de formatage de code. 

Voici un exemple d'utilisation simple avec Python:

Au niveau `root` de votre projet créez un fichier `.editorconfig`.
Par exemple, ajoutez une conf de formatage des indentations:

```
[*.py]
indent_style = space
indent_size = 4
```

Si comme moi vous êtes passé à visual studio code (ou atom), il suffit d'installer un plugin appelé `EditorConfig for VS Code` et le package Python autopep8 via pip. Ce dernier s'installera tout seul si vous pressez les commandes de formatage automatique `alt` + `Shift` + `f`.

Une fois que tout est installé, vous pouvez reformater votre code automatiquement via la commande précédente `alt` + `Shift` + `f`.



