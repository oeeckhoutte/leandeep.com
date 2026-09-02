# Réduire un tableau en JavaScript

- Canonical URL: https://leandeep.com/r%C3%A9duire-un-tableau-en-javascript/
- Author: Olivier Eeckhoutte
- Published: 2016-02-27T20:20:00Z
- Updated: 2016-02-27T20:20:00Z
- Language: fr
- Tags: JavaScript
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Réduire un tableau en JavaScript peut être effectué en utilisant la méthode `reduce()`. Cette méthode applique une fonction contre un accumulateur qui prend chaque valeur du tableau (de gauche à droite) pour le réduire à une seule valeure.

<br/>

## Signature de la méthode reduce()

La méthode `reduce()` prend 2 paramètres: 
- (Obligatoire) Une fonction *callback* de réduction. Elle sera appliquée à chaque paire: valeur précédente (résultat de la dernière exécution) et valeur suivante.
- (Facultatif) Une valeur initiale qui sera utilisée comme paramètre du premier appel à la fonction de callback

<br/>

## Exemple: accumulation, concaténation


Calcul du prix d'un panier:

```
// Elements du panier
var items = [{price: 50}, {price: 100}, {price: 500}];

// Fonction de réduction (callback function)
var reducer = function add(sumSoFar, item) { return sumSoFar + item.price; };

//
var totalPrice = items.reduce(reducer, 0);

console.log(totalPrice);
// 650
```

<br/>

## Usage avancé (combinaison)

*Inspiré de redux combineReducers.*

Combiner plusieurs reducers en une seule fonction de réduction:
```
var reducers = {
  totalInDollar: function(state, item) {
    // specific statements...
    return state.dollars += item.price;
  },
  totalInEuros : function(state, item) {
    return state.euros += item.price * 0.897424392;
  },
  totalInPounds : function(state, item) {
    return state.pounds += item.price * 0.692688671;
  },
  totalInYen : function(state, item) {
    return state.yens += item.price * 113.852;
  }
  // more...
};
```

On crée une fonction qui retourne une fonction callback de réduction qui va appliquer chaque fonction de réduction individuellement.
```
var combineTotalPriceReducers = function(reducers) {
  return function(state, item) {
    return Object.keys(reducers).reduce(
      function(nextState, key) {
        reducers[key](state, item);
        return state;
      },
      {}      
    );
  }
};
```

Voici le code pour l'utiliser:
```
var bigTotalPriceReducer = combineTotalPriceReducers(reducers);

var initialState = {dollars: 0, euros:0, yens: 0, pounds: 0};

var totals = items.reduce(bigTotalPriceReducer, initialState);

console.log(totals);

/*
Object {dollars: 1130, euros: 1015.11531904, yens: 127524.24, pounds: 785.81131152}
*/
```

