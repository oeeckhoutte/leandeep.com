# Restaurer une base de données Mysql et voir la progression

- Canonical URL: https://leandeep.com/restaurer-une-base-de-donn%C3%A9es-mysql-et-voir-la-progression/
- Author: Olivier Eeckhoutte
- Published: 2018-01-10T19:59:00+02:00
- Updated: 2018-01-10T19:59:00+02:00
- Language: fr
- Tags: MySQL, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


En pré-requis il vous faut 2 binaires: `pv` et `mysql-client`

Pour les installer, il suffit d'exécuter les commandes suivantes: 
```
brew install pv mysql-client
```

<br/>

Ensuite, pour restaurer le dump d'une base de données et voir la progression, vous pouvez exécuter la commande suivante:

```
pv dump.sql | mysql -u DB_USER -h DB_HOST -D DB_NAME -p
```

> Rappel: commande pour dumper une base MySQL: `mysqldump -u DB_USER -h DB_HOST -D DB_NAME -p > dump.sql`
