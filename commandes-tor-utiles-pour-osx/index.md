# Commandes Tor utiles pour OSX

- Canonical URL: https://leandeep.com/commandes-tor-utiles-pour-osx/
- Author: Olivier Eeckhoutte
- Published: 2022-05-03T21:25:00Z
- Updated: 2022-05-03T21:25:00Z
- Language: fr
- Tags: Tor, tips, Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



Voici quelques commandes utiles à ajouter à votre `.zshrc` pour vérifier que votre Mac est connecté ou non à Tor.


```
echo "# Tor alias" >> ~/.zshrc
echo "alias myip='curl -s https://api.ipify.org/'" >> ~/.zshrc
echo "alias myiplookup='ip2cc \$(curl -s https://api.ipify.org/)'" >> ~/.zshrc
echo "alias mytorip='curl -s --socks5 127.0.0.1:9050 https://api.ipify.org/'" >> ~/.zshrc
echo "alias mytoriplookup='ip2cc \$(curl -s --socks5 127.0.0.1:9050 https://api.ipify.org/)'" >> ~/.zshrc
echo "alias tor_on='sudo networksetup setsocksfirewallproxy \"Wi-Fi\" 127.0.0.1 9050 && tor'" >> ~/.zshrc
echo "alias tor_off='sudo networksetup setsocksfirewallproxystate \"Wi-Fi\" off && killall tor'" >> ~/.zshrc
source ~/.zshrc
```

