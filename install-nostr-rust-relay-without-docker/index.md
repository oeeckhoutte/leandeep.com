# Install Nostr Rust relay without Docker

- Canonical URL: https://leandeep.com/install-nostr-rust-relay-without-docker/
- Author: Olivier Eeckhoutte
- Published: 2025-05-04T23:32:00+02:00
- Updated: 2025-05-04T23:32:00+02:00
- Language: fr
- Tags: Linux, Rust, Nostr
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


In this article we are going to see how to setup a Nostr relay without Docker. 

<br/>

**Prerequisites**

* rust installed (else `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)

<br/>

**Run Nostr relay without Docker**

```
sudo apt-get install build-essential cmake protobuf-compiler pkg-config libssl-dev
git clone -q https://git.sr.ht/\~gheartsfield/nostr-rs-relay
cd nostr-rs-relay
cargo build -q -r

RUST_LOG=warn,nostr_rs_relay=info ./target/release/nostr-rs-relay
```

And voila the relay will listen on port 8080.
