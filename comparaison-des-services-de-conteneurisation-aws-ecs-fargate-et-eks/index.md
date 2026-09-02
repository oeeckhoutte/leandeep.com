# Comparaison des services de conteneurisation AWS (ECS, Fargate et EKS) 

- Canonical URL: https://leandeep.com/comparaison-des-services-de-conteneurisation-aws-ecs-fargate-et-eks/
- Author: Olivier Eeckhoutte
- Published: 2019-01-16T19:33:00Z
- Updated: 2019-01-16T19:33:00Z
- Language: fr
- Tags: Docker, Kubernetes, AWS
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

![image](/images/ecs-fargate-eks.png)

Il n'est pas évident de comprendre les différentes entre AWS ECS, Fargate et EKS. Au premier abord ces outils peuvent sembler similaire. Je me suis personnellement vraiment questionné sur la différence entre AWS Fargate et AWS EKS.

Dans cet article je vais essayer de résumer les différences qu'il peut y avoir entre ces 3 services.

<br/>

**Avantages**

| ECS   |      EKS      |  Fargate |
|----------|:-------------:|------:|
| Service gratuit (on ne paye que pour le compute sous jacent)  | Offre toutes les features d’ECS + VPC pour le réseau entre pods et isolation au niveau du cluster Kubernetes | Possible d’utiliser l’API de Fargate comme celle d’ECS |
| Service historique d’AWS d’orchestration de containers Docker | Offre tous les avantages de Kubernetes (cloud agnostic) | Permet de faire tourner des clusters hétérogènes constitués d’instance EC2 ou Fargate. Idéal pour scaler rapidement horizontalement |
| Possibilité de dupliquer ses environnements via API | Réplication des masters Kubernetes dans 3 zones de disponibilités différentes | Permet de ne pas avoir à manager l’infrastructure |
| Intégration sans couture avec la registry Docker AWS ECR (pas besoin de gérer sa propre registry + workflow simple pour gérer ses images) | Possibilité de répliquer l’environnement dans un autre déjà existant avec assez peu de modifications | Support AWS VPC network mode; ce qui signifie que les tâches qui tournent sur une même instance partage l’interface réseau (Elastic Network Interface) |
| Auto-healing des containers Docker | Coût assez faible par cluster: $0.20 par heure | Coût à l'usage du compute et non pas à l’instance EC2 sous-jacente. Cela peut permettre de faire des économies |
|  | Toutes les communications entre pods se font via IP dans le VPC | Scalabilité horizontale très rapide (machines provisionées à l’avance) |

<br/>

**Inconvénients**

| ECS   |      EKS      |  Fargate |
|----------|:-------------:|------:|
| Service pas simple à utiliser pour les systèmes distribués | Faible intégration avec les autres services AWS | Moins d’options de customisation |
| Scalabité horizontale dépendante du démarrage d’instances EC2 | Prévoir des charges supplémentaires pour des ressources complémentaires (ex: stockage) | Besoin de démarrer ses propres composants |
| Obtenir un cluster On-demand peut prendre du temps | Pas possible d’avoir plus de 3 clusters par région (quota augmenté par ticket) | Démarrage assez long |
| Changer le type d’instance n’est pas possible une fois démarrée | IAM au niveau des pod est difficile à mettre en place | Pas d’accès à un filesystem persistent |


