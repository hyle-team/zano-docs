:::caution Testnet only
This RPC method is currently available only on testnet. It will be included in a future mainnet release.
:::

:::danger Admin API — run your own daemon
This is an **admin-level** method and is **disabled by default**. Start `zanod` with `--rpc-enable-admin-api` to enable it.

Owner change is a highly sensitive operation that determines who controls the gateway address from now on. **Never call this method on a third-party daemon**; always run your own `zanod` bound to localhost.
:::

Submits a gateway owner change transaction: assembles the prepared tx blob with the supplied signatures and broadcasts it to the network. **Two** domain-separated signatures from the current owner must be supplied: one for the gateway input (fee) and one for the ownership change proof. Both signatures are produced by the same current-owner secret key, but over different domain-separated hashes returned by `gateway_create_owner_change`.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request:
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "gateway_submit_owner_change",
  "params": {
    "tx_blob": "0100000001...",
    "tx_id": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8",
    "opt_transfer_ecdsa_signature":  "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    "opt_transfer_eddsa_signature":  "dc2a4459e7369633a52b1bf277839a00201009a3efbf3ecb69bea2186c26b58909351fc9ac90b3ecfdfbc7c66431e0303dca179c138ac17ad9bef1177331a704",
    "opt_transfer_custom_schnorr_signature":  "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01",
    "opt_ownership_ecdsa_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
    "opt_ownership_eddsa_signature": "dc2a4459e7369633a52b1bf277839a00201009a3efbf3ecb69bea2186c26b58909351fc9ac90b3ecfdfbc7c66431e0303dca179c138ac17ad9bef1177331a704",
    "opt_ownership_custom_schnorr_signature": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01"
  }
}
```
### Request description:
```
    "tx_blob": Hex representation of the unsigned transaction blob from gateway_create_owner_change (pass back unchanged).
    "tx_id": The actual tx_id from the gateway_create_owner_change response. Sanity check that the same tx is being submitted.

    Transfer-side signature (over hash_to_sign_transfer) — exactly ONE of the following, matching the current owner key type:
    "opt_transfer_ecdsa_signature": [optional] ECDSA (Ethereum, secp256k1) signature.
    "opt_transfer_eddsa_signature": [optional] EdDSA (Solana, ed25519) signature.
    "opt_transfer_custom_schnorr_signature": [optional] Zano-specific Schnorr signature.

    Ownership-side signature (over hash_to_sign_ownership) — exactly ONE of the following, matching the current owner key type:
    "opt_ownership_ecdsa_signature": [optional] ECDSA (Ethereum, secp256k1) signature.
    "opt_ownership_eddsa_signature": [optional] EdDSA (Solana, ed25519) signature.
    "opt_ownership_custom_schnorr_signature": [optional] Zano-specific Schnorr signature.

```

Both signatures must:
- Be produced by the **same current-owner secret key** (the one whose public key is currently stored in the gateway address descriptor).
- Use the **same scheme** that matches the current owner key type — there is no point mixing schemes here.
- Cover their corresponding domain-separated hash from the `gateway_create_owner_change` response (`hash_to_sign_transfer` for `opt_transfer_*`, `hash_to_sign_ownership` for `opt_ownership_*`).

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
    "signed_tx_blob": Hex representation of the fully signed transaction blob. The transaction is broadcast to the network automatically — no separate sendrawtransaction call is needed.

```

### Verification

After the transaction is confirmed in a block, query `gateway_get_address_info` to verify that the descriptor's `owner_key` field has been updated to the new owner public key. From that block onward, only the new owner's secret key can authorize transactions from this gateway address; the previous owner loses all control.
