# Créer une variable d'environnement multiligne

- Canonical URL: https://leandeep.com/cr%C3%A9er-une-variable-denvironnement-multiligne/
- Author: Olivier Eeckhoutte
- Published: 2014-02-08T23:31:00Z
- Updated: 2014-02-08T23:31:00Z
- Language: fr
- Tags: Unix, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Si vous voulez définir une variable d'environnement qui comporte plusieurs lignes dans votre `.zshrc`, vous pouvez utiliser le pattern suivant:

```
VAR1=$(cat <<EOF
ligne 1
ligne 2
ligne 3
EOF
)
export VOTRE_VARIABLE=$VAR1
```

<br/>

Ou directement utiliser:

```
export VOTRE_VARIABLE=$(cat <<EOF
ligne 1
ligne 2
ligne 3
EOF
)
```


