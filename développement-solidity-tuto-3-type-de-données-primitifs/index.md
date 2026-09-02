# Développement Solidity tuto 3 - Type de données primitifs

- Canonical URL: https://leandeep.com/d%C3%A9veloppement-solidity-tuto-3-type-de-donn%C3%A9es-primitifs/
- Author: Olivier Eeckhoutte
- Published: 2021-09-10T08:08:00Z
- Updated: 2021-09-10T08:08:00Z
- Language: fr
- Tags: Dev, Ethereum, Blockchain, Solidity
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Quelques types de primitifs:
* boolean
* uint
* int
* address

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Primitives {
    bool public mon_bool = true;

    /*
    uint signifie unsigned integer, pour non negative integers
    Différente tailles sont disponibles
        uint8   varie de 0 à 2 ** 8 - 1
        uint16  varie de 0 à 2 ** 16 - 1
        ...
        uint256 varie de 0 à 2 ** 256 - 1
    */
    uint8 public u8 = 1;
    uint public u256 = 456;
    uint public u = 123; // uint est un alias pour uint256

    /*
    Les nombres négatifs sont autorisés pour les types int.
    Comme uint, différentes tailles sont disponibles de int8 à int256
    */
    int8 public i8 = -1;
    int public i256 = 456;
    int public i = -123; // int est le même que int256

    address public adr = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;

    // Valeurs par défaut
    // Les variables non assignées ont une valeur par défaut
    bool public defaultBoo; // false
    uint public defaultUint; // 0
    int public defaultInt; // 0
    address public defaultAddr; // 0x0000000000000000000000000000000000000000
}
```
