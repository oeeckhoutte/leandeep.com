# Convertir un fichier pipfile.lock en requirements.txt

- Canonical URL: https://leandeep.com/convertir-un-fichier-pipfile.lock-en-requirements.txt/
- Author: Olivier Eeckhoutte
- Published: 2022-05-26T21:25:00Z
- Updated: 2022-05-26T21:25:00Z
- Language: fr
- Tags: tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petit tip du jour pour convertir un fichier `Pipfile` en `requirements.txt`

En pré-requis, il faut avoir jq 

> `brew install jq`

Ensuite, il suffit d'exécuter la commande suivante:

```
jq -r '.default
        | to_entries[]
        | .key + .value.version' \
    Pipfile.lock > requirements.txt
```
