# Exécuter des commandes et des scripts en passant par Tor

- Canonical URL: https://leandeep.com/ex%C3%A9cuter-des-commandes-et-des-scripts-en-passant-par-tor/
- Author: Olivier Eeckhoutte
- Published: 2014-07-17T19:54:00Z
- Updated: 2014-07-17T19:54:00Z
- Language: fr
- Tags: Unix Tip, tips, Security
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Introduction
Parfois il peut être utile d'obtenir une adresse IP différente de la sienne pour tester son travail dans un autre pays.

Pour exécuter une commande et passer par Tor, il est possible d'utiliser cette procédure:

<br/>

## Installation

```
brew install tor torsocks
```

<br/>

## Exécution

Dans un premier onglet de votre terminal lancez tor:
```
tor
```

<br/>

Dans un second onglet exécutez la commande que vous souhaitez "torifier":
```
torsocks -i wget -qO- http://ipecho.net/plain 2> /dev/null ; echo 
```

<br/>

Si vous relancez la même commande sans passer par tor:
```
wget -qO- http://ipecho.net/plain ; echo 
```

<br/>

Vous verrez une autre IP. Ce sera en effet celle de votre propre box internet. La première commande est donc bien passée par Tor. Vous pouvez utiliser cette astuce pour à peu près tout. Attention, n'utilisez pas cela à des fins malveillantes; vous êtes $$responsables de vos actes.

