# Support des modules ES6 dans Chrome 61

- Canonical URL: https://leandeep.com/support-des-modules-es6-dans-chrome-61/
- Author: Olivier Eeckhoutte
- Published: 2017-09-06T13:03:00Z
- Updated: 2017-09-06T13:03:00Z
- Language: fr
- Tags: Javascript, ES6
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Excellente news, Chrome supporte maintenant nativement les modules ES6. Enfin!

<br/>

Exemple: 

## index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Test module ES6</title>
</head>
<body>
  <p>2+3 = <span class="result"></span></p>

  <script type="module">
    import { add } from './common.js'; 
    (function () { 
      document.querySelector('.result').innerText = add(2, 3); 
      console.log(add(2, 3));
    }());
  </script>
  
</body>
</html>
```

<br/>

## common.js

```
console.log('common.js');
export function add (a, b) {
    return a + b;
}
```



