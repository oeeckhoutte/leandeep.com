# Rust to Webassembly

- Canonical URL: https://leandeep.com/rust-to-webassembly/
- Author: Lean Deep
- Published: 2019-12-22T18:28:03Z
- Updated: 2019-12-22T18:28:03Z
- Language: fr
- Tags: Rust, Webassembly
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

## Introduction

L'objectif de cet article est de voir comment compiler un tout petit programme en Rust et de l'appeler soit dans un navigateur, soit dans un programme NodeJS ou soit dans un programme Python. 

<br/>

## Installation 

**Installer rustup**

> Rustup is an installer for the systems programming language Rust

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

<br/>

**Installer wasm-pack**
```
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

<br/>

## Création d'une librairie Rust

```
cargo new --lib days-count
```

Remplacer le contenu du fichier `days-count/src/lib.rs` par celui-ci:

```
/// Count the number of calendar days between two dates given as
/// timestamps in milliseconds. Make the assumption that One day is
/// 86_400_000 milliseconds (leap seconds are ignored).
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn count_days_between(timestamp_ms_a: u64, timestamp_ms_b: u64) -> u64 {
    let days_count_a = timestamp_ms_a / 1000 / 3600 / 24;
    let days_count_b = timestamp_ms_b / 1000 / 3600 / 24;
    let days_count_between = match days_count_a.checked_sub(days_count_b) {
        Some(difference) => difference,
        None => days_count_b - days_count_a,
    };

    return days_count_between;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_returns_365_between_xmas_2018_and_xmas_2019() {
        assert_eq!(count_days_between(1545696000000, 1577232000000), 365);
    }

    #[test]
    fn it_returns_365_between_xmas_2019_and_xmas_2018() {
        assert_eq!(count_days_between(1577232000000, 1545696000000), 365);
    }

    #[test]
    fn it_returns_0_for_two_timestamps_in_the_same_day() {
        // 2019/11/14 at 00:00, and later in the day
        assert_eq!(count_days_between(1573689600000, 1573750188321), 0);
    }

    #[test]
    fn it_returns_29_in_february_of_a_leap_year() {
        // 2012/03/01 & 2012/02/01
        assert_eq!(count_days_between(1330560000000, 1328054400000), 29);
    }
}
```

<br/>

**Ajouter la cible permettant de compiler du Rust en WebAssembly**
```
rustup target add wasm32-unknown-unknown
```

Modifier le fichier `Cargo.toml` et ajouter le contenu suivant: 

```
[dependencies]
wasm-bindgen = "0.2"

[lib]
crate-type = ["cdylib"]
```

<br/>

## Accéder au wasm depuis NodeJS

On compile la librairie grâce à la commande suivante:
```
wasm-pack build --release --target nodejs
```

```
mkdir nodejs && cd nodejs
yarn init -y # ou : npm init -y
yarn add --dev ../pkg # ou : npm i -D ../pkg
touch index.js
```

On importe le module days-count généré par wasm-pack et on exécute la fonction count_days_between dans notre fichier NodeJS:

Pour ce faire, on modifie donc le fichier `nodejs/index.js` avec le qui suit:

```
const daysCount = require('days-count');

console.log(
  daysCount.count_days_between(
    // 01/02/2012
    BigInt(1330560000000),
    // 01/03/2012
    BigInt(1328054400000)
  )
);

```

En exécutant node nodejs/index.js on obtient bien `29` en output.

<br/>

## Accéder au wasm depuis le Navigateur

On compile le project Rust:
```
wasm-pack build --release --target bundler
```

On crée un projet basé sur la template NPM wasm-app:
```
mkdir browser && cd browser
npm init wasm-app
yarn add --dev ../pkg # ou : npm i -D ../pkg
yarn && yarn build # ou npm install && npm run build
```

On modifie le fichier `browser/index.js` et on lui donne le contenu suivant:

```
import * as daysCount from 'days-count';

// pour changer du console.log
document.body.append(
  daysCount.count_days_between(
    // 01/02/2012
    BigInt(1330560000000),
    // 01/03/2012
    BigInt(1328054400000)
  )
);
```

On lance le projet avec `yarn start` et on se rend à l'adresse suivante `http://localhost:8080` pour voir le résultat de la fonction Rust exécutée.


<br/>

## Bonus - Accéder à un wasm depuis Python

Créer une nouvelle librairie:
```
cargo new --lib simple
```

<br/>

Modifier le fichier `simple/src/lib.rs` et ajouter la fonction Rust suivante:

```
#[no_mangle]
pub extern fn simple_add(a: i32, b: i32) -> i32 { a + b}
```

<br/>

Ajouter la target suivante en exécutant cette commande dans votre terminal:
```
rustup target add wasm32-unknown-unknown
```

<br/>

Modifier le fichier `Cargo.toml` et ajouter le contenu suivant: 

```
[dependencies]
wasm-bindgen = "0.2"

[lib]
crate-type = ["cdylib"]
```

<br/>

Créer un fichier simple.py qui va appeler notre binaire wasm:
```
from wasmer import Instance
path = './target/wasm32-unknown-unknown/release/simple.wasm'
with open(path, ‘rb’) as bytecode:
    wasm_bytes = bytecode.read()
    instance = Instance(wasm_bytes)
    result = instance.exports.simple_add(12, 12)
    print('Modules exported from Rust: ')
    print(instance.exports)  # this will print function's name
    print('call simple_add(12, 12): ')
    print(result)  # 24
```

<br/>

Exécuter le fichier python: `python simple.py` et observer le résultat.
```
Modules exported from Rust:
["simple_add"]
call simple_add(12, 12):
24
```

<br/>

> Notes: pour installer un package cargo, il faut ajouter la dépendance dans le fichier `Cargo.toml` et exécuter la commande `cargo build`.


