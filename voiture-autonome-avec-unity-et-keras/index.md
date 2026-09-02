# Voiture autonome avec Unity et Keras

- Canonical URL: https://leandeep.com/voiture-autonome-avec-unity-et-keras/
- Author: Olivier Eeckhoutte
- Published: 2018-03-04T15:43:00Z
- Updated: 2018-03-04T15:43:00Z
- Language: fr
- Tags: Deep Learning, Featured, Machine Learning
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



    <iframe 
        width="100%" 
        height="400" 
        src="//www.youtube.com/embed/Pl6MbEZ3liM?rel=0" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>




<br/>
Cet article présente le résultat de mon travail sur la construction d'un véhicule autonome dans un simulateur. J'ai suivi un *whitepaper* rédigé par une équipe de Nvidia qui est disponible à l'adresse suivante: [http://images.nvidia.com/content/tegra/automotive/images/2016/solutions/pdf/end-to-end-dl-using-px.pdf](http://images.nvidia.com/content/tegra/automotive/images/2016/solutions/pdf/end-to-end-dl-using-px.pdf)

Le training a été fait non pas sur une Nvidia Drive PX comme précisé dans le *paper* mais sur un Macbook Pro durant 1 nuit.

![image](/images/implemented-model.png)


Le problème de conduite de véhicule autonome est ramené à un problème d'apprentissage supervisé. 
Grâce au simulateur [*opensource*](https://github.com/udacity/self-driving-car-sim) d'[Udacity](https://eu.udacity.com/), des données d'apprentissage peuvent être extraites. 
* En entrée X, on a des images de la route. 
En effet, à l'avant du véhicule, il y a 3 caméras. Une filme le côté gauche du véhicule, une autre le devant et une dernière filme le côté droit.
* En sortie Y, on a l'angle du volant.


Le modèle est construit et entraîné avec Keras (et Tensorflow en backend).

Le modèle suivant est implémenté:

![image](/images/cnn-autonomous-vehicule.png)


Comme vous avez pu le voir sur la vidéo au dessus, après une nuit d'apprentissage, notre véhicule suit bien la route en toute autonomie.

Maintenant, si vous voulez construire votre propre voiture autonome grandeur nature vous savez comment faire... Il faut placer 3 caméras sur le capot de votre véhicule, lire le bus CAN et pouvoir agir sur l'angle du volant (et sur les pédales aussi!).

![image](/images/lol.gif)

