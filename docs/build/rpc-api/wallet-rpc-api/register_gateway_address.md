:::caution Testnet only
This RPC method is currently available only on testnet. It will be included in a future mainnet release.
:::

Register gateway address to be used in further transfers.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "register_gateway_address",
  "params": {
    "descriptor_info": {
      "meta_info": "Some metadata",
      "opt_owner_custom_schnorr_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
      "opt_owner_ecdsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8e2",
      "opt_owner_eddsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
    },
    "view_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
  }
}
```
### Request description: 
```
    "descriptor_info": Descriptor information for the gateway
      "meta_info": Additional metadata about the gateway
      "opt_owner_custom_schnorr_pub_key": owner's custom Schnorr signature public key
      "opt_owner_ecdsa_pub_key": owner's Ethereum public key
      "opt_owner_eddsa_pub_key": owner's EdDSA public key
    "view_pub_key": View address to register

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "address": "",
    "address_id": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
    "status": "OK",
    "tx_id": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
  }
}
```
### Response description: 
```
    "address": Addres starting from gwZ or gwiZ
    "address_id": Registered gateway address id
    "status": Result (OK if success)
    "tx_id": Transaction id

```
<sub>Auto-doc built with: 2.2.0.461[d830c07]</sub>