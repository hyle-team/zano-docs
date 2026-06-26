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
    "fee": 100000000,
    "new_descriptor_info": {
      "meta_info": "Some metadata",
      "opt_gateway_address": "gwZ5sqZkre33rxhoo9ht5xcmzy5khvr2hFSfvk7TeXeMXxby7acC3fs1D",
      "opt_owner_custom_schnorr_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
      "opt_owner_ecdsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8e2",
      "opt_owner_eddsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
    }
  }
}
```
### Request description: 
```
    "address_id": Gateway address ID to update the owner for.
    "fee": Transaction fee, paid from the gateway address native coin balance.
    "new_descriptor_info": New descriptor info containing the new owner key and optional meta_info.
      "meta_info": Additional metadata about the gateway
      "opt_gateway_address": (optional) gateway address for sertain cases
      "opt_owner_custom_schnorr_pub_key": owner's custom Schnorr signature public key
      "opt_owner_ecdsa_pub_key": owner's Ethereum public key
      "opt_owner_eddsa_pub_key": owner's EdDSA public key

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "hash_to_sign_ownership": "dc2a4459e7369633a52b1bf277839a00201009a3efbf3ecb69bea2186c26b589",
    "hash_to_sign_transfer": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012",
    "status": "OK",
    "status_error": "",
    "tx_blob": "0100000001...",
    "tx_id": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8",
    "tx_secret_key": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd0f"
  }
}
```
### Response description: 
```
    "hash_to_sign_ownership": Hash to be signed by the current owner for the ownership change proof.
    "hash_to_sign_transfer": Hash to be signed by the current owner for the gateway input, same scheme as regular gateway transfers - equals prepare_prefix_hash_for_sign over the tx.
    "status": Status of the call.
    "status_error": Error description if the call failed.
    "tx_blob": Hex representation of the unsigned transaction blob.
    "tx_id": Actual hash of the transaction (for reference and tx tracking).
    "tx_secret_key": Secret key of the transaction.

```
<sub>Auto-doc built with: 2.2.1.501[fc57729]</sub>