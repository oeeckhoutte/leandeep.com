# Installer un REPL Rust et jouer avec les types et slices

- Canonical URL: https://leandeep.com/installer-un-repl-rust-et-jouer-avec-les-types-et-slices/
- Author: Olivier Eeckhoutte
- Published: 2021-12-31T06:34:00Z
- Updated: 2021-12-31T06:34:00Z
- Language: fr
- Tags: Development, Rust, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


### Introduction

Dans cet article, nous allons voir comment installer le REPL `evcxr` pour Rust développé par Google. Ce genre d'outil est très utile lorsque vous apprenez un langage (ou même quand vous êtes expérimenté et que vous voulez vérifier quelque chose). Avec `evcxr`, il n'est pas nécessaire de recompiler son programme Rust à chaque nouvelle commande exécutée. Ce REPL le fait tout seul; un gros gain de temps.

<br/>

### Installation

```
rustup component add rust-src
cargo install evcxr_repl
```

<br/>

### Démarrage

> Lien vers la [documentation](https://github.com/google/evcxr/blob/main/COMMON.md)

```
evcxr
```

<br/>

A titre d'exemple, jouez avec les types primitifs en créant des variables mutables ou non et observez le comportement du langage Rust dans le REPL. 


> `i8`: entier signé de 8 bits, soit une valeur comprise entre `[-128;+127]`<br/>
> `i16`: entier signé de 16 bits<br/>
> `i32`<br/>
> `i64`<br/>
> `i128`<br/>
> `u8`: entier non-signé de 8 bits<br/>
> `u16`: entier non-signé de 16 bits, soit une valeur max de `(2^16)-1` soit `65 535`.<br/>
> `u32`<br/>
> `u64`<br/>
> `u128`<br/>
> `f32`: nombre flottant de 32 bits<br/>
> `f64`: nombre flottant de 64 bits<br/>
> `slice`: morceau de tableau<br/>
> `String`<br/>
> `char`
> `bool`
> `unit`: tuple
> `usize`: entier non-signé dont la size dépend de l'architecture du système (i.e. Intel 32 ou 64 bits...)
> `isize`: idem mais pour un entier signé

<br/>

Ou encore testez les Slices:

```
>> let tableau = &["titi", "tata", "toto"];
>> println!("{:?}", tableau);
["titi", "tata", "toto"]

>> let sub_tab = &tableau[1..];
>> println!("{:?}", sub_tab);
["tata", "toto"]
```

