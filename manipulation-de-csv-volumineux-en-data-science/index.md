# Manipulation de CSV volumineux en Data Science 

- Canonical URL: https://leandeep.com/manipulation-de-csv-volumineux-en-data-science/
- Author: Olivier Eeckhoutte
- Published: 2019-02-08T11:41:00Z
- Updated: 2019-02-08T11:41:00Z
- Language: fr
- Tags: Data Science, Unix Tip, Python, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)

Il existe de nombreuses librairies en Python pour manipuler des fichiers CSV. Je recommande l'usage des langages de haut niveau comme Python le plus possible car cela permet d'automatiser, *"d'APIser"* et d'industrialiser au maximum ses use cases. Mais parfois lorsqu'il faut tailler dans la masse sur des fichiers extrèmement volumineux, rien de tel que les bonnes vieilles méthodes de DevOps :) .

`AWK` à la rescousse pour par exemple extraire toutes les entreprises situées dans le Nord sur un fichier de plusieurs GB.

```
awk -F ";" '$21~/^"(59)([0-9]{3})"$/' mon_fichier_volumineux.csv >> companies_nord.csv
```

> Note: On peut aussi passer par un Dataframe Pandas et lire le fichier CSV par *chunks* avec ceci `pd.read_csv(csv_url,chunksize=500)` mais c'est quand même beaucoup plus long et lourd... 
> Je dirais que cela dépend du use case dans lequel on se trouve. Dans mon cas, générer ce fichier est du one-shot...

