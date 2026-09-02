# La notation "Big O"

- Canonical URL: https://leandeep.com/la-notation-big-o/
- Author: Olivier Eeckhoutte
- Published: 2012-09-18T08:08:00Z
- Updated: 2012-09-18T08:08:00Z
- Language: fr
- Tags: Algorithm
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


La notation "big O" est utilisée pour analyser et comparer l'efficacité des algorithmes en termes de temps d'exécution ou de consommation de ressources. 

La notation big O est notée généralement comme `O(f(n))`, où `f(n)` est une fonction qui représente la complexité de l'algorithme en fonction de la taille de l'entrée, n. Le O indique l'ordre de grandeur ou la limite supérieure de la complexité. 

Par exemple, si un algorithme a une complexité de `O(n)`, cela signifie que le temps d'exécution de l'algorithme est linéairement proportionnel à la taille de l'entrée.

<br/>
<br/>

Voici quelques exemples courants de notations big O:

**`O(1)`: Notation constante**

Cela signifie que l'algorithme a un temps d'exécution constant, indépendamment de la taille de l'entrée. Par exemple, accéder à un élément spécifique dans un tableau de taille n a une complexité de `O(1)`.

Exemple d'algo:

```
def get_first_element(arr):
    return arr[0]
```

<br/>


**`O(log n)`: Notation logarithmique**

Cela indique que l'algorithme a un temps d'exécution qui croît de manière logarithmique par rapport à la taille de l'entrée. Les algorithmes de recherche binaires ou les arbres de recherche équilibrés, comme les arbres binaires de recherche, ont une complexité de `O(log n)`.


Exemple d'algo:

```
def recherche_binaire(liste, element):
    debut = 0
    fin = len(liste) - 1

    while debut <= fin:
        milieu = (debut + fin) // 2  # Calcul de l'indice du milieu

        if liste[milieu] == element:
            return milieu  # L'élément a été trouvé à l'indice milieu
        elif liste[milieu] < element:
            debut = milieu + 1  # Recherche dans la moitié supérieure de la liste
        else:
            fin = milieu - 1  # Recherche dans la moitié inférieure de la liste

    return -1  # L'élément n'a pas été trouvé

# Exemple d'utilisation
ma_liste = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
element_recherche = 23

indice = recherche_binaire(ma_liste, element_recherche)

if indice != -1:
    print("L'élément", element_recherche, "a été trouvé à l'indice", indice)
else:
    print("L'élément", element_recherche, "n'a pas été trouvé dans la liste.")
```

Voici les étapes de base de l'algorithme de recherche binaire :

1. Comparer l'élément recherché avec l'élément du milieu de la liste.
2. Si les deux éléments sont égaux, la recherche est terminée et l'élément est trouvé.
3. Si l'élément recherché est inférieur à celui du milieu de la liste, la recherche continue dans la moitié inférieure de la liste.
4. Si l'élément recherché est supérieur à celui du milieu de la liste, la recherche continue dans la moitié supérieure de la liste.
5. Répéter les étapes 1 à 4 jusqu'à ce que l'élément soit trouvé ou que la liste soit réduite à une taille nulle.

<br/>


**`O(n)`: Notation linéaire**

Cela signifie que l'algorithme a un temps d'exécution proportionnel à la taille de l'entrée. Par exemple, parcourir un tableau de n éléments a une complexité de `O(n)`.


<br/>


**`O(n log n)`: Notation quasi-linéaire**

Cela indique une complexité légèrement supérieure à linéaire. De nombreux algorithmes de tri efficaces, tels que le tri fusion (merge sort) ou le tri rapide (quick sort), ont une complexité de `O(n log n)`.

Exemple d'algo:

```
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]
    
    left_half = merge_sort(left_half)
    right_half = merge_sort(right_half)
    
    return merge(left_half, right_half)

def merge(left, right):
    merged = []
    i, j = 0, 0
    
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
            
    merged.extend(left[i:])
    merged.extend(right[j:])
    
    return merged

arr = [7, 2, 5, 1, 8, 3]
sorted_arr = merge_sort(arr)
print(sorted_arr)
```

<br/>


**`O(n^2)`: Notation quadratique**

Cela signifie que l'algorithme a un temps d'exécution quadratique par rapport à la taille de l'entrée. Par exemple, une méthode de tri par sélection (selection sort) a une complexité de `O(n^2)`.

Exemple d'algo:

```
def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                
    return arr
```

<br/>


**`O(2^n)`: Notation exponentielle**

Cela indique une complexité exponentielle, où le temps d'exécution double à chaque augmentation de la taille de l'entrée. Les problèmes NP-complets, tels que le problème du sac à dos (knapsack problem), ont souvent une complexité exponentielle.

Exemple d'algo:

```
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)
```
