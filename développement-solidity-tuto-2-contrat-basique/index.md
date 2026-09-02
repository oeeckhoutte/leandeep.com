# Développement Solidity tuto 2 - Contrat basique

- Canonical URL: https://leandeep.com/d%C3%A9veloppement-solidity-tuto-2-contrat-basique/
- Author: Olivier Eeckhoutte
- Published: 2021-09-10T08:08:00Z
- Updated: 2021-09-10T08:08:00Z
- Language: fr
- Tags: Dev, Ethereum, Blockchain, Solidity
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici un exemple de smart contrat simple qui incrémente et décrémente le compteur `count` gardé en mémoire.


```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Counter {
    uint public count;

    // Fonction permettant d'obtenir la valeur du compteur count 
    function get() public view returns (uint) {
        return count;
    }

    // Fonction qui incrémente count par 1
    function inc() public {
        count += 1;
    }

    // Fonction qui décrémente count par 1
    function dec() public {
        count -= 1;
    }
}
```
