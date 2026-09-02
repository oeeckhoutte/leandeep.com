# Afficher les spreads des produits dérivés dans Tradingview

- Canonical URL: https://leandeep.com/afficher-les-spreads-des-produits-d%C3%A9riv%C3%A9s-dans-tradingview/
- Author: Olivier Eeckhoutte
- Published: 2021-11-24T19:49:00+02:00
- Updated: 2021-11-24T19:49:00+02:00
- Language: fr
- Tags: AlgoTrading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Aujourd'hui j'écris mon premier article sur le trading. J'avais déjà écrit un article sur la finance en parlant d'un outil que j'avais construit pour suivre les mouvements des fonds d'investissement via le RPA (Robotic Process Automation) mais jamais sur le trading.

Nous allons voir comment afficher les spreads dans Tradingview en construisant son propre indicateur EMA (Exponential Moving Average) sur 13 périodes. Voici la démarche à suivre à travers cette vidéo.


    <iframe 
        width="100%" 
        height="400px"
        src="//www.youtube.com/embed/-FU0M0X0-fk?autoplay=1&mute=1" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>



<br/>

> **A quoi servent les spreads ?**
> <br/>
> Les spreads des produits dérivés nous permettent de déterminer si on peut poser un bottom ou non. Lorsque le contrat d'un produit dérivé sur un exchange s'échange à un prix plus faible qu'un contrat spot, le sentiment de marché est baissier. En d'autres termes, lorsque les spreads sont négatifs c'est que les gens sont en train de shorter le marché. 
> Donc si la majorité des gens vendent leurs actifs, les gros portefeuilles (whales) vont très certainement les racheter et donc le marché va se retourner. Et pour suivre la tendance, les gens devront acheter plus haut ce qui fera augmenter le cours.

