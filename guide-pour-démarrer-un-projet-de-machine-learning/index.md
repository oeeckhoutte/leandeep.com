# Guide pour démarrer un projet de Machine Learning

- Canonical URL: https://leandeep.com/guide-pour-d%C3%A9marrer-un-projet-de-machine-learning/
- Author: Olivier Eeckhoutte
- Published: 2015-12-21T23:05:00Z
- Updated: 2015-12-21T23:05:00Z
- Language: fr
- Tags: Machine Learning, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Dans cet article nous allons voir quelles sont les étapes à suivre pour mener à bien un projet de Machine Learning. 

<br/>

Un projet de Machine Learning correspond bien souvent à un problème que l'on souhaite résoudre. Par exemple, comment diminuer la fraude à la Carte Bleue de certains de mes clients ? Où investir dans l'immobilier pour faire le plus de rentabilité ? etc. 
Pour résoudre ce problème et atteindre une cible (Y), il faut impérativement des données (X). Nous verrons par la suite de quoi on parle en terme de données. 
Enfin il faudra définir une fonction de coût (f) qui nous permette d'évaluer la distance (autrement dit l'erreur) entre la prédiction de notre modèle et la cible réelle.

<br/>

L'objectif final étant de trouver la meilleure fonction f qui permette de prédire Y en fonction de X: 
Y ~ f(X,w) avec w un ensemble de paramètres

<br/>

Une fois le problème bien posé, il faut se poser les questions suivantes: 

<br/>

# 1. De quel type de problème s'agit-il ?

Est-ce qu'il s'agit d'un problème d'apprentissage supervisé ou de non supervisé ?

* **Apprentissage supervisé**
    *S'agit-il d'un problème d'apprentissage supervisé de type:*
    * regression *(i.e: est-ce que la variable à prédire est continue ? Est-ce qu'on essaye de s'en approcher le plus possible ?)*
    * classification *(i.e: est-ce que la variable à prédire est une classe ou un entier ?)*
    * ranking *(i.e: est-ce que la variable à prédire me permet d'ordonner une liste ? Est-ce que c'est un score ?)*

* **Apprentissage non supervisé**
    *S'agit-il d'un problème d'apprentissage non supervisé de type:*
    * clustering *(i.e: est-ce que mes données peuvent être regroupées en clusters plus pu moins homogènes ?)*
    * réduction du nombre de dimension 
    * système de recommandations


Pour simplifier le problème et essayer de donner du sens au modèle prédictif, on essaye de le ramener à un problème d'apprentissage supervisé; même si à la base on pensait qu'il s'agissait d'un problème d'apprentissage non-supervisé.

En pratique, ce n'est pas si simple. Pour construire un modèle prédictif fiable, il faut assembler différents types de modèles avec parfois des étapes d'apprentissage non supervisées intermédiaires.

<br/>

# 2. Quelles données ai-je à ma disposition ? 

* Y a-t-il des données temporelles ? 
* Quel est mon nombre d'observations (nombre de lignes) ? 
* Quel est mon nombre de features/ variables (nombre de colonnes) ?
* Quelles sont les variables manquantes ?
* Quelles sont les corrélations entre les variables et la cible à prédire ?
* Mes variables sont-elles catégorielles, discètes ou continues ?
* Est-ce quel type de données je travaille ? CSV ? JSON ? BDD relationnelle ? BDD Graph ?..
* Dois-je encoder mes données catégorielles ? 

<br/>

# 3. Quel Train/ Test Split réaliser sur mon dataset ?

Dans cet partie on va découper notre dataset en 2 parties pour éviter de faire de l'overfitting (apprentissage par coeur). 
On va réserver environ entre 70 à 80% du dataset pour la phase d'apprentissage et on va utiliser le reste pour déterminer le modèle qui fait le moins d'erreurs durant la phase de test.

Attention toutefois si le problème que l'on traite est un problème de classification. Il faut que toutes les classes à prédire soient bien représentées dans les 2 splits. C'est d'autant plus vrai si l'un de nos split comporte peu d'exemples. 

Attention aussi si le problème que l'on traite comporte des données temporelles. Il faut bien séparer temporellement les splits de données pour prédire le futur avec le passé.

<br/>

# 4. Quel algorithme dois-je utiliser ?

Enchaînez l'apprentissage avec plusieurs modèles et comparez les résultats. Cela peut même être fait de manière automatique (Grid Search, Tpot, Auto-Sklearn...). Dès que vous entamez un problème de Machine Learning essayez tout de suite d'apprendre un modèle et d'observer votre performance. Cela vous permettra d'estimer la complexité du sujet. 

Il faudra ensuite itérer en améliorant votre code jusqu'à ce que la performance recherchée soit atteinte. 

Si vous souhaitez pouvoir interprêter les prédictions de votre modèle, privilégiez les modèles linéaires ou les arbres de décision.
Dans le cas contraire privilégiez les random forests. Cela vous simplifiera la vie car vous pourrez travailler avec tout type de données et votre modèle ne sera pas victime d'un surapprentissage.

<br/>

# 5. Quelle est la performance de mon modèle ?

En fonction du type de problème que vous adressez, différents indicateurs peuvent être mesurés à partir du split de test.

* **Apprentissage supervisé**
    * Régression 
        * Erreur de prédiction
        * Sur un Graph XY: valeur à prédire / valeur prédite

    * Classification
        * Courbe de ROC
        > Pour rappel, la courbre de ROC permet de représenter le ratio précision (prédire correctement) / rappel (valider la prédiction)
        > Certains modèles retournent un score de confiance en plus de la prédiction. Plus ce score est élevé et plus le résultat a de chance d'être correct ou précis.
        
        * Matrice de confusion
        * Précision / Rappel

    * Ranking
        * Corrélation de rang
        * DCG

* **Apprentissage non supervisé**
    * Clustering
        * Nombre d'arc coupés 
        * Variance inter et intra classes

    * Système de recommandation
        * Corrélation de rang

Si la performance de votre modèle n'est pas suffisante, posez-vous par exemple les questions suivantes: 

* Est-ce que les valeurs manquantes empêchent le modèle d'apprendre ?
* Faut-il donner plus de features à mon modèle ? 
* Ai-je distribué de manière homogène mes variables entre mes splits d'apprentissage et de test ?
* Ai-je laissé des outliers dans ma base d'apprentissage ? 
* Est-ce que mes données sont bruitées ? 

<br/>

# 6. Comment puis-je optimiser mon modèle ?

* Valorisez des valeurs manquantes en utilisant la sortie d'autres modèles de machine learning
* Calculez de nouvelles données si des données peuvent être groupées (Par exemple, calculez des moyennes pour connaître la note d'un restaurant et savoir si oui ou non des clients sont satisfaits...)
* Pour traiter les outliers et diminuer leur importance, il faut passer les variables au logarithme.
* Aggrégés des données sur des périodes d'un mois ou d'un an pour des données temporelles
* Si la performance est mauvaise essayez de comprendre quelle feature est la cause du problème
* Si vos données sont bruitées, voire très bruitées, il est possible d'utiliser les premiers axes d'une ACP (Analyse en Composante Principale; i.e: prendre le maximum d'échantillons du dataset et diminuer le nombre de variables en les compressant) ou un réseau Diabolo.

<br/>

# 7. Validation du modèle

Pour valider que votre modèle est performant et qu'il permette de réellement prédire une cible de manière fiable, réaliser une Cross Validation.  

