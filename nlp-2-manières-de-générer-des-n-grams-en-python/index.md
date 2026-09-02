# [NLP] 2 manières de générer des N-grams en Python 

- Canonical URL: https://leandeep.com/nlp-2-mani%C3%A8res-de-g%C3%A9n%C3%A9rer-des-n-grams-en-python/
- Author: Olivier Eeckhoutte
- Published: 2019-09-03T07:48:00Z
- Updated: 2019-09-03T07:48:00Z
- Language: fr
- Tags: NLP, Machine Learning, Ngrams
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction

Dans une phrase, les N-grams sont des séquences de N-mots adjacents. N peut être 1 ou 2 ou toute autre entier positif. En général N n'est pas très grand car ces N-grams apparaissent rarement plusieurs fois.

On utilise ces N-grams en Machine Learning dans les sujets qui traitent du Natural Language Processing. Plus précisément, on les retrouve dans les sujets de classification de textes. On peut utiliser des bi-grams ou tri-grams comme *features* pour représenter nos documents en plus d'utiliser des tokens individuels trouvés dans le corpus.

Dans cet article, nous allons voir comment générer en Python des N-grams à partir de phrases en entrée. 

<br/>

## N-grams en pur Python

Partons de la phrase suivante et transformons la en N-grams:

```
s = "On utilise ces N-grams en Machine Learning dans les sujets qui traitent du Natural Language " \ 
    "Processing et en particulier dans les sujets de classification de textes."
```

Si on transforme cette phrase en bi-grams on va obtenir l'output suivant:

```
[
    "On utilise",
    "utilise ces",
    "ces n",
    "n grams",
    "grams en",
	...
]
```

Pour obtenir le résultat précédent, on peut utiliser le code Python suivant: 

```
import re

def generate_ngrams(s, n):
    # Convert to lowercases
    s = s.lower()
    
    # Replace all non-alphanumeric characters with spaces
    s = re.sub(r'[^a-zA-Z0-9\s]', ' ', s)
    
    # Break sentence in the token, remove empty tokens
    tokens = [token for token in s.split(" ") if token != ""]
    
    # Use the zip function to help us generate n-grams
    # Concatentate the tokens into ngrams and return
    ngrams = zip(*[token[i:] for i in range(n)])
    return [" ".join(ngram) for ngram in ngrams]
```

Si on applique la fonction suivante sur notre phrase d'entrée avec N=4, on obtient le résultat suivant:


```
>>> generate_ngrams(s, n=4)
['on utilise ces n', 'utilise ces n grams', 'ces n grams en', 'n grams en machine', 'grams en machine learning', 'en machine learning dans', 'machine learning dans les', 'learning dans les sujets', 'dans les sujets qui', 'les sujets qui traitent', 'sujets qui traitent du', 'qui traitent du natural', 'traitent du natural language', 'du natural language processing', 'natural language processing et', 'language processing et en', 'processing et en particulier', 'et en particulier dans', 'en particulier dans les', 'particulier dans les sujets', 'dans les sujets de', 'les sujets de classification', 'sujets de classification de', 'de classification de textes']
```

La fonction précédente utilise la fonction `zip` qui crée un *generator* qui aggrége les éléments de plusieurs listes. 

Plus de détails dans la section de code commentée:

```
# phrase d'entrée
s = "un deux trois quatre cinq"

tokens = s.split(" ")
# tokens = ["un", "deux", "trois", "quatre", "cinq"]

sequences = [tokens[i:] for i in range(3)]
# Cette ligne génère des séquences depuis différents éléments de la liste tokens
range(x) définit combien de séquences on veut générer
#
# sequences = [
#   ['un', 'deux', 'trois', 'quatre', 'cinq'],
#   ['deux', 'trois', 'quatre', 'cinq'],
#   ['trois', 'quatre', 'cinq']]

bigrams = zip(*sequences)
# La fonction zip prend les 3 séquences comme une liste d'input grâce à l'opérateur *. 
# Pour info, cette syntaxe revient au même que zip(sequences[0], sequences[1], sequences[2]).
# Chaquee tuple que cette fonction zip retourne contient un élément de chaque séquence.
# Comme il n'y a que 3 éléments dans la dernières séquence, il n'y a que 3 tuples retournés par la fonction zip
```

<br/>

## N-grams avec NLTK

Au lieu d'utiliser la méthode précédente pour générer des N-grams, on peut se simplifier la vie en utilisant la librairie `NLTK (Natural Language Toolkit)` spécialisée comme son nom l'indique dans le NLP.

Avec le code suivant, on peut générer des N-grams, tout comme on l'a fait avec la méthode `generate_ngrams()`.

```
import re
from nltk.util import ngrams

s = s.lower()
s = re.sub(r'[^a-zA-Z0-9\s]', ' ', s)
tokens = [token for token in s.split(" ") if token != ""]
output = list(ngrams(tokens, 5))
```

> Si vous rencontrez l'erreur suivante avec NLTK `CERTIFICATE_VERIFY_FAILED] certificate verify failed:`, voici les commandes Python à exécuter comme workaround:

```
import nltk
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    ssl._create_default_https_context = _create_unverified_https_context

# nltk.download('stopwords')
nltk.download('...')
```

