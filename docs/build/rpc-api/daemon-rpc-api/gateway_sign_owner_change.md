Signs a gateway owner change transaction and broadcasts it to the network. A single signature from the current owner is used for both the gateway input (fee) and the ownership proof, since both are signed over the same tx hash by the same key.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request:
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "gateway_sign_owner_change",
  "params": {
    "tx_blob": "0100000001...",
    "tx_hash_to_sign": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8",
    "opt_ecdsa_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    "opt_eddsa_signature": "dc2a4459e7369633a52b1bf277839a00201009a3efbf3ecb69bea2186c26b58909351fc9ac90b3ecfdfbc7c66431e0303dca179c138ac17ad9bef1177331a704",
    "opt_custom_schnorr_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01"
  }
}
```
### Request description:
```
    "tx_blob": Hex representation of the unsigned transaction blob from gateway_create_owner_change.
    "tx_hash_to_sign": Hash of the transaction to sign.
    "opt_ecdsa_signature": [optional] ECDSA (Ethereum) signature of tx_hash by the current owner. Exactly one signature type must be specified.
    "opt_eddsa_signature": [optional] EdDSA (Solana) signature of tx_hash by the current owner. Exactly one signature type must be specified.
    "opt_custom_schnorr_signature": [optional] Schnorr signature of tx_hash by the current owner. Exactly one signature type must be specified.

```
### Response:
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "status": "OK",
    "signed_tx_blob": "0100000001..."
  }
}
```
### Response description:
```
    "status": Status of the call.
    "signed_tx_blob": Hex representation of the fully signed transaction blob. The transaction is broadcast automatically upon signing.

```
