# Lister les nouveaux Exit Nodes sur Tor

- Canonical URL: https://leandeep.com/lister-les-nouveaux-exit-nodes-sur-tor/
- Author: Olivier Eeckhoutte
- Published: 2022-05-27T13:50:00Z
- Updated: 2022-05-27T13:50:00Z
- Language: fr
- Tags: tips, Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Si comme moi vous vous demandez à quelle fréquence des Exit Nodes sont ajoutés ou retirés du réseau Tor, alors vous aurez la réponse en exécutant le script suivant. Parfois prendre 5 minutes à écrire un script peut nous donner les réponses aux questions dont Google n'a pas la réponse. 

> * Python 3+<br/>
> * `pip install requests`

```
import requests
from datetime import datetime
from time import sleep

TOR_PROXIES_URI = "https://check.torproject.org/torbulkexitlist"

previous_ips = set()

while True:
    result = requests.get(TOR_PROXIES_URI).content
    results = result.decode("utf-8").split("\n")
    now = datetime.now()
    tmp_previous_ips = set()
    for ip in results:
        if not ip:
            continue
        tmp_previous_ips.add(ip)
        if ip not in previous_ips:
            print(f"NEW EXIT NODE DETECTED at {now}: {ip}")
    diff_stopped_exit_nodes = previous_ips - tmp_previous_ips
    if len(list(diff_stopped_exit_nodes)) > 0:
        print(f"FOLLOWING NODES STOPPED at {now}: {diff_stopped_exit_nodes}")
    previous_ips = tmp_previous_ips
    sleep(60)
    print(".")

```

<br/>
> * Lien intéressant pour détecter si on utilise Tor ou non: https://check.torproject.org/
> 
> * Pour spécifier un exit node sur OSX, éditer le fichier `vim ~/Library/Application\ Support/TorBrowser-Data/Tor/torrc` et ajouter la ligne suivante: `ExitNodes IP_NEW_NODE`.

<br/>

## Raccourci .zshrc 

```
update_ip_tor_browser ()
{
    content="
    ClientOnionAuthDir /Users/olivier/Library/Application Support/TorBrowser-Data/Tor/onion-auth
    DataDirectory /Users/olivier/Library/Application Support/TorBrowser-Data/Tor
    GeoIPFile /Applications/Tor Browser.app/Contents/Resources/TorBrowser/Tor/geoip
    GeoIPv6File /Applications/Tor Browser.app/Contents/Resources/TorBrowser/Tor/geoip6
    ExitNodes $1
    "
    echo $content > ~/Library/Application\ Support/TorBrowser-Data/Tor/torrc
    osascript -e 'quit app "Tor Browser"'
    open -a "Tor Browser"
}

reset_tor_browser ()
{
    content="
    ClientOnionAuthDir /Users/olivier/Library/Application Support/TorBrowser-Data/Tor/onion-auth
    DataDirectory /Users/olivier/Library/Application Support/TorBrowser-Data/Tor
    GeoIPFile /Applications/Tor Browser.app/Contents/Resources/TorBrowser/Tor/geoip
    GeoIPv6File /Applications/Tor Browser.app/Contents/Resources/TorBrowser/Tor/geoip6
    "
    echo $content > ~/Library/Application\ Support/TorBrowser-Data/Tor/torrc
    osascript -e 'quit app "Tor Browser"'
    open -a "Tor Browser"
}
```
