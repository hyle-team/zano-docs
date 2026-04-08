Creates a transaction to change the owner of a gateway address. Returns unsigned tx blob and tx hash that must be signed by the current owner.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request:
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "gateway_create_owner_change",
  "params": {
    "address_id": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
    "new_descriptor_info": {
      "opt_owner_ecdsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8e2",
      "opt_owner_eddsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
      "opt_owner_custom_schnorr_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
      "meta_info": "Some metadata"
    },
    "fee": 100000000
  }
}
```
### Request description:
```
    "address_id": Gateway address ID to update the owner for.
    "new_descriptor_info": New descriptor info containing the new owner key and optional meta_info.
      "opt_owner_ecdsa_pub_key": [optional] New owner's Ethereum public key (33 bytes compressed, 66 hex). Exactly one key type must be specified.
      "opt_owner_eddsa_pub_key": [optional] New owner's EdDSA public key (32 bytes, 64 hex). Exactly one key type must be specified.
      "opt_owner_custom_schnorr_pub_key": [optional] New owner's custom Schnorr signature public key (32 bytes, 64 hex). Exactly one key type must be specified.
      "meta_info": [optional] Additional metadata about the gateway.
    "fee": Transaction fee, paid from the gateway address native coin balance.

```
### Response:
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "status": "OK",
    "tx_hash_to_sign": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8",
    "tx_blob": "0100000001..."
  }
}
```
### Response description:
```
  "status": Status of the call.
  "tx_hash_to_sign": Hash of the transaction to be signed by the current owner (for both gateway input and ownership proof).
  "tx_blob": Hex representation of the unsigned transaction blob.

```
