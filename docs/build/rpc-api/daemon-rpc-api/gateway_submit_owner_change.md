Submits a gateway owner change transaction: assembles the prepared tx blob with the supplied signatures and broadcasts it to the network. Two domain-separated signatures from the current owner must be supplied: one for the gateway input (fee) and one for the ownership change proof.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "gateway_submit_owner_change",
  "params": {
    "opt_ownership_custom_schnorr_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    "opt_ownership_ecdsa_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    "opt_ownership_eddsa_signature": "dc2a4459e7369633a52b1bf277839a00201009a3efbf3ecb69bea2186c26b58909351fc9ac90b3ecfdfbc7c66431e0303dca179c138ac17ad9bef1177331a704",
    "opt_transfer_custom_schnorr_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    "opt_transfer_ecdsa_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    "opt_transfer_eddsa_signature": "dc2a4459e7369633a52b1bf277839a00201009a3efbf3ecb69bea2186c26b58909351fc9ac90b3ecfdfbc7c66431e0303dca179c138ac17ad9bef1177331a704",
    "tx_blob": "0100000001...",
    "tx_id": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8"
  }
}
```
### Request description: 
```
    "opt_ownership_custom_schnorr_signature": Schnorr signature of hash_to_sign_ownership by the current owner.
    "opt_ownership_ecdsa_signature": ECDSA (Ethereum) signature of hash_to_sign_ownership by the current owner.
    "opt_ownership_eddsa_signature": EdDSA (Solana) signature of hash_to_sign_ownership by the current owner.
    "opt_transfer_custom_schnorr_signature": Schnorr signature of hash_to_sign_transfer by the current owner.
    "opt_transfer_ecdsa_signature": ECDSA (Ethereum) signature of hash_to_sign_transfer by the current owner.
    "opt_transfer_eddsa_signature": EdDSA (Solana) signature of hash_to_sign_transfer by the current owner.
    "tx_blob": Hex representation of the unsigned transaction blob from gateway_create_owner_change.
    "tx_id": Actual hash of the transaction.

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "signed_tx_blob": "0100000001...",
    "status": "OK",
    "status_error": ""
  }
}
```
### Response description: 
```
    "signed_tx_blob": Hex representation of the fully signed transaction blob, ready for sendrawtransaction.
    "status": Status of the call.
    "status_error": Error description if the call failed.

```
<sub>Auto-doc built with: 2.2.1.501[fc57729]</sub>