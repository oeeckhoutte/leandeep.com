# Retourner un dataframe OHLCV des tickers Binance à partir de CCTX

- Canonical URL: https://leandeep.com/retourner-un-dataframe-ohlcv-des-tickers-binance-%C3%A0-partir-de-cctx/
- Author: Olivier Eeckhoutte
- Published: 2023-01-14T07:00:00+02:00
- Updated: 2023-01-14T07:00:00+02:00
- Language: fr
- Tags: Python_tips, tips, AlgoTrading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Petit tip du jour de minutes. Voici comment convertir les données OHLCV de Binance obtenues grâce à CCTX en dataframe.


```
import ccxt
import calendar
from datetime import datetime
import pandas as pd
import numpy as np
from typing import List

binance = ccxt.binance()


def min_ohlcv(dt: datetime, pair: str, limit: int) -> list:
    # UTC native object
    since = calendar.timegm(dt.utctimetuple()) * 1000
    ohlcv1 = binance.fetch_ohlcv(
        symbol=pair, timeframe="1m", since=since, limit=limit
    )
    ohlcv2 = binance.fetch_ohlcv(
        symbol=pair, timeframe="1m", since=since, limit=limit
    )
    ohlcv = ohlcv1 + ohlcv2
    return ohlcv


def ohlcv(dt: List[str], pair: str, period: str = "1d") -> pd.DataFrame:
    ohlcv = []
    limit = 1000
    if period == "1m":
        limit = 720
    elif period == "1d":
        limit = 365
    elif period == "1h":
        limit = 24
    elif period == "5m":
        limit = 288
    for i in dt:
        start_dt = datetime.strptime(i, "%Y%m%d")
        since = calendar.timegm(start_dt.utctimetuple()) * 1000
        if period == "1m":
            ohlcv.extend(min_ohlcv(start_dt, pair, limit))
        else:
            ohlcv.extend(
                binance.fetch_ohlcv(
                    symbol=pair, timeframe=period, since=since, limit=limit
                )
            )
    df = pd.DataFrame(
        ohlcv,
        columns=["Date", "Open", "High", "Low", "Close", "Volume"],
    )
    df["Date"] = [
        datetime.fromtimestamp(float(time) / 1000) for time in df["Date"]
    ]
    df["Open"] = df["Open"].astype(np.float64)
    df["High"] = df["High"].astype(np.float64)
    df["Low"] = df["Low"].astype(np.float64)
    df["Close"] = df["Close"].astype(np.float64)
    df["Volume"] = df["Volume"].astype(np.float64)
    df.set_index("Date", inplace=True)
    return df


dt = ["20190101", "20200101"]
df = ohlcv(dt, "BTC/USDT", "1m")
print(df.head())
```


<br/>

Résultat:

```
                        Open     High      Low    Close     Volume
Date
2019-01-01 01:00:00  3701.23  3703.72  3701.09  3702.46  17.100110
2019-01-01 01:01:00  3702.44  3702.63  3695.66  3697.04  23.700604
2019-01-01 01:02:00  3699.42  3702.04  3696.08  3698.14  14.488615
2019-01-01 01:03:00  3697.49  3698.19  3695.97  3696.51   8.499966
2019-01-01 01:04:00  3697.20  3697.62  3695.00  3696.32  21.782886
```
