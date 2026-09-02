# Exemples de DEX que j'utilise dans mes robots de trading

- Canonical URL: https://leandeep.com/exemples-de-dex-que-jutilise-dans-mes-robots-de-trading/
- Author: Olivier Eeckhoutte
- Published: 2022-07-03T21:25:00Z
- Updated: 2022-07-03T21:25:00Z
- Language: fr
- Tags: RPC, Blockchain, DeFi, Trading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Voici quelques exemples de DEXes sur lesquels mes robots de trading sont connectés ainsi que quelques informations de base les concernants. J'ai pris l'exemple des 2 Blockchains les plus utilisées après Ethereum à savoir **BNB Smart Chain (BSC)** et **Polygon**.

Pour le moment, et jusqu'à ce qu'on passe en version 2, je n'utilise plus Ethereum à cause de gas fees qui rendent les trades moins intéressants.

Bien sûr il y en a plein d'autres et sur des tas de blockchains différentes. (Et il n'y a pas que les blockchains EVM qui offrent des opportunités de trading...)


* Arbitrum
* Avalanche
* BNB Smart Chain (BSC)
* Celo
* Cronos
* Ethereum
* Fantom
* Fuse
* Gnosis (xDAI)
* Harmony (Mainnet Shard 0)
* Moonriver
* Optimism
* Polygon
* Solana


<br/>

## Arbitrum (usage en preprod)

* Uniswap (v3) - https://info.uniswap.org/<br/>
Factory: `0x1F98431c8aD98523631AE4a59f267346ea31F984`<br/>
Router: `0xE592427A0AEce92De3Edee1F18E0157C05861564`


<br/>

## BNB Smart Chain (BSC)

* ApeSwap (v2) - https://apeswap.finance/<br/>
Factory: `0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6`<br/>
Router: `0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7`<br/>
Fees: 0.1%

* BabySwap (v2) - https://home.babyswap.finance/<br/>
Factory: `0x86407bEa2078ea5f5EB5A52B2caA963bC1F889Da`<br/>
Router: `0x325E343f1dE602396E256B67eFd1F61C3A6B38Bd`<br/>
Fees: 0.3%

* Biswap (v2) - https://biswap.org/<br/>
Factory: `0x858E3312ed3A876947EA49d572A7C42DE08af7EE`<br/>
Router: `0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8`<br/>
Fees: 0.2%

* Eros Swap (custom v2) - https://bsc.erosswap.finance/<br/>
Factory & Router: `0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8`<br/>
Fees: 0% how? 0.1% maybe?

* FSTSwap (v2) - https://www.fstswap.pro/<br/>
Factory: `0x9A272d734c5a0d7d84E0a892e891a553e8066dce`<br/>
Router: `0x1B6C9c20693afDE803B27F8782156c0f892ABC2d`<br/>
Fees: 0.3%

* GIBX Swap **(removed)** - https://gibxswap.io/<br/>
Factory: `0x97bCD9BB482144291D77ee53bFa99317A82066E8`

* Jetswap (v2) - https://jetswap.finance/<br/>
Factory: `0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5`<br/>
Router: `0xBe65b8f75B9F20f4C522e0067a3887FADa714800`<br/>
Fees: 0.3%

* JustLiquidity (v2) - https://justliquidity.org/<br/>
Factory: `0x553990F2CBA90272390f62C5BDb1681fFc899675`<br/>
Router: `0xbd67d157502A23309Db761c41965600c2Ec788b2`<br/>
Fees: mêmes que Uniswap: 0.05%;0.3%;1%

* Nomiswap (**≠**v2) - https://nomiswap.io/<br/>
Factory: `0xd6715A8be3944ec72738F0BFDC739d48C3c29349`<br/>
Router: `0xC471647c2c0fFe4E59E8841d5ce1726D052A2d17`<br/>
Fees: 0.1%

* Pancakeswap (v2) - https://pancakeswap.finance/<br/>
Factory: `0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73`<br/>
Router: `0x10ED43C718714eb63d5aA57B78B54704E256024E`<br/>
Fees: 0.30%


<br/>

## Cronos

* CyborgSwap (v2) - https://cyborgswap.io/<br/>
Factory: `0x6C50Ee65CFcfC59B09C570e55D76daa7c67D6da5`<br/>
Router: `0x5bFc95C3BbF50579bD57957cD074fa96a4d5fF9F`<br/>
Fees: 0.25%

* MM Finance (v2) - https://mm.finance/<br/>
Factory: `0xd590cC180601AEcD6eeADD9B7f2B7611519544f4`<br/>
Router: `0x145677FC4d9b8F19B5D56d1820c48e0443049a30`<br/>
Fees: 0.17%

* VVS Finance (v2) - https://vvs.finance/<br/>
Factory: `0x3B44B2a187a7b3824131F8db5a74194D0a42Fc15`<br/>
Router: `0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae`<br/>
Fees: 0.2%


<br/>

## Ethereum

* HoneySwap (v2) - https://honeyswap.org/<br/>
Factory: `0xd34971BaB6E5E356fd250715F5dE0492BB070452`<br/>
Router: `0xB9960d9bcA016e9748bE75dd52F02188B9d0829f`<br/>Fees: 0.25%

* QuickSwap (v2) - https://quickswap.exchange/<br/>
Factory: `0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32`<br/>
Router: `0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff` (preprod. adresses à vérifier)

* ShibaSwap (v2) - https://shibaswap.com/<br/>
Factory: `0x115934131916C8b277DD010Ee02de363c09d037c`<br/>
Router: `0x03f7724180AA6b939894B5Ca4314783B0b36b329`<br/>
Doc: https://shibaswap.gitbook.io/shibaswap/<br/>
Fees: 0.3%

* SushiSwap (v2) - https://sushi.com/<br/>
Factory: `0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac`<br/>
Router: `0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F`<br/>
Fees: 0.3%

* Uniswap (v2) - https://app.uniswap.org<br/>
Factory: `0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f`<br/>
Router: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`<br/>
Fees: 0.3%



<br/>





## Fantom

* JetSwap (v2) - https://jetswap.finance/<br/>
Factory: `0xf6488205957f0b4497053d6422F49e27944eE3Dd`<br/>
Router: `0x845E76A8691423fbc4ECb8Dd77556Cb61c09eE25`<br/>
Fees: 0.3%

* Spookyi (v2) - https://spooky.fi<br/>
Factory: `0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3`<br/>
Router: `0xF491e7B69E4244ad4002BC14e878a34207E38c29`<br/>
Fees: 0.22%

* SushiSwap (v2) - https://sushi.com/<br/>
Factory: `0xc35DADB65012eC5796536bD9864eD8773aBc74C4`<br/>
Router: `0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506`<br/>
Fees: 0.3%

* TombSwap (v2) - https://swap.tomb.com/<br/>
Factory: `0xE236f6890F1824fa0a7ffc39b1597A5A6077Cfe9`<br/>
Router: `0x6D0176C5ea1e44b08D3dd001b0784cE42F47a3A7`<br/>
Fees: 0.5%

<br/>



## Harmony (usage en preprod)

* Defi Kingdoms - https://defikingdoms.com/<br/>
Factory: `0x9014B937069918bd319f80e8B3BB4A2cf6FAA5F7`<br/>
Router: `0x24ad62502d1C652Cc7684081169D04896aC20f30`


<br/>

## Polygon 

* ApeSwap (BANANA) (v2) - https://apeswap.finance<br/>
Factory: `0xCf083Be4164828f00cAE704EC15a36D711491284`<br/>
Router: `0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607`<br/>
Fees: 0.1%

* Dfyn Network (v2) - https://dfyn.network/<br/>
Factory: `0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B`<br/>
Router: `0xA102072A4C07F06EC3B4900FDC4C7B80b6c57429`<br/>
Fees:

* HoneySwap (v2) - https://honeyswap.org/<br/>
Factory: `0x03DAa61d8007443a6584e3d8f85105096543C19c`<br/>
Router: `0xaD340d0CD0B117B0140671E7cB39770e7675C848`<br/>
Fees:

* JetSwap (v2) - https://jetswap.finance/<br/>
Factory: `0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7`<br/>
Router: `0x5C6EC38fb0e2609672BDf628B1fD605A523E5923`<br/>
Fees:

* Polycat (v2) - https://polycat.finance/<br/>
Factory: `0x477Ce834Ae6b7aB003cCe4BC4d8697763FF456FA`<br/>
Router: `0x94930a328162957FF1dd48900aF67B5439336cBD`<br/>
Fees:

* Quickswap (v2) - https://quickswap.exchange/<br/>
Factory: `0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32`<br/>
Router: `0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff`<br/>
Fees: 

* RadioShack (RADIO) (v2) - https://www.radioshack.org/<br/>
Factory: `0xB581D0A3b7Ea5cDc029260e989f768Ae167Ef39B`<br/>
Router: `0xAf877420786516FC6692372c209e0056169eebAf`<br/>
Fees:

* Uniswap (**v3**)<br/>
Factory: `0x1F98431c8aD98523631AE4a59f267346ea31F984`<br/>
Router: `0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45`
Fees:

* SushiSwap (v2) - https://sushi.com/<br/>
Factory: `0xc35DADB65012eC5796536bD9864eD8773aBc74C4`<br/>
Router: `0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506`<br/>
Fees: 0.3%





<br/>

## Gnosis / xDAI (usage en preprod)


* Baoswap (v2) - https://www.baoswap.xyz/#/swap<br/>
Factory: `0x45DE240fbE2077dd3e711299538A09854FAE9c9b`<br/>
Router: `0x6093AeBAC87d62b1A5a4cEec91204e35020E38bE`<br/>
Doc: https://docs.bao.finance/contracts-and-key-info/xdai<br/>
Fees:

* HoneySwap - https://honeyswap.org/<br/>
Factory: `0xA818b4F111Ccac7AA31D0BCc0806d64F2E0737D7`<br/>
Router: `0x1C232F01118CB8B424793ae03F870aa7D0ac7f77`<br/>
Fees:

* SushiSwap - https://sushi.com/<br/>
Factory: `0xc35DADB65012eC5796536bD9864eD8773aBc74C4`<br/>
Router: `0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506`<br/>
Fees:


