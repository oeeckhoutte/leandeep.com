# Premier programme en Rust

- Canonical URL: https://leandeep.com/premier-programme-en-rust/
- Author: Olivier Eeckhoutte
- Published: 2021-05-13T18:20:00Z
- Updated: 2021-05-13T18:20:00Z
- Language: fr
- Tags: Rust
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


J'ai voulu créer un premier programme en Rust; sans avoir jamais suivi de tutoriel ou de formation. Suite à cette première expérience, je pense que c'est très compliqué de coder quelque chose de propre et de comprendre ce que l'on fait sans lire un livre sur le sujet. 

J'ai donc craqué et me suis prévu un peu de lecture pour ce mois ci &#128540;... 

![image](/images/rust-book.png)

<br/>


## Premier hello world

Créer un fichier main.rs
```
fn main() {
    println!("Hello, world!");
}
```

Puis exécuter la commande `rustc main.rs` pour créer un binaire. Puis exécutez le `./main`

<br/>


## Mon premier utilitaire

J'ai créé un utilitaire système permettant de mettre à jour un record DNS de type A sur Cloudflare avec l'IP dynamique d'une box internet. Je voulais un petit utilitaire simple transformé en binaire pour ne pas avoir à gérer de dépendances Python ou Node sur le système et ne pas avoir gérer de pipeline CICD. C'était aussi un petit use case très simple pour expérimenter Rust.

<br/>

Création de la structure du projet:
```
cargo new update-cloudflare-A-DNS-record
```

<br/>

Ajouter le contenu suivant dans le fichier `./src/main.rs`: (je rappelle que c'est la première fois que je fais du Rust et j'ai bien galéré. Donc c'est sans doute loin d'être clean et optimisé. Bon par contre, cela fonctionne très bien). Pensez à remplacer `VOTRE_DNS` par votre propre DNS cloudflare si vous voulez faire la même chose. 

```
use std::net::{IpAddr};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

fn main() {
    println!("Getting public IP");
    let ip = get_public_ip();
    println!("Public IP address: {:?}", ip);
    println!("Updating DNS A record with public IP");
    update_cloudflare_a_record(ip)
}

fn get_public_ip() -> IpAddr {
    tokio::runtime::Runtime::new().unwrap().block_on(async {
        let ip: IpAddr = "127.0.0.1".parse().unwrap();
        if let Some(ip) = public_ip::addr().await {
            return ip
        } else {
            println!("couldn't get an IP address");
        }
        return ip;
    })
}

fn update_cloudflare_a_record(ip: IpAddr) {
    tokio::runtime::Runtime::new().unwrap().block_on(async {
        let client = reqwest::Client::new();

        // Get zones
        // curl -s -X GET "https://api.cloudflare.com/client/v4/zones/?per_page=100" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_KEY}" \
        -H "Content-Type: application/json"| jq -r '.result[] | "\(.id) \(.name)"'

        // Get DNS informations
        // curl -X GET "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
        // -H "Content-Type:application/json" \
        // -H "Authorization: Bearer ${CLOUDFLARE_API_KEY}"

        // Update DNS record
        // curl -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${DNS_ID}" \
        // -H "Authorization: Bearer ${CLOUDFLARE_API_KEY}" \
        // -H "Content-Type: application/json" \
        // --data '{"type":"A","name":"VOTRE_DNS","content":"127.0.0.1","ttl":1,"proxied":false}'

        let s: String = ip.to_string();

        let mut map = HashMap::new();
        map.insert("type", "A");
        map.insert("name","VOTRE_DNS");
        map.insert("content", &s);

        let res = client.put("https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${DNS_ID}")
            .bearer_auth("${CLOUDFLARE_API_KEY}")
            .json(&map)
            .send()
            .await.unwrap();

        let t = res
            .text()
            .await.unwrap();

        println!("{}", t);
    })
}
```

<br/>

Ajouter les packages permettant de faire les calls externes. Editer le fichier `Cargo.toml` et ajouter le contenu suivant:

```
[package]
name = "update-cloudflare-A-DNS-record"
version = "0.1.0"
authors = ["Olivier Eeckhoutte <olivier.eeckhoutte@gmail.com>"]
edition = "2018"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
reqwest = { version = "0.11.3", features = ["json"] }
tokio = { version = "1", features = ["full"] }
public-ip = "0.2"
serde = "1.0.8"
serde_derive = "1.0.8"
serde_json = "1.0"
```

<br/>

Télécharger les packages externes, compiler et builder le projet:
```
cargo build (debug mode)
# cargo build --release (for prod)
```

<br/>

Voir le résultat (exécuter le binaire):
```
./target/debug/update-cloudflare-A-DNS-record
```

<br/>

## Build for Linux from Mac

Je travaille sur Mac, du coup pour obtenir un binaire compatible avec Linux, je usis passé par Docker. J'ai créé une image qui contient tout le nécessaire pour builder mon programme Rust sur Linux. Maintenant je n'ai plus qu'à exécuter la commande ci-dessous et un dossier `linux` se crée dans le répertoire target. 
```
docker run --rm \
    --volume "${PWD}":/root/src \
    --workdir /root/src \
    build_from_mac_for_linux:latest \
    sh -c "cargo build --release"
```

