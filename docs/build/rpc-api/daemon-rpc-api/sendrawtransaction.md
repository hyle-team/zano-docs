Broadcasts a raw transaction encoded in hexadecimal format to the network.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "sendrawtransaction",
  "params": {
    "tx_as_base64": "AwElEBr7PxIAAAAAABr......cQAAAAAAABqBJAAAAAAAABo6BQ",
    "tx_as_hex": "00018ed1535b8b4862e.....368cdc5a86"
  }
}
```
### Request description: 
```
    "tx_as_base64": The transaction data as a base64 string, ready for network broadcast. Used only if tx_as_hex is empty
    "tx_as_hex": The transaction data as a hexadecimal string, ready for network broadcast.

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "status": "OK"
  }
}
```
### Response description: 
```
    "status": Status of the call.

```
<sub>Auto-doc built with: 2.1.6.402[ef0a47c]</sub>