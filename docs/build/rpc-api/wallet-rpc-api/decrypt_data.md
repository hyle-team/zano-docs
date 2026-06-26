Decrypt base64 encoded data message with chacha using wallet view secret key

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "decrypt_data",
  "params": {
    "buff": "ZGNjc2Ztc2xrZm12O2xrZm12OydlbGtmdm0nbGtmbXY="
  }
}
```
### Request description: 
```
    "buff": base64-encoded ciphertext

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "res_buff": "ZGNjc2Ztc2xrZm12O2xrZm12OydlbGtmdm0nbGtmbXY="
  }
}
```
### Response description: 
```
    "res_buff": base64-encoded decrypted result

```
<sub>Auto-doc built with: 2.2.1.501[fc57729]</sub>