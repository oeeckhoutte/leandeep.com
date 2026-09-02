# Servir les fichiers du dossier courant via une interface web

- Canonical URL: https://leandeep.com/servir-les-fichiers-du-dossier-courant-via-une-interface-web/
- Author: Olivier Eeckhoutte
- Published: 2015-06-17T22:37:00Z
- Updated: 2015-06-17T22:37:00Z
- Language: fr
- Tags: Unix Tip, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

**Dans la catégorie réseau et SSH:**

2 possibilitées en fonction de ce qui est installé sur votre machine.

* NodeJS est installé

```
$ npm install -g http-server
$ http-server
```

Par défaut le port 8080 sera utilisé.
Pour le customiser utilisé la commande suivante:

```
$ http-server -p 3000
```

<br/>

* Python est installé:

```
$ python -m SimpleHTTPServer
ou
$ python3 -m http.server
```

Par défaut le port 8000 sera utilisé 
Pour le customiser utilisé la commande suivante:

```
$ python -m SimpleHTTPServer 3000
ou
$ python3 -m http.server
```


Que vous utilisiez NodeJS ou Python vous devrez passer en root pour utiliser les ports en dessous de 1024.

