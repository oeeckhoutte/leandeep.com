# Mocker en 1 minute les appels vers des services externes

- Canonical URL: https://leandeep.com/mocker-en-1-minute-les-appels-vers-des-services-externes/
- Author: Olivier Eeckhoutte
- Published: 2020-07-04T21:20:04-07:00
- Updated: 2020-07-04T21:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Que ce soit pour du dévelopement ou pour exécuter des tests ou autres, il est très fréquent de vouloir mocker les appels vers des services externes. 
Si vous utilisez le module `requests` dans votre projet vous pouvez tout simplement ajouter le module `requests_cache` pour créer des bouchons. En effet, ce dernier va mettre en cache (dans une base de données sqlite) toutes les réponses aux requêtes faites par `requests`.

<br/>

## Mise en place

Bien sûr, on install le module: `pip install requests_cache`. Puis on ajoute le code suivant dans son projet:

```
import requests 

import requests_cache
requests_cache.install_cache("non_fichier_bdd_sqlite")
```

Comme vous le voyez c'est excessivement simple.

<br/>
Notez que ce système peut permettre de travailler efficacement en mode déconnecté ou de travailler sur des systèmes sécurisés non exposés sur internet.  
