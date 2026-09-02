# Créer son premier smart contract pour Ethereum

- Canonical URL: https://leandeep.com/cr%C3%A9er-son-premier-smart-contract-pour-ethereum/
- Author: Olivier Eeckhoutte
- Published: 2020-09-06T09:49:00+02:00
- Updated: 2020-09-06T09:49:00+02:00
- Language: fr
- Tags: Solidity, Blockchain, Smart Contract, Ethereum, Truffle, Ganache
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Installation des pré-requis

### Truffle
```
npm install -g truffle
```

<br/>

### Ganache

**Option 1:**


Rendez-vous à l'adresse http://truffleframework.com/ganache et cliquer sur le bouton "Download". 


**Option 2:**

Installation via le terminal
```
npm install ganache-cli -g
```

puis démarrage du server Ganache via la commande:

```
ganache-cli -p 7545 -i 47 -l 4700000
```

<br/>


## Initialisation du projet 

> Il est possible d'initialiser son project avec la commande `truffle init` mais des [boilerplates](https://www.trufflesuite.com/boxes) prêts à l'emploi existent.

```
mkdir amiland-shop
cd amiland-shop
truffle unbox pet-shop
```

<br/>

## Structure du projet

```
├── LICENSE
├── box-img-lg.png
├── box-img-sm.png
├── bs-config.json
├── contracts
│   └── Migrations.sol
├── migrations
│   └── 1_initial_migration.js
├── node_modules
├── package-lock.json
├── package.json
├── src
│   ├── css
│   ├── fonts
│   ├── images
│   ├── index.html
│   ├── js
│   │   ├── app.js
│   │   ├── bootstrap.min.js
│   │   ├── truffle-contract.js
│   │   └── web3.min.js
│   └── pets.json
├── test
└── truffle-config.js
```

<br/>

* `contracts/` contient le code source Solidity pour un ou plusieurs Smart contracts, ainsi que le fichier de migration `Migrations.sol`.

* `migrations/`: truffle possède un système de migration pour déployer des smarts contracts. Une migration est vue comme un smart contract particulier qui permet de suivre tous les changements réalisés.

* `test/`: contient à la fois les fichiers de tests pour le code JavaScript et Solidity.

* `truffle-config.js`: Fichier de configuration Truffle.

> D'autres fichiers ont été créés avec le boilerplate. Nous ne les détaillerons pas dans cet article. Il s'agit principalement des fichiers permettant d'afficher un front pour notre dApp.

<br/>

## Smart contract

Créer un fichier appelé `AdoptUnChien.sol` et ajouter le code suivant:

```
pragma solidity ^0.5.0;

contract AdoptUnChien {
    address[16] public nouveauxParents;
    
    function adoptUnChien(uint chienId) public returns (uint) {
        require(chienId >= 0 && chienId <= 15);
        nouveauxParents[chienId] = msg.sender;
        return chienId;
    }

    function getNouveauxParents() public view returns (address[16] memory) {
        return nouveauxParents;
    }
}
```

> Nous avons défini la variable `nouveauxParents` qui est un tableau d'adresse Ethereum. Les tableaux contienne un type et ont une taille fixe ou variable. Dans notre cas de notre variable le type est `address` et la longueur du tableau est `16`.

> `memory` dans `address[16] memory` retourne la location des données d'une variable.

> Le mot clé `view` dans la déclaration de la fonction `getNouveauxParents` signifie que la fonction ne va pas modifier l'état du contrat.

> La doc pour apprendre le langage Solidity est ici: https://solidity.readthedocs.io/en/v0.5.3/types.html

> Le style guide est accessible ici: https://solidity.readthedocs.io/en/v0.5.3/style-guide.html . Il est inspiré de Python: "The structure and many of the recommendations within this style guide were taken from python’s pep8 style guide."
<br/>

## Compilation

```
truffle compile
```

Si tout se passe bien, vous devriez voir quelque chose de similaire à ceci:

```
Compiling your contracts...
===========================
> Compiling ./contracts/AdoptUnChien.sol
> Compiling ./contracts/Migrations.sol
> Artifacts written to /Users/olivier/Dev/Leandeep/Ethereum/amiland-shop/build/contracts
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang
```


<br/>

## Déploiement 

Pour déployer son smart contract sur la blockchain on utilise une migration. 

Pour ceux qui connaissent Alembic en Python pour migrer le schéma de sa base de données Postgres c'est un peu le même concept.

Une migration est un script de déploiement qui altère l'état des contrats de son application en le faisant passer d'un état *n* à un état *n+1*.

Pour une première migration, il n'y a pas de changement d'état. On déploie simplement du nouveau code mais pour les autres migrations, il faudra peut être déplacer des données et remplacer un smart contrat par un autre.


Configurer le fichier `truffle-config.js`. Eventuellement changez le network-id. La valeur à entrer se trouve dans les settings de Ganache.

Puis exécuter la commande de migration:

```
truffle migrate
```

Si tout se passe bien, vous devriez avoir un message comme celui ci:

```
Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'development'
> Network id:      47
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x84d8f3bfba6820d3555a9036eaee427d7c74c26ccf8f855163e4e3cc56e52060
   > Blocks: 0            Seconds: 0
   > contract address:    0x99e87F4bF62117ed6C4f330026FA473570792118
   > block number:        3
   > block timestamp:     1599397484
   > account:             0x52F1292acF383eB82DC4c08A966447D642d8294C
   > balance:             99.99554203
   > gas used:            164175 (0x2814f)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0032835 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:           0.0032835 ETH


2_deploy_contracts.js
=====================

   Deploying 'AdoptUnChien'
   ------------------------
   > transaction hash:    0xbdc59be57dc2ff1811aba723905f1f6cfda1bcb86af3f1686934cdb4c8a3803b
   > Blocks: 0            Seconds: 0
   > contract address:    0x2be685a572F1bd7AAFdD6fCc00C5A9B6E04CFCE7
   > block number:        5
   > block timestamp:     1599397485
   > account:             0x52F1292acF383eB82DC4c08A966447D642d8294C
   > balance:             99.99061867
   > gas used:            203827 (0x31c33)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00407654 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00407654 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.00736004 ETH

```

<br/>

## Tests unitaires

### Tests Solidity

Créer un fichier `TestAdoptUnChien.sol` dans le répertoire `test` et ajouter le contenu ci-dessous. 

La liste des assertions disponible pour Solidity est la suivante: https://github.com/trufflesuite/truffle/blob/master/packages/core/lib/testing/Assert.sol


```
pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/AdoptUnChien.sol";

contract TestAdoptUnChien {
    // The address of the AdoptUnChien contract to be tested
    AdoptUnChien adoptUnChien = AdoptUnChien(DeployedAddresses.AdoptUnChien());

    // The id of the pet that will be used for testing
    uint expectedChienId = 8;

    //The expected owner of adopted pet is this contract
    address expectedNouveauParent = address(this);


    function testNouveauParentPeutAdopterUnChien() public {
        uint returnedId = adoptUnChien.adoptUnChien(expectedChienId);
        Assert.equal(returnedId, expectedChienId, "AdoptUnChien of the expected chien should match what is returned.");
    }

    function testGetNouveauxParentsAddressByChienId() public {
        address nouveauParent = adoptUnChien.nouveauxParents(expectedChienId);
        Assert.equal(nouveauParent, expectedNouveauParent, "Owner of the expected pet should be this contract");
    }

     function testGetNouveauParentAddressByChienIdInArray() public {
        // Store nouveauxParents in memory rather than contract's storage
        address[16] memory nouveauxParents = adoptUnChien.getNouveauxParents();
        Assert.equal(nouveauxParents[expectedChienId], expectedNouveauParent, "Owner of the expected chien should be this contract");
    }

}
```

Exécuter les tests via la commande:

```
truffle test
```

S'il n'y a pas d'erreur, vous devriez voir quelque chose de similaire:

```
Using network 'development'.


Compiling your contracts...
===========================
> Compiling ./contracts/AdoptUnChien.sol
> Compiling ./test/TestAdoption.sol
> Artifacts written to /var/folders/6n/c4hj8zyn21j9pbxdjz86y0kw0000gn/T/test--54639-JZkSvOpCLaWh
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang



  TestAdoptUnChien
    ✓ testNouveauParentPeutAdopterUnChien (147ms)
    ✓ testGetNouveauxParentsAddressByChienId (113ms)
    ✓ testGetNouveauParentAddressByChienIdInArray (122ms)


  3 passing (8s)
```  

<br/>

### Tests JavaScript

On peut également créer des tests en JavaScript:

Par exemple, créer un fichier `testAdoptUnChien.test.js` et ajouter le contenu suivant: 

```
const AdoptUnChien = artifacts.require("AdoptUnChien");

contract("AdoptUnChien", (nouveauxParents) => {
    let adoptUnChien;
    let expectedChienId;

    before(async () => {
        adoptUnChien = await AdoptUnChien.deployed();
    });

    describe("Adopter un chien et recuperer les adresses de son account", async () => {
        before("adopter un chien en utilisant nouveauxParents[0]", async () => {
            await adoptUnChien.adoptUnChien(8, { from: nouveauxParents[0] });
            expectedNouveauParent = nouveauxParents[0];
        });
    });

    describe("Adopter un chien et récupérer les adresses du compte", async () => {
        before("adopter un chien en utilisant nouveauxParents[0]", async () => {
            await adoptUnChien.adoptUnChien(8, { from: nouveauxParents[0] });
            expectedAdopter = nouveauxParents[0];
        });

        it("peut récupérer l'adresse d'un nouveauParent par chien id", async () => {
            const adopteUnChien = await adoptUnChien.nouveauxParents(8);
            assert.equal(adopteUnChien, expectedAdopter, "The owner of the adopted pet should be the first account.");
        });

        it("peut récupérer la liste des adresses de tous les nouveaux parents", async () => {
            const adopters = await adoptUnChien.getNouveauxParents();
            assert.equal(adopters[8], expectedAdopter, "The owner of the adopted pet should be in the collection.");
        });
    });

});
```

Exécuter la même commande que pour les tests Solidity:

```
truffle test
```

Résultat si tout est ok:

```
Using network 'development'.


Compiling your contracts...
===========================
> Compiling ./contracts/AdoptUnChien.sol
> Artifacts written to /var/folders/6n/c4hj8zyn21j9pbxdjz86y0kw0000gn/T/test--56489-VuSW19vJxhf6
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang



  Contract: AdoptUnChien
    Adopter un chien et récupérer les adresses du compte
      ✓ peut récupérer l'adresse d'un nouveauParent par chien id
      ✓ peut récupérer la liste des adresses de tous les nouveaux parents (75ms)


  2 passing (300ms)
```
