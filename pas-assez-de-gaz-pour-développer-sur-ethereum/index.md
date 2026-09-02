# Pas assez de gaz pour développer sur Ethereum

- Canonical URL: https://leandeep.com/pas-assez-de-gaz-pour-d%C3%A9velopper-sur-ethereum/
- Author: Olivier Eeckhoutte
- Published: 2021-09-06T08:08:00Z
- Updated: 2021-09-06T08:08:00Z
- Language: fr
- Tags: Dev, Ethereum, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



## Introduction 

Voici un tip pour éviter de devoir attendre 24h avant de pouvoir réclamer des Keth via les Faucets de Kovan. Sans cela, et lorsque vous avez brulé tout votre capital à force de tester sans cesse votre code, c'est très compliqué d'avancer et d'achever le développement de son smart contract Solidity (ou dApps web3). On perd du temps alors qu'on n'est même pas en prod...

Ce tip permet de s'affranchir temporairement de l'erreur suivante:
`{'code': -32010, 'message': 'Insufficient funds. The account you tried to send transaction from does not have enough funds. Required 26000000000000000 and got: 18781271414646593.'}`

> Les faucets que j'utilise sur Kovan (tous fonctionnels au 06 sept 2021):
> * https://faucets.blockxlabs.com/
> * https://gitter.im/kovan-testnet/faucet
> * https://ethdrop.dev/
> * https://app.mycrypto.com/faucet 

<br/>

## Pré-requis

```
npm install ganache-cli -g
```

<br/>

## Fork du réseau Ethereum

**Option 1: Ganache**
```
ganache-cli --fork https://kovan.poa.network -u 0x1F9815741F47A73277964d0631e9Fc1dbB0f7342 --seed "firm prevent scrap curtain kid bamboo olympic convince muffin inquiry segment sunny" -i [--secure] [--debug  ]

# Liste des options ici: https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/
```

> Cela fonctionne également avec le Mainnet.

Un serveur local va écouter sur le port 8545 et ce sera un fork du réseau kovan. Seulement les 64 derniers blocks depuis le latest block seront accessibles.

10 accounts de 100 Eth chacun vont être créés. Les adresses et leurs clés privées seront visibles dans les logs. Dans la commande précédente, je passe un *seed* pour toujours avoir les mêmes adresses et private keys

<br/>

**Option 2: Hardhat**

```
npm install --save-dev hardhat
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/...
```

<br/>

C'est aussi simple que cela et vous pourrez achever vos devs... 

