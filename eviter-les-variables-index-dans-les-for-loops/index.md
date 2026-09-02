# Eviter les variables index dans les for-loops

- Canonical URL: https://leandeep.com/eviter-les-variables-index-dans-les-for-loops/
- Author: Olivier Eeckhoutte
- Published: 2018-06-04T21:28:06-07:00
- Updated: 2018-06-04T21:28:06-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Les développeurs venant des langages comme JavaScript ont l'habitude de déclarer des variables pour suivre les indexes des conteneurs (liste, générateurs, dictionnaires...) dans une boucle.

Par exemple en JavaScript:

```
for (let i = 0; i < mon_conteneur.length; i++) {
    // suite du code
}
```
<br/>

En Python, il est plus propre d'utiliser la fonction `enumerate`. 


## Anti-pattern (Pas bien!)

```
my_list = ["toto", "titi", "tata"]
index = 0
for el in my_list:
    print(f"{index} {el}")
    index += 1
```

<br/>

## Bonne pratique (Bien!)

```
my_list = ["toto", "titi", "tata"]
for index, el in enumerate(my_list):
    print(f"{index} {el}")
```
