# Solidity fondamentals

- Canonical URL: https://leandeep.com/solidity-fondamentals/
- Author: Olivier Eeckhoutte
- Published: 2020-02-13T16:49:00+02:00
- Updated: 2020-02-13T16:49:00+02:00
- Language: fr
- Tags: Ethereum, Solidity, Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Remix IDE 

[Remix](https://remix.ethereum.org)
*(Orange buttons dans la partie interaction avec le smart contract de Remix -> it costs gas)*

[Remix IDE Doc](https://remix-ide.readthedocs.io/)

[Remix Project](https://github.com/ethereum/remix-project)

> Déployer son Smart Contract sur Rinkeby en sélectionnant **injected Web3** et étant connecté à Metamask.

> Partager un dossier local avec remix Cloud IDE:
> ```
> npm install -g @remix-project/remixd
> remixd -s <absolute-path-to-the-shared-folder> --remix-ide https://remix.ethereum.org
> ```

> Faire tourner l'IDE Remix en local
> ```
> git clone https://github.com/ethereum/remix-project.git
> cd remix-project
> yarn install
> yarn run build:libs
> nx build
> nx serve
> ```
> Open [http://127.0.0.1:8080](http://127.0.0.1:8080)

<br/>

## Deploy a first smart contract. La base

For rapid prototyping use Remix and select "Javascript VM".

<br/>

**Simplest commented Contract example**

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24; // Specify compiler version

contract ExampleOne { // Contract definition
  uint256 myVar; // storage varible. Can only store positive integer with a max value of 256 bits
  
  function setMyVar(uint256 _myVar) public { // Public method than can be called externally and a parameter has to be passed
    myVar = _myVar;
  }

}
```

<br/>

Compile, deploy and interact with the Smart Contract still via Remix.

<br/>

## Second commented Contract example

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24; // Specify compiler version

contract MyContract  { // Contract definition
  
  uint256 public myVar; // storage varible. Can only store positive integer with a max value of 256 bits. The public keywork automatically generates the get Method.
  
  constructor(uint256 _myVar) public { // Cannot be pure or view. As a normal constructor, it is automatically called. Not prefixed by function keywork. Called during contract deployment.
    myVar = _myVar; // Used to pass a variable during the deployment
  }

  function setMyVar(uint256 _myVar) public { // Public method than can be called externally and a parameter has to be passed
    myVar = _myVar;
  }

  function getMyVar() public view returns(uint256) { 
    return myVar;
  }

  function() public { // Anonymous function. Used when we interact with a Smart Contract but we do not specify any function. Often used to transfer Eth. This anonymous function can also be explicitely called. It is a fallback function. We should keen it as simple as possible (for gas).
    myVar = 2;
  }

}
```

> **Pure** functions do not interact with other part of the smart contract excepted other pure methods. An example could be a method that multiples 2 numbers. <br/>
> **View** functions are reading functions. They interact view state variables. It is a "call" not a "transact" so they are free to use on Ethereum.

<br/>

## Other variable types

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24; // Specify compiler version 

contract MyContract  { // Contract definition

  uint8 internal myUint8; // Can only be called by the contract and/or other contracts within it.
  int8 private myInt8; // Can only be called from the contract
  string public coinName = "70 Cent";
  bool isValid = true;
  uint myUint256; // = uint256 

  // Global variables
  uint blockTime = block.timestamp; 
  address sender = msg.sender;

  // Arrays
  string[] public tokenNames = ["Dogecoin", "Luna", "USDC"];
  uint[5] levels = [10, 25, 50, 100, 500];
  
  // Datetime
  uint timeNow1Sec = 1 seconds;
  uint timeNow1MinInSec = 1 minutes;
  uint timeNow1HourInSec = 1 hours;
  uint timeNow1DayInSec = 1 days;
  uint public timeNow1WeekInSec = 1 weeks;

  function divideInteger() public pure returns(uint8) { // The remainer of 5/2 (0.5) will be discard. The return type uint8 rounds the return value. 
    uint five = 5;
    uint two = 2;
    return five/two;
  }

  function wrapAround() public pure returns(uint8) { // The remainer of 5/2 (0.5) will be discard. The return type uint8 rounds the return value. 
    uint8 zero = 0;
    zero--;
    return zero; //The result won't be -1 here since the return type is uint8. The value will be 255.
  }

  function getBalance() public view returns(uint) { // Returns the balance in Wei.
    // 1 Ether 
    //  = 10^18 Wei
    //  = 10^15 KWei
    //  = 10^12 MWei
    //  = 10^9 GWei
    //  = 10^6 Szabo
    //  = 10^3 Finney
    return address(this).balance;
  }

  function() public payable { //Payable is mandatory if we want to pass a Ether value to the smart contract after deployment
    uint balance = msg.value;
  }

  function withdrawEverything() public { //Send back money received in Smart Contract
    msg.sender.transfer(getBalance());
  }
}
```

<br/>

## Modifiers

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24; // Specify compiler version 

contract MyContract  { // Contract definition
  uint public myVarOne;
  uint public myVarTwo;
  bool writable;
  
  modifier mustBeWritable() { // Modifiers can be used to avoid the require() in functions like below
    require(writable);
    _;
  }

  function setWritable(bool _writeable) {
    writeable = _writeable;
  }

  //function updateMyVarOne(uint _myVar) public {
  //  require(writable);
  //  myVarOne = _myVar;
  //}

  //function updateMyVarTwo(uint _myVar) public {
  //  require(writable);
  //  myVarTwo = _myVar;
  //}
  
  function updateMyVarOne(uint _myVar) public mustBeWritable {
    myVarOne = _myVar;
  }

  function updateMyVarTwo(uint _myVar) public mustBeWritable {
    myVarTwo = _myVar;
  }
   
}
```

<br/>

## Mappings 

**Simple mapping:**

```
mapping(string => string) public tradesAccountsMap;
```

<br/>

**Nested mapping:**
```
struct User {
  address userAddress;
  string firstName;
  string lastName;
}

mapping(address => mapping(string => User)) private UserNestedMap;
```

<br/>

## Enum

```
enum cookieSecurity {NONE, LAX, SECURE}
cookieSecurity public cookie = cookieSecurity.SECURE;
```

<br/>

**Autre example:**

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24; // Specify compiler version 

contract MyContract { // Contract definition
  mapping(uint => bool) public myMapping; // key value pairs. All values are false by default. (true for all 256 values)

  function writeSomethingInTheMapping(uint _myInt) public {
    myMapping[_myInt] = true
  }

}
```


<br/>

## Structs

With structs we can define our own data types.

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24; // Specify compiler version 

contract MyContract { // Contract definition
  
  struct MyStruct {
    uint timestamp;
    uint counter;
  }

  mapping(address => MyStruct) public myMapping;

  function myFunction() public {
    myMapping[msg.sender].timestamp = now;
    myMapping[msg.sender].counter++;
  }

}
```

<br/>

## Compare 2 strings 

**Don't do:**
```
string memory coinToFind = "btc";
string[] memory myCoins = ["btc", "eth", "etc"];
for (uint i = 0; i < myCoins.length; i++) {
  string memory coin = myCoins[i];
  if (coinToFind == coin) {
    return i;
  }
}
```

**But do:**

```
string memory coinToFind = "btc";
string[] memory myCoins = ["btc", "eth", "etc"];
for (uint i = 0; i < myCoins.length; i++) {
  string memory coin = myCoins[i];
  if (keccak256(abi.encodePacked(coinToFind) == keccak256(abi.encodePacked(coin)) {
    return i;
  }
}
```
> La **string** en Solidity n'est pas un type natif. C'est un dynamic array. <br/>
> keccak256 est une fonction hash native d'Ethereum. Les fonctions permettant de manipuler les strings (*get string’s length, reading and changing the character at a given location, concat two strings, extracting part of a string* doivent être implémentées manuellement.


<br/>

Solution moins coûteuse en terme gaz:

```
function memoryCompare(bytes memory a, bytes memory b) internal pure returns(bool) {
  return (a.length == b.length) && (keccak256(a) == keccak256(b));
}
function stringCompare(string memory a, string memory b) internal pure returns(bool) {
    return memoryCompare(bytes(a), bytes(b));
}
```

<br/>

## Héritage

```
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 < 0.9.0

contract mySuperContract {
  uint availableSupply;
  uint maxSupply;
  constructor(uint _startingSupply, uint _maxSupply) {
    availableSupply = _startingSupply;
    maxSupply = _maxSupply;
  }
}

contract myChildContract is MySuperContract {
  constructor(uint _ss, uint _ms) MySuperContract(ss, ms) {}

  function getAvailableSupply() public view returns (uint) {
    return availableSupply;
  } 
}
```

<br/>

## Notary app example code

Create a file called `notary.sol`. 

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24; // Specify compiler version 

contract Notary { // Contract definition
  struct MyNotaryDocument {
    bytes32 checkSum; // Hash of the file
    string comments;
    string fileName;
    bool isSet;
    address setBy;
    uint timestamp;
  }

  mapping(bytes32 => myNotaryDocument) public docMapping;

  event NewDocument(bytes32 _checksum, string fileName, address indexed _setBy); // indexed so that we can search by _setBy later (only 3)

  function addDocument(bytes32 _checksum, string _fileName, string comments) public {
    require(!docMapping[_checksum].isSet);

    docMapping[_checksum].isSet = true;
    docMapping[_checksum].fileName = _fileName;
    docMapping[_checksum].timestamp = now;
    docMapping[_checksum].comments = _comments;
    docMapping[_checksum].setBy = msg.sender;

    emit NewDocument(_checksum, _fileName, msg.sender);
  }

  function documentSet(bytes32 _checksum) public view returns(string, uint, string, address) {
    require(docMapping[_checksum].isSet);

    return (docMapping[_checksum].fileName, docMapping[_checksum].timestamp, docMapping[_checksum].comments, docMapping[_checksum].setBy);
  }
}
```

<br/>

## Notary smart contract unit test in JS example

Under test directory create a new file called `notaryTest.js` and add the following content:

```
var NotaryArtifact = artifacts.require("./notary.sol");

contract("NotaryContract", function(accounts) {
  it("This is my first test", function() {
    return NotaryArtifact.deployed().then(function(instance) {
      console.log(instance);
    })
  });

  it("should not be able to find a hash for an unexisting document", async function() {
    return NotaryArtifact.deployed().then(async function(instance) {
      try {
        await instance.documentSet(0x1111111111111111111111111111111111111111111111111111111111111111);
        assert.fail(true, true, "Exception expected while calling documentSet with non existing hash")
      } catch(error) {
        if (error.message.search("revert") >= 0) {
          assert.equal(error.message.search("revert") >= 0, true, "Error Message does not reflect expected Exception Message");
        } else {
          throw error;
        }
      }
    })
  });

  it("should not be able to create the read a document", async () => {
    let instance = await NotaryArtifact.deployed();
    await instance.addDocument(0x2222222222222222222222222222222222222222222222222222222222222222, "test", "test");
    let entry = await instance.documentSet(0x2222222222222222222222222222222222222222222222222222222222222222);
    //console.log(entry)
    assert.equal(entry[0], "test", "Filename should be equal to test");
    assert.equal(entry[1].toNumber() >= 1, true, "Timestamp should be bigger than 1");
    assert.equal(entry[2], "test", "Comment should be equal to test");
    assert.equal(entry[3, accounts[0], "The transaction should have been passed by account 0");

  });
});
```

Then execute `truffle test`.

<br/>

## Notary smart contract unit test in Solidity example

Under test directory create a new file called `notaryTest.sol` and add the following content:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Notary.sol";

contract NotaryTest {
  function testAddAndRead() public {
    Notary notaryContract = Notary(DeployedAddresses.Notary());
    notaryContract.addDocument(0x3333333333333333333333333333333333333333333333333333333333333333, "test", "test");
    string memory fileName;
    uint timestamp;
    string memory comment;
    address sender;
    (fileName, timestamp, comment, sender) = notaryContract.documentSet(0x3333333333333333333333333333333333333333333333333333333333333333);
    Assert.equal(fileName, "test", "Filename should be equal to test");
    Assert.equal(sender, address(this), "The caller and the address of the smart contract creator should be the same")

  }

  function testException() public {
    address notaryAddress = address(DeployedAddresses.Notary());
    bool transactionOk = notaryAddress.call(bytes4(keccak256("documentSet(bytes32)")) "0x4444444444444444444444444444444444444444444444444444444444444444");
    Assert.equal(transactionOk, false, "Transaction should fail");
  }
}
```

Then execute `truffle test`.

<br/>

## Truffle Framework

Truffle is useful when you work with a blockchain development team. 

**Installation**

```
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
echo "export NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist" >> ~/.bashrc
source ~/.bashrc
nvm ls-remote

# Install NodeJS
nvm install v12.22.0
nvm use v12.22.0
nvm use default v12.22.0

# Install truffle
npm i -g truffle

# Create an empty folder and create an empty project
truffle init

# Other Truffle commands
truffle compile
truffle migrate
truffle test

# Install Ganache
git clone --depth=1 https://github.com/trufflesuite/ganache.git && cd ganache
npm install
npm start
```

<br/>

**Truffle project configuration**

Edit the `truffle-config.js` and add the Ganache development network. So inside `module.exports = {networks:{}}` add the following lines of code:

```
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // match any network
      websockets: true
    },
```

Then run `truffle migrate` to deploy the basic smart contract to your dev blockchain.

<br/>

## Autres remarques

* Aujourd'hui Hardhat est plus recommendé que Truffle

* Dans Solidity et Ethereum les data sont stockées à l'intérieur des Smart Contracts. Ce n'est pas toujours le cas avec toutes les Blochains (cf: Solana).

