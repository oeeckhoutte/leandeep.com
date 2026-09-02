# Introduction à ES6

- Canonical URL: https://leandeep.com/introduction-%C3%A0-es6/
- Author: Olivier Eeckhoutte
- Published: 2016-01-04T19:35:00Z
- Updated: 2016-01-04T19:35:00Z
- Language: fr
- Tags: JavaScript
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Voici les bases à connaître pour utiliser ES6:

## Arrow Functions (Fonctions fléchées)

**Exemple:**
Plutôt que de coder:
```
const myFunction = function foo() {
  //...
}
```

Utiliser maintenant:
```
const myFunction = () => {
  //...
}

// Si la méthode ne possède qu'une seule déclaration, on écrit la méthode comme ceci:
const myFunction = i => 3 * i
```

## The spread operator (Syntaxe de décomposition)

Si on a:

```
const c = [...a]
```
Cette déclaration copie le tableau a dans c.
On peut ajouter d'autres éléments derrière un spread operator:

```
const c = [...a, 2, 'test']
```

## Destructuring assignments (Affectation par décomposition)

On peut extraire juste certaines propriétés d'un objet en utilisant la syntaxe suivante: 

```
const person = {
  firstName: 'Tom',
  lastName: 'Cruise',
  actor: true,
  age: 54 //made up
}

const { firstName: name, age } = person

```
Cela va créer 2 const variables appelées name et age.

La synataxe suivante fonctionne également:

```
const a = [1,2,3,4,5]
[first, second, , , fifth] = a
```

## Template Literals (Modèles de libellés)

```
const str = `test`
```

```
const string = `something ${1 + 2 + 3}`
const string2 = `something ${foo() ? 'x' : 'y'}`
```

```
const string3 = `Hey
this

string
is awesome!`
```

## Async / Await

Une fonction async retourne une promesse:

```
const doSomethingAsync = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve('I did something'), 3000)
    })
}
```

Quand on veut appeler cette fonction on ajoute await comme ceci: 

```
const doSomething = async () => {
    console.log(await doSomethingAsync())
}
```

**Exemple**

```
const doSomethingAsync = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve('I did something'), 3000)
    })
}

const doSomething = async () => {
    console.log(await doSomethingAsync())
}

console.log('Before')
doSomething()
console.log('After')
```

*Résultat:*
```
Before
After
I did something // Après 3s
```

**Autre exemple, au lieu de:**

```
const getFirstUserData = () => {
  return fetch('/users.json') // get users list
    .then(response => response.json()) // parse JSON
    .then(users => users[0]) // pick first user
    .then(user => fetch(`/users/${user.name}`)) // get user data
    .then(userResponse => response.json()) // parse JSON
}

getFirstUserData()
```

*Le code se simplifie avec async / await:*

```
const getFirstUserData = async () => {
  const response = await fetch('/users.json') // get users list
  const users = await response.json() // parse JSON
  const user = users[0] // pick first user
  const userResponse = await fetch(`/users/${user.name}`) // get user data
  const userData = await user.json() // parse JSON
  return userData
}

getFirstUserData()
```

**Dernier exemple avec des async / await en série:**

```
const promiseToDoSomething = () => {
    return new Promise(resolve => {
        setTimeout(() => resolve('I did something'), 10000)
    })
}

const watchOverSomeoneDoingSomething = async () => {
    const something = await promiseToDoSomething()
    return something + ' and I watched'
}

const watchOverSomeoneWatchingSomeoneDoingSomething = async () => {
    const something = await watchOverSomeoneDoingSomething()
    return something + ' and I watched as well'
}

watchOverSomeoneWatchingSomeoneDoingSomething().then((res) => {
    console.log(res)
})
```

*Résultat:*

```
I did something and I watched and I watched as well
```

## Classes

```
class Person {
  constructor(name) {
    this.name = name
  }

  hello() {
    return 'Hello, I am ' + this.name + '.'
  }
  
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
  
  set age(years) {
    this.theAge = years
  }
}

class Actor extends Person {
  hello() {
    return super.hello() + ' I am an actor.'
  }
}

var tomCruise = new Actor('Tom Cruise')
tomCruise.hello()
```

## Modules

**Importer des modules**

L'import se fait via les commandes `import ... from ...`:

```
import * from 'mymodule'
import React from 'react'
import { React, Component } from 'react'
import React as MyLibrary from 'react'
```

**Exporter des modules**

```
export var foo = 2
export function bar() { /* ... */ }
```

## FOR-OF LOOP

C'est un forEach avec la possibilité de faire un break

```
//iterate over the value
for (const v of ['a', 'b', 'c']) {
  console.log(v);
}
a
b
c

//get the index as well, using `entries()`
for (const [i, v] of ['a', 'b', 'c'].entries()) {
  console.log(i, v);
}
0 "a"
1 "b"
2 "c"
```

