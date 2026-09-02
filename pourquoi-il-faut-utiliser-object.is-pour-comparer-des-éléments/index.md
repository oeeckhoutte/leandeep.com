# Pourquoi il faut utiliser Object.is() pour comparer des éléments

- Canonical URL: https://leandeep.com/pourquoi-il-faut-utiliser-object.is-pour-comparer-des-%C3%A9l%C3%A9ments/
- Author: Olivier Eeckhoutte
- Published: 2017-04-10T19:51:00Z
- Updated: 2017-04-10T19:51:00Z
- Language: fr
- Tags: JavaScript
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Nous savons tous que le langage JavaScript manque de typage ~~et qu'il faut faire du Typescript~~ et qu'on peut obtenir des résultats bizarres à cause de ce qu'on appelle la *coercion* ou le *casting*.

> "Converting a value from one type to another is often called "type casting," when done explicitly, and "coercion" when done implicitly (forced by the rules of how a value is used) Source: https://github.com/getify/You-Dont-Know-JS 

Exemple "What the fuck" :
```
0 == ' ' //true 
null == undefined //true
[1] == true //true
```

<br/>

Il existe l'opérateur `===` qui améliore les choses en bloquant la conversion de type implicite mais qui ne résoud pas tout:

```
NaN == NaN //false
```

<br/>

ES6 a introduit une nouvelle feature qui améliore encore les choses `Object.is()`:

Par exmple:
```
Object.is(0 , ' '); //false
Object.is(null, undefined); //false
Object.is([1], true); //false
Object.is(NaN, NaN); //true
```

<br/>

Plus de détails (source Mozilla: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness):

![image](/images/elements_comparisons.png)


