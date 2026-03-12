Retrieves information about a gateway address.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "gateway_get_address_info",
  "params": {
    "gateway_address": "gateway1qxyz..."
  }
}
```
### Request description: 
```
    "gateway_address": The gateway address for which information is being requested.

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "balances": [{
      "amount": 100000000,
      "asset_id": "729811f9340537e8d5641949e6cc58261f91f109687a706f39bae9514757e819"
    }],
    "descriptor_info": {
      "meta_info": "Some metadata",
      "opt_owner_custom_schnorr_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
      "opt_owner_eddsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
      "opt_owner_eth_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8e2"
    },
    "gateway_view_pub_key": "0feef5e2ea0e88b592c0a0e6639ce73e12ea9b3136d89464748fcb60bb6f18f5",
    "payment_id": "4cf2c7c7e16d1a2a",
    "status": "OK"
  }
}
```
### Response description: 
```
    "balances": List of balances for different asset_id associated with the gateway address.
      "amount": The amount of the specified currency in the gateway balance entry.
      "asset_id": The asset ID for the gateway balance entry.
    "descriptor_info": Information about the specified gateway address.
      "meta_info": Additional metadata about the gateway
      "opt_owner_custom_schnorr_pub_key": owner's custom Schnorr signature public key
      "opt_owner_eddsa_pub_key": owner's EdDSA public key
      "opt_owner_eth_pub_key": owner's Ethereum public key
    "gateway_view_pub_key": Gateway view public key associated with the gateway address.
    "payment_id": Payment ID associated with the gateway address.
    "status": Status of the call.

```
<sub>Auto-doc built with: 2.2.0.461[7ecf73f]</sub>