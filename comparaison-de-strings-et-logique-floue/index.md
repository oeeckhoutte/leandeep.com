# Comparaison de strings et logique floue

- Canonical URL: https://leandeep.com/comparaison-de-strings-et-logique-floue/
- Author: Olivier Eeckhoutte
- Published: 2020-01-16T16:20:04-07:00
- Updated: 2020-01-16T16:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Pour implémenter dans la logique floue pour comparer deux strings, on peut utiliser la distance de Levenshtein.

Voici le code permettant de calculer cette distance. Rien de particulier, on retrouve partout ce code sur internet.

```
import numpy as np
def levenshtein_ratio_and_distance(s, t, ratio_calc = False):
    """ levenshtein_ratio_and_distance:
        Calculates levenshtein distance between two strings.
        If ratio_calc = True, the function computes the
        levenshtein distance ratio of similarity between two strings
        For all i and j, distance[i,j] will contain the Levenshtein
        distance between the first i characters of s and the
        first j characters of t
    """
    # Initialize matrix of zeros
    rows = len(s)+1
    cols = len(t)+1
    distance = np.zeros((rows,cols),dtype = int)

    # Populate matrix of zeros with the indeces of each character of both strings
    for i in range(1, rows):
        for k in range(1,cols):
            distance[i][0] = i
            distance[0][k] = k

    # Iterate over the matrix to compute the cost of deletions,insertions and/or substitutions    
    for col in range(1, cols):
        for row in range(1, rows):
            if s[row-1] == t[col-1]:
                cost = 0 # If the characters are the same in the two strings in a given position [i,j] then the cost is 0
            else:
                # In order to align the results with those of the Python Levenshtein package, if we choose to calculate the ratio
                # the cost of a substitution is 2. If we calculate just distance, then the cost of a substitution is 1.
                if ratio_calc == True:
                    cost = 2
                else:
                    cost = 1
            distance[row][col] = min(distance[row-1][col] + 1,      # Cost of deletions
                                 distance[row][col-1] + 1,          # Cost of insertions
                                 distance[row-1][col-1] + cost)     # Cost of substitutions
    if ratio_calc == True:
        # Computation of the Levenshtein Distance Ratio
        Ratio = ((len(s)+len(t)) - distance[row][col]) / (len(s)+len(t))
        return Ratio
    else:
        # print(distance) # Uncomment if you want to see the matrix showing how the algorithm computes the cost of deletions,
        # insertions and/or substitutions
        # This is the minimum number of edits needed to convert string a to string b
        return "The strings are {} edits away".format(distance[row][col])
```



Il existe aussi un package appelé `Levenshtein` qui nous simplifie la vie.

```
>>> import Levenshtein as lev

>>> string_1 = "Lean Deep."
>>> string_2 = "leandeep"

>>> distance = lev.distance(string_1.lower(), string_2.lower()),
>>> print(distance)

(1,)

>>> ratio = lev.ratio(Str1.lower(),Str2.lower())
>>> print(ratio)

0.9473684210526315
```

<br/>

**Et surtout il existe le package `fuzzywuzzy`** qui contient des fonctions avancées pas présentes dans le package `Levenshtein` qui vont nous permettre de gérer des cas plus complexes comme le "substring matching"; très utile pour extraire des bribes d'informations de textes.

```
>>> from fuzzywuzzy import fuzz

>>> string_1 = "Lean Deep"
>>> string_2 = "deep"
>>> ratio = fuzz.ratio(string_1.lower(), string_2.lower())
>>> partial_ratio = fuzz.partial_ratio(string_1.lower(), string_2.lower())
>>> print(ratio)
>>> print(partial_ratio)

50
100
```

