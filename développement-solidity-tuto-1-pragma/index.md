# Développement Solidity tuto 1 - Pragma

- Canonical URL: https://leandeep.com/d%C3%A9veloppement-solidity-tuto-1-pragma/
- Author: Olivier Eeckhoutte
- Published: 2021-09-10T08:08:00Z
- Updated: 2021-09-10T08:08:00Z
- Language: fr
- Tags: Dev, Ethereum, Blockchain, Solidity
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Les `pragma` permettent de spécifier la version du compiler pour Solidity

```
// SPDX-License-Identifier: MIT
// La version doit être supérieure ou égale à 0.8.6 et inférieur à 0.9.0
pragma solidity ^0.8.6;

contract HelloEthereum {
    string public greet = "Hello Solidity!";
}
```
