# Moderne Javascript Tips

- Canonical URL: https://leandeep.com/moderne-javascript-tips/
- Author: Olivier Eeckhoutte
- Published: 2016-07-16T19:00:00Z
- Updated: 2016-07-16T19:00:00Z
- Language: fr
- Tags: JavaScript
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction
Ce weekend, j'ai fait un Kata en JS. 
Voici une liste de snippets utiles à connaître pour coder proprement son app. 

<br/>

## Tips

**Calculer le nombre propriétés que possède un objet**

```
const fleur = {
  couleur: 'rouge',
  nom: 'rose'
}

Object.keys(fleurs).length
```

<br/>

**Trier un tableau d'objets en fonction de certaines propriétés**

```
const liste = [
  { couleur: 'blanc', taille: 'XXL' },
  { couleur: 'rouge', taille: 'XL' },
  { couleur: 'noir', taille: 'M' }
]

// Trier par ordre alphabétique le nom des couleurs: blanc, noir, rouge.
liste.sort((a, b) => (a.couleur > b.couleur) ? 1 : -1)

//La fonction de callback pourrait trier sur une seconde propriété, pour gérer le cas où 2 couleurs seraient identiques:
list.sort((a, b) => (a.couleur > b.couleur) ? 1 : (a.couleur === b.couleur) ? ((a.taille > b.taille) ? 1 : -1) : -1 )
```

<br/>

**Comment définir des valeurs par défaut pour des fonctions**

Depuis ES6 en 2015, il est possible de définir des valeurs par défaut aux paramètres des fonctions.

```
const doSomething = (param1 = 'test', param2 = 'test2') => {

}
```

Si on devait passer un objet d'options à une fonction, voici le code pour gérer des options undefined:

```
const colorize = (options) => {
  if (!options) {
    options = {}
  }

  const color = ('color' in options) ? options.color : 'yellow'
  ...
}

// Avec le destructuring, c'est beaucoup plus simple:
const colorize = ({ color = 'yellow' }) => {
  ...
}

// Si pas l'objet n'est passé en appelant la fonction colorize on peut assigner un objet vide par défaut: 
const spin = ({ color = 'yellow' } = {}) => {
  ...
}
```

<br/>

**Vider un tableau**

```
// Option 1
const list = ['a', 'b', 'c']
list.length = 0

// Option 2 en utilisant let plutôt que const
let list = ['a', 'b', 'c']
list = []
```

<br/>

**Encoder une URL**

Pour respecter le standard RFC 3986 (http://tools.ietf.org/html/rfc3986), il y a la fonction suivante:

```
const fixedEncodeURIComponent = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16)
  })
}
```

<br/>

**Fusionner 2 objets**

ES6 en 2015 a introduit le `Spread Operator`, qui permet de fusionner facilement 2 simples objets:

```
const object1 = {
  name: 'Flavio'
}

const object2 = {
  age: 35
}

const object3 = {...object1, ...object2 }
```

Si les 2 objets ont des propriétés ayant des noms identiques, le 2ème objets surchargera le premier. 
Dans ce cas, il pourra utiliser la méthode `merge()` de lodash qui fera un deep merge. 







