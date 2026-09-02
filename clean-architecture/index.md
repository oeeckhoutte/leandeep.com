# Clean Architecture

- Canonical URL: https://leandeep.com/clean-architecture/
- Author: Olivier Eeckhoutte
- Published: 2016-03-15T21:34:00Z
- Updated: 2016-03-15T21:34:00Z
- Language: fr
- Tags: Architecture
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Bonjour à tous, 

Dans cet article nous allons parler de *clean architecture* en référence à ce que présente Robert C. Martin (alias [Oncle Bob](https://fr.wikipedia.org/wiki/Robert_C._Martin)) dans cette [vidéo](https://www.youtube.com/watch?v=Nsjsiz2A9mg). Si vous ne l'avez pas vu, je vous la recommande fortement !

Tous les concepts dont il parle dans sa proposition "d'Architecture propre" ne sont pas nouveaux car déjà utilisés dans d'autres architectures antérieures. (Il le dit lui-même dans sa vidéo.)

Voici la proposition d'Architecture propre:
![image](/images/clean-architecture-diagram.jpg)

<br/>

# Partie 1

Le schéma à gauche (en forme d'oignon) est la combinaison de 2 architectures plus anciennes:

* [Onion Architecture](http://jeffreypalermo.com/blog/the-onion-architecture-part-1/) de Jeffrey Palermo, 2008
* [Ports & Adapters Architecture](http://alistair.cockburn.us/Hexagonal+architecture) d'Alistair Cockburn, 2005. Cette dernière est également appelée **Architecture Hexagonale**)

<br/>

Voici une synthèse des différents concepts présentés. 

## Externalisation des outils et des mécanismes de livraison

Dans une Architecture Hexagonale on se focuse sur l'externalisation des outils et mécanismes de livraison de l'application en utilisant des interfaces (ports) et des *adapters*. 

Cette approche est aussi un des fondements de l'Onion Architecture comme on peut le voir sur le schéma ci-dessous. Comme on peut le voir, les tests, la couche infrastructure, le UI et la couche d'API sont situés à l'extrémité du diagramme. 

![image](/images/Onion-Architecture.png)

Dans la clean Architecture, c'est similaire. Au final tout le *core* applicatif se retrouve au centre et est agnostique des différents frameworks et librairies.

<br/>

## Direction des dépendances

Dans l'Archictecture Hexagonale rien n'explicite la direction des dépendances. Néanmoins on peut facilement la déduire. 
L'application a un port (ou interface) qui doit être implémenté ou utilisé par un *adpater*. Donc l'*adapter* dépend de l'interface qui dépend du *core* applicatif qui est au centre. Ce qui est à l'extérieur dépend de ce qui est à l'intérieur. Donc la direction des dépendances est vers le centre. 

In the Hexagonal Architecture, we don’t have anything explicitly telling us the direction of the dependencies. Nevertheless, we can easily infer it: The Application has a port (an interface) which must be implemented or used by an adapter. So the Adapter depends on the interface, it depends on the application which is in the centre. What is outside depends on what is inside, the direction of the dependencies is towards the centre.
Dans le diagramme de la Clean Architecture c'est très explicite. Il y a des flèches en direction du centre. Elles introduisent le principe d'inversion de dépendances. Le centre du cercle ne connait rien de ce qu'il y a à l'extérieur. De plus, lorsque les données circulent entre les couches c'est toujours dans une forme qui convient le mieux aux couches les plus proches du centre.

<br/>

## Couches 

Le diagramme de l'Architecture Hexagonale ne montre que 2 couches: intérieur de l'application et extérieur de l'application. 

![image](/images/archi-hexa.jpeg)

L'Onion Architecture quant à elle apporte les couches identifiées par le DDD (Domain Driven Design): 
* Application Services qui porte la logique du *use case*.
* Domain Services qui encapsule la logique du domaine qui n'appartient pas aux *Entites* ou au *Value Objects*.
* Les Entities, Value Objects... 

Quand on compare l'Onion Architecture et la Clean Architecture on voit que la Clean Architecture garde toutes les couches de l'Onion Architecture sauf la partie *Domain Services layer*.
Cependant lorsque l'on rentre dans le détail des articles de Robert C. Martin on se rend compte qu'il considère les Entities pas simplement comme les Entities en DDD mais comme un Domain Object. 

<br/>

## Testabilité et isolation

Les 3 types d'Architecture pronent l'isolation de l'application et de la  *domain logic* . Cela signifie que pour tous les use cases on peut "*mocker*" les outils externes et mécanismes de livraison et que les différentes partie de l'application peuvent être testées de manière isolée.

<br/>

# Partie 2

Dans cette partie on va s'intéresser à la partie droite du schéma de la Clean Architecture. 

![image](/images/clean-architecture-right-side.png)


Ce n'est pas très explicite ! 
Par contre, on retrouve plus d'explication avec le schéma suivant:

![image](/images/clean-architecture-design.png)


On y retrouve sur la gauche une Architecture MVC et sur la droite une Architecture EBI (on voit clairement les *Boundaries*, l'*Interactor* et les *Entities*), the “Application” in Hexagonal Architecture, the “Application Core” in the Onion Architecture, and the “Entities” and “Use Cases” layers in the Clean Architecture diagram above.

Ce dernier permet d'illustrer les Architectures suivantes:   


* EBI (Entity-Boundary-Interactor) Architecture par Ivar Jacobson, 1992
* Architecture MVC, 1970s

Le pattern EBI est au backend ce que MVC est au frontend. Ces 2 approches sont complémentaires.  

> Rappel sur MVC: 
https://herbertograca.com/2017/08/17/mvc-and-its-variants/#model-view-view_model

Le pattern MVC separe le code en 3 parties:

* Le Modèle représente la *business logic*
* La Vue représente un widget dans le UI: un bouton, text box...
* Le Controleur permet de coordonner la vue avec le modèle; c'est-à-dire décider quelle Vue afficher avec quelle donnée. Il traduit les actions utilisateur (i.e. clic sur bouton) en business logic.

> EBI (Entity-Boundary-Interactor) ou Single Responsibility Principle ?

<br/>

### Entity 

L'objet *Entity* contient la donnée utilisée par le système ainsi que tous les comportements couplés à cette donnée. 
"An Entity object should contain the logic that would change when the Entity itself changes, that is to say: if the data structure it holds changes, the operations on that data will also need to change and therefore they should be located in the Entity as well.", Ivar Jacobson 1992

<br/>

### Boundary (Interface)

L'object Boundary est l'interface avec le système.

"Everything concerning the interface of the system is placed in an interface object", Ivar Jacobson 1992

Toutes les fonctionnalités qui dépendent de l'environnement du système (outils et mécanismes de livraison) appartiennent à l'objet *Boundary*.

Chaque intéraction avec le système au travers d'un "acteur" passe par l'objet Boundary. Un "acteur" peut être un humain (admin, client) ou non (alarme, trigger, API externe).

<br/>

### Interactor (Control)

L'objet *Interactor* va contenir les comportements par naturellement liés aux autres types d'objets. 

Ces comportement peuvent typiquement être des opérations sur plusieurs Entities retournant des résultats (qui passeront par l'objet boundary). 

"Behaviour that remains after the Interface objects and Entity objects have obtained their parts will be placed in the control objects" Ivar Jacobson 1992

Cela signifie que tous les comportements qui ne se situent pas dans les objets Boundary ou Entity seront placés dans un ou plusieurs objets Interactor.

<br/>

# Conclusion

Avec cette approche, Robert C. Martin a n'a rien inventé mais rappelle et clarifie des *patterns* importants souvent oubliés. Il explique quand même comment tous ces patterns, règles et concepts peuvent coexister ensemble pour construire de manière standardisée et propre des applications complexes et facilement maintenables. Je dirais donc que c'est à adopter... 

