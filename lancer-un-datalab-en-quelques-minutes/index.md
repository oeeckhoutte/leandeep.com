# Lancer un Datalab en quelques minutes

- Canonical URL: https://leandeep.com/lancer-un-datalab-en-quelques-minutes/
- Author: Olivier Eeckhoutte
- Published: 2018-01-19T23:39:00Z
- Updated: 2018-01-19T23:39:00Z
- Language: fr
- Tags: Machine Learning, AWS, Docker
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Il m’arrive assez régulièrement de devoir switcher de machine de développement lorsque je travaille sur du Machine ou Deep Learning. C’est d’autant plus vrai lorsque je travaille avec Tensorflow avec support GPU et que je manipule des datasets de plusieurs Go. Pour accélérer la phase d’apprentissage de mes algorithmes, il m’arrive de louer, durant plusieurs heures, des VM survitaminées chez Amazon Web Services.

Pour éviter de devoir reconfigurer à chaque fois mon environnement de datascience, j’utilise 2 images Docker.
Grâce à Docker et à l’image que j’ai à disposition, je peux lancer un nouvel environnement de datascience from Scratch en moins de 5 minutes. De plus, je peux faire une sauvegarde parfaite de toutes les configurations et librairies que j’utilise. It’s definitely worth it ! Avez-vous déjà perdu votre temps à installer xgboost ou Cuda sur OSX 😀 ?

Ma première image est la parfaite toolbox du data scientist.

![image](/images/docker-jupyter-spark.png)


Elle contient les outils suivants:

* Spark
* Python3
* R
* SQL
* Jupyter

De nombreuses librairies pour la datascience
Vous pouvez cloner mon repository, builder et démarrer l’image sur votre environnement:

https://github.com/oeeckhoutte/fast-datalab

Je vous recommande d’exécuter la deuxième commande dans mon README. Elle vous permettra de monter un volume entre votre Host Docker et le container. Vos données seront ainsi préservées si le container venait à crasher. Si vous n’êtes pas dans une logique d’industrialisation de vos modèles, je vous recommande également de créer un cron et de sauvegarder automatiquement vos notebooks Jupyter sur Bitbucket (free private repositories).

 

Après avoir exécuté les 2 commandes pour builder votre image et lancer un container (moins de 5 minutes), votre environnement avec Jupyter Notebook et tous les outils actuels pour faire du Machine Learning seront prêts. Vous n’aurez plus qu’à ouvrir un nouvel onglet dans votre navigateur et vous rendre à l’adresse indiquée:

![image](/images/jupyter-launched.png)



 

Pour faire du Deep Learning avec la version optimisée pour GPU de TensorFlow, j’ai rencontré pas mal de difficultés à tout installer et configurer. Même si mon poste de développement est puissant (Mac Pro avec i7, GPU NVIDIA élevé, 32 go RAM), je n’ai pas la patience d’attendre durant les phases d’apprentissage.

Pour avoir le maximum de puissance (plusieurs GPU en parallèle) et pour ne plus jamais avoir à installer et configurer CUDA, j’exécute directement mes algorithmes dans des containers Docker sur la plateforme AWS. Je loue une machine survitaminée (une machine que je n’aurais jamais chez moi) le temps de l’apprentissage et je l’arrête quand c’est terminé. Cela ne me coûte presque rien. Merci AWS !

Je parlerai de ce sujet plus en détails dans un prochain article.

