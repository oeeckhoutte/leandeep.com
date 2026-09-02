# Commandes de synchronisation/dev Geth

- Canonical URL: https://leandeep.com/commandes-de-synchronisation/dev-geth/
- Author: Olivier Eeckhoutte
- Published: 2022-06-30T09:49:00+02:00
- Updated: 2022-06-30T09:49:00+02:00
- Language: fr
- Tags: Tip, Blockchain, BNB Smart Chain, BSC
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Dans cet article très court, vous trouverez des commandes utiles pour vérifier si votre noeud BSC (Geth) est synchronisé ou non, ainsi que d'autres commandes utiles pour développer sur cette Blockchain.

<br/>

## Synchronisation 

Si vous n'avez pas accès la machine, vous pouvez utiliser `curl`:

```
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' http://127.0.0.1:8545
```


<br/>

Par contre, si vous avez accès à `geth` sur le serveur faisant tourner la blockchain vous pouvez utiliser une de ces deux commandes:

```
./geth_bsc --exec "loadScript('GethSyncingProgress_2TimeEstimate.js')" attach ./node/geth.ipc
```

Le script MIT réalisé [par Lyricalpolymath `GethSyncingProgress_2TimeEstimate.js`](https://github.com/lyricalpolymath/Ethereum-Scripts/blob/master/GethSyncingProgress_2TimeEstimate.js) est le suivant:

```
/**
*   GETH SYNCING PROGRESS - TIME ESTIMATE
*  a script to estimate how much time is left to fully sync the Ethereum Blockchain with Geth
*  
*  If it takes too long, consider restarting geth with 
*		the '--fast' option (not suggested for developers), 
*		or better the '--cache=1024' or '--cache=2048 option that will assign more RAM to geth and make it faster
* 
*  (c) Lyricalpolymath 2016. MIT Licence 
*  http://github.com/lyricalpolymath
*/


// run like this
// $ geth --exec "loadScript('GethSyncingProgress_2TimeEstimate.js')" attach  

                   
//number of blocks to test before we give a timing estimate    
var resolution = 10; 

var startDate = new Date();
var endDate;
var s = eth.syncing;
var block1 = s.currentBlock
var blockLast = block1 + resolution
 

// convert the duration for the stats
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24), 
		days = parseInt((duration / (1000 * 60 * 60 * 24)) % 365);
       
    var h = (hours < 10) ? "0" + hours : hours;
    var m = (minutes < 10) ? "0" + minutes : minutes;
    var s = (seconds < 10) ? "0" + seconds : seconds;

    return days + "d :" + hours + "h :" + minutes + "m :" + seconds + "s." + milliseconds;
}
    

function displayTimeEstimate() {
	s = eth.syncing;
	var blocksLeft = (s.highestBlock-s.currentBlock)   
	var time_duration = endDate - startDate  //returns amount of milliseconds passed
	var time_duration_readable = msToTime(time_duration);
	var time_left = msToTime( (time_duration / resolution) * blocksLeft );
	
	console.log("------------ GETH SYNCING PROGRESS - Time estimate")
	console.log("progress: " + (s.currentBlock/s.highestBlock*100));
	console.log("Estimated Time left*: " + time_left);
	console.log("Time it took to parse " + resolution + " blocks: " + time_duration_readable); 
	console.log("blocks left to parse: " + blocksLeft ); 
	 
	if(time_duration_readable.indexOf("0d") != -1) {
		console.log("--------------------------------------------------") 
		console.log("*WARNING: this is just an ESTIMATE based on how much time it took to parse " + resolution + " blocks. But each block is different, some take longer than others because they have more transactions, and also, new blocks are continuously added");
		console.log("If it takes too long, consider restarting geth with the '--fast' option (not suggested for developers), or better the '--cache=1024' or '--cache=2048 option that will assign more RAM to geth and make it faster");
	}  
}


// wait untill the number of Blocks isn't like the BlockLast
// and then calculate the time difference and show it on the console 
console.log("\nGeth Syncing progress Time Estimate - STARTED - be patient, this might take ≈" + (resolution*5) + " seconds approximately")
do {
   var cb = eth.syncing.currentBlock;
   if (cb >= blockLast) {
	   endDate = new Date();
	   displayTimeEstimate()
   }
} while(cb < blockLast) 
```

<br/>

Ou cette commande plus simple:

```
./geth_bsc --exec 'var s = eth.syncing; console.log("\n------------ GETH SYNCING PROGRESS\nprogress: " + (s.currentBlock/s.highestBlock*100)+ " %\nblocks left to parse: "+ (s.highestBlock-s.currentBlock) + "\ncurrent Block: " + s.currentBlock + " of " + s.highestBlock)' attach ./node/geth.ipc
```


<br/>

## Tunnel vers Geth si remote access not configured

*Bien sûr à ne pas utiliser en production*

```
ssh -N -v -p PORT_SSH VOTRE_SSH_USER@VOTRE_SSH_SERVER -L 8545:localhost:8545
```



