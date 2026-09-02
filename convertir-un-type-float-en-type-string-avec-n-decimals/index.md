# Convertir un type float en type string avec n decimals

- Canonical URL: https://leandeep.com/convertir-un-type-float-en-type-string-avec-n-decimals/
- Author: Olivier Eeckhoutte
- Published: 2018-06-16T21:20:04-07:00
- Updated: 2018-06-16T21:20:04-07:00
- Language: fr
- Tags: python, tips, python_tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Petit tip très rapide qui explique comment convertir un nombre décimal de type float en type string tout en gardant n chiffres après la virgule.

La conversion peut se faire directement avec les f-strings.

```
price = float(1000)
print(type(price))
new_price = f"{price:.2f}"
print(new_price)
print(type(new_price))
```

