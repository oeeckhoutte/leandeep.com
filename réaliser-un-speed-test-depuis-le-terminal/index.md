# Réaliser un speed test depuis le terminal

- Canonical URL: https://leandeep.com/r%C3%A9aliser-un-speed-test-depuis-le-terminal/
- Author: Olivier Eeckhoutte
- Published: 2021-10-10T15:25:00Z
- Updated: 2021-10-10T15:25:00Z
- Language: fr
- Tags: Ubuntu, Linux, unix_tips, tips
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


J'ai eu besoin de mettre en place un traffic shaper sur mon Firewall pour ne pas qu'un de mes noeuds Ethereum consomme toute la bande passante de mon réseau. Je voulais limiter la bande passante en semaine de 8h30 à 19h. Une fois tout cela mis en place, il m'a fallu tester si tout était bien configuré. Si vous avez besoin de réaliser un speed test depuis un serveur headless, vous pouvez suivre ce tip.

<br/>

## Pré-requis

```
curl -s https://install.speedtest.net/app/cli/install.deb.sh | sudo bash
sudo apt-get install speedtest
```

<br/>

## Exécution du speedtest

Ouvrir un terminal et simplement exécutez la commande `speedtest`. 
