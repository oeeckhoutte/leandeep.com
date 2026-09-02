# Analyser le code source d'une app ElectronJS

- Canonical URL: https://leandeep.com/analyser-le-code-source-dune-app-electronjs/
- Author: Olivier Eeckhoutte
- Published: 2020-11-12T22:49:00+02:00
- Updated: 2020-11-12T22:49:00+02:00
- Language: fr
- Tags: ElectronJS, Security, Electron
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



## Introduction

Parfois pour vérifier qu'une application dénichée sur internet (et pas sur les stores officiels Google ou Apple) ne comporte pas de virus, le plus simple est d'analyser son code source.
C'était mon cas pour une application utilisant le framework ElectronJS que je trouvais géniale. J'ai voulu vérifier qu'elle ne contenait pas de faille de sécurité avant de l'installer sur mon Mac.
Les applications ElectronJS sont "protégées" par une archive et le code est offusqué. Dans cet court article, nous allons voir comment décompresser ces App Electron et comment rendre le code plus lisible.
Cet article peut aussi intéresser tout développeur souhaitant comprendre comment est codée une application Electron.

<br/>

## Pré-requis

* NodeJS v12+ installé

<br/>

## Installation

```
npm install -g asar js-beautify
```

<br/>

## Décompresser l'archive Asar

```
cd /Applications/AppAAnalyser.app/Contents/Resources
asar extract app.asar app 
```

<br/>

## Rendre le code lisible

```
mv app/js/app.js app/js/app.min.js
js-beautify app/js/app.min.js -o app/js/app.js
code .
```


