Returns wallet helpful wallet information

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "get_wallet_info",
  "params": {
    "collect_utxo_data": false
  }
}
```
### Request description: 
```
    "collect_utxo_data": Collect utxo statistics data(might slow down request, don't use it by default)

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "address": "ZxDNaMeZjwCjnHuU5gUNyrP1pM3U5vckbakzzV6dEHyDYeCpW8XGLBFTshcaY8LkG9RQn7FsQx8w2JeJzJwPwuDm2NfixPAXf",
    "current_height": 112132,
    "has_bare_unspent_outputs": false,
    "is_whatch_only": false,
    "path": "\/some\/path\/to\/wallet\/file.zan",
    "transfer_entries_count": 24,
    "transfers_count": 11
  }
}
```
### Response description: 
```
    "address": string; standard public address of the wallet.
    "current_height": Current wallet/daemon height
    "has_bare_unspent_outputs": Shows if the wallet still has UTXO from pre-zarcanum era
    "is_whatch_only": Shows if the wallet is watch-only
    "path": Path to wallet file location
    "transfer_entries_count": Represent number of internal entries count(each entry represent tx output that have been addressed to this wallet)
    "transfers_count": Represent number of transactions that happened to this wallet(basically tx history)

```
<sub>Auto-doc built with: 2.2.0.461[d830c07]</sub>