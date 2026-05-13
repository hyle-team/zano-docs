:::caution Testnet only
This RPC method is currently available only on testnet. It will be included in a future mainnet release.
:::

:::warning Admin API — run your own daemon
This is an **admin-level** method and is **disabled by default**. Start `zanod` with `--rpc-enable-admin-api` to enable it. Always run **your own daemon**, bound to localhost.
:::

Attaches the owner's signature (produced over the domain-separated `tx_hash_to_sign` returned by `gateway_create_transfer`) to the unsigned tx blob, returning a fully signed transaction blob ready for `sendrawtransaction`.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "gateway_sign_transfer",
  "params": {
    "tx_blob": "0100000001...",
    "tx_id": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8",
    "opt_ecdsa_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    "opt_eddsa_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    "opt_custom_schnorr_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01"
  }
}
```
### Request description: 
```
    "tx_blob": Hex representation of the unsigned transaction blob, as returned by gateway_create_transfer (pass back unchanged).
    "tx_id": Actual hash of the transaction (the tx_id field from the gateway_create_transfer response). Sanity check that the same tx is being signed.
    "opt_ecdsa_signature": ECDSA (Ethereum, secp256k1) signature over tx_hash_to_sign by the current owner. Exactly one signature type must be specified, matching the owner key type.
    "opt_eddsa_signature": EdDSA (Solana, ed25519) signature over tx_hash_to_sign by the current owner.
    "opt_custom_schnorr_signature": Zano-specific Schnorr signature over tx_hash_to_sign by the current owner.

```

Note: the signature is produced over the domain-separated `tx_hash_to_sign` returned by `gateway_create_transfer`, **not** over `tx_id`. See `gateway_create_transfer` documentation for details.

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