Tries to transfer all coins with amount below the given limit to the given address

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "sweep_below",
  "params": {
    "address": "ZxBvJDuQjMG9R2j4WnYUhBYNrwZPwuyXrC7FHdVmWqaESgowDvgfWtiXeNGu8Px9B24pkmjsA39fzSSiEQG1ekB225ZnrMTBp",
    "amount": 1000000000000,
    "asset_id": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
    "fee": 10000000000,
    "max_inputs": 5,
    "min_outputs": 3,
    "mixin": 15,
    "payment_id_hex": ""
  }
}
```
### Request description: 
```
    "address": Public address for sending or receiving native coins.
    "amount": Threshold amount of native coins to sweep.
    "asset_id": [optional] Asset ID to filter outputs. Native coin if not specified.
    "fee": Transaction fee required for processing the transaction.
    "max_inputs": [optional] Maximum number of inputs in sweeping transaction. Default is the maximum possible.
    "min_outputs": [optional] Minimum number of outputs in sweeping transaction. Default is the minimum possible.
    "mixin": Number of outputs from the blockchain to mix with when sending a transaction to improve privacy.
    "payment_id_hex": [deprecated] Legacy tx-wide hex-encoded payment_id, that normally used for user database by exchanges

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "amount_swept": 101000000000,
    "amount_total": 100000000000,
    "asset_id": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
    "outs_swept": 112,
    "outs_total": 10,
    "tx_hash": "01220e8304d46b940a86e383d55ca5887b34f158a7365bbcdd17c5a305814a93",
    "tx_unsigned_hex": "8304d46b940a86e383d55ca5887b34f158a7365bbcdd17c5a305814a9334f158a7368304d46b940a86e383d55ca5887b34f158a7365bbcdd17c5a305814a9334f158a736"
  }
}
```
### Response description: 
```
    "amount_swept": Amount of native coins swept in the transaction.
    "amount_total": Total amount of native coins involved in the transaction.
    "asset_id": Asset ID used to filter outputs.
    "outs_swept": Number of outputs swept in the transaction.
    "outs_total": Total number of outputs in the transaction.
    "tx_hash": Transaction ID (hash) format.
    "tx_unsigned_hex": Unsigned transaction data in hexadecimal format.

```
<sub>Auto-doc built with: 2.2.1.501[fc57729]</sub>