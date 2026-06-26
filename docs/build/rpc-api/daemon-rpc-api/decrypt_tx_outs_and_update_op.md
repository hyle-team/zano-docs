Decrypts transaction outputs and ownership change information, if any. Should be used only with your own local daemon for security reasons.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "decrypt_tx_outs_and_update_op",
  "params": {
    "outputs_addresses": ["ZxDNaMeZjwCjnHuU5gUNyrP1pM3U5vckbakzzV6dEHyDYeCpW8XGLBFTshcaY8LkG9RQn7FsQx8w2JeJzJwPwuDm2NfixPAXf","ZxBvJDuQjMG9R2j4WnYUhBYNrwZPwuyXrC7FHdVmWqaESgowDvgfWtiXeNGu8Px9B24pkmjsA39fzSSiEQG1ekB225ZnrMTBp"],
    "strict_output_addresses_match": false,
    "tx_blob": "ewogICJ2ZXJzaW9uIjogMSwgC....iAgInZpbiI6IFsgewogICAgIC",
    "tx_id": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8",
    "tx_secret_key": "2e0b840e70dba386effd64c5d988622dea8c064040566e6bf035034cbb54a5c08"
  }
}
```
### Request description: 
```
    "outputs_addresses": Destination addresses. Must correspond to tx outputs if strict_output_addresses_match is true, order/count are not important otherwise.
    "strict_output_addresses_match": If true, then outputs_addresses is expected to strictly match tx outputs in order and size. Otherwise all outputs will be attempted to be decoded against all provided address.
    "tx_blob": [or] base64-encoded or hex-encoded tx blob. Can be ommited if tx_id is provided.
    "tx_id": [either] ID for a transaction if it is already in the blockchain. Can be ommited if tx_blob is provided.
    "tx_secret_key": Hex-encoded transaction secret key.

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "asset_update": {
      "asset_updated_descriptor": {
        "operation_type": 1,
        "opt_amount_commitment": "5688b56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
        "opt_asset_id": "cc4e69455e63f4a581257382191de6856c2156630b3fba0db4bdd73ffcfb36b6",
        "version": 2
      },
      "decoded_outputs": [{
        "address": "ZxBvJDuQjMG9R2j4WnYUhBYNrwZPwuyXrC7FHdVmWqaESgowDvgfWtiXeNGu8Px9B24pkmjsA39fzSSiEQG1ekB225ZnrMTBp",
        "amount": 10000000000000,
        "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
        "out_index": 1,
        "payment_id": 0
      }],
      "gw_updated_descriptor": {
        "meta_info": "Some metadata",
        "opt_gateway_address": "gwZ5sqZkre33rxhoo9ht5xcmzy5khvr2hFSfvk7TeXeMXxby7acC3fs1D",
        "opt_owner_custom_schnorr_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
        "opt_owner_ecdsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8e2",
        "opt_owner_eddsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
      }
    },
    "gw_update": {
      "asset_updated_descriptor": {
        "operation_type": 1,
        "opt_amount_commitment": "5688b56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
        "opt_asset_id": "cc4e69455e63f4a581257382191de6856c2156630b3fba0db4bdd73ffcfb36b6",
        "version": 2
      },
      "decoded_outputs": [{
        "address": "ZxBvJDuQjMG9R2j4WnYUhBYNrwZPwuyXrC7FHdVmWqaESgowDvgfWtiXeNGu8Px9B24pkmjsA39fzSSiEQG1ekB225ZnrMTBp",
        "amount": 10000000000000,
        "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
        "out_index": 1,
        "payment_id": 0
      }],
      "gw_updated_descriptor": {
        "meta_info": "Some metadata",
        "opt_gateway_address": "gwZ5sqZkre33rxhoo9ht5xcmzy5khvr2hFSfvk7TeXeMXxby7acC3fs1D",
        "opt_owner_custom_schnorr_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
        "opt_owner_ecdsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8e2",
        "opt_owner_eddsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
      }
    },
    "normal_transfer": {
      "asset_updated_descriptor": {
        "operation_type": 1,
        "opt_amount_commitment": "5688b56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
        "opt_asset_id": "cc4e69455e63f4a581257382191de6856c2156630b3fba0db4bdd73ffcfb36b6",
        "version": 2
      },
      "decoded_outputs": [{
        "address": "ZxBvJDuQjMG9R2j4WnYUhBYNrwZPwuyXrC7FHdVmWqaESgowDvgfWtiXeNGu8Px9B24pkmjsA39fzSSiEQG1ekB225ZnrMTBp",
        "amount": 10000000000000,
        "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
        "out_index": 1,
        "payment_id": 0
      }],
      "gw_updated_descriptor": {
        "meta_info": "Some metadata",
        "opt_gateway_address": "gwZ5sqZkre33rxhoo9ht5xcmzy5khvr2hFSfvk7TeXeMXxby7acC3fs1D",
        "opt_owner_custom_schnorr_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
        "opt_owner_ecdsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8e2",
        "opt_owner_eddsa_pub_key": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
      }
    },
    "status": "OK",
    "tx_in_json": "ewogICJ2ZXJzaW9uIjogMSwgC....iAgInZpbiI6IFsgewogICAgIC",
    "verified_tx_id": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8"
  }
}
```
### Response description: 
```
    "asset_update": Transaction's decoded results for asset update operation
      "asset_updated_descriptor": (optional) asset updated descriptor, for asset update operation
        "operation_type": Asset operation type identifier
        "opt_amount_commitment": (optional) Asset operation amount commitment (register/emit/burn).
        "opt_asset_id": (optional) ID of an asset (emit/burn/update).
        "version": Asset operation type struct version
      "decoded_outputs": Transaction's decoded outputs
        "address": Destination address.
        "amount": Amount begin transferred.
        "asset_id": Asset id.
        "out_index": Index of the corresponding output in the transaction.
        "payment_id": [optional] Intrinsic per-output 8 byte long payment id
      "gw_updated_descriptor": (optional) gateway updated descriptor, for gateway update operation
        "meta_info": Additional metadata about the gateway
        "opt_gateway_address": (optional) gateway address for sertain cases
        "opt_owner_custom_schnorr_pub_key": owner's custom Schnorr signature public key
        "opt_owner_ecdsa_pub_key": owner's Ethereum public key
        "opt_owner_eddsa_pub_key": owner's EdDSA public key
    "gw_update": Transaction's decoded results for gateway update operation
      "asset_updated_descriptor": (optional) asset updated descriptor, for asset update operation
        "operation_type": Asset operation type identifier
        "opt_amount_commitment": (optional) Asset operation amount commitment (register/emit/burn).
        "opt_asset_id": (optional) ID of an asset (emit/burn/update).
        "version": Asset operation type struct version
      "decoded_outputs": Transaction's decoded outputs
        "address": Destination address.
        "amount": Amount begin transferred.
        "asset_id": Asset id.
        "out_index": Index of the corresponding output in the transaction.
        "payment_id": [optional] Intrinsic per-output 8 byte long payment id
      "gw_updated_descriptor": (optional) gateway updated descriptor, for gateway update operation
        "meta_info": Additional metadata about the gateway
        "opt_gateway_address": (optional) gateway address for sertain cases
        "opt_owner_custom_schnorr_pub_key": owner's custom Schnorr signature public key
        "opt_owner_ecdsa_pub_key": owner's Ethereum public key
        "opt_owner_eddsa_pub_key": owner's EdDSA public key
    "normal_transfer": Transaction's decoded results for normal transer
      "asset_updated_descriptor": (optional) asset updated descriptor, for asset update operation
        "operation_type": Asset operation type identifier
        "opt_amount_commitment": (optional) Asset operation amount commitment (register/emit/burn).
        "opt_asset_id": (optional) ID of an asset (emit/burn/update).
        "version": Asset operation type struct version
      "decoded_outputs": Transaction's decoded outputs
        "address": Destination address.
        "amount": Amount begin transferred.
        "asset_id": Asset id.
        "out_index": Index of the corresponding output in the transaction.
        "payment_id": [optional] Intrinsic per-output 8 byte long payment id
      "gw_updated_descriptor": (optional) gateway updated descriptor, for gateway update operation
        "meta_info": Additional metadata about the gateway
        "opt_gateway_address": (optional) gateway address for sertain cases
        "opt_owner_custom_schnorr_pub_key": owner's custom Schnorr signature public key
        "opt_owner_ecdsa_pub_key": owner's Ethereum public key
        "opt_owner_eddsa_pub_key": owner's EdDSA public key
    "status": Status code of operation, OK if success
    "tx_in_json": Serialized transaction represented in JSON, encoded in Base64.
    "verified_tx_id": (Re)calculated transaction id. Can be used in third-party proof generation.

```
<sub>Auto-doc built with: 2.2.1.501[fc57729]</sub>