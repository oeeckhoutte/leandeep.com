# Phases de synchronisation sur Erigon et liens vers l'architecture

- Canonical URL: https://leandeep.com/phases-de-synchronisation-sur-erigon-et-liens-vers-larchitecture/
- Author: Olivier Eeckhoutte
- Published: 2023-02-14T07:00:00+02:00
- Updated: 2023-02-14T07:00:00+02:00
- Language: fr
- Tags: Blockchain
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


## Steps de synchronisation sur Erigon

```
var (
	Snapshots           SyncStage = "Snapshots"       // Snapshots
	Headers             SyncStage = "Headers"         // Headers are downloaded, their Proof-Of-Work validity and chaining is verified
	CumulativeIndex     SyncStage = "CumulativeIndex" // Calculate how much gas has been used up to each block.
	BlockHashes         SyncStage = "BlockHashes"     // Headers Number are written, fills blockHash => number bucket
	Bodies              SyncStage = "Bodies"          // Block bodies are downloaded, TxHash and UncleHash are getting verified
	Senders             SyncStage = "Senders"         // "From" recovered from signatures, bodies re-written
	Execution           SyncStage = "Execution"       // Executing each block w/o buildinf a trie
	Translation         SyncStage = "Translation"     // Translation each marked for translation contract (from EVM to TEVM)
	VerkleTrie          SyncStage = "VerkleTrie"
	IntermediateHashes  SyncStage = "IntermediateHashes"  // Generate intermediate hashes, calculate the state root hash
	HashState           SyncStage = "HashState"           // Apply Keccak256 to all the keys in the state
	AccountHistoryIndex SyncStage = "AccountHistoryIndex" // Generating history index for accounts
	StorageHistoryIndex SyncStage = "StorageHistoryIndex" // Generating history index for storage
	LogIndex            SyncStage = "LogIndex"            // Generating logs index (from receipts)
	CallTraces          SyncStage = "CallTraces"          // Generating call traces index
	TxLookup            SyncStage = "TxLookup"            // Generating transactions lookup index
	Finish              SyncStage = "Finish"              // Nominal stage after all other stages

	MiningCreateBlock SyncStage = "MiningCreateBlock"
	MiningExecution   SyncStage = "MiningExecution"
	MiningFinish      SyncStage = "MiningFinish"
	// Beacon chain stages
	BeaconHistoryReconstruction SyncStage = "BeaconHistoryReconstruction" // BeaconHistoryReconstruction reconstruct missing history.
	BeaconBlocks                SyncStage = "BeaconBlocks"                // BeaconBlocks are downloaded, no verification
	BeaconState                 SyncStage = "BeaconState"                 // Beacon blocks are sent to the state transition function
	BeaconIndexes               SyncStage = "BeaconIndexes"               // Fills up Beacon indexes

)
```
> Source: https://pkg.go.dev/github.com/ledgerwatch/erigon/eth/stagedsync/stages


<br/>

## Organisation des données sur Erigon

https://github.com/ledgerwatch/erigon/blob/devel/docs/programmers_guide/db_walkthrough.MD

> * Info sur les events: https://github.com/ledgerwatch/erigon/blob/devel/docs/programmers_guide/db_walkthrough.MD#table-receipts-1
<br/><br/>
> * Accéder à la DB d'Erigon en local via Python sans RPC call via https://lmdb.readthedocs.io/en/release/

<br/>

## Architecture d'Erigon

https://erigon.substack.com/p/architecture-of-erigon-separable?s=w
