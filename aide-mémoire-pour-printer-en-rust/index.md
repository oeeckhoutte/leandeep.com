# Aide mémoire pour printer en Rust

- Canonical URL: https://leandeep.com/aide-m%C3%A9moire-pour-printer-en-rust/
- Author: Olivier Eeckhoutte
- Published: 2022-01-16T07:00:00+02:00
- Updated: 2022-01-16T07:00:00+02:00
- Language: fr
- Tags: Rust, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



**Le print simple/ courant**

```
println!("{}, l'origine", 42);
```

<br/>

**Print avec des arguments positionnels**

```
println!("Hi {0}, I am {1}. Hi {1}, I am {0}", "John", "Peter");
```

<br/>

**Print avec des arguments nommés**

```
println!("{argument1} {argument2} {argument3}",
    argument2="fifi",
    argument1="riri",
    argument3="loulou"
);
```

<br/>

**Printer en alignant la variable à afficher à droite**

```
println!("{ma_variable:>width$}", ma_variable="toto", width=10);
```

<br/>

**Printer en alignant à droite et en préfixant avec des zéros**
```
println!("{nombre:0>width$}", nombre=100, width=6);
```
<br/>

**Printer avec une conversion automatique en binaire**

```
println!("{} en binaire s'écrit {:b}", 4, 4);
```

<br/>

**Printer une structure**

```
#[derive(Debug)]
struct Voiture {
    modele: String,
    marque: String
}

    
let modele = "508 GT".to_string();
let marque = "Peugeot".to_string();
let voiture = Voiture {modele, marque};
println!("{:?}", voiture);
```

<br/>

**Addition dans un print**

```
println!("1 + 2 = {}", 1 + 2);
//println!("1 + 2 = {}", 1i32 + 2);
//println!("1 + 2 = {}", 1u32 + 2);
```

<br/>

**Soustraction dans un print**

```
println!("1 - 2 = {}", 1 - 2);
//println!("1 - 2 = {}", 1i32 - 2);

// Attention aux overflows 
println!("1 - 2 = {}", 1u32 - 2);
                          ^^^^^^^^ attempt to compute `1_u32 - 2_u32`, which would overflow
this arithmetic operation will overflow
```

<br/>

**Algèbre de Boole dans un print**

```
println!("vrai ET faux = {}", true && false);
println!("vrai OU faux = {}", true || false);
println!("NON vrai = {}", !true);
```

<br/>

**Opérations binaires** 

```
println!("01001 ET 00111 = {:05b}", 0b01001u32 & 0b00111);
//01001 ET 00111 = 00001
println!("01001 OU 00111 = {:05b}", 0b01001u32 | 0b00111);
//01001 OU 00111 = 01111
println!("01001 XOR 00111 = {:05b}", 0b01001u32 ^ 0b00111);
//01001 XOR 00111 = 01110
// Décalage
println!("1 << 4 = {}", 1u32 << 4);
// 16
println!("0x80 >> 1 = 0x{:x}", 0x80u32 >> 1);
// 0x80 >> 1 = 0x40
```

<br/>

**Manière plus lisible d'écrire des nombres**

```
println!("1 milliard peut s'écrire {}", 1_000_000_000u32);
```
