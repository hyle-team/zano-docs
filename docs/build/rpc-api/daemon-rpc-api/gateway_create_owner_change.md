:::caution Testnet only
This RPC method is currently available only on testnet. It will be included in a future mainnet release.
:::

:::danger Admin API - run your own daemon
This is an **admin-level** method and is **disabled by default**, you also sould start `zanod` with `--rpc-enable-admin-api` to enable it.

Owner change is a highly sensitive operation. The response includes `tx_secret_key` - the per-transaction one-time secret - which can be used to decrypt encrypted parts of the unsigned transaction. **Never call this method on a third-party daemon**; always run your **OWN** `zanod` bound to localhost.
:::

Creates a transaction to change the owner of a gateway address. Returns the unsigned tx blob and **two** domain-separated hashes that must be signed independently by the current owner with the same secret key.

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
    "tx_id": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8",
    "hash_to_sign_transfer": "b1c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012",
    "hash_to_sign_ownership": "dc2a4459e7369633a52b1bf277839a00201009a3efbf3ecb69bea2186c26b589",
    "tx_blob": "0100000001...",
    "tx_secret_key": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd0f"
  }
}
```
### Response description:
```
  "status": Status of the call.
  "tx_id": Actual hash of the transaction. Used as a sanity-check parameter in gateway_submit_owner_change and for tx tracking.
  "hash_to_sign_transfer": Domain-separated hash to be signed by the current owner for the gateway input (fee). Computed as H(CRYPTO_HDS_GW_INPUT_SIGNATURE || prepare_prefix_hash_for_sign(tx)).
  "hash_to_sign_ownership": Domain-separated hash to be signed by the current owner for the ownership change proof. Computed as H(CRYPTO_HDS_GW_CHANGE_OWNER_SIGNATURE || tx_id). Distinct from hash_to_sign_transfer so a signature for one role cannot be substituted for the other.
  "tx_blob": Hex representation of the unsigned transaction blob. Pass back to gateway_submit_owner_change unchanged.
  "tx_secret_key": Per-transaction one-time secret. Required if you want to verify the constructed tx via gateway_decrypt_tx_outs_and_update_op before signing. SENSITIVE - never log or send over insecure channels.

```

### Domain separation

Owner change requires **two** independent signatures by the current owner — one for spending the gateway input (fee), one for owner descriptor change. Both are produced by the same secret key but over **different** hashes (the two `hash_to_sign_*` values returned here). This domain-separation binding ensures a signature collected for one role cannot be substituted in the other context.

The corresponding consensus verification in the daemon also verifies each signature against its own DSS-wrapped hash, so signing exactly the bytes returned in each `hash_to_sign_*` field is mandatory.

See also: `gateway_submit_owner_change` to attach the signatures and broadcast.

