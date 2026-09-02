# Smart contract development: Emprunter 1 million de DAI (~dollars) avec un flashloan sur DyDx

- Canonical URL: https://leandeep.com/smart-contract-development-emprunter-1-million-de-dai-~dollars-avec-un-flashloan-sur-dydx/
- Author: Olivier Eeckhoutte
- Published: 2021-11-05T08:08:00Z
- Updated: 2021-11-05T08:08:00Z
- Language: fr
- Tags: Dev, Ethereum, Blockchain, Solidity
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article nous allons voir comment réaliser un Flashloan sur DyDx. 
<br/>
Nous allons emprunter $1 000 000 et le rembourser instantanément avec des frais seulement de 2 wei. Crazy !

> Pour cet example, j'ai utilisé Node version: `nvm use v14.17.6`. J'ai aussi installé les modules NodeJS `ganache-cli` et `truffle`

<br/>

## Création du Smart contract

Créer un fichier `SimpleDyDxFlashloan.sol` dans le répertoire `contracts/simple-dydx-flashloan` de votre repo git et ajouter le contenu suivant: 

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/DyDxFlashloanBase.sol";
import "./interfaces/ICallee.sol";

contract SimpleDyDxFlashloan is DydxFlashloanBase, ICallee {
    address private constant SOLO = 0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e;
    address public user;

    event Log(string message, uint256 val);

    struct Data {
        address token;
        uint256 repayAmount;
    }

    // Call dydx and request a flashloan
    function initiateFlashloan(address _token, uint256 _amount) external {
        ISoloMargin solo = ISoloMargin(SOLO);
        uint256 marketID = _getMarketIdFromTokenAddress(SOLO, _token);

        // Calculate repay amount
        uint256 repay_amount = _getRepaymentAmountInternal(_amount);
        IERC20(_token).approve(SOLO, repay_amount);

        Actions.ActionArgs[] memory operations = new Actions.ActionArgs[](3);

        operations[0] = _getWithdrawAction(marketID, _amount);
        operations[1] = _getCallAction(
            abi.encode(Data({token: _token, repayAmount: repay_amount}))
        );
        operations[2] = _getDepositAction(marketID, repay_amount);

        Account.Info[] memory accountInfos = new Account.Info[](1);

        accountInfos[0] = _getAccountInfo();

        solo.operate(accountInfos, operations);
    }

    // This function receives the flashloan
    // Fallback function called by dydx
    function callFunction(
        address sender,
        Account.Info memory account,
        bytes memory data
    ) public override {
        require(
            msg.sender == SOLO,
            "the caller to this function is not SOLO contract"
        );
        require(
            sender == address(this),
            "sender of the flashloan has to be the address of dydxFlashloan"
        );

        Data memory data_decoded = abi.decode(data, (Data));
        uint256 repay_amount = data_decoded.repayAmount;

        uint256 balance = IERC20(data_decoded.token).balanceOf(address(this));
        require(
            balance >= repay_amount,
            "balance has to be higher than repay amount"
        );

        user = sender;
        emit Log("balance", balance);
        emit Log("repay amount", repay_amount);
        emit Log("balance - repay amount", balance - repay_amount);
    }
}

```

<br/>

L'interface `DyDxFlashloanBase.sol` dans le répertoire `./contracts/simple-dydx-flashloan/interfaces` ressemble à ceci:

```
// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./ISoloMargin.sol";

contract DydxFlashloanBase {
    using SafeMath for uint256;

    // -- Internal Helper functions -- //

    function _getMarketIdFromTokenAddress(address _solo, address token)
        internal
        view
        returns (uint256)
    {
        ISoloMargin solo = ISoloMargin(_solo);

        uint256 numMarkets = solo.getNumMarkets();

        address curToken;
        for (uint256 i = 0; i < numMarkets; i++) {
            curToken = solo.getMarketTokenAddress(i);

            if (curToken == token) {
                return i;
            }
        }

        revert("No marketId found for provided token");
    }

    function _getRepaymentAmountInternal(uint256 amount)
        internal
        pure
        returns (uint256)
    {
        // Needs to be overcollateralize
        // Needs to provide +2 wei to be safe
        return amount.add(2);
    }

    function _getAccountInfo() internal view returns (Account.Info memory) {
        return Account.Info({owner: address(this), number: 1});
    }

    function _getWithdrawAction(uint256 marketId, uint256 amount)
        internal
        view
        returns (Actions.ActionArgs memory)
    {
        return
            Actions.ActionArgs({
                actionType: Actions.ActionType.Withdraw,
                accountId: 0,
                amount: Types.AssetAmount({
                    sign: false,
                    denomination: Types.AssetDenomination.Wei,
                    ref: Types.AssetReference.Delta,
                    value: amount
                }),
                primaryMarketId: marketId,
                secondaryMarketId: 0,
                otherAddress: address(this),
                otherAccountId: 0,
                data: ""
            });
    }

    function _getCallAction(bytes memory data)
        internal
        view
        returns (Actions.ActionArgs memory)
    {
        return
            Actions.ActionArgs({
                actionType: Actions.ActionType.Call,
                accountId: 0,
                amount: Types.AssetAmount({
                    sign: false,
                    denomination: Types.AssetDenomination.Wei,
                    ref: Types.AssetReference.Delta,
                    value: 0
                }),
                primaryMarketId: 0,
                secondaryMarketId: 0,
                otherAddress: address(this),
                otherAccountId: 0,
                data: data
            });
    }

    function _getDepositAction(uint256 marketId, uint256 amount)
        internal
        view
        returns (Actions.ActionArgs memory)
    {
        return
            Actions.ActionArgs({
                actionType: Actions.ActionType.Deposit,
                accountId: 0,
                amount: Types.AssetAmount({
                    sign: true,
                    denomination: Types.AssetDenomination.Wei,
                    ref: Types.AssetReference.Delta,
                    value: amount
                }),
                primaryMarketId: marketId,
                secondaryMarketId: 0,
                otherAddress: address(this),
                otherAccountId: 0,
                data: ""
            });
    }
}

// test and deployment

```

<br/>

La seconde interface `ICallee.sol` dans le répertoire `./contracts/simple-dydx-flashloan/interfaces` contient le code suivant:

```
// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8;
pragma experimental ABIEncoderV2;

import {Account} from "./ISoloMargin.sol";

/**
 * @title ICallee
 * @author dYdX
 *
 * Interface that Callees for Solo must implement in order to ingest data.
 */
interface ICallee {
    // ============ Public Functions ============

    /**
     * Allows users to send this contract arbitrary data.
     *
     * @param  sender       The msg.sender to Solo
     * @param  accountInfo  The account from which the data is being sent
     * @param  data         Arbitrary data given by the sender
     */
    function callFunction(
        address sender,
        Account.Info calldata accountInfo,
        bytes calldata data
    ) external;
}

```

<br/>

Enfin, la dernière interface `ISoloMargin.sol` dans le répertoire `./contracts/simple-dydx-flashloan/interfaces` a le code suivant:

```
// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8;
pragma experimental ABIEncoderV2;

library Account {
    enum Status {
        Normal,
        Liquid,
        Vapor
    }
    struct Info {
        address owner; // The address that owns the account
        uint256 number; // A nonce that allows a single address to control many accounts
    }
    struct accStorage {
        mapping(uint256 => Types.Par) balances; // Mapping from marketId to principal
        Status status;
    }
}

library Actions {
    enum ActionType {
        Deposit, // supply tokens
        Withdraw, // borrow tokens
        Transfer, // transfer balance between accounts
        Buy, // buy an amount of some token (publicly)
        Sell, // sell an amount of some token (publicly)
        Trade, // trade tokens against another account
        Liquidate, // liquidate an undercollateralized or expiring account
        Vaporize, // use excess tokens to zero-out a completely negative account
        Call // send arbitrary data to an address
    }

    enum AccountLayout {
        OnePrimary,
        TwoPrimary,
        PrimaryAndSecondary
    }

    enum MarketLayout {
        ZeroMarkets,
        OneMarket,
        TwoMarkets
    }

    struct ActionArgs {
        ActionType actionType;
        uint256 accountId;
        Types.AssetAmount amount;
        uint256 primaryMarketId;
        uint256 secondaryMarketId;
        address otherAddress;
        uint256 otherAccountId;
        bytes data;
    }

    struct DepositArgs {
        Types.AssetAmount amount;
        Account.Info account;
        uint256 market;
        address from;
    }

    struct WithdrawArgs {
        Types.AssetAmount amount;
        Account.Info account;
        uint256 market;
        address to;
    }

    struct TransferArgs {
        Types.AssetAmount amount;
        Account.Info accountOne;
        Account.Info accountTwo;
        uint256 market;
    }

    struct BuyArgs {
        Types.AssetAmount amount;
        Account.Info account;
        uint256 makerMarket;
        uint256 takerMarket;
        address exchangeWrapper;
        bytes orderData;
    }

    struct SellArgs {
        Types.AssetAmount amount;
        Account.Info account;
        uint256 takerMarket;
        uint256 makerMarket;
        address exchangeWrapper;
        bytes orderData;
    }

    struct TradeArgs {
        Types.AssetAmount amount;
        Account.Info takerAccount;
        Account.Info makerAccount;
        uint256 inputMarket;
        uint256 outputMarket;
        address autoTrader;
        bytes tradeData;
    }

    struct LiquidateArgs {
        Types.AssetAmount amount;
        Account.Info solidAccount;
        Account.Info liquidAccount;
        uint256 owedMarket;
        uint256 heldMarket;
    }

    struct VaporizeArgs {
        Types.AssetAmount amount;
        Account.Info solidAccount;
        Account.Info vaporAccount;
        uint256 owedMarket;
        uint256 heldMarket;
    }

    struct CallArgs {
        Account.Info account;
        address callee;
        bytes data;
    }
}

library Decimal {
    struct D256 {
        uint256 value;
    }
}

library Interest {
    struct Rate {
        uint256 value;
    }

    struct Index {
        uint96 borrow;
        uint96 supply;
        uint32 lastUpdate;
    }
}

library Monetary {
    struct Price {
        uint256 value;
    }
    struct Value {
        uint256 value;
    }
}

library Storage {
    // All information necessary for tracking a market
    struct Market {
        // Contract address of the associated ERC20 token
        address token;
        // Total aggregated supply and borrow amount of the entire market
        Types.TotalPar totalPar;
        // Interest index of the market
        Interest.Index index;
        // Contract address of the price oracle for this market
        address priceOracle;
        // Contract address of the interest setter for this market
        address interestSetter;
        // Multiplier on the marginRatio for this market
        Decimal.D256 marginPremium;
        // Multiplier on the liquidationSpread for this market
        Decimal.D256 spreadPremium;
        // Whether additional borrows are allowed for this market
        bool isClosing;
    }

    // The global risk parameters that govern the health and security of the system
    struct RiskParams {
        // Required ratio of over-collateralization
        Decimal.D256 marginRatio;
        // Percentage penalty incurred by liquidated accounts
        Decimal.D256 liquidationSpread;
        // Percentage of the borrower's interest fee that gets passed to the suppliers
        Decimal.D256 earningsRate;
        // The minimum absolute borrow value of an account
        // There must be sufficient incentivize to liquidate undercollateralized accounts
        Monetary.Value minBorrowedValue;
    }

    // The maximum RiskParam values that can be set
    struct RiskLimits {
        uint64 marginRatioMax;
        uint64 liquidationSpreadMax;
        uint64 earningsRateMax;
        uint64 marginPremiumMax;
        uint64 spreadPremiumMax;
        uint128 minBorrowedValueMax;
    }

    // The entire storage state of Solo
    struct State {
        // number of markets
        uint256 numMarkets;
        // marketId => Market
        mapping(uint256 => Market) markets;
        // owner => account number => Account
        mapping(address => mapping(uint256 => Account.accStorage)) accounts;
        // Addresses that can control other users accounts
        mapping(address => mapping(address => bool)) operators;
        // Addresses that can control all users accounts
        mapping(address => bool) globalOperators;
        // mutable risk parameters of the system
        RiskParams riskParams;
        // immutable risk limits of the system
        RiskLimits riskLimits;
    }
}

library Types {
    enum AssetDenomination {
        Wei, // the amount is denominated in wei
        Par // the amount is denominated in par
    }

    enum AssetReference {
        Delta, // the amount is given as a delta from the current value
        Target // the amount is given as an exact number to end up at
    }

    struct AssetAmount {
        bool sign; // true if positive
        AssetDenomination denomination;
        AssetReference ref;
        uint256 value;
    }

    struct TotalPar {
        uint128 borrow;
        uint128 supply;
    }

    struct Par {
        bool sign; // true if positive
        uint128 value;
    }

    struct Wei {
        bool sign; // true if positive
        uint256 value;
    }
}

interface ISoloMargin {
    struct OperatorArg {
        address operator;
        bool trusted;
    }

    function ownerSetSpreadPremium(
        uint256 marketId,
        Decimal.D256 calldata spreadPremium
    ) external;

    function getIsGlobalOperator(address operator) external view returns (bool);

    function getMarketTokenAddress(uint256 marketId)
        external
        view
        returns (address);

    function ownerSetInterestSetter(uint256 marketId, address interestSetter)
        external;

    function getAccountValues(Account.Info calldata account)
        external
        view
        returns (Monetary.Value memory, Monetary.Value memory);

    function getMarketPriceOracle(uint256 marketId)
        external
        view
        returns (address);

    function getMarketInterestSetter(uint256 marketId)
        external
        view
        returns (address);

    function getMarketSpreadPremium(uint256 marketId)
        external
        view
        returns (Decimal.D256 memory);

    function getNumMarkets() external view returns (uint256);

    function ownerWithdrawUnsupportedTokens(address token, address recipient)
        external
        returns (uint256);

    function ownerSetMinBorrowedValue(Monetary.Value calldata minBorrowedValue)
        external;

    function ownerSetLiquidationSpread(Decimal.D256 calldata spread) external;

    function ownerSetEarningsRate(Decimal.D256 calldata earningsRate) external;

    function getIsLocalOperator(address _owner, address operator)
        external
        view
        returns (bool);

    function getAccountPar(Account.Info calldata account, uint256 marketId)
        external
        view
        returns (Types.Par memory);

    function ownerSetMarginPremium(
        uint256 marketId,
        Decimal.D256 calldata marginPremium
    ) external;

    function getMarginRatio() external view returns (Decimal.D256 memory);

    function getMarketCurrentIndex(uint256 marketId)
        external
        view
        returns (Interest.Index memory);

    function getMarketIsClosing(uint256 marketId) external view returns (bool);

    function getRiskParams() external view returns (Storage.RiskParams memory);

    function getAccountBalances(Account.Info calldata account)
        external
        view
        returns (
            address[] memory,
            Types.Par[] memory,
            Types.Wei[] memory
        );

    function renounceOwnership() external;

    function getMinBorrowedValue()
        external
        view
        returns (Monetary.Value memory);

    function setOperators(OperatorArg[] calldata args) external;

    function getMarketPrice(uint256 marketId) external view returns (address);

    function owner() external view returns (address);

    function isOwner() external view returns (bool);

    function ownerWithdrawExcessTokens(uint256 marketId, address recipient)
        external
        returns (uint256);

    function ownerAddMarket(
        address token,
        address priceOracle,
        address interestSetter,
        Decimal.D256 calldata marginPremium,
        Decimal.D256 calldata spreadPremium
    ) external;

    function operate(
        Account.Info[] calldata accounts,
        Actions.ActionArgs[] calldata actions
    ) external;

    function getMarketWithInfo(uint256 marketId)
        external
        view
        returns (
            Storage.Market memory,
            Interest.Index memory,
            Monetary.Price memory,
            Interest.Rate memory
        );

    function ownerSetMarginRatio(Decimal.D256 calldata ratio) external;

    function getLiquidationSpread() external view returns (Decimal.D256 memory);

    function getAccountWei(Account.Info calldata account, uint256 marketId)
        external
        view
        returns (Types.Wei memory);

    function getMarketTotalPar(uint256 marketId)
        external
        view
        returns (Types.TotalPar memory);

    function getLiquidationSpreadForPair(
        uint256 heldMarketId,
        uint256 owedMarketId
    ) external view returns (Decimal.D256 memory);

    function getNumExcessTokens(uint256 marketId)
        external
        view
        returns (Types.Wei memory);

    function getMarketCachedIndex(uint256 marketId)
        external
        view
        returns (Interest.Index memory);

    function getAccountStatus(Account.Info calldata account)
        external
        view
        returns (uint8);

    function getEarningsRate() external view returns (Decimal.D256 memory);

    function ownerSetPriceOracle(uint256 marketId, address priceOracle)
        external;

    function getRiskLimits() external view returns (Storage.RiskLimits memory);

    function getMarket(uint256 marketId)
        external
        view
        returns (Storage.Market memory);

    function ownerSetIsClosing(uint256 marketId, bool isClosing) external;

    function ownerSetGlobalOperator(address operator, bool approved) external;

    function transferOwnership(address newOwner) external;

    function getAdjustedAccountValues(Account.Info calldata account)
        external
        view
        returns (Monetary.Value memory, Monetary.Value memory);

    function getMarketMarginPremium(uint256 marketId)
        external
        view
        returns (Decimal.D256 memory);

    function getMarketInterestRate(uint256 marketId)
        external
        view
        returns (Interest.Rate memory);
}

```


<br/>

## Création du TU permettant d'appeler notre Smart contract

Créer un fichier `test/simple-dydx-flashloan.js` et ajouter le contenu suivant:

```
const BN = require('bn.js');
const { assert } = require('chai');

const IERC20 = artifacts.require('IERC20');
const SimpleDyDxFlashloan = artifacts.require('SimpleDyDxFlashloan');
const SOLO = '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e';


contract('SimpleDyDxFlashloan', accounts => {

    const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const DAI_WHALE = '0xC73f6738311E76D45dFED155F39773e68251D251';
    const DECIMALS = 6;

    const FUND_AMOUNT = new BN(10).pow(new BN(18)).mul(new BN(200))
    const BORROW_AMOUNT = new BN(10).pow(new BN(18)).mul(new BN(1000000))

    let simpleDyDxFlashloan, token, flashloan_user, user;

    beforeEach(async () => {
        token = await IERC20.at(DAI);
        simpleDyDxFlashloan = await SimpleDyDxFlashloan.new();
        flashloan_user = accounts[0]

        // await network.provider.request({
        //     method: "hardhat_impersonateAccount",
        //     params: [DAI_WHALE],
        // });

        console.log(`contract address is: ${simpleDyDxFlashloan.address}`)

        const whale_balance = await token.balanceOf(DAI_WHALE);
        assert(whale_balance.gte(FUND_AMOUNT), 'Whale DAI balance has to be higher than FUND AMOUNT');
        await token.transfer(simpleDyDxFlashloan.address, FUND_AMOUNT, { from: DAI_WHALE });

        const solo_balance = await token.balanceOf(SOLO);
        assert(solo_balance.gte(BORROW_AMOUNT), 'Solo balance has to be higher than BORROW AMOUNT');
        console.log(`SOLO balance is: ${solo_balance}`);
    });

    it('flash loan functionality works correctly', async () => {

        const tx = await simpleDyDxFlashloan.initiateFlashloan(token.address, BORROW_AMOUNT, { from: flashloan_user });

        user = await simpleDyDxFlashloan.user();

        for (const log of tx.logs) {
            console.log(log.args.message, log.args.val.toString());
        }

        assert.equal(user, simpleDyDxFlashloan.address,
            'user has to be set correctly to the address of simpleDyDxFlashloan');
    })
})
```

<br/>

## Forker le mainnet Ethereum

Créer un fichier de config `truffle-config.js` au niveau root de votre repo contenant l'alias vers l'environnement `mainnet_fork`:

```
module.exports = {
    contracts_directory: "./contracts/simple-dydx-flashloan/",
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
npx truffle test --network mainnet_fork test/simple-dydx-flashloan.js
```

Voilà, si tout est bien configuré, vous devriez voir ceci à la fin du test:

<br/>

![image](/images/flashloan-dydx-result.png)


