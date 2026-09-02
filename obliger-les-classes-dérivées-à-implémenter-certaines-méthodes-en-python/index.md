# Obliger les classes dérivées à implémenter certaines méthodes en Python

- Canonical URL: https://leandeep.com/obliger-les-classes-d%C3%A9riv%C3%A9es-%C3%A0-impl%C3%A9menter-certaines-m%C3%A9thodes-en-python/
- Author: Olivier Eeckhoutte
- Published: 2012-10-29T21:12:00Z
- Updated: 2012-10-29T21:12:00Z
- Language: fr
- Tags: Python, POO
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Pour être notifié dès l'instanciation d'une classe que des méthodes n'ont pas été implémentées on peut utiliser le module `ABC` (Abstract Base Classes).
On crée alors avec le module `ABC` une classe de base dont on va se servir pour dériver notre sous-classe. Dans la classe de base on créera des méthodes abstraites à implémenter dans la sous-classe.

<br/>

Exemple:

```
from abc import ABCMeta, abstractmethod

class Base(metaclass=ABCMeta):
	@abstractmethod
    def foo(self):
    	pass
        
    @abstractmethod
    def bar(self):
	    pass

```

```
class Concrete(Base):
	def foo(self):
    	pass
        
        # on ne déclare pas bar() volontairement 

```

```
assert issubclass(Concrete, Base)
```

```
c = Concrete()
TypeError:
"Can't instantiate abstract class Concrete with abstract methods bar"
```

> Sans le module `ABC` n'avait pas été présent, on aurait obtenu `NotImplementedError` si une méthode non implémentée avait été appelée. 
Avec `ABC` on est alerté dès l'instanciation de la classe que la méthode n'existe pas.

