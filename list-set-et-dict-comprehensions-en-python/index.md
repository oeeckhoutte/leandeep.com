# List, set et dict comprehensions en Python

- Canonical URL: https://leandeep.com/list-set-et-dict-comprehensions-en-python/
- Author: Olivier Eeckhoutte
- Published: 2017-02-05T21:12:00Z
- Updated: 2017-02-05T21:12:00Z
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici quelques exemples de *list et dict comprehensions* en Python.

Le pattern des "X comprehensions" est le suivant: `values = [expression for item in collection]`

Il est possible d'ajouter un filtre sur les éléments de l'itération avant qu'ils soient utilisés dans l'évaluation de l'expression: `values = [expression for item in collection if condition]`


## Listes

```
# Python provides compact syntax for deriving one list from another. These
# expressions are called list comprehensions. For example, say you want to
# compute the square of each number in a list. You can do this by providing
# the expression for your computation and the input sequence to loop over.


a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = [x*x for x in a]
print(squares)
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

```
# Unless you're applying a single-argument functions, list comprehensions are
# clearer than map built-in function cases, map requires creating a lambda
# function for the computation, which is visually noisy.


squares = map(lambda x: x*x, a)
print(squares)
# Python 2
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
# Python 3
print(list(squares))
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

```
# Unlike may, list comprehensions let you easily filter items from the input
# list, removing corresponding outputs from the result. For example, say you
# only want to compute the squares of the numbers that are divisible by 2.
# Here, I do this by adding a conditional expression to the list
# comprehension after the loop:


even_squares = [x*x for x in a if x % 2 == 0]
print(even_squares)
# [4, 16, 36, 64, 100]
```

```
# The filter built-in function can be used along with map to achieve the same
# outcome, but it is much harder to read.


alt = map(lambda x: x*x, filter(lambda x: x % 2 == 0, a))
assert even_squares == list(alt)
```

<br/>

## Sets

> Attention, l'ordre des éléments n'est pas gardé.

<br/>

**Exemple simple:**

```
>>> {x * x for x in range(-9, 10) }
set([61, 1, 36, 0, 49, 9, 16, 81, 25, 4])
```

<br/>

## Dictionnaires

**Exemple simple:**

```
>>> { x: x * x for x in range(5) }
{0: 0, 1: 1, 2: 4, 3: 9, 4: 16} 
```

```
# Dictionaries and sets have their own equivalents of list comprehensions.
# These make it easy to create derivative data structures when writing
# algorithms.

chile_ranks = {'ghost': 1, 'habanero': 2, 'cayenne': 3}

rank_dict = {rank: name for name, rank in chile_ranks.items()}

print(rank_dict)
# {1: 'ghost', 2: 'habanero', 3: 'cayenne'}

chile_len_set = {len(name) for name in rank_dict.values()}

print(chile_len_set)
# {8, 5, 7}
```

<br/>

## Listes à 2 niveaux 

Il est possible d'avoir des *lists comprehensions* avec 2 expressions. Il est possible d'aller au-delà mais ce n'est pas recommandé pour la lisibilité. 

```
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [x for array in matrix for x in array]
print(flat)

# [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

```
# The example above is simple, readable, and a reasonable usage of multiple
# loops. Another reasonable usage of multiple loops is replicating the
# two-level deep layout of the input list. For example, say you want to square
# the value in each cell of a two-dimensional matrix. This expression is
# noisier because of the extra [] characters, but it's still easy to read.

matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
data = [[x*x for x in row] for row in matrix]
print(data)
# [[1, 4, 9], [16, 25, 36], [49, 64, 81]]
```

```
# If this expression included another loop, the list comprehension would get
# so long that you'd have to split it over multiple lines.

my_lists = [
    [[1, 2, 3], [4, 5, 6]],
    # ...
    [[11, 22, 33], [44, 55, 66]]
]
flat = [x for sublist1 in my_lists
        for sublist2 in sublist1
        for x in sublist2]
print(flat)
# [1, 2, 3, 4, 5, 6, 11, 22, 33, 44, 55, 66]
```

```
# At this point, the multiline comprehension isn't much shorter thant the
# alternative. Here, I produce the same using normal loop statements. The
# indentation of this version makes the looping clearer than the list
# comprehension.


flat = []
for sublist1 in my_lists:
    for sublist2 in sublist1:
        flat.extend(sublist2)
print(flat)
# [1, 2, 3, 4, 5, 6, 11, 22, 33, 44, 55, 66]
```

```
# List comprehensions also support multiple if conditions. Multiple
# conditions at the same loop level are an implicit and expression. For
# example, say you want to filter a list of numbers to only even values
# greater than four. These only list comprehensions are equivalent.


a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
b = [x for x in a if x > 4 if x % 2 == 0]
c = [x for x in a if x > 4 and x % 2 == 0]
print(b)
print(c)
# [6, 8, 10]
# [6, 8, 10]
```

