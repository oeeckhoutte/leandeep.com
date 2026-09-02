# Aide mémoire types Rust

- Canonical URL: https://leandeep.com/aide-m%C3%A9moire-types-rust/
- Author: Olivier Eeckhoutte
- Published: 2022-01-28T07:00:00+02:00
- Updated: 2022-01-28T07:00:00+02:00
- Language: fr
- Tags: Rust, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Literals

Le type d'une variable peut être défini en ajoutant un suffixe derrière la valeur de la variable. Par exemple:

```
let mon_test1: i32 = 12;

Equivaut à

let mon_test2 = 12i32;

Equivaut à 

let mon_test3 = 12_i32;
```

Retourner la taille d'une variable:

```
println!("Taille de `mon_test1` in bytes: {}", std::mem::size_of_val(&mon_test1));
Taille de `mon_test1` in bytes: 4
// i32 -> 4 x 8 
```

<br/>

## Casting

> Il n'y a pas de *coercion*, c'est-à-dire de la conversion implicite, entre les types primitifs en Rust. Par contre, il y a de la conversion explicite de type (Casting) grâce au mot clé `as`.

```
let mon_float: f32 = 3.14159;
println!("{}", mon_float)
//3.14159

let mon_float2 = 3.6789_f32;
println!("{}", mon_float2)
//3.6789

//DONC la ligne suivante ne fonctionne pas:
let integer: u8 = mon_float; <- Pas de conversion implicite (coercion)

//MAIS la ligne suivante fonctionne:
let mon_integer = mon_float as u8;
println!("{}", mon_integer)
//3

let mon_integer2 = mon_float2 as u8;
println!("{}", mon_integer2)
//3 <- toujours 3, pas d'arrondi supérieur

let mon_character = mon_integer as char;
mon_character
'\u{3}'
```

> A noter qu'il n'est pas possible de convertir explicitement un float en char.
> `let mon_character = mon_decimal as char;` n'est pas possible.

Lorsqu'on cast une variable X dans une nouvelle variable Y non signée (*unsigned*) par exemple Rust essaye de *fit* l'ancienne variable dans la nouvelle. Des exemples valent mieux qu'un long discours...

```
fn print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
}

let ma_var = 1000;
print_type_of(&ma_var);
//i32
println!("{}", ma_var);
//1000

let ma_var2 = ma_var as u16;
print_type_of(&ma_var2);
//u16
println!("{}", ma_var2);
//1000
//Pas de changement car 1000 rentre bien dans u16

let ma_var3 = ma_var as u8;
print_type_of(&ma_var3);
//u8
println!("{}", ma_var3);
//232
// 1000 - 256 - 256 - 256 = 232 
// Pour les nombre positifs c'est la même chose que le modulo 1000 mod 256 = 232

let mon_second_test = -1i8;
print_type_of(&mon_second_test);
//i8
println!("{}", mon_second_test);
//-1
println!("{} as u8 = {}", mon_second_test, mon_second_test as u8);
//-1 as u8 = 255
//-1 + 256 = 255
```

Convertir un NAN
```
println!("nan as u8 = {}", f32::NAN as u8);
//0
```

Convertir des floats
```
println!("600.0 is {}", 600.0_f32 as u8);
// 600.0 is 255

println!("400.0 is {}", 400.0_f32 as u8);
// 400.0 is 255

println!("10000.0 is {}", 10000.0_f32 as u8);
// 10000.0 is 255

println!("1000000.0 is {}", 1000000.0_f32 as u8);
// 1000000.0 is 255

println!("255.0 is {}", 255.0_f32 as u8);
// 255.0 is 255

println!("256.0 is {}", 256.0_f32 as u8);
// 256.0 is 255

println!("-200.0 as u8 is {}", -200.0_f32 as u8);
// -200.0 as u8 is 0

println!("-1.0 as u8 is {}", -1.0_f32 as u8);
//-1.0 as u8 is 0
```

> A noter qu'il existe le mot clé `unsafe` pour changer le comportement ci-dessus.

<br/>

## Aliasing

Le mot clé `type` peut être utilisé en Rust pour donner un nouveau nom à un type existant.

> Contrairement aux types primitifs (f64, usize...), le nom donné à un "nouveau" type doit commencer par une masjuscule puis être en camel case. "nouveau" entre guillemets car il ne s'agit pas réellement de nouveaux types mais d'alias. Si ce format upper camel case n'est pas respecté, il y aura un warning lors de la compilation. Il est possible de la désactiver en précédant la ligne par `#[allow(non_camel_case_types)]`.

```
type Meter = u64;
type KiloMeter = u64;

#[allow(non_camel_case_types)]
type kilo_t = u32;
```

<br/>

## Inference

L'inférence de type en Rust est bien faite. Plutôt que de juste regarder la valeur d'une variable lors de son initialisation, Rust analyse comment est utilisée cette variable dans le reste du programme pour correctement inférer son type.

```
fn  main() {
    let mon_test = 5u8;
    let mut mon_vecteur = Vec::new();
    // /!\ Si vous commentez la ligne ci-dessous, 
    // Rust ne saura pas quoi donner comme type pour mon_vecteur.
    // Il y aura donc une erreur de compilation. 
    // Par contre, si on laisse la ligne suivante, Rust la lira lors 
    // de la compilation et déterminer que mon_vecteur est de type alloc::vec::Vec<u8>
    mon_vecteur.push(elem);
    println!("{:?}", mon_vecteur);
}
```
