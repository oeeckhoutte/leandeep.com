# Devenir Atari Pong master grâce à l'apprentissage par renforcement

- Canonical URL: https://leandeep.com/devenir-atari-pong-master-gr%C3%A2ce-%C3%A0-lapprentissage-par-renforcement/
- Author: Olivier Eeckhoutte
- Published: 2018-03-29T21:09:00Z
- Updated: 2018-03-29T21:09:00Z
- Language: fr
- Tags: Featured, Apprentissage Renforcement, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Qu'est-ce que l'apprentissage par renforcement ?

L'apprentissage par renforcement est utilisé dans l'intelligence artificielle pour enseigner aux ordinateurs comment prendre de meilleures décisions en fonction des récompenses qu'ils reçoivent.

En d'autres termes, l'apprentissage par renforcement, c'est un peu comme apprendre à faire quelque chose en obtenant des récompenses pour ses actions. 

En trading par exemple, on évalue quelle stratégie va maximiser les récompenses qui sont le retour sur investissement. Les récompenses peuvent être obtenues longtemps après une action. 

Autre exemple, avec un jeu d'échec, on peut obtenir des récompenses mieux que ce qu'on aurait pu jouer simplement en sacrifiant des pièces pour jouer un meilleur coup.

> En apprentissage par renforcement, on crée une **politique** qui définit l'**action** qui maximisera les **récompenses** lorsqu'une action sera exécutée en fonction de l'état du système.
 
<br/>
 
## Atari Pong

Pour coder mon réseau de neurones et faire de l'apprentissage par renforcement sur un cas pratique et simple, j'ai utilisé le framework [OpenAI gym](https://gym.openai.com/docs/). 

> "Gym is a toolkit for developing and comparing reinforcement learning algorithms"

Ce framework permet d'intéragir avec des jeux basiques Atari.
J'ai choisi le jeu Atari Pong pour implémenter mon algorithme gradients de politique.

Voici 2 vidéos que j'ai enregistré qui montrent des parties jouées entre un agent qui est l'ordinateur et un agent qui est piloté par un réseau de neurones.

* Dans la première vidéo, le réseau de neurones n'a pas encore été entraîné.


    <iframe 
        width="100%" 
        height="400" 
        src="//www.youtube.com/embed/fmxJNCf4REY?rel=0" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>





<br/>
<br/>

* Dans la seconde vidéo, le réseau de neurones a été entraîné pendant des jours avec un algorithme policy gradients.


    <iframe 
        width="100%" 
        height="400" 
        src="//www.youtube.com/embed/yo2c-SCFL-M?rel=0" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>





<br/>
<br/>

<br/>

## Algorithmes gradients de politique&nbsp;*(Policy Gradients)*

Les algorithmes de gradient de politique sont un type d'algorithme d'apprentissage par renforcement qui utilisent la descente de gradient pour apprendre une politique qui maximise une récompense donnée.

Les algorithmes gradients de politique sont utilisés pour apprendre à un ordinateur comment prendre de meilleures décisions pour accomplir une tâche spécifique. Voici comment ça marche :

- Objectif: Tout d'abord, l'ordinateur a une tâche à accomplir, comme jouer à un jeu ou piloter un robot.

- Actions: Il peut effectuer différentes actions pour essayer de bien faire cette tâche. Par exemple, dans un jeu vidéo, il peut décider de bouger vers la gauche ou vers la droite.

- Politique: L'ordinateur a une sorte de plan, appelé "politique", qui lui dit quelles actions prendre dans différentes situations. Au début, ce plan peut être aléatoire, c'est-à-dire qu'il fait des choses au hasard.

- Récompense: À chaque fois qu'il fait quelque chose, il reçoit une récompense. Si ce qu'il fait est bon, la récompense est élevée ; s'il se trompe, la récompense est faible.

- Apprentissage: Maintenant, l'ordinateur veut devenir meilleur. Il regarde les récompenses qu'il a reçues et ajuste sa politique. Si une action a conduit à une grande récompense, il est plus susceptible de faire cette action dans le futur. Si une action a conduit à une petite récompense, il est moins susceptible de la faire à l'avenir.

- Répétition: Il continue à jouer ou à effectuer des actions, à recevoir des récompenses, à ajuster sa politique, encore et encore, jusqu'à ce qu'il devienne vraiment bon à la tâche.

Donc, les algorithmes gradients de politique sont comme un apprentissage par essais et erreurs, où l'ordinateur apprend à faire de meilleures actions en se basant sur les récompenses qu'il reçoit. C'est un peu comme quand tu essaies de faire quelque chose, comme dessiner, et que tu t'améliores en pratiquant et en apprenant de tes erreurs.

<br/>

Voici un très bon cours pour comprendre en détail comment fonctionnent ces algorithmes: 
[http://rll.berkeley.edu/deeprlcourse/](http://rll.berkeley.edu/deeprlcourse/) (voir lecture 4 policy gradient). 

Il y a également cette vidéo qui traite spécifiquement de ces algorithmes:


    <iframe 
        width="100%" 
        height="400" 
        src="//www.youtube.com/embed/oPGVsoBonLM?rel=0" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>





En synthèse, voici un résumé de l'algo implémenté:

* On commence par laisser la politique du réseau de neurones jouer plusieurs parties de Pong et à chaque étape on calcule les gradients qui augmenteraient la probabilité de l'action choisie. Au début, on ne fait rien d'autre que calculer les gradients. 

* Après plusieurs parties, on calcule le score de chaque action. On évalue une action en fonction de la somme de toutes les récompenses qui s'ensuivent en appliquant à chaque étape un taux de rabais (**discount rate**) r. 
Par exemple, si on considère que notre agent va 3 fois de suite vers le haut et qu'on prend les hypothèses suivantes:
    * Il reçoit +10 comme récompense après la première étape
    * 0 après la deuxième 
    * -50 après la troisième
    * r = 0,8 (plus le taux de rabais est proche de 1 et plus les récompenses arrivant tardivement comptent autant que les récompenses immédiates. Généralemement r varie entre 0,95 et 0,99. 
    * Conclusion: le score total est de 10 * r^0 + 0 * r^1 + (-50) * r^2 = -22

* Si le score est positif, cela signifie que l'action était bonne. On applique les gradients calculés lors de la première étape. Appliquer les gradients signifie que l'on multiplie son vecteur par le score de l'action correspondante. L'action sera ainsi davantage utilisée dans le futur. 
Si l'action n'était pas bonne, on applique les gradients opposés.

* Pour terminer, on calcule la moyenne de tous les vecteurs de gradients obtenus et on l'utilise pour effectuer une étape de descente de gradient. 

