Signs a transfer from gateway address.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "gateway_sign_transfer",
  "params": {
    "opt_custom_schnorr_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    "opt_ecdsa_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    "opt_eddsa_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    "tx_blob": "0100000001...",
    "tx_hash_to_sign": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8"
  }
}
```
### Request description: 
```
    "opt_custom_schnorr_signature": Custom Schnorr signature for signing the transaction.
    "opt_ecdsa_signature": Ethereum signature for signing the transaction.
    "opt_eddsa_signature": EdDSA signature for signing the transaction.
    "tx_blob": Hex representation of the transaction blob to sign.
    "tx_hash_to_sign": Hash of the transaction to sign.

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "signed_tx_blob": "0100000001...",
    "status": "OK"
  }
}
```
### Response description: 
```
    "signed_tx_blob": Hex representation of the signed transaction blob.
    "status": Status of the call.

```
<sub>Auto-doc built with: 2.2.0.461[d830c07]</sub>