# Héritage vs Composition en programmation orientée objet 

- Canonical URL: https://leandeep.com/h%C3%A9ritage-vs-composition-en-programmation-orient%C3%A9e-objet/
- Author: Olivier Eeckhoutte
- Published: 2012-11-09T21:02:00Z
- Updated: 2012-11-09T21:02:00Z
- Language: fr
- Tags: POO, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Petit article rapide pour rappeler la différence entre héritage et composition en POO et la représentation UML.

<br/>

## Rappel héritage ("est un")

L'héritage est une relation de spécialisation/généralisation entre deux classes. Elle indique qu’une classe dite classe fille spécialise une autre classe dite classe mère.
En d'autres termes, une classe fille possède les attributs et les méthodes de la classe mère plus d’autres qui lui sont propres. On parle aussi de super classe et de sous classe.

<br/>

## Example d'héritage en Python

```
class classeMere:
    """une classe mère"""
    ...

class classeFille(classeMere):
    """une classe fille qui hérite de la classe mère"""
    ...

```

<br/>

## Constructeur

Le constructeur de la classe fille doit faire un appel explicite au constructeur de la classe mère afin d’initialiser les attributs hérités de celle-ci. Pour cela on aura deux syntaxes à notre disposition.

Dans la première syntaxe possible, on fait précéder `__init__` du nom de la classe mère :


**1ère syntaxe**

```
class classeFille(classeMere):
    """documentation de la classe fille"""
    def __init__(self, parametre1, parametre2, ...):
        classeMere.__init__(self, parametre1, ...)
        ...
```

<br/>

**2ème syntaxe**

```
class classeFille(classeMere):
    """documentation de la classe fille"""
    def __init__(self, parametre1, parametre2, ...):
        super().__init__(parametre1, ...)
        ...
```

<br/>

## Représentation UML

![image](/images/heritage.png)

<br/>

## Rappel composition ("a un")

La relation de composition modélise une relation d’inclusion entre les instances de deux classes. Les objets de la classe conteneur possèdent donc un attribut qui est un objet de la classe contenue.

Dans certains cas il est tout à fait possible techniquement d’utiliser une relation de composition à la place d’une relation d’héritage.

Au lieu d’avoir une classe B qui hérite d’une classe A, on déclare dans B un attribut qui sera une instance de la classe A.

<br/>

## Example de composition en Python

```
class point:
    def __init__(self,x,y):
        self.__x = x
        self.__y = y
    def getx(self):
        return self.__x
    def gety(self):
        return self.__y

class disque:
    def __init__(self,x,y,r):
        self.__r = r
        self.__centre = point(x,y)
    def surface(self):
        return 3.14 * self.__r**2
    def getCentre(self):
        return self.__centre

cd = disque(-1, 2, 5)
print("abscisse du centre :",cd.getCentre().getx())
print("ordonnée du centre :",cd.getCentre().gety())
```

<br/>

## Représentation UML

![image](/images/composition-agregation.png)

<br/>

## Héritage vs Composition en Python

**Exemples simples**

```
# Héritage
class Vehicule:
	pass

class Bicycle(Vehicule)
	pass

#######################################

# Composition
class Engine:
	pass

class Car:
	def __init__(self):
    	self.engine = Engine()

```

<br/>

## Choisir entre composition et héritage ?

On choisit l’héritage quand la relation entre classes est bien de la forme `est un`, ou pour les anglicistes `is a`.

On choisit la composition quand la relation entre classes est bien de la forme `a un`, ou pour les anglicistes `has a`.

Si l'on suit les recommandations du best seller "Design Patterns - Elements of Reusable Object Oriented Software" (du Gang of 4), il vaut mieux utiliser la composition. 

![image](/images/best-seller-design-patterns-OOP.png)

Object composition consiste à voir les objets comme des boites noires. C'est plus simple que de faire de l'héritage où il faut connaître les détails de l'objet pour l'utiliser

--- Mis à jour 21/05/2019 ---

La conférence "PyCon Cleveland 2019" a une vidéo intéressante sur le sujet: https://www.youtube.com/watch?time_continue=1&v=YXiaWtc0cgE

<br/>

**Quand utiliser l'héritage ?**

1. Quand la base classe et la classe dérivée appartiennent au même module/ package et sous le contrôle des mêmes développeurs.

2. Quand il y a une bonne doc (exmple JSONEncoder)  

3. Quand l'objet dérivé a un lien de type "est un" au lieu des "a un"

4. Ils ne sont pas concurrent mais complémentaire

5. Quand on utilise l'héritage, il ne faut pas oublier le principe de substitution de Liskov

