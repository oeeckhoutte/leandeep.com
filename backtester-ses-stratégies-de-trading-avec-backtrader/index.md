# Backtester ses stratégies de trading avec Backtrader

- Canonical URL: https://leandeep.com/backtester-ses-strat%C3%A9gies-de-trading-avec-backtrader/
- Author: Olivier Eeckhoutte
- Published: 2024-02-02T18:10:00Z
- Updated: 2024-02-02T18:10:00Z
- Language: fr
- Tags: Python, Backtesting, Backtrader, Trading, AlgoTrading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)




Voici un exemple de code Python permettant de backtester une stratégie (ici j'en ai créé une complètement inutile mais cela permet d'illustrer mon propose).

<br/>
**Pré-requis**

```
pip install Pyarrow==15.0.0 pandas==2.2.0 backtrader==1.9.78.123 matplotlib==3.8.2
```
<br/>

```
import math
import pandas as pd
import backtrader as bt
import ccxt

# Charger les données historiques depuis Binance
exchange = ccxt.binance(
    {
        "apiKey": "",
        "secret": "",
    }
)

symbol = "ETH/USDT"
timeframe = "1h"

ohlcv = exchange.fetch_ohlcv(symbol, timeframe)
df = pd.DataFrame(
    ohlcv, columns=["timestamp", "open", "high", "low", "close", "volume"]
)
df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
df.set_index("timestamp", inplace=True)


# Définir la stratégie
class MovingAverageCrossStrategy(bt.Strategy):
    params = (
        ("short_period", 20),
        ("long_period", 50),
    )

    def __init__(self):
        self.short_ma = bt.indicators.SimpleMovingAverage(
            self.data.close, period=self.params.short_period
        )
        self.long_ma = bt.indicators.SimpleMovingAverage(
            self.data.close, period=self.params.long_period
        )
        self.crossover = bt.indicators.CrossOver(self.short_ma, self.long_ma)

    def next(self):
        if self.crossover > 0:
            # Signal d'achat
            self.buy()
        elif self.crossover < 0:
            # Signal de vente
            self.sell()


# Convertir les données pandas en format compréhensible par backtrader
data = bt.feeds.PandasData(dataname=df)

# Configurer le cerveau du backtest
cerebro = bt.Cerebro()
cerebro.adddata(data)
cerebro.addstrategy(MovingAverageCrossStrategy)

# Ajouter un observer pour afficher les gains/pertes
cerebro.addobserver(bt.observers.Value)

# Paramètres du backtest
start_date = pd.to_datetime("2022-01-01")
end_date = pd.to_datetime("2022-12-31")
cerebro.run(stdstats=False, tradehistory=True, fromdate=start_date, todate=end_date)

# Afficher les gains/pertes
final_portfolio_value = cerebro.broker.getvalue()
print(f"Capital final: {final_portfolio_value} USDT")
cerebro.plot()
```

![image](/images/backtrader.png)

<br/>

**Stratégie Mean Reversion:**

```
# Définir la stratégie
class MeanReversionStrategy(bt.Strategy):
    params = (
        ('rsi_period', 14),
        ('rsi_overbought', 70),
        ('rsi_oversold', 30),
        ('bbands_period', 20),
        ('bbands_dev', 2),
    )

    def __init__(self):
        self.rsi = bt.indicators.RelativeStrengthIndex(period=self.params.rsi_period)
        self.bbands = bt.indicators.BollingerBands(period=self.params.bbands_period, devfactor=self.params.bbands_dev)

    def next(self):
        if self.rsi < self.params.rsi_oversold and self.data.close < self.bbands.lines.bot:
            # Conditions d'achat
            self.buy()

        elif self.rsi > self.params.rsi_overbought and self.data.close > self.bbands.lines.top:
            # Conditions de vente
            self.sell()
```

Dans cette stratégie, des signaux d'achat sont générés lorsque le RSI est en zone de survente et que le prix est en dessous de la bande inférieure de Bollinger. Des signaux de vente sont générés lorsque le RSI est en zone de surachat et que le prix est au-dessus de la bande supérieure de Bollinger.

![image](/images/backtrader2.png)

<br/>


**Stratégie Ichimoku:**

```
class Ichimoku(bt.Strategy):

    def __init__(self):

        self.ichimoku = bt.indicators.Ichimoku()
   
    def next(self):

         if not self.position and self.ichimoku.lines.senkou_span_a > self.ichimoku.lines.senkou_span_b: 
            amount_to_invest = (0.95 * self.broker.cash)
            self.size = math.floor(amount_to_invest / self.data.close)

            print("Buy {} shares at {}".format(self.size, self.data.close[0]))
            self.buy(size=self.size)

         if self.position and self.ichimoku.lines.senkou_span_a < self.ichimoku.lines.senkou_span_b:
            print("Sell {} shares at {}".format(self.size, self.data.close[0]))
            self.close()
```


Aucun paramètre spécifique n'est fourni à l'indicateur, ce qui signifie que les valeurs par défaut des périodes Ichimoku sont utilisées (9, 26, 52).

La fonction next est appelée à chaque barre de prix. La stratégie vérifie d'abord si elle n'a pas de position (not self.position) et si la ligne Senkou Span A est au-dessus de la ligne Senkou Span B. Si ces conditions sont remplies, cela signifie que la tendance est à la hausse, et un signal d'achat est généré.
En cas de signal d'achat, la stratégie calcule la quantité d'actions à acheter en fonction de 95% du capital disponible (0.95 * self.broker.cash) et achète ces actions en utilisant la fonction self.buy.
Ensuite, la stratégie vérifie si elle a déjà une position (self.position) et si la ligne Senkou Span A est en dessous de la ligne Senkou Span B. Si ces conditions sont remplies, cela signifie que la tendance est à la baisse, et un signal de vente est généré.
En cas de signal de vente, la stratégie ferme la position en utilisant la fonction self.close.

![image](/images/backtrader3.png)

<br/>


**Stratégie Aroon:**

La stratégie Aroon est basée sur l'utilisation des indicateurs Aroon, qui sont conçus pour mesurer la force de la tendance et identifier les périodes de consolidation ou de retournement de tendance sur un marché financier. Les indicateurs Aroon se composent de deux lignes principales : Aroon Up et Aroon Down.

Aroon Up (Aroon Haut) : Mesure le nombre de périodes écoulées depuis le plus haut récent.

Aroon Down (Aroon Bas) : Mesure le nombre de périodes écoulées depuis le plus bas récent.

La stratégie Aroon utilise ces deux indicateurs pour générer des signaux de trading. Voici comment interpréter les signaux Aroon dans une stratégie de base :

Signal d'Achat (Aroon Up fort) : Lorsque l'Aroon Up est élevé, cela indique que la tendance à la hausse est forte. Un signal d'achat est généré lorsque l'Aroon Up traverse à la hausse l'Aroon Down.

Signal de Vente (Aroon Down fort) : Lorsque l'Aroon Down est élevé, cela indique que la tendance à la baisse est forte. Un signal de vente est généré lorsque l'Aroon Down traverse à la hausse l'Aroon Up.

Période de Consolidation (Aroon Up et Aroon Down faibles) : Si les deux Aroon Up et Aroon Down sont faibles, cela indique une période de consolidation où le marché ne montre pas de tendance claire. Certains traders choisissent d'éviter de prendre des positions pendant ces périodes.

```
class AroonStrategy(bt.Strategy):

    params = (("upperband", 99), ("lowerband", -99), ("order_percentage", 0.95))

    def __init__(self):
        self.Aroon = bt.indicators.AroonOscillator(self.data, period=14)

    def next(self):
        if not self.position and self.Aroon < self.params.lowerband:
            amount_to_invest = self.params.order_percentage * self.broker.cash
            self.size = math.floor(amount_to_invest / self.data.close)

            print("Buy {} shares  at {}".format(self.size, self.data.close[0]))
            self.buy(size=self.size)

        if self.position and self.Aroon > self.params.upperband:
            print("Sell {} shares  at {}".format(self.size, self.data.close[0]))
            self.close()
```

![image](/images/backtrader4.png)


<br/>


**Stratégie Buy and Hold:**


```
class BuyHoldStrategy(bt.Strategy):

    def next(self):
        if self.position.size == 0:
            amount_to_invest = 0.95 * self.broker.getcash()
            size = math.floor(amount_to_invest / self.data)
            print("Buy {} shares at {}".format(size, self.data.close[0]))
            self.buy(size=size)
```


<br/>


**Stratégie Golden cross:**


La stratégie Golden Cross est une approche de trading basée sur l'identification d'un signal lorsque deux moyennes mobiles se croisent à la hausse. C'est une stratégie populaire dans l'analyse technique et est souvent utilisée pour repérer des changements potentiels dans la tendance d'un actif financier.

Voici comment fonctionne la stratégie Golden Cross:

1. Moyenne Mobile à Court Terme (Short-Term Moving Average):

Une moyenne mobile à court terme est calculée en prenant la moyenne des prix de clôture sur une période relativement courte.
Cette moyenne mobile réagit plus rapidement aux fluctuations des prix.

<br/>

2. Moyenne Mobile à Long Terme (Long-Term Moving Average):

Une moyenne mobile à long terme est calculée de manière similaire, mais sur une période plus longue.
Cette moyenne mobile réagit plus lentement aux changements de prix.

<br/>

3. Signal d'Achat - Golden Cross:

Un signal d'achat est généré lorsque la moyenne mobile à court terme (plus rapide) croise à la hausse la moyenne mobile à long terme (plus lente). Ce point de croisement est souvent appelé un "Golden Cross" (croix dorée).
Le Golden Cross indique un potentiel changement dans la dynamique du marché, suggérant que la tendance pourrait passer d'une tendance baissière à une tendance haussière.

<br/>

4. Signal de Vente - Death Cross:

À l'inverse, un signal de vente, souvent appelé "Death Cross" (croix de la mort), se produit lorsque la moyenne mobile à court terme croise à la baisse la moyenne mobile à long terme. Cela peut indiquer un potentiel changement de tendance à la baisse.
La stratégie Golden Cross est souvent utilisée comme indicateur de confirmation de tendance. Cependant, il est important de noter que les signaux générés par cette stratégie peuvent parfois être retardés, et il existe des périodes où ils peuvent être trompeurs, surtout dans des marchés instables.

```
class GoldenCrossStrategy(bt.Strategy):
    params = (('sma_50', 50), ('sma_200', 200), ('order_percentage', 0.95))

    def __init__(self):
        # Create 50 SMA
        self.sma_moving_average_50 = bt.indicators.SMA(
            self.data.close, period=self.params.sma_50, plotname='50 day moving average'
        )

        # Create 200 SMA
        self.sma_moving_average_200 = bt.indicators.SMA(
            self.data.close, period=self.params.sma_200, plotname='200 day moving average'
        )

        # Create crossover using the SMA's
        self.crossover = bt.indicators.CrossOver(self.sma_moving_average_50, self.sma_moving_average_200)

    def next(self):

        # Open trade
        if self.position.size == 0:
            if self.crossover > 0:
                amount_to_invest = (self.params.order_percentage * self.broker.cash)
                self.size = math.floor(amount_to_invest / self.data.close)

                print("Buy {} shares at {}".format(self.size, self.data.close[0]))
                self.buy(size=self.size)
        
        # Close trade
        if self.position.size > 0:
            if self.crossover < 0:      
                print("Sell {} shares at {}".format(self.size, self.data.close[0]))
                self.close()
```

![image](/images/backtrader5.png)

<br/>

**EMA Stratégie:**

```
class EMAStrategy(bt.Strategy):
    params = (
        ("short_period", 20),
        ("long_period", 50),
    )

    def __init__(self):
        self.short_ema = bt.indicators.ExponentialMovingAverage(
            self.data.close, period=self.params.short_period
        )
        self.long_ema = bt.indicators.ExponentialMovingAverage(
            self.data.close, period=self.params.long_period
        )

    def next(self):
        if self.short_ema > self.long_ema:
            # Condition d'achat pour la stratégie EMA
            self.buy()

        elif self.short_ema < self.long_ema:
            # Condition de vente pour la stratégie EMA
            self.sell()

```

![image](/images/backtrader6.png)

<br/>

**SMA Stratégie:**

```
class SMAStrategy(bt.Strategy):

    def __init__(self):
        self.sma = bt.indicators.SMA()

    def next(self):
        if not self.position and self.data > self.sma.lines.sma: 
           amount_to_invest = (0.95 * self.broker.cash)
           self.size = math.floor(amount_to_invest / self.data.close)

           print("Buy {} shares at {}".format(self.size, self.data.close[0]))
           self.buy(size=self.size)

        if self.position and self.data < self.sma.lines.sma:
                print("Sell {} shares at {}".format(self.size, self.data.close[0]))
                self.close()
```

![image](/images/backtrader7.png)

<br/>

**Stratégie RMI:**

```
class RMI(bt.Strategy):
    
    params = (('upperband', 70.0), ('lowerband', 30.0), ('order_percentage', 0.95))

    def __init__(self):
        self.rmi = bt.indicators.RMI(self.data, period=20)

    def next(self):
        if not self.position and self.rmi < self.params.lowerband: 
           amount_to_invest = (self.params.order_percentage * self.broker.cash)
           self.size = math.floor(amount_to_invest / self.data.close)

           print("Buy {} shares at {}".format(self.size, self.data.close[0]))
           self.buy(size=self.size)

        if self.position and self.rmi > self.params.upperband:
                print("Sell {} shares at {}".format(self.size, self.data.close[0]))
                self.close()
```


![image](/images/backtrader8.png)

<br/>

**Stratégie RSI:**

```
class RSIStrategy(bt.Strategy):

    params = (("upperband", 85), ("lowerband", 25), ("order_percentage", 0.95))

    def __init__(self):
        self.rsi = bt.indicators.RSI(self.data, period=14)

    def next(self):
        if not self.position and self.rsi < self.params.lowerband:
            amount_to_invest = self.params.order_percentage * self.broker.cash
            self.size = math.floor(amount_to_invest / self.data.close)

            print("Buy {} shares at {}".format(self.size, self.data.close[0]))
            self.buy(size=self.size)

        if self.position and self.rsi > self.params.upperband:
            print("Sell {} shares at {}".format(self.size, self.data.close[0]))
            self.close()

```

![image](/images/backtrader9.png)

<br/>

**Stratégie MACD:**

```
class MACDStrategy(bt.Strategy):

    params = (('ema_12', 12), ('ema_26', 26), ('order_percentage', 0.95))

    def __init__(self):     
        self.fast_ema_12 = bt.indicators.EMA(
            self.data.close, period = self.params.ema_12, plotname = '12 day EMA'
        )

        self.slow_ema_26 = bt.indicators.EMA(
            self.data.close, period = self.params.ema_26, plotname = '26 day EMA'
        )

        self.macd = bt.indicators.MACDHistogram(self.fast_ema_12, self.slow_ema_26)

    def next (self):
        if not self.position and self.macd > 0:
            amount_to_invest = (self.params.order_percentage * self.broker.cash)
            self.size = math.floor(amount_to_invest / self.data.close)

            print("Buy {} shares at {}".format(self.size, self.data.close[0]))
            self.buy(size=self.size)

        if self.position and self.macd < 0:
             print("Sell {} shares at {}".format(self.size, self.data.close[0]))
             self.close()
```

![image](/images/backtrader10.png)


<br/>

Et voilà, vous voyez à quel point il est simple de coder des stratégies. Maintenant il ne vous reste plus qu'à être inventif pour créer une stratégie qui vous rapportera de l'argent. Au moins vous avez un outil pour vérifier qu'elle pourrait fonctionner (je dis bien pourrait car le passé ne présage pas le futur)... Je ne suis pas conseiller financier. Je ne recommande pas ces stratégies qui vous aurait fait perdre de l'argent en 2022. Faites vos recherches.

