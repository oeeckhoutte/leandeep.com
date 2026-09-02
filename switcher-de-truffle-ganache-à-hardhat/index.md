# Switcher de Truffle Ganache à Hardhat

- Canonical URL: https://leandeep.com/switcher-de-truffle-ganache-%C3%A0-hardhat/
- Author: Olivier Eeckhoutte
- Published: 2021-09-07T08:08:00Z
- Updated: 2021-09-07T08:08:00Z
- Language: fr
- Tags: Dev, Ethereum, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



## Introduction 

Dans cet article nous allons voir comment utiliser Hardhat pour démarrer une blockchain locale (fork du réseau mainnet) et pour compiler et déployer son code Solidity. Nous verrons aussi comment avoir une explorer type etherscan local. 

<br/>

## Pré-requis

* nvm
* Créer un compte ethernal sur https://app.tryethernal.com/
* Compte alchemyapi (concurrent infura ou autre full node)

<br/>

## Installation

```
nvm install v14.17.6
nvm use v14.17.6
nvm use default v14.17.6
npm install ethernal -g
ethernal login

npm install --save-dev hardhat
npm i --save-dev hardhat-ethernal
npm i --save-dev @nomiclabs/hardhat-waffle
```

<br/>

## Démarrer votre blockchain en local

```
npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/...
```

<br/>

## Synchronisation avec l'explorer

Dans un second terminal:
```
ethernal listen
```

<br/>

## Projet Hardhat synchronisé sur Eternal
```
npx hardhat
```

<br/>

Voici ce que j'ai répondu aux questions posées:

✔ What do you want to do? · Create a basic sample project<br/>
✔ Hardhat project root: · ./solidity<br/>
✔ Do you want to add a .gitignore? (Y/n) · y<br/>
✔ Do you want to install this sample project's dependencies with npm (@nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers)? (Y/n) · y<br/>

<br/>


Compiler le fichier Solidity:

```
npx hardhat compile
```

<br/>

Vérifier le bon fonctionnement de Hardhat et du projet:

```
npx hardhat test
```

<br/>

Modifier le fichier de déployment pour que le contract apparaisse dans Eternal. Le fichier `sample-script.js` doit ressembler à ceci:

```
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const ethernal = require('hardhat-ethernal');
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await hre.ethernal.push({
    name: 'Greeter',
    address: greeter.address
  });
  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```

> J'ai donc ajouté 4 lignes au fichier généré via la commande `npx hardhat`

Déployer le projet *sample* sur la blockchain hardhat:

```
npx hardhat run scripts/sample-script.js --network localhost
```

<br/>

Modifier aussi le fichier `hardhat.config.js` et ajouter la ligne suivante:

```
require("@nomiclabs/hardhat-waffle");
require('hardhat-ethernal');
```

<br/>

## Visualisation sur Eternal

Rendez-vous sur https://app.tryethernal.com/address/ et vous verrez le contract sample.

![image](/images/eternal.png)

<br/>

## Interaction avec le smart contract

Via la console Hardhat, il est possible d'interagir avec le smart contract déployé. 

```
npm install --save-dev @nomiclabs/buidle
```

<br/>

Exemple avec un smart contract aléatoire dont le code est le suivant:

```
pragma solidity ^0.6.0;

//define interface
interface UniswapV2Factory {
    //this function returns the pair address based on 2 token addresses
    function getPair(address tokenA, address TokenB)
        external
        view
        returns (address pair);
}

//define interface
interface UniswapV2Pair {
    //this function returns how much DAI and WETH is locked in uniswap
    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );
}

contract GetReserves {
    address private factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address private dai = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address private weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function getTokenReserves() external view returns (uint256, uint256) {
        address pair = UniswapV2Factory(factory).getPair(dai, weth);

        (uint256 reserve0, uint256 reserve1, ) = UniswapV2Pair(pair)
            .getReserves();

        return (reserve0, reserve1);
    }
}
```

<br/>

Code JS à exécuter dans la console démarrée via la commande `npx hardhat console --network localhost`:
```
const GetReserves = await ethers.getContractFactory("GetReserves")
const getReserves = await MyContract.attach("0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc")
await getReserves.getTokenReserves()
```

> Ethers tips:
> * Convert 1 eth to wei: `wei = ethers.utils.parseUnits("1.0", 18)`
