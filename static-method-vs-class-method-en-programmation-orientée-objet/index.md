# static method vs class method en programmation orientée objet

- Canonical URL: https://leandeep.com/static-method-vs-class-method-en-programmation-orient%C3%A9e-objet/
- Author: Olivier Eeckhoutte
- Published: 2012-11-12T21:03:00Z
- Updated: 2012-11-12T21:03:00Z
- Language: fr
- Tags: OOP, Python
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Qu'est-ce qu'une class method ?

Une méthode de classe est une méthode qui est liée à une classe plutôt qu'à ses objets. Tout comme la méthode statique, il n'est pas nécessaire de créer une instance de classe pour appeler la méthode.

<br/>

## Différence entre static method et class method

Les static methods ne connaissent rien à propos de la classe et ne peuvent utiliser que les paramètres.
Les class methods fonctionnent avec la classe et ses paramètres sont toujours ceux de la classe elle-même. 
La class method peut être appelée à la fois par la classe et ses instances.

```
Class.classmethod()
```

Ou aussi:
```
Class().classmethod()
```

Mais peu importe, la class method est toujours attachée à une classe avec comme premier argument la classe elle-même.

```
def classMethod(cls, args...)
```

<br/>

## Quand utiliser des class methods ?

**Pour créer des factory methods:**

> Les Factory methods sont ces méthodes qui retournent un objet classe (comme constructor) pour différents use cases.

> C'est similaire à surcharger une fonctione en C++. Mais puisque Python n'a pas de mécanisme similaire les class methods et static methods sont utilisées.

```
from datetime import date

# random Person
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @classmethod
    def from_birth_year(cls, name, birth_year):
        return cls(name, date.today().year - birth_year)

    def display(self):
        print("{} a {} ans".format(self.name, self.age))

person = Person('Adam', 19)
person.display()

person1 = Person.from_birth_year('John',  1985)
person1.display()
```

<br/>

Output
```
Adam a 19 ans
John a 31 ans
```

<br/>

**Corriger la création d'une instance en héritage:**

Quand on dérive une classe en implémentant une factory méthode comme class méthode, cela permet d'avoir une création d'instance correcte de la classe dérivée.

On aurait pu créer une static method pour l'exemple précédent mais l'objet qu'elle crée sera hardcodé comme *Base class*.

Mais quand on utilise une class method, cela crée une instance correcte de la classe dérivée.

```
from datetime import date

# random Person
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @staticmethod
    def from_fathers_age(name, father_age, father_person_age_diff):
        return Person(name, date.today().year - father_age + father_person_age_diff)

    @classmethod
    def from_birth_year(cls, name, birth_year):
        return cls(name, date.today().year - birth_year)

    def display(self):
        print("{} a {} ans".format(self.name, self.age))

class Man(Person):
    sex = 'Male'

man = Man.from_birth_year('John', 1985)
print(isinstance(man, Man))

man1 = Man.from_fathers_age('John', 1965, 20)
print(isinstance(man1, Man))
```

<br/>

Output:

```
True
False
```

Ici en utilisant une static method pour créer une instance de classe cela nous oblige à hardcoder le type d'instance pendant sa création: `def from_fathers(... return Person(name...` .

Cela pose clairement un problème pour l'héritage Personne à Man.

La méthode `from_fathers_age` ne retourne pas un objet `Man` mais l'objet de classe de base de `Person`.

<br/>

Cela viole le paradigme OOP...

