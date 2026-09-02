# Premier limit order avec Nautilus trader sur Binance

- Canonical URL: https://leandeep.com/premier-limit-order-avec-nautilus-trader-sur-binance/
- Author: Olivier Eeckhoutte
- Published: 2026-02-23T22:19:00Z
- Updated: 2026-02-23T22:19:00Z
- Language: fr
- Tags: Rust, Python, Trading, AlgoTrading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Dans cet article, j'approfondis l'adapter Binance écrit en Rust de Nautilus trader pour pouvoir me connecter au testnet de Binance pour réaliser un limit order.

<br/>

## Accès au testnet de Binance

**Data tester**

L'adapter existant ne supporte pas le testnet. 

Créer une API key sur https://testnet.binance.vision/key/register:
```
openssl genrsa -out test-prv-key.pem 2048
openssl rsa -in test-prv-key.pem -pubout -outform PEM -out test-pub-key.pem
```

Je préconise de créer une autre example dans l'adapter binance: `node_data_tester_testnet.rs`

```
export BINANCE_API_KEY="API_KEY_FROM_BINANCE_TESTNET_WEBSITE"
export BINANCE_API_SECRET="$(cat /path/to/test-prv-key.pem)"
cargo run --release --example binance-spot-data-tester-testnet --package nautilus-binance
```

Résultat:

`2026-02-23T22:08:55.464317000Z [INFO] TRADER-001.nautilus_binance::spot::websocket::streams::client: Connecting to Binance SBE WebSocket: url=wss://stream.testnet.binance.vision/ws, auth=false`

![image](/images/binance-btc-usd-testnet.png)


<br/>

**Exec tester**

Comme pour le script précédent, je préconise de créer un nouveau fichier dans l'adapter binance: `node_exec_tester_testnet.rs`.

```
export BINANCE_API_KEY="API_KEY_FROM_BINANCE_TESTNET_WEBSITE"
export BINANCE_API_SECRET="$(cat /path/to/test-prv-key.pem)"
cargo run --release --example binance-spot-exec-tester-testnet --package nautilus-binance
```

Résultat:

![image](/images/binance-limit-order-btc-usd-testnet.png)


<br/>

## Lister les limit orders sur Binance testnet via API call

Créer un fichier `./check_orders.sh` avec le contenu suivant:

```
#!/bin/bash

API_KEY="..."
SECRET_KEY="..."
BASE_URL="https://testnet.binance.vision"
SYMBOL="${1:-BTCUSDT}"

# Verify keys
if [[ "$API_KEY" == "ta_cle_api_ici" ]] || [[ "$SECRET_KEY" == "ton_secret_ici" ]]; then
    echo "❌ Erreur : Modifie API_KEY et SECRET_KEY avec tes vraies clés testnet !" >&2
    exit 1
fi

# Timestamp in milliseconds
TIMESTAMP=$(date +%s000)
QUERY_PARAMS="symbol=${SYMBOL}&timestamp=${TIMESTAMP}&recvWindow=5000"
SIGNATURE=$(echo -n "$QUERY_PARAMS" | openssl dgst -sha256 -hmac "$SECRET_KEY" -binary | xxd -p -c 0)
FULL_URL="${BASE_URL}/api/v3/openOrders?${QUERY_PARAMS}&signature=${SIGNATURE}"

echo "📊 Récupération des open orders pour ${SYMBOL}..."

# Call Binance testnet API
RESPONSE=$(curl -s -H "X-MBX-APIKEY: ${API_KEY}" \
    --connect-timeout 10 \
    --max-time 30 \
    "${FULL_URL}")

# Check if there is an error
if echo "$RESPONSE" | grep -q '"code"'; then
    echo "❌ Erreur API : $RESPONSE" >&2
    exit 1
fi

# Process and display the orders
echo "$RESPONSE" | jq --arg symb "$SYMBOL" '
  # Filtrer seulement les LIMIT orders
  [.[]? | select(.type? == "LIMIT")] as $limits |
  
  if ($limits | length) == 0 then
    "✅ Aucune LIMIT order ouverte pour \($symb)"
  else
    "📋 \(($limits | length)) LIMIT order(s) ouverte(s) :", 
    $limits[] | {
      symbol: .symbol,
      side: .side,
      price: .price,
      qty: .origQty,
      filled: .executedQty,
      status: .status,
      time: (.time | tonumber / 1000 | strftime("%Y-%m-%d %H:%M:%S"))
    }
  end
'

```

Exécuter: `./check_orders.sh BTCUSDT`

<br/>

Je peux maintenant lister les prix avec de bonnes perf et exécuter des trades sur le mainnet et le testnet de Binance. Je vais maintenant pouvoir créer des screeners et quelques stratégies simples en Rust avec des ordres d'achat et vente par palier. Je vais mettre en place de l'alerting (notif OSX et telegram) et du reporting (TUI).

Je passerai ensuite aux étapes suivantes:
- Connecter le projet à l'API demo de Binance
- Accéder à mon portefeuille sur Binance demo & testnet
- A très court terme, créer une stratégie sur un exchange "sniper de liquidité"
- Créer une stratégie d'arbitrage triangulaire sur un exchange
- Créer une stratégie de funding rate sur perp & spot sur un exchange
- Créer des stratégies simple sur 2 exchanges (par exemple: arbitrage simple sur marché spot ou funding rate).
- Tester la partie Python pour tester des stratégies plus complexes + Backtesting
- Accéder en python à l'API testnet de Binance
- Créer des stratégies sur plus de 2 exchanges
- Et pleins d'autres...

