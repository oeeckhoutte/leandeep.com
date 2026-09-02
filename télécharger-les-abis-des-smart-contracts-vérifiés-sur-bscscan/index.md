# Télécharger les ABIs des smart contracts vérifiés sur bscscan

- Canonical URL: https://leandeep.com/t%C3%A9l%C3%A9charger-les-abis-des-smart-contracts-v%C3%A9rifi%C3%A9s-sur-bscscan/
- Author: Olivier Eeckhoutte
- Published: 2022-07-03T21:25:00Z
- Updated: 2022-07-03T21:25:00Z
- Language: fr
- Tags: RPC, Blockchain, DeFi, Trading
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Tout est dans le titre. Voici un script très simple permettant de télécharger les ABIs disponibles sur BSC Scan.

Créer un fichier `get_abi.py` et coller le contenu suivant:

<br/>

```
#!/usr/bin/python
import argparse
import requests
import json


ABI_ENDPOINT = "https://api.etherscan.io/api?module=contract&action=getabi&address="

parser = argparse.ArgumentParser()
parser.add_argument("-a", "--address", type=str, help="Smart contract address")
parser.add_argument("-o", "--output", type=str, help="Path to store the output ABI JSON file", required=True)

def __main__() -> None:
    """Exports contract ABI in JSON"""
    args = parser.parse_args()
    resp_json_ = requests.get(f"{ABI_ENDPOINT}{args.addr}").json()
    abi_json = json.loads(resp_json["result"])
    result = json.dumps({"abi": abi_json}, indent=4, sort_keys=True)
    open(args.output, "w").write(result)

if __name__ == "__main__":
    __main__()
```

<br/>

Et voici la commande pour utiliser ce script:

`python get_abi --address=ADDRESS_CONTRACT --output=OUTPUT_PATH`
