# Protéger votre site internet/ web app du scraping

- Canonical URL: https://leandeep.com/prot%C3%A9ger-votre-site-internet/-web-app-du-scraping/
- Author: Olivier Eeckhoutte
- Published: 2022-05-28T09:45:00Z
- Updated: 2022-05-28T09:45:00Z
- Language: fr
- Tags: Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Si vous avez besoin de protéger vos précieuses données, sécuriser votre API ne suffit pas. Il faut aussi protéger votre front du scraping sans quoi un hacker peut récupérer toutes vos données. Pour un hacker, c'est un peu plus long qu'attaquer une API mais pour une personne expérimentée, cela peut aller très vite. Dans cet article succinct, nous allons voir brièvement des techniques utilisées pour scraper des données. Il est important de les connaître pour mieux protéger son site internet. Il est abérrant de voir que certains business lancés sur internet n'ont absolument rien fait pour se protéger. Pourtant si un dump de leurs données se retrouvait sur internet ils pourraient tout de suite fermer boutique...

<br/>

## Filtrage IP

Possibilité de passer sous le radar des API gateway avec des nouvelles IPs. 

**Proxy Anonyme via Tor**

> Avantage: Rapidité de mise en oeuvre<br/>
> Inconvénient: Range d'IPs connu

Example d'usage sur OSX avec Python 3:

```
pip insall requests
brew install tor
tor

ou 

brew services start tor
```

<br/>

Dans un programme Python:

```
import requests

proxies = {
    'http': 'socks5://127.0.0.1:9050',
    'https': 'socks5://127.0.0.1:9050'
}

req = requests.Session()
url = ""
req.get(url, proxies=proxies)
```

<br/>

ou 
<br/>

```
# pip install requests
# pip install pysocks

import requests

proxies = {
  "http": "socks5://127.0.0.1:9050",
  "https": "socks5://127.0.0.1:9050",
}

req = requests.Session()
url = "http://jsonip.com"
response = req.get(url, proxies=proxies)
ip = response.json()['ip']
print('Your public IP is:', ip)
```

<br/>

**Proxies en tout genre**

Utiliser des proxies publiques à la place de Tor.
Scraping totalement indétectable si le proxy change très régulièrement.
Par exemple, des failles XSS ou botnet (TDL4 rootkit de 2011 https://www.youtube.com/watch?v=k3g5gNcHoFM) sont exploitées...


<br/>

> Etant donné que l'on parle de proxy, sécurité et Python dans cet article, j'en profite pour vous indiquer quelques références que je recommende pour apprendre la sécurité avec Python.

![image](/images/python-black-hat.png)
![image](/images/rootkits-and-bootkits.png)
![image](/images/malware-data-science.png)
![image](/images/python-hacking.png)
![image](/images/gray-hat-python.png)
![image](/images/malware-analysis.png)
![image](/images/violent-python.png)

Et enfin, cette référence pour avoir un point de vue plus entreprise.

![image](/images/blue-team.png)

<br/>

## Browser headless type Selenium

Il existe pas mal de solutions concurrentes.
Selenium fontionne très bien. [RPA python](https://github.com/tebelorg/RPA-Python) fonctionne également très bien et il permet de mieux intéragir avec le desktop.
Selenium conjugé à `fake_useragent`, des tailles d'écran différentes et le plugin `browsermob-proxy` permet de récupérer à peu près tout ce qu'on veut. Il n'est pas forcément nécessaire de contourner le filtrage IP ou plus généralement les quota limits car malheureusement rarement mis en place.

> `rpa` a le mérite d'être excessivement simple à boostraper. <br/>Un simple `pip install rpa` et un minuscule script comme ci-dessous permet de d'ouvrir un browser sur une URL donnée.
> ```
> url = "https://..."
> r.init(
>    visual_automation=True,
>    chrome_browser=True,
>    headless_mode=False,
>    turbo_mode=False,
> )
> r.url(url)
> # r.click('//a[normalize-space()="Inventaire complet"]') 
> r.wait(10)
> r.close()
> ```
> Pour les XPATHs utiliser l'extensions [SelectorsHUB](https://chrome.google.com/webstore/detail/selectorshub/ndgimibanhlabgdgjcpbbndiehljcpfh?hl=en)

<br/>

## Captcha

Malheureusement ils se contournent. 

<br/>

Exemple de resources:

* https://2captcha.com/api-2captcha

* https://2captcha.com/newapi-recaptcha-en

* https://pixodrom.com/

* https://www.9kw.eu/plugins.html

* https://www.ghstools.fr/api_captcha.php

* http://caca.zoy.org/wiki/PWNtcha
