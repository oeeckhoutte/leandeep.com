# Analyse du projet nautilus trader

- Canonical URL: https://leandeep.com/analyse-du-projet-nautilus-trader/
- Author: Olivier Eeckhoutte
- Published: 2026-02-18T21:19:00Z
- Updated: 2026-02-18T21:19:00Z
- Language: fr
- Tags: Rust, Python, Trading, AlgoTrading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir ce qu'est Nautilus Trader et comment l'utiliser. 
Je me suis penché sur cet outil car je m'étais fixé l'objectif de ré-écrire un bot de trading en Rust avant de m'apercevoir qu'il y avait déjà cette plateforme open source qui existait et qui contient déjà plus de 17 000 commits.
Plutôt que de réinventer la roue, l'idée est de voir si je peux m'approprier cet outil bot pour en faire un bot d'arbitage. Cela me permet aussi de me plonger dans un large projet Rust avec bindings pour Python. Et du coup s'il manque des features, ce sera avec grand plaisir que je pourrai les coder. 


<br/>

## Présentation

Nautilus Trader n'est pas juste une lib Python écrite en Rust; c'est un peu plus complexe.

C'est une plateforme de trading algorithmique haute performance qui utilise une architecture hybride à **trois couches de langages**:

<br/>

**1. Rust: Le moteur natif (crates/)**

Le workspace Rust contient ~35 crates qui implémentent le cœur du système:

| Catégorie |	Crates |
| :--     | :--   |
| Noyau |	core, model, common, data, serialization |
| Trading	| trading, execution, risk, portfolio, backtest |
| Infra	| network, persistence, infrastructure, cryptography |
| Adapters | exchanges	binance, bybit, kraken, deribit, okx, dydx, coinbase_intx, tardis, etc. |
| Binding Python |	pyo3: le pont vers Python via PyO3 |

Le crate `crates/pyo3/` est la passerelle: il compile une bibliothèque partagée nautilus_pyo3 qui expose les types et fonctions Rust directement en Python.

<br/>

**2. Cython: La couche intermédiaire (fichiers .pyx)**

Il y a ~106 fichiers .pyx (Cython) et ~129 fichiers .pxd (déclarations). C'est une couche historique importante qui:
- Fournit une grande partie de l'API Python publique (stratégies, ordres, instruments, indicateurs, etc.)
- Appelle le code Rust via FFI/C (headers générés dans `nautilus_trader/core/includes/`)
- Implémente certains composants directement en Cython pour la performance
- Se compile en extensions C (fichiers .so/.pyd) qui se linkent aux bibliothèques statiques Rust

On le voit dans `nautilus_trader/core/rust/` qui contient des fichiers .pyx comme model.pyx et common.pyx servant de pont entre Cython et les bibliothèques Rust.

<br/>

**3. Python pur: L'orchestration (fichiers .py)**

Du Python classique pour:
- La configuration et l'orchestration du système
- Certains adapters de plus haut niveau
- Les tests

<br/>

En gros l'architectue du projet se décompose comme ceci:

```
┌─────────────────────────────────────────────────┐
│              Utilisateur Python                 │
│         (import nautilus_trader)                │
├────────────────────┬────────────────────────────┤
│   Cython (.pyx)    │     Python pur (.py)       │
│  Extensions C/C++  │  Config, orchestration     │
├────────────────────┴────────────────────────────┤
│          FFI (C headers)  &  PyO3               │
├─────────────────────────────────────────────────┤
│              Rust (crates/)                     │
│  Core engine, model, adapters, networking, etc. │
└─────────────────────────────────────────────────┘
```

L'API utilisateur est en Python, mais que la performance critique est en Rust, et que le Cython sert de ciment (historique) entre les deux.

> Le projet migre progressivement de Cython vers Rust/PyO3. Le Cython est la couche historique, et le Rust prend de plus en plus de place. On voit d'ailleurs que les tests ont souvent des versions _pyo3

<br/>


**Il y a 3 catégories d'adapters**

**1. Adapters Rust + couche Python fine (la majorité)**

Ces adapters ont une double implémentation: le gros de la logique est en Rust, avec une couche Python par-dessus.

| Adapter	| Rust (crates/adapters/)	| Python (nautilus_trader/adapters/) |
| :--     | :--   | :-- |
| Binance	| oui	| oui |
| Bybit	| oui	|	oui	|
| Kraken | oui	|	oui	|
| OKX | oui | oui |
| Deribit | oui | oui |
| dYdX | oui | oui |
| Coinbase | IntX | oui | oui |
| Databento | oui | oui |
| Tardis | oui | oui |
| Hyperliquid | oui | oui |
| BitMEX | oui | oui |
| Architect | AX | oui | oui |
| Sandbox | oui | oui |
| Blockchain | oui | oui |

Par exemple pour Binance, le code Rust dans `crates/adapters/binance/src/futures/data.rs` (~1500 lignes) implémente le vrai client de données live (connexions WebSocket, parsing des messages, gestion de l'order book,...). Le code contient même un sous-dossier `python/` avec des bindings PyO3 pour exposer certains types (enums, clients HTTP/WebSocket) à Python.

Côté Python, `nautilus_trader/adapters/binance/data.py` est la couche qui orchestre le tout comme la configuration, les factories, et certains traitements de haut niveau mais qui délègue le travail lourd au Rust.

<br/>

**2. Adapters Python pur (quelques-uns)**

Certains adapters n'existent qu'en Python, sans contrepartie Rust:

| Adapter | Rust | Python |
| :--     | :--   | :-- |
| Interactive Brokers | non | oui |
| Betfair | non | oui (+ un peu de Cython pour l'orderbook) |
| Polymarket | non | oui |
| dYdX v4 (legacy) | non | oui |

<br/>

**3. Le template**
Le dossier `nautilus_trader/adapters/_template/` contient un squelette Python pour créer de nouveaux adapters. Il est en Python pur:

```
_template/
├── __init__.py
├── core.py
├── data.py
├── execution.py
└── providers.py
```

<br/>

## Installation sur OSX

Les bases de données ne sont pas requises pour commencer. Elles sont optionnelles et servent à des cas d'usage spécifiques:

| Service | Rôle | Obligatoire ? |
| :--     | :--   | :-- |
| Redis | Cache persistant et/ou message bus partagé entre instances | Non |
PostgreSQL | Stockage durable des ordres, positions, instruments | Non |

<br/>

**Pré-requis**

| Outil |	Version |	Pourquoi |
| :--     | :--   | :-- |
| Python | 3.12 - 3.14 | Runtime principal |
| Rust (via rustup) | 1.93.1 stable | Compilation des crates |
| clang	(fourni par Xcode) | Compilateur C pour les extensions Cython |
| uv | 0.10.3+ | Gestionnaire de packages Python recommandé |
| Cap'n Proto | 1.3.0 | Compilation des schémas de sérialisation |

<br/>

```
# Installation de Rust
curl https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
# Ou update 
# rustup update stable

# uv (gestionnaire de packages Python)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Cap'n Proto
brew install capnp
```

<br/>

```
git clone https://github.com/nautechsystems/nautilus_trader
git checkout master
cd nautilus_trader
export PYO3_PYTHON=$(pwd)/.venv/bin/python
make install
# Plus tard pour itérer rapidement: 
# make install-debug
uv run python -c "import nautilus_trader; print(nautilus_trader.__version__)"
# 1.222.0
# uv run python -m pip list
```

<br/>

## Utilisation basique

| Commande | Description |
| :--     | :--   |
| make install | Build release + install toutes les dépendances |
| make install-debug | Build debug (plus rapide, pour le dev) |
| make build-debug | Recompiler après modification de .rs, .pyx, .pxd |
| make clean | Nettoyer tous les artefacts de build |
| make format | Formater le code Rust et Python |
| make pre-commit | Lancer tous les hooks pre-commit |

<br/>

## Organisation des exemples

Le dossier `examples/` est organisé autour de 3 environnements d'exécution + un dossier utilitaire:

<br/>

**1. `backtest/`: Données historiques, exchange simulé**

Si on fournit des données historiques, le moteur simule un exchange et exécute une stratégie dessus. Aucune connexion réseau, aucune clé API est nécessaire.

Le pattern est toujours le même: `Engine -> Venue -> Instrument -> Data -> Strategy -> Run`.

Il y a aussi 11 exemples tutoriels numérotés (example_01 à example_11) qui enseignent chacun un concept:

| Exemple | Concept enseigné |
| :--     | :--   |
| 01 | Charger des bars depuis un CSV custom |
| 02 | Utiliser les timers de l'horloge |
| 03 | Agrégation de bars |
| 04 | Utiliser le data catalog |
| 05 | Utiliser le portfolio |
| 06 | Utiliser le cache |
| 07 | Utiliser les indicateurs |
| 08 | Indicateurs en cascade |
| 09 | Messaging via le message bus |
| 10 | Messaging via un Actor (data) |
| 11 | Messaging via un Actor (signals) |

Chaque tutoriel a un run_example.py (le lanceur) et un strategy.py (la logique de trading).

<br/>

**2. `sandbox/`: Données live, exécution simulée**

C'est un mode hybride. On se connectes à un vrai exchange pour recevoir des données de marché en temps réel, mais les ordres sont exécutés dans un simulateur local. C'est vraiment parfait pour tester une stratégie dans des conditions réelles sans risquer d'argent.

```
# source binance_spot_futures_sandbox.py

data_clients={
    "BINANCE_FUTURES": BinanceDataClientConfig(  # <-- Données RÉELLES de Binance
        // ...
    ),
    "BINANCE_SPOT": BinanceDataClientConfig(     # <-- Données RÉELLES de Binance
        // ...
    ),
},
exec_clients={
    "BINANCE_FUTURES": SandboxExecutionClientConfig(  # <-- Exécution SIMULÉE
        venue="BINANCE_FUTURES",
        starting_balances=["10_000 USDC", "0.005 BTC"],
    ),
    "BINANCE_SPOT": SandboxExecutionClientConfig(     # <-- Exécution SIMULÉE
        venue="BINANCE_SPOT",
        starting_balances=["1_000 USDC", "0.001 BTC"],
    ),
},
```

<br/>

**3. `live/`: Données live, exécution live**

Dans cette section, c'est du vrai trading. C'est Organisé par exchange, chaque sous-dossier contient typiquement:
- Un data tester (`*_data_tester.py`) qui se connecte et affiche les données reçues, sans trader
- Un exec tester (`*_exec_tester.py`) qui teste le passage d'ordres réels
- Des stratégies (`*_ema_cross.py`, `*_market_maker.py`, etc.) qui sont des exemples complets.

<br/>

## Indicateur disponibles

**Moyennes mobiles**

| Indicateur | Abréviation | Description |
|-----------|:-----------:|-------------|
| SimpleMovingAverage | SMA | Moyenne arithmétique sur une fenêtre glissante |
| ExponentialMovingAverage | EMA | Moyenne exponentielle: pondère davantage les données récentes |
| DoubleExponentialMovingAverage | DEMA | Double exponentielle: réduit encore le retard |
| WeightedMovingAverage | WMA | Moyenne pondérée linéairement |
| HullMovingAverage | HMA | Hull: très réactive avec peu de lag |
| AdaptiveMovingAverage | AMA | Kaufman: s'adapte au bruit du marché |
| WilderMovingAverage | RMA | Wilder: utilisée dans le calcul du RSI |
| VariableIndexDynamicAverage | VIDYA | Variable: s'ajuste dynamiquement à la volatilité |
| LinearRegression | LR | Régression linéaire glissante |
| VolumeWeightedAveragePrice | VWAP | Prix moyen pondéré par le volume |

<br/>

**Momentum**

| Indicateur | Abréviation | Description |
|-----------|:-----------:|-------------|
| RelativeStrengthIndex | RSI | Force relative: détection des zones de surachat/survente |
| MovingAverageConvergenceDivergence | MACD | Convergence/divergence de moyennes mobiles |
| BollingerBands | BB | Bandes de volatilité autour d'une moyenne mobile |
| Stochastics | STOCH | Oscillateur stochastique (%K, %D) |
| CommodityChannelIndex | CCI | Mesure l'écart du prix par rapport à sa moyenne statistique |
| ChandeMomentumOscillator | CMO | Oscillateur de momentum de Chande |
| RateOfChange | ROC | Taux de variation en pourcentage |
| AroonOscillator | AROON | Détection de tendance et de sa force |
| ArcherMovingAveragesTrends | AMAT | Identification de tendance par croisement de moyennes |
| DirectionalMovement | DM | Mouvement directionnel (ADX, +DI, -DI) |
| PsychologicalLine | PSL | Pourcentage de bougies haussières sur une fenêtre |
| Swings | — | Détection de points hauts et bas (swing points) |
| Bias | — | Écart relatif du prix par rapport à une moyenne mobile |

<br/>

**Volatilité**

| Indicateur | Abréviation | Description |
|-----------|:-----------:|-------------|
| AverageTrueRange | ATR | Mesure de la volatilité moyenne |
| DonchianChannel | DC | Canal basé sur le plus haut/bas des N dernières périodes |
| KeltnerChannel | KC | Canal basé sur l'EMA ± un multiple de l'ATR |
| KeltnerPosition | KP | Position relative du prix dans le canal de Keltner |
| VolatilityRatio | VR | Ratio entre la volatilité récente et historique |
| VerticalHorizontalFilter | VHF | Filtre qui distingue tendance et range |
| RelativeVolatilityIndex | RVI | Index de volatilité relative |

<br/>

**Volume**

| Indicateur | Abréviation | Description |
|-----------|:-----------:|-------------|
| OnBalanceVolume | OBV | Volume cumulé pondéré par la direction du prix |
| KlingerVolumeOscillator | KVO | Oscillateur de flux monétaire de Klinger |
| Pressure | — | Mesure de la pression acheteuse vs vendeuse |

<br/>

**Ratio et analyse**

| Indicateur | Abréviation | Description |
|-----------|:-----------:|-------------|
| EfficiencyRatio | ER | Ratio d'efficience de Kaufman (signal/bruit) |
| SpreadAnalyzer | — | Analyse du spread bid-ask |
| BookImbalanceRatio | — | Ratio de déséquilibre du carnet d'ordres |

<br/>

**Divers**

| Indicateur | Abréviation | Description |
|-----------|:-----------:|-------------|
| FuzzyCandlesticks | — | Classification des bougies par logique floue (fuzzy logic) |

<br/>

> Ichimoku est absent 😢


<br/>

## Analyse d'exemples

Voici la description des exemples de 4 exchanges dans `examples/live/`:

**Binance (7 fichiers)** 
| Fichier | Stratégie | Description |
| :--     | :--   | :-- |
| `binance_data_tester.py` | DataTester | Connexion data-only, affiche quotes/trades/bars/book. Pas de trading. |
| `binance_spot_ema_cross.py` | EMACross | Croisement EMA 10/20 sur ETHUSDT Spot, ordres de 0.010 ETH |
| `binance_futures_testnet_ema_cross.py` | EMACross | Même stratégie mais sur Futures testnet (ETHUSDT-PERP), mode hedging |
| `binance_spot_ema_cross_bracket_algo.py` | EMACrossBracketAlgo + TWAP | EMA cross avec ordres bracket (TP/SL basés sur ATR) et exécution TWAP |
| `binance_spot_exec_tester.py` | ExecTester | Test de passage d'ordres (limit post-only, market IOC). Pas de stratégie. |
| `binance_spot_testnet_exec_tester.py` | ExecTester | Idem sur testnet |
| `binance_futures_testnet_exec_tester.py` | ExecTester | Idem sur Futures testnet |
| `binance_spot_and_futures_market_maker.py` | VolatilityMarketMaker x2 | Market making sur Spot ET Futures simultanément (2 exchanges, 2 stratégies) |

<br/>

**Bybit (8 fichiers)**

| Fichier | Stratégie | Description |
| :--     | :--   | :-- |
| `bybit_data_tester.py` | DataTester | Data-only (LINEAR ou INVERSE) |
| `bybit_ema_cross.py` | EMACross | EMA 10/20 sur ETHUSDT-LINEAR |
| `bybit_ema_cross_bracket_algo.py` | EMACrossBracketAlgo + TWAP | EMA cross avec bracket orders et TWAP |
| `bybit_ema_cross_stop_entry.py` | EMACrossStopEntry | EMA cross avec entrée par stop order et trailing stop ATR |
| `bybit_ema_cross_with_trailing_stop.py` | EMACrossTrailingStop | EMA cross avec trailing stop en basis points |
| `bybit_exec_tester.py` | ExecTester | Test d'exécution (SPOT/LINEAR/INVERSE/OPTION) |
| `bybit_options_data_collector.py` | BybitOptionsDataCollector | Collecte les données d'options BTC en parquet |
| `bybit_request_custom_endpoint.py` | RequestDemoStrategy | Démo de requête custom (ticker) toutes les 10s |

<br/>

**OKX (3 fichiers)**

| Fichier | Stratégie | Description |
| :--     | :--   | :-- |
| `okx_data_tester.py` | DataTester | Spot + Swap, quotes/trades/mark/funding |
| `okx_exec_tester.py` | ExecTester | SPOT/MARGIN/SWAP/FUTURES/OPTION |
| `okx_spot_swap_quoter.py` | SpotSwapQuoter | Quote ETH-USDT Spot et ETH-USDT-SWAP simultanément (2 instruments, 1 exchange) |

<br/>

**Interactive Brokers (8 fichiers)**

| Fichier | Stratégie | Description |
| :--     | :--   | :-- |
| `connect_with_dockerized_gateway.py` | SubscribeStrategy | Connexion via IB Gateway Docker, SPY/ES/CL/EUR.USD |
| `connect_with_tws.py` | SubscribeStrategy | Connexion via TWS local |
| `contract_download.py` | Script utilitaire | Télécharge les définitions d'instruments (NSE NIFTY50) |
| `historical_download.py` | Script utilitaire | Télécharge des données historiques AAPL en parquet
| `with_databento_client.py` | SubscribeStrategy | Données via Databento + exécution via IB (2 sources) |
| `notebooks/bracket_order_example.py` | Bracket order | Ordre bracket sur ES futures avec OCO TP/SL |
| `notebooks/oca_group_example.py` | OCA group | Groupe OCA (One-Cancels-All) sur ES |
| `notebooks/spread_example.py` | SpreadTestStrategy | Calendar spread ES ou options spread, multi-leg |

<br/>

Voilà c'est tout pour cette première analyse. Je vais maintenant creuser du côté du coeur en Rust, du côté de l'arbitrage (en Python et surtout en Rust pour maximiser la latence), des screeners basiques pour trouver des cadeaux à trader et je vais peut être voir si je ne peux pas contribuer sur la création d'un indicateur ou stratégie avec Ichimoku. J'écrirais sans doute un autre article sur cet outil prochainement car je passe énormément de temps sur le sujet du trading chaque semaine et je ne documente jamais.
Je ne suis pas trader pro mais je regarde presque quotidiennement depuis 4 ou 5 ans des vidéos d'analyse technique et je passe très régulièrement des trades sur des CEX. Bref pouvoir combiner 2 passions (Dev avec Rust + Python & trading) c'est top.

