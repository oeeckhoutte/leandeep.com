# Créer un dataset avec les données Binance OHLCV pour réaliser des backtests

- Canonical URL: https://leandeep.com/cr%C3%A9er-un-dataset-avec-les-donn%C3%A9es-binance-ohlcv-pour-r%C3%A9aliser-des-backtests/
- Author: Olivier Eeckhoutte
- Published: 2023-01-27T10:49:00+02:00
- Updated: 2023-01-27T10:49:00+02:00
- Language: fr
- Tags: Backtesting, Backtest, Binance, OHLCV, Pandas, Dataset, tips, AlgoTrading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Sans utiliser la librairie CCTX dont j'ai parlé [dans l'article](https://leandeep.com/retourner-un-dataframe-ohlcv-des-tickers-binance-à-partir-de-cctx/), voici comment récupérer directement les données OHLCV depuis l'API de Binance:

```
import requests
import datetime
import pandas as pd
import numpy as np

start_date = "2022-01-01"
end_date = "2022-01-31"
interval = "1m"
symbol = "BTCUSDT"


def get_binance_data(
    ticker: str,
    interval: str = "4h",
    limit: int = 500,
    start: str = "2018-01-01 00:00:00",
) -> pd.DataFrame:
    """Get X (limit) OHLCV entries from Binance"""
    columns = [
        "open_time",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "close_time",
        "qav",
        "num_trades",
        "taker_base_vol",
        "taker_quote_vol",
        "ignore",
    ]
    start = int(datetime.datetime.timestamp(pd.to_datetime(start)) * 1000)
    base_url = "https://www.binance.com/api/v3/klines"
    query_params = (
        f"?symbol={ticker}&interval={interval}&limit={limit}&startTime={start}"
    )
    url = base_url + query_params
    data = pd.DataFrame(
        requests.get(url).json(), columns=columns, dtype=np.float
    )
    data.index = [
        pd.to_datetime(x, unit="ms").strftime("%Y-%m-%d %H:%M:%S")
        for x in data.open_time
    ]
    use_cols = [
        "open",
        "high",
        "low",
        "close",
        "volume",
        "qav",
        "num_trades",
        "taker_base_vol",
        "taker_quote_vol",
    ]
    data = data[use_cols]
    return data


if __name__ == "__main__":
    df = get_binance_data("BTCUSDT", "1m")
    print(df.head())
```

<br/>
Résultat:

```
                         open      high       low  ...  num_trades  taker_base_vol  taker_quote_vol
2017-12-31 23:00:00  13829.97  13829.99  13804.29  ...        44.0        1.164005     16097.885201
2017-12-31 23:01:00  13829.97  13829.97  13788.86  ...        57.0        2.079160     28704.375784
2017-12-31 23:02:00  13788.88  13804.27  13784.61  ...        57.0        1.619601     22352.031033
2017-12-31 23:03:00  13799.98  13799.98  13777.59  ...        71.0        3.725320     51357.627303
2017-12-31 23:04:00  13788.83  13788.83  13700.01  ...        91.0        2.388566     32905.122453
```
