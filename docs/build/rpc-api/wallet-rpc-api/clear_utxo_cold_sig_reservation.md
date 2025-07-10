Clears cold sig reservation flag for all unspent transaction outputs, that have one. Please, use with CAUTION!

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "clear_utxo_cold_sig_reservation",
  "params": {
  }
}
```
### Request description: 
```

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "affected_outputs": [{
      "pk": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
    }],
    "status": "OK"
  }
}
```
### Response description: 
```
    "affected_outputs": List of affected outputs (for reference).
      "pk": Output's one-time public key
    "status": Status of the call

```
<sub>Auto-doc built with: 2.1.8.414[d56bf75]</sub>