# Comment réduire la durée d'entrainement d'un modèle ?

- Canonical URL: https://leandeep.com/comment-r%C3%A9duire-la-dur%C3%A9e-dentrainement-dun-mod%C3%A8le/
- Author: Olivier Eeckhoutte
- Published: 2019-02-13T20:11:00Z
- Updated: 2019-02-13T20:11:00Z
- Language: fr
- Tags: Machine Learning, Machine Learning Theory
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Supposons que nous ayons un dataset composé de 1000 colonnes et comportant 1 million de lignes pour un sujet de classification, comment réduire sa dimension pour réduire les temps d'entrainement ? On suppose également que la machine qui va faire l'entrainement n'a pas énormément de RAM...

Voici les différentes options: 
- Commencer par fermer toutes les applications qui ne servent à rien
- Echantillonner aléatoirement le dataset. C'est-à-dire créer plusieurs petits datasets de dimension M(300 000, 1 000) et faire plusieurs entrainements
- On peut séparer les variables numériques et catégorielles et supprimer les variables corrélées. Plus précisément, pour les variables numériques on utilise la corrélation et pour les variables catégorielles on utilise le test du chi 2.
- On peut utiliser le PCA et sélectionner les composants qui expliquent le maximum de variance dans le dataset
- On peut utiliser l'algorithme de Vowpal Wabbit (online learning)
- On peut construire un modèle linéaire en utilisant une descente de gradient stochastique
- On peut aussi utiliser ses compétences métier pour sélectionner les features qui vont impacter le plus modèle. C'est une approche qui fait appel à l'intuition.  

