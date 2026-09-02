# Afficher les 500 dernières bougies d'une paire crypto de Binance

- Canonical URL: https://leandeep.com/afficher-les-500-derni%C3%A8res-bougies-dune-paire-crypto-de-binance/
- Author: Olivier Eeckhoutte
- Published: 2023-01-05T07:00:00+02:00
- Updated: 2023-01-05T07:00:00+02:00
- Language: fr
- Tags: python_tips, tips, AlgoTrading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petit tip du jour. Voici comment afficher, en moins 2 minutes, l'évolution du cours d'une paire crypto présente sur Binance.

Installer les packages `cctx` et `plotly` puis créer un fichier contenant le code suivant:

```
import ccxt
from datetime import datetime
import plotly.graph_objects as go


def run():
    binance = ccxt.binance()
    trading_pair = "BTC/USDT"
    candles = binance.fetch_ohlcv(trading_pair, "1d")

    dates = []
    open_data = []
    high_data = []
    low_data = []
    close_data = []

    for candle in candles:
        dates.append(
            datetime.fromtimestamp(candle[0] / 1000.0).strftime(
                "%Y-%m-%d %H:%M:%S.%f"
            )
        )
        open_data.append(candle[1])
        high_data.append(candle[2])
        low_data.append(candle[3])
        close_data.append(candle[4])

    fig = go.Figure(
        data=[
            go.Candlestick(
                x=dates,
                open=open_data,
                high=high_data,
                low=low_data,
                close=close_data,
            )
        ]
    )
    fig.show()


if __name__ == "__main__":
    run()

```

<br/>

Résultat:
![image](/images/plotly-btc-usdt.png)
