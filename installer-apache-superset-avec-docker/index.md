# Installer Apache Superset avec Docker

- Canonical URL: https://leandeep.com/installer-apache-superset-avec-docker/
- Author: Lean Deep
- Published: 2019-08-11T00:46:43Z
- Updated: 2019-08-11T00:46:43Z
- Language: fr
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

`Apache Superset` est un super outil Opensource (construit en React et Python) permettant de réaliser des dashboards d'analyse de données. Cet outil est gratuit et parfaitement responsive design. La documentation officielle est [ici](https://superset.incubator.apache.org).

Son installation est aisée avec Docker. 

<br/>

Voici les commandes permettant de créer une instance avec toutes ses dépendances (Redis et Postgres) avec Docker:

```
git clone https://github.com/apache/incubator-superset/
cd incubator-superset/contrib/docker
docker-compose run -e SUPERSET_LOAD_EXAMPLES=yes --rm superset ./docker-init.sh
docker-compose up
```

<br/>

Une fois le container principal (superset) lancé, il suffit de se rendre à l'adresse suivante http://localhost:8088 pour accéder à l'outil. 
Une fois authentifié avec le compte créé durant l'installation, on peut commencer par créer une base de données. Si votre datasource est un CSV, cochez la case permettant d'uploader des CSV lors de la création de la base de données. 

Vous pouvez ensuite créer de beaux dashboards avec des charts qui montrent les informations extraites pertinentes dont vous avez besoin.

![image](/images/superset-donnees-filtrees.png)

<br/>

Vous pouvez construire des dashboards design:

![image](/images/superset-example.png)

