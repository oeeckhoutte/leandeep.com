# Aide mémoire primitives Rust

- Canonical URL: https://leandeep.com/aide-m%C3%A9moire-primitives-rust/
- Author: Olivier Eeckhoutte
- Published: 2022-01-11T07:00:00+02:00
- Updated: 2022-01-11T07:00:00+02:00
- Language: fr
- Tags: Rust, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



**Annoter le type des variables**

```
let is_rust_cool: bool = true;

// let mon_float: f64 = 5.0; // Annotation simple
// let mon_integer = 5i32; // Annotation via suffixe 

// Ou inférence de type:
let mon_autre_float = 5.0; // f64
let mon_autre_integer = 5; // i32
```

> Le type de variable ne peut pas être changé

<br/>


**Tableau de taille fixe et type connu**

```
let petit_tableau: [i8; 5] = [1, 2, 3, 4, 5];
```

<br/>

**Tableau de taille fixe, type connu et initialisé à 0**

```
let petit_tableau2: [i8; 20] = [0; 20];
```

<br/>

**Retourner le nombre d'éléments d'un tableau**

```
println!("petit_tableau2 contient {} éléments", petit_tableau2.len());
```

<br/>

**Retourner la taille occupée en mémoire par un tableau**

```
use std::mem;
fn main() {
  let petit_tableau2: [i8; 20] = [0; 20];
  println!("petit_tableau2 occupe {} bytes", mem::size_of_val(&petit_tableau2));
  // petit_tableau2 occupe 20 bytes
  let petit_tableau2: [i16; 20] = [0; 20];
  println!("petit_tableau2 occupe {} bytes", mem::size_of_val(&petit_tableau2));
  // petit_tableau2 occupe 20 bytes
  // i8 <-> 8 bits <-> 1 byte
  // i16 <-> 16 bits <-> 2 bytes
}
```

<br/>

**Slicer des tableaux**
```
fn describe_slice(slice: &[i16]) {
    println!("Slice[0]: {}", slice[0]);
    println!("Slice length: {}", slice.len());
}

fn main() {
  let petit_tableau2: [i16; 20] = [0; 20];
  describe_slice(&petit_tableau2);
  //Slice[0]: 0
  //Slice length: 20
  describe_slice(&petit_tableau2[0..2]);
  //Slice[0]: 0
  //Slice length: 2
}
```

<br/>

**Retourner l'élément N d'un tuple**

```
let mon_tuple = (1u8, 2u16, 3u32, 4u64, 5u32, 6u16, -1i8, -2i16, -3i32, -4i64, 0.1f32, 0.2f64, false, 'a', 'b');
println!("Premier element dans mon_tuple: {}", mon_tuple.0);
println!("Deuxième element dans mon_tuple: {}", mon_tuple.1);
```

<br/>

**Un tuple dans un tuple**

```
let mon_tuple_dans_tuple = ((1u8, 2u16, 2u32), (3u32, 5u8), -2i16);
println!("Print tuple dans tuples: {:?}", mon_tuple_dans_tuple);
//Print tuple dans tuples: ((1, 2, 2), (3, 5), -2)
println!("Premier tuple dans tuples: {:?}", mon_tuple_dans_tuple.0);
//Premier tuple dans tuples: (1, 2, 2)
```

> Attention les tuples trop longs ne peuvent pas être "printés"

<br/>

**Renverser un tuple de 2 éléments/ une paire**

> Comme en Python les tuples peuvent être passés ou retournés dans les fonctions

```
fn reverse(pair: (i32, bool)) -> (bool, i32) {
    let (integer, boolean) = pair;
    (boolean, integer)
}

let mon_tuple = (1, true);
println!("mon_tuple = {:?}", mon_tuple);
//mon_tuple = (1, true)
println!("mon_tuple reversed = {:?}", reverse(mon_tuple));
//mon_tuple reversed = (true, 1)
```

> Comme en Python, les tuples contenant 1 élement, s'écrivent `("titi",)`

<br/>

**Destructuration**

```
let mon_tuple = (1, "titi", 0.5, true);
let (a, b, c, d) = mon_tuple;
println!("{:?}, {:?}, {:?}, {:?}", a, b, c, d);
//1, "titi", 0.5, true
```

<br/>

**Structures**

```
#[derive(Debug)]
struct Matrix(f32, f32, f32, f32);

let ma_matrice = Matrix(0.1, 0.2, 1.1, 2.2);
println!("{:?}", ma_matrice);
Matrix(0.1, 0.2, 1.1, 2.2)
```
