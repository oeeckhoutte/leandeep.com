# Créer des NFTs sur Ethereum

- Canonical URL: https://leandeep.com/cr%C3%A9er-des-nfts-sur-ethereum/
- Author: Olivier Eeckhoutte
- Published: 2021-06-11T15:25:00Z
- Updated: 2021-06-11T15:25:00Z
- Language: fr
- Tags: Ethereum, Python, Blockchain, NFT, Brownie
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article, nous allons voir comment créer des NFT sur Ethereum en utilisant le projet Python Brownie. L'ensemble du tutorial a été réalisé avec Python 3.8. NodeJS sera également nécessaire pour installer Ganache. Dans cet article, j'ai utilisé la v10.23.3 ainsi qu'NPM 6.14.11.

<br/>

## Qu'est-ce que Brownie ?

Similaire au framework Truffle, Brownie permet de développer, tester et déployer des Smart Contracts. A la différence de Truffle, il est écrit en Python 3. De ce que j'ai pu voir, il est un peu plus complet que Truffle en terme de tooling (en qu'il y a des plugins) et peut fonctionner aussi avec Vyper qui permet d'écrire des Smart Contracts en Python typé façon Mypy. 

En résumé il peut faire ceci:
* Programmer des smart contract dans différents langages: Solidity ou Vyper
* "Builder" des contracts
* Tester les smart contracts avec Pytest
* Intéragir avec les contracts
* Il y a des scripts pour intéragir avec les smart contracts
* If offre des templates de smart contract
* Intégration avec Ganache
 
Source du projet: https://github.com/eth-brownie/brownie

<br/>

## Pré-requis

Installer le package Brownie et Ganache
```
pip install eth-brownie
# Installed version 1.14.6

npm install -g ganache-cli
# Installed version 6.12.2
```

<br/>

Posséder des ETH sur Rinkeby.

> Si vous n'en avez pas, ces Faucets sont à disposition:
> * Testnet ETH: https://faucet.rinkeby.io/
 

<br/>

## Configuration

Créer un fichier `.env` contenant les variables d'environnement de votre projet.  Pour la PRIVATE_KEY utilisez un compte sur Rinkeby (https://rinkeby.etherscan.io) qui possède des ETH. 

```
export PRIVATE_KEY=blablabla
export WEB3_INFURA_PROJECT_ID=blablabla
export ETHERSCAN_TOKEN=blablabla
```

Ensuite sourcer votre fichier `source .env`.

<br/>

## Développement

Partez d'un boilerplate. Dans un terminal exécuter la commande:
```
brownie bake nft-mix
cd nft
```

> **VSCode autocompletion Workaround**
> <br/>
> Pour éditer le smart contract `./contract/SimpleCollectible.sol`, je vous recommande d'importer la package npm `npm i openzeppelin-solidity@3.4.0`, de configurer VSCode pour avoir l'autocompletion et de temporairement changer le path du module importé.
> <br/>
> <br/>
> Ajouter les lignes suivantes dans `.vscode/settings.json`:
> ```
> ...
> "solidity.packageDefaultDependenciesContractsDirectory": "",
> "solidity.packageDefaultDependenciesDirectory": "node_modules"
> }
> ```
> <br/>
> Changer ensuite l'import du package Solidity (je n'ai pas encore trouvé comment dire VSCode d'interprêter le fichier `brownie-config.yaml`).
> ```
> import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol"; // New line added for VSCode
> import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
> ```
> <br/>
> Ce n'est pas idéal pour la compilation. Mais on peut très facilement contourner ce problème avec un simple `Makefile` et exécuter un `make compile` lorsqu'on veut faire un `brownie compile`. Il suffit de renommer le dossier `contracts` en `contracts_source` et d'avoir la commande suivante dans son `Makefile`: `rm -r contracts && cp -R contracts_source contracts && sed -i '' '/\/\/dev$/d' ./contracts/*.sol && brownie compile`
> <br/>
> Et voilà, au moins j'ai accès à toutes les `docstrings` et définitions et je suis efficace.

<br/>

## Déployer la NFT factory

Exécuter les commandes suivantes:
```
brownie run scripts/simple_collectible/deploy_simple.py --network rinkeby
# Une fois la vérification passée "Verification complete. Result: Pass - Verified":
brownie run scripts/simple_collectible/create_collectible.py --network rinkeby
```

<br/>

## Visualisation du déploiement 

![image](/images/nft-sur-opensea.png)

https://testnets.opensea.io/assets/0xE62800C18D25AA2742d4e9d4dA2a9B18b19B5552/4

<br/>

## Fonctionnement

OpenSea est une plateforme "non-custodial". Les NFTs des utilisateurs ne sont pas sur OpenSea. Les NFTs vivent sur une adresse ETH et les wallets (comme MetaMask) permettent de les manipuler.

Dans le détail:

Les NFT sont comme des peintures. Votre adresse Ethereum est une galerie dont vous être le propriétaire. Metamask est un conservateur de galerie qu'on peut utiliser pour déplacer les peintures. OpenSea est une fenêtre donnant sur votre galerie.

On peut embaucher un autre conservateur de galerie en changeant de Wallet. Le NFT/la peinture n'a pas à sortir de votre galerie et vous pouvez toujours le/la voir à travers la fenêtre OpenSea. Rien ne change vraiment, sauf la façon dont vous interagissez avec l'élément.

On peut utiliser une autre fenêtre pour votre votre NFT/peinture comme Rarible or Mintable. Le NFT/la peinture ne bouge pas et la "galerie" (votre adresse ETH) ne change pas.

La vente ou le transfert du NFT/ de la peinture le/la déplace vers une autre adresse ETH (galerie). OpenSea et d'autres plates-formes peuvent afficher n'importe quel NFT en ouvrant simplement une autre fenêtre, rien n'a à être fait par le propriétaire.

