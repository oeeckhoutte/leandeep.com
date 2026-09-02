# Expérimentation Réalité Augmentée sur iOS

- Canonical URL: https://leandeep.com/exp%C3%A9rimentation-r%C3%A9alit%C3%A9-augment%C3%A9e-sur-ios/
- Author: Olivier Eeckhoutte
- Published: 2021-06-14T11:16:00Z
- Updated: 2021-06-14T11:16:00Z
- Language: fr
- Tags: Featured
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Quand tu as trop chaud pour dormir... Plus sérieusement, j'ai expérimenté ce qu'il est possible de faire avec le SDK `ARKit` d'Apple. Le résultat est bluffant; vivement la sortie des Apple Glass pour pouvoir développer des nouveaux Use Cases...

Voici à titre d'exemple une petite application permettant d'augmenter le contenu éditorial du journal 20 Minutes. En survolant une photo particulière (définie dans le code), il est possible d'ajouter un overlay (`Spritekit` `SKVideoNode`) qui vient jouer une vidéo locale ou remote... J'ai pris l'édition du 20 Minutes de ce weekend (13 juin 2021) et une vidéo Youtube aléatoire qui traitait du sujet de la première de couverture et voici le résultat:


    <iframe 
        width="100%" 
        height="400px"
        src="//www.youtube.com/embed/kaOncfPBZLM?autoplay=1&mute=1" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>


<br/>
Je vais pousser les tests pour voir à quel point le mécanisme de reconnaissance d'images d'`ARKit` est capable de différencier des éléments (photos)/ `Anchors` similaires. J'espère qu'on atteint des niveaux de reconnaissance d'images aussi proches de ce qu'on est capable d'obtenir avec Tensorflow et un réseau de `VGG16` ou `VGG19`. Si c'est le cas, on pourrait imaginer tellement de Use Cases bien sympatiques...
