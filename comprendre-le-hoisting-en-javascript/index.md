# Comprendre le hoisting en JavaScript

- Canonical URL: https://leandeep.com/comprendre-le-hoisting-en-javascript/
- Author: Olivier Eeckhoutte
- Published: 2016-01-10T19:52:00Z
- Updated: 2016-01-10T19:52:00Z
- Language: fr
- Tags: JavaScript
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Comprendre le *hoisting* en JavaScript est important pour organiser vos fonctions.

> Rappel entre déclarer et définir une variable:
Déclarer une variable signifie: "dire au système qu'une variable existe"
Définir une variable signifie: "assigner une valeur à une variable"

<br/>

Lorsqu'on déclare une variable ou une fonction elles sont *hoisted* (hissées) en haut du fichier. Par contre, lorsqu'on définit une variable ou déclare et définit sur la même ligne une variable il n'y a pas de *hoisting*. 

<br/>

Du coup voici des exemples de déclarations de variables et fonctions pour voir les *scopes*.

```
function maSuperFonction() {
  // ReferenceError: fonctionPasDeclaree is not defined
  console.log(fonctionPasDeclaree);
  // Outputs: undefined

  console.log(variableDefiniePlusTard);
  var variableDefiniePlusTard;

  variableDefiniePlusTard = 'contenu de ma variable';
  console.log(variableDefiniePlusTard);
  // Outputs: 'contenu de ma variable'


  console.log(variableDefinieEtDefinieSimultanement);
  // Outputs: undefined
  var variableDefinieEtDefinieSimultanement = 'contenu de cette variable';
  console.log(variableDefinieEtDefinieSimultanement);
  // Outputs: 'contenu de cette variable'

  // Outputs: 'yeah!'
  nouvelleFonction();

  function nouvelleFonction() {
    console.log('yeah!');
  }

  // TypeError: undefined is not a function
  autreFonction();

  var autreFonction = function() {
    console.log('Oops');
  }
}
```

<br/>

Pour garder les choses simples déclarez toutes vos variables au-dessus du *scope* de vos fonctions. Definissez vos variables avant d'en avoir besoin. Definissez vos fonctions en-dessous de vos *scopes*.


