# Installer Rust sur Debian

- Canonical URL: https://leandeep.com/installer-rust-sur-debian/
- Author: Olivier Eeckhoutte
- Published: 2021-05-24T15:20:00Z
- Updated: 2021-05-24T15:20:00Z
- Language: fr
- Tags: Rust, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


### Provisioning d'une instance Debian

```
docker run -it -v $PWD:/home debian:latest bash
```

<br/>
### Installation de Rust

```
apt update
apt install curl vim git -y
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
apt install gcc gcc-multilib
source $HOME/.cargo/env

find /usr -iname "crti.o" -print
export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH # dans ~/.zshrc

find /usr -iname "Scrt1.o" -print
# /usr/lib/x86_64-linux-gnu/Scrt1.o -> No export necessary else add the dir containing Scrt1.o

apt-get install libclang-dev
find /usr -iname "libclang.so" -print
export LIBCLANG_PATH="/usr/lib/llvm-11/lib/libclang.so:${LIBCLANG_PATH}"

apt-get install g++ g++-multilib
```

<br/>
 
### Vérification du bon fonctionnement

```
# Créer un nouveau projet
cargo new example
cargo build
cargo run
 
# ou au moins avoir les binaires installés 
rustc --version
cargo --version
rustup --version
```

<br/>

### Voir les toolchains

```
rustup toolchain list
```

<br/>

### Installer une toolchain

```
rustup toolchain install TOOLCHAIN_NAME
```
