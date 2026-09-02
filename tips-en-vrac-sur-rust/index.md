# Tips en vrac sur Rust

- Canonical URL: https://leandeep.com/tips-en-vrac-sur-rust/
- Author: Olivier Eeckhoutte
- Published: 2021-12-31T06:34:00Z
- Updated: 2021-12-31T06:34:00Z
- Language: fr
- Tags: Development, Rust, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


**Voir les "choses" chargées par défaut lors du démarrage d'un programme Rust**

> "The prelude is the list of things that Rust automatically imports into every Rust program." [Source](https://doc.rust-lang.org/std/prelude/index.html#the-rust-prelude)

[https://doc.rust-lang.org/std/prelude/v1/index.html](https://doc.rust-lang.org/std/prelude/v1/index.html)

<br/>

**Some()**

`Some` est une variante de l'enum Option<T>.

```
enum Option<T> {
    None,
    Some(T),
}
```

Si on veut parler d'une variable qui existe, on utilise `Some(value)`. (Par contre, si on veut parler d'une variable qui pourrait ne pas exister, on utilise plutôt `Option<IciAnyType>`)

> Il peut être intéressant d'utiliser l'opérateur `if let` avec `Some()`:
> ```
> if let Some(s) = ma_fonction(1) {...
> ...
> ```

<br/>

**Utilisation du `Some()` dans un `while let`**

C'est un shortcut à loop:

```
let mut vecteur = vec!("titi", "tata", "toto");

loop {
    match vecteur.pop() {
        Some(x) => println!("{}", x),
        None => break,
    }
}
```

> A noter ici que `vecteur` doit être défini comme mutable; sans quoi `vecteur.pop()` poserait problème. Le compilateur empêchera la compilation de toute façon...


```
let mut vecteur = vec!("titi", "tata", "toto");

while let Some(x) = vecteur.pop() {
    println!("{}", x);
}
```

Output: <br/>
toto<br/>
tata<br/>
titi

<br/>


**Debugging: afficher le type d'une variable**

```
fn debug_print_type_of<T>(_: &T) {
    println!("{}", std::any::type_name::<T>())
}

fn main() {
    let test_string = "titi";
    let test_i32 = 42;

    debug_print_type_of(&test_string); // &str
    debug_print_type_of(&test_i32); // i32
}
```

<br/>

**Return ou pas return?**

Le code suivant:

```
fn sum(num1: i32, num2: i32) -> i32 {
    num1 + num2
}
```

est équivalent au code suivant:

```
fn sum(num1: i32, num2: i32) -> i32 {
    return num1 + num2;
}
```

<br/>

**Préciser qu'une fonction ne retourne rien**

Comment faire l'équivant de `-> None:` en Python mais en Rust ?

```
fn ma_fonction() -> () {
    println!("Hello world");
}
```

<br/>

**L'opérateur ?**

L'utilisation de l'opérateur `?` n'est possible que sur les types qui implémentent le trait [Try](https://doc.rust-lang.org/stable/std/ops/trait.Try.html).

```
use std::fs::File;

fn open_file(filename: &str) -> Result<u32, String> {
    let mut my_file = File::open(filename).map_err(|e| format!("Error while opening file {:?}", (filename, e)))?;
    Ok(0)
}
```

> Noter ici l'utilisation du paramètre `{:?}` dans la macro `format`. Plus d'information sur les paramètres disponibles pour formater des strings sur [la doc officielle](https://doc.rust-lang.org/std/fmt/index.html).
