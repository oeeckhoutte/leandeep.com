# Smart contract development: Emprunter 1 million de DAI (~dollars) avec un flashloan sur Aave

- Canonical URL: https://leandeep.com/smart-contract-development-emprunter-1-million-de-dai-~dollars-avec-un-flashloan-sur-aave/
- Author: Olivier Eeckhoutte
- Published: 2021-11-05T09:08:00Z
- Updated: 2021-11-05T09:08:00Z
- Language: fr
- Tags: Dev, Ethereum, Blockchain, Solidity
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment réaliser un Flashloan sur Aave. 
<br/>
Nous allons emprunter $1 000 000 et le rembourser instantanément avec 0.09% de frais. Pour emprunter $1 000 000 et faire ce qu'on veut avec tant qu'il est remboursé dans la même transaction, on ne va payer que $900 d'intérêt...

> Pour cet example, j'ai utilisé Node version: `nvm use v14.17.6`. J'ai aussi installé les modules NodeJS `ganache-cli` et `truffle`

<br/>

## Création du Smart contract

Créer un fichier `SimpleAaveFlashloan.sol` dans le répertoire `contracts/simple-aave-flashloan` de votre repo git et ajouter le contenu suivant: 

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/FlashLoanReceiverBase.sol";

contract SimpleAaveFlashloan is FlashLoanReceiverBase {
    using SafeMath for uint256;

    struct Data {
        address token;
        uint256 amount;
    }
    address public tokenBorrowed;

    event Log(string message, uint256 value);
    event LogAsset(string message, address token);

    constructor(ILendingPoolAddressesProvider _addressProvider)
        FlashLoanReceiverBase(_addressProvider)
    {}

    function flashLoan(address _token, uint256 _amount) external {
        uint256 token_balance = IERC20(_token).balanceOf(address(this));
        uint256 min_amount = _amount.div(50);
        require(
            token_balance > min_amount,
            "token balance has to be higher than 10% of the amount borrowed"
        );

        address receiverAddress = address(this);

        // multiple assets can be borrowed, in this case just 1
        address[] memory assets = new address[](1);
        assets[0] = _token;

        // array of amount has to be the same lenght as the assets array
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _amount;

        // 0 = no debt (flashloan), 1 = stable and 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        require(
            assets.length == amounts.length,
            "assets and amounts arrays are not the same length"
        );

        // this is the address that would receive the debt in case modes 1 and 2
        address onBehalfOf = address(this);

        // data that can be usefull to do arbitrage or liquidations
        bytes memory params = abi.encode(
            Data({token: _token, amount: _amount})
        );

        uint16 referralCode = 0;

        // LENDING_POOL is called inside FlashLoanReceiverBase
        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    // AAVE protocol will call this function after we call LENDING_POOL.flashLoan()
    // here the flashloan is received, in this function we have to repay AAVE after doing stuff with the flashloan
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(initiator == address(this), "!initiator");

        Data memory data_decoded = abi.decode(params, (Data));

        if (assets.length == 1) {
            tokenBorrowed = assets[0];
            uint256 amountBorrowed = amounts[0];
            uint256 fee = premiums[0];

            require(
                tokenBorrowed == data_decoded.token &&
                    amountBorrowed == data_decoded.amount
            );

            /*
             *  arbitrage or liquidation code
             */

            //emit LogAsset('token', tokenBorrowed);
            emit Log("borrowed", amountBorrowed);
            emit Log("fee", fee);
            emit Log("amount to pay back", amountBorrowed.add(fee));

            // amoun to pay back to AAVE
            uint256 totalAmount = amountBorrowed.add(fee);
            // approve LENDING_POOL
            IERC20(tokenBorrowed).approve(address(LENDING_POOL), totalAmount);
        } else {
            // if you borrow more than 1 token
            for (uint256 i = 0; i < assets.length; i++) {
                emit LogAsset("token", assets[i]);
                emit Log("borrowed", amounts[i]);
                emit Log("fee", premiums[i]);
            }
        }
        return true;
    }
}

```

<br/>

L'interface `FlashLoanReceiverBase.sol` dans le répertoire `./contracts/simple-aave-flashloan/interfaces` ressemble à ceci:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./IFlashLoanReceiver.sol";
import "./ILendingPoolAddressProvider.sol";
import "./ILendingPool.sol";

abstract contract FlashLoanReceiverBase is IFlashLoanReceiver {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    ILendingPoolAddressesProvider public immutable ADDRESSES_PROVIDER;
    ILendingPool public immutable LENDING_POOL;

    constructor(ILendingPoolAddressesProvider provider) {
        ADDRESSES_PROVIDER = provider;
        LENDING_POOL = ILendingPool(provider.getLendingPool());
    }
}

```

<br/>

La seconde interface `IFlashLoanReceiver.sol` dans le répertoire `./contracts/simple-aave-flashloan/interfaces` contient le code suivant:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

```

<br/>

La troisième interface `ILendingPool.sol` dans le répertoire `./contracts/simple-aave-flashloan/interfaces` ressemble à cela:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

interface ILendingPool {
    function flashLoan(
        address receiverAddress,
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata modes,
        address onBehalfOf,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

```

<br/>


Enfin, la dernière interface `ILendingPoolAddressProvider.sol` dans le répertoire `./contracts/simple-aave-flashloan/interfaces` a le code suivant:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

interface ILendingPoolAddressesProvider {
    function getLendingPool() external view returns (address);
}

```


<br/>

## Création du TU permettant d'appeler notre Smart contract

Créer un fichier `test/simple-aave-flashloan.js` et ajouter le contenu suivant:

```
const IERC20 = artifacts.require('IERC20');
const SimpleAaveFlashloan = artifacts.require('SimpleAaveFlashloan');
const BN = require('bn.js');
const { assert } = require('chai');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SimpleAaveFlashloan', accounts => {
    const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const AAVE = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5';

    const DECIMALS = 18;
    const DAI_WHALE = '0xC73f6738311E76D45dFED155F39773e68251D251';

    const FUND_AMOUNT = new BN(10).pow(new BN(DECIMALS)).mul(new BN(21000));
    const FUND_AMOUNT_FAIL = new BN(10).pow(new BN(DECIMALS)).mul(new BN(1000));
    const BORROW_AMOUNT = new BN(10).pow(new BN(DECIMALS)).mul(new BN(1000000));

    let simpleAaveFlashloan, token, token_borrowed, flashloan_user, amount, contract_balance

    beforeEach(async () => {
        token = await IERC20.at(DAI);
        simpleAaveFlashloan = await SimpleAaveFlashloan.new(AAVE);
        flashloan_user = accounts[0];

        // await network.provider.request({
        //     method: "hardhat_impersonateAccount",
        //     params: [DAI_WHALE],
        // });
        console.log(`contract address is: ${simpleAaveFlashloan.address}`)

        const whale_balance = await token.balanceOf(DAI_WHALE);
        assert(whale_balance.gte(FUND_AMOUNT), 'Whale DAI balance has to be higher than FUND_AMOUNT');
    })

    it('flash loan function works correctly', async () => {

        await token.transfer(simpleAaveFlashloan.address, FUND_AMOUNT, { from: DAI_WHALE });
        contract_balance = await token.balanceOf(simpleAaveFlashloan.address) / 1e18
        console.log(`DAI contract balance before flashloan: ${contract_balance.toString()}`)

        const tx = await simpleAaveFlashloan.flashLoan(DAI, BORROW_AMOUNT)
        token_borrowed = await simpleAaveFlashloan.tokenBorrowed();
        assert.equal(DAI, token_borrowed, 'token and token_borrowed are different')

        for (const log of tx.logs) {
            //console.log(log.args.message, log.args.token)
            amount = log.args.value / 1e18;
            console.log(log.args.message, amount.toString())
        }
        contract_balance = await token.balanceOf(simpleAaveFlashloan.address) / 1e18
        console.log(`DAI contract balance after flashloan: ${contract_balance.toString()}`)


    })

    it('flash loan function should fail if contract balance is less than 2% of BORROW_AMOUT', async () => {

        await token.transfer(simpleAaveFlashloan.address, FUND_AMOUNT_FAIL, { from: DAI_WHALE });
        const contract_balance = await token.balanceOf(simpleAaveFlashloan.address) / 1e18
        console.log(`DAI contract balance: ${contract_balance.toString()} --- this is not enough balance, should be rejected `)
        await simpleAaveFlashloan.flashLoan(DAI, BORROW_AMOUNT).should.be.rejected;
    })

})
```

<br/>

## Forker le mainnet Ethereum

Créer un fichier de config `truffle-config.js` au niveau root de votre repo contenant l'alias vers l'environnement `mainnet_fork`:

```
module.exports = {
    contracts_directory: "./contracts/simple-aave-flashloan/",
    networks: {
        mainnet_fork: {
            host: "127.0.0.1", // Localhost (default: none)
            port: 8545, // Standard Ethereum port (default: none)
            network_id: "999", // Any network (default: none)
            gas: 0
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
npx truffle test --network mainnet_fork test/simple-aave-flashloan.js
```

Voilà, si tout est bien configuré, vous devriez voir ceci à la fin du test:

<br/>

![image](/images/flashloan-aave-result.png)


