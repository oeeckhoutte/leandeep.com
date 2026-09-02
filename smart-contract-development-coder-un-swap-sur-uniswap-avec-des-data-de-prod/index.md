# Smart contract development: coder un Swap sur Uniswap avec des data de prod

- Canonical URL: https://leandeep.com/smart-contract-development-coder-un-swap-sur-uniswap-avec-des-data-de-prod/
- Author: Olivier Eeckhoutte
- Published: 2021-10-22T08:08:00Z
- Updated: 2021-10-22T08:08:00Z
- Language: fr
- Tags: Dev, Ethereum, Blockchain, Solidity
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment réaliser un échange d'USDC avec de l'USDT en codant un smart contract qui utiliser Uniswap.

> Pour cet example, j'ai utilisé Node version: `nvm use v14.17.6`. J'ai aussi installé les modules NodeJS `ganache-cli` et `truffle`

<br/>

## Création du Smart contract

Créer un fichier `SimpleUniswapSwap.sol` dans le répertoire `contracts` de votre repo git et ajouter le contenu suivant: 

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/Uniswap.sol";

contract SimpleUniswapSwap {
    address private constant UNISWAP_V2_ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address _to
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn); // Send money to this smart contract
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn); // Allow uniswap router to use/swap the money we just transfered

        address[] memory path;
        if (_tokenIn == WETH || _tokenOut == WETH) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        }

        IUniswapV2Router(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            _to,
            block.timestamp
        );
    }

}

```

<br/>

L'interface `Uniswap.sol` dans le répertoire `./contracts/interfaces` ressemble à ceci:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.7;

// https://uniswap.org/docs/v2/smart-contracts

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}
```

<br/>

## Création du TU permettant d'appeler notre Smart contract

Créer un fichier `test/simple-uniswap-swap.js` et ajouter le contenu suivant:

```
const BN = require("bn.js"); // On charge le module Node Bignumber 
const { USDC, USDT, USDC_WHALE } = require("./config"); // Adresses des tokens USC, USDT et wallet 

const IERC20 = artifacts.require("IERC20");  // on load l'interface des contracts ERC20
const SimpleUniswapSwap = artifacts.require("SimpleUniswapSwap"); //on load le smart contract qu'on a créé pour swapper des tokens ERC20

contract("SimpleUniswapSwap", (accounts) => {
    const WHALE = USDC_WHALE;
    const AMOUNT_IN = 1000;
    const AMOUNT_OUT_MIN = 980;
    const TOKEN_IN = USDC;
    const TOKEN_OUT = USDT;
    const TO = accounts[0];

    let simpleUniswapSwap;
    let tokenIn;
    let tokenOut;
    beforeEach(async () => {
        tokenIn = await IERC20.at(TOKEN_IN);
        tokenOut = await IERC20.at(TOKEN_OUT);
        simpleUniswapSwap = await SimpleUniswapSwap.new();

        await tokenIn.approve(simpleUniswapSwap.address, AMOUNT_IN, { from: WHALE });
    });

    it("should pass", async () => {
        await simpleUniswapSwap.swap(
            tokenIn.address,
            tokenOut.address,
            AMOUNT_IN,
            AMOUNT_OUT_MIN,
            TO,
            {
                from: WHALE,
            }
        );

        console.log(`in ${AMOUNT_IN}`);
        console.log(`out ${await tokenOut.balanceOf(TO)}`);
    });
});
```

<br/>

## Forker le mainnet Ethereum

Créer un fichier de config `truffle-config.js` au niveau root de votre repo contenant l'alias vers l'environnement `mainnet_fork`:

```
module.exports = {
    networks: {
        mainnet_fork: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 8545, // Standard Ethereum port (default: none)
            network_id: "999", // Any network (default: none)
        },
    },

    // Set default mocha options here, use special reporters etc.
    mocha: {
        // timeout: 100000
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: "0.7.6", // Fetch exact version from solc-bin (default: truffle's version)
        },
    },
}
```

<br/>

> Repérer une whale possèdant de l'USDC via https://twitter.com/whale_alert, récupérer son wallet Ethereum via Etherscan et unlocker le  dans votre fork Ethereum.

```
source .env
ganache-cli --fork https://mainnet.infura.io/v3/$TOKEN_INFURA --seed $YOUR_SEED -i --unlock $WHALE_ADDRESS --networkId 999
```

<br/>

## Exécution du swap

```
npx truffle test --network mainnet_fork test/simple-uniswap-swap.js
```

Voilà, si tout est bien configuré, vous devriez voir ceci à la fin du test:

<br/>

![image](/images/swap-uniswap-result.png)


<br/>

## Interagir avec Ganache

```
npx truffle console --network mainnet_fork
# npx truffle debug 0xbb18c245899e6e11da427cb951d88de7f072ca1021c98fbb1c7b65660c572f44
```
