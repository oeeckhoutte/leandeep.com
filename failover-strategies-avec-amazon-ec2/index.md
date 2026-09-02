# Failover strategies avec Amazon EC2

- Canonical URL: https://leandeep.com/failover-strategies-avec-amazon-ec2/
- Author: Olivier Eeckhoutte
- Published: 2013-01-26T19:02:00Z
- Updated: 2013-01-26T19:02:00Z
- Language: fr
- Tags: AWS
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## downtime < 10 minutes

Pour avoir un downtime < 10 minutes il y a cette première stratégie:

![image](/images/downtime-10-min.png)

On crée un clone de l'environnement de production prêt à être lancé à n'importe quel moment sur une autre zone de disponibilité si l'environnement de production venait à crasher. L'outil Cloudformation fournit gratuitement par AWS peut peut aider à configurer plusieurs environnements.

<br/>

## Un peu de redondance

Remarque: Transférer des données entre instances dans la même zone de disponibilité est gratuit. Par contre, entre 2 zones différentes le coût est de $0.01 par gigabyte.

![image](/images/un-peu-redondance.png)

<br/>

## Redondance totale 

![image](/images/redondance-totale.png)



