# Décoder une string HTML encoded en ligne de commande

- Canonical URL: https://leandeep.com/d%C3%A9coder-une-string-html-encoded-en-ligne-de-commande/
- Author: Olivier Eeckhoutte
- Published: 2023-05-03T07:00:00+02:00
- Updated: 2023-05-03T07:00:00+02:00
- Language: fr
- Tags: tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Tip du jour pour rapidement convertir une string HTML encoded via le terminal.

## Pré-requis

```
brew install recode
```

<br/>

## Commande

```
echo "string&#32;&#35;1&#46;" | recode html..ascii
```
