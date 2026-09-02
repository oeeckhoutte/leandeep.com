# Premiers pas avec Nautilus trader

- Canonical URL: https://leandeep.com/premiers-pas-avec-nautilus-trader/
- Author: Olivier Eeckhoutte
- Published: 2026-02-23T21:19:00Z
- Updated: 2026-02-23T21:19:00Z
- Language: fr
- Tags: Rust, Python, Trading, AlgoTrading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Dans cet article, je parcours quelques adapters de Nautilus trader écrits en Rust pour récupérer les données en temps réel sur différents exchanges. Mon objectif est de réécrire des bots de trading en Rust et de voir si Nautilus trader pourrait m'aider à avancer plus vite que si je démarrais from scratch.

<br/>

## Accès aux données d'exchanges

**Binance**

Pour utilise l'adapter Binance, il faut générer une API key `Ed25519`. On fournit à Binance un API secret et Binance fournit un API key.

Voici la procédure:

```
openssl genpkey -algorithm ed25519 -out binance_ed25519_private.pem
# Extract public key for Binance registration
openssl pkey -in binance_ed25519_private.pem -pubout -out binance_ed25519_public.pem
```


Exécution:

```
export BINANCE_API_KEY="API_KEY_FOURNIE_PAR_BINANCE"
export BINANCE_API_SECRET="$(cat /path/to/binance_ed25519_private.pem)"
RUST_LOG=debug cargo run --example binance-spot-data-tester --package nautilus-binance
```

Résultat:

![image](/images/binance-spot-btc-usd.png)

<br/>

**Coinbase**

Coinbase dans sa version classique non institutionnel n'est pas disponible dans Nautilus Trader.
Néanmoins, il est aisé, en s'inspirer des autres adapters et de l'adapter coinbase international existant, de créer son propre adapter coinbase pour récupérer des données en temps réel.
C'est même plus simple que Coinbase International car pour coinbase non institutionnel, il ne faut pas s'authentifier à l'API WS.

Voici l'arborescence à suivre:

```
coinbase/
├── Cargo.toml
├── README.md
├── examples/
│   └── node_data_tester.rs       # Exemple : BTC-USD + ETH-USD en temps réel
└── src/
    ├── lib.rs
    ├── config.rs                  # CoinbaseDataClientConfig (pas d'auth requise)
    ├── data.rs                    # CoinbaseDataClient (DataClient trait)
    ├── factories.rs               # CoinbaseDataClientFactory
    ├── common/
    │   ├── consts.rs              # COINBASE exchange/venue, URLs REST + WS
    │   └── enums.rs               # CoinbaseProductType, CoinbaseSide
    ├── http/
    │   ├── client.rs              # CoinbaseHttpClient (requêtes REST publiques)
    │   ├── models.rs              # Structs de désérialisation JSON
    │   └── parse.rs               # Parsing → CurrencyPair instruments
    └── websocket/
        ├── client.rs              # (réservé pour client standalone futur)
        ├── messages.rs            # Types WS : ticker, trades, L2, candles
        └── parse.rs               # Parsing → QuoteTick, TradeTick
```

Exécution:
```
cargo run --release \
  --example coinbase-data-tester \
  --package nautilus-coinbase
```

Résultat:

![image](/images/coinbase-btc-usd.png)


<br/>

**Hyperliquid**

Pour Hyperliquid, il n'y a rien à faire; c'est cadeau.

Exécution:

```
cargo run --example hyperliquid-data-tester --package nautilus-hyperliquid
```

Résultat:

![image](/images/hyperliquid-perp-btc-usd.png)


<br/>


**Deribit**

Deribit, idem rien à faire.

Exécution:

```
cargo run --example deribit-data-tester --package nautilus-deribit
```

Résultat:

![image](/images/deribit-perp-btc-usd.png)

<br/>

**Dydx**

Et pour le dernier exemple de cet article, dydx il y a également rien à faire.
Exécution:

```
cargo run --example dydx-data-tester --package nautilus-dydx
```

Résultat:

![image](/images/dydx-perp-btc-usd.png)

<br/>


Voilà de bonnes bases pour commencer à s'amuser sérieusement; c'est un bon début pour ce projet. Il contient d'autres *adapters* comme bitmex, Kraken... Je vais maintenant voir s'il est possible de modifier l'adapter Binance pour soit me connecter à son mainnet ou son testnet. Et je vais créer une première stratégie très simple qui me permettra de créer des limit orders en Rust sur Binance. On verra ensuite pour soit une stratégie *multi-exchanges* ou soit une stratégie plus poussée juste sur Binance.

> A noter que Bybit, Okx et Databento n'ont pas fonctionné out of the box.



