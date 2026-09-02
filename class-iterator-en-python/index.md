# Class iterator en Python

- Canonical URL: https://leandeep.com/class-iterator-en-python/
- Author: Olivier Eeckhoutte
- Published: 2017-02-09T22:01:00Z
- Updated: 2017-02-09T22:01:00Z
- Language: fr
- Tags: Python, python_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Après les *list, dict, set comprehensions*, il est possible de créer des *class iterator*. Il devient alors possible de boucler sur des objets. 

> Ce n'est pas pas la seule manière de boucler sur des objets. Il existe aussi les *generators* et les *generator expressions*.

**Exemple simple:**

```
class Repeater:
	def __init__(self, value):
		self.value = value
	
    def __iter__(self):
		return self

	def __next__(self):
		return self.value

repeater = Repeater('Hello')
for item in repeater:
	print(item)

```

Output:

```
...
Hello
Hello
Hello
...

```

Bravo on vient de créer un iterator qui ne finit jamais d'afficher Hello. Ce n'est pas très utile... On va maintenant écrire une autre *class iterator* qui aura un nombre fini de répétitions. 

```
class BoundedRepeater:
	def __init__(self, value, max_repeats):
    	self.value = value
        self.max_repeats = max_repeats
        self.count = 0
        
	def __iter__(self):
    	return self
        
	def __next__(self):
    	if self.count >= self.max_repeats:
        	raise StopIteration
		self.count += 1
        return self.value

repeater = BoundedRepeater('Hello', 3)
for item in repeater:
	print(item)
    
```

Output:

```
Hello
Hello
Hello

```

L'appel de la *class iterator* BoundedRepeater avec le *fency* for-loop revient à écrire le code suivant beaucoup moins simple et lisible:


```
repeater = BoundedRepeater('Hello', 3)
iterator = iter(repeater)
while True:
	try:
    	item = next(iterator)
    except StopIteration:
    	break
    print(item)
    
```



