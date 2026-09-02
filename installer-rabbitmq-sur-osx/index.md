# Installer RabbitMQ sur OSX

- Canonical URL: https://leandeep.com/installer-rabbitmq-sur-osx/
- Author: Olivier Eeckhoutte
- Published: 2015-12-28T22:11:00Z
- Updated: 2015-12-28T22:11:00Z
- Language: fr
- Tags: OSX, RabbitMQ, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Pour installer RabbitMQ sur OSX, c'est vraiment très simple:

<br/>

## Installer RabbitMQ 

Exécuter la commande:
```
brew install rabbitmq
```

Puis ajouter la ligne `export PATH=$PATH:/usr/local/sbin` dans votre fichier `~/.zshrc`.

<br/>

## Démarrer RabbitMQ

Pour démarrer le service il suffit d'exécuter la commande suivante:
```
brew services start rabbitmq
```

Si vous vous rendez sur http://localhost:15672 vous pourrez voir l'interface d'administration de RabbitMQ.

> Il est également possible de démarrer le serveur en standalone via la commande `rabbitmq-server`.

