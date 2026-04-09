:::caution Testnet only
This RPC method is currently available only on testnet. It will be included in a future mainnet release.
:::

Initiates a transfer from gateway address. Create tx that need to be signed.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "gateway_create_transfer",
  "params": {
    "comment": "Some comment",
    "destinations": [{
      "address": "ZxBvJDuQjMG9R2j4WnYUhBYNrwZPwuyXrC7FHdVmWqaESgowDvgfWtiXeNGu8Px9B24pkmjsA39fzSSiEQG1ekB225ZnrMTBp",
      "amount": 10000000000000,
      "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
      "payment_id": 1020394
    }],
    "fee": 100000000,
    "origin_gateway_id": "gateway1qxyz...",
    "service_entries": [{
      "body": "dcfd7e055a6a3043ea3541a571a57a63e25dcc64e4a270f14fa9a58ac5dbec85dcfd7e055a6a3043ea3541a571a57a63e25dcc64e4a270f14fa9a58ac5dbec85",
      "flags": 0,
      "instruction": "K",
      "security": "d8f6e37f28a632c06b0b3466db1b9d2d1b36a580ee35edfd971dc1423bc412a5",
      "service_id": "C"
    }],
    "service_entries_permanent": false
  }
}
```
### Request description: 
```
    "comment": Comment for the gateway transfer.
    "destinations": Details of the gateway transfer destinations.
      "address": Destination address
      "amount": Amount to transfer to destination
      "asset_id": Asset id to transfer
      "payment_id": [optional] Intrinsic 8-byte payment id for this destination. Incompatible with integrated addresses.
    "fee": Transaction fee for the gateway transfer.
    "origin_gateway_id": Origin gateway ID for the transfer.
    "service_entries": Service entries for the gateway transfer.
      "body": Hex-encoded body of the attachment
      "flags": Flags that help wallet to automatically process some properties of the attachment(combination of TX_SERVICE_ATTACHMENT_ENCRYPT_BODY=1, TX_SERVICE_ATTACHMENT_DEFLATE_BODY=2, TX_SERVICE_ATTACHMENT_ENCRYPT_BODY_ISOLATE_AUDITABLE=4,TX_SERVICE_ATTACHMENT_ENCRYPT_ADD_PROOF=8 )
      "instruction": Instruction that make sence for this particular service
      "security": Hex-encoded public key of the owner, optional
      "service_id": Service ID, identificator that diferent one service from another
    "service_entries_permanent": Whether the service entries are permanent.

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "status": "OK",
    "tx_blob": "0100000001...",
    "tx_hash_to_sign": "a6e8da986858e6825fce7a192097e6afae4e889cabe853a9c29b964985b23da8"
  }
}
```
### Response description: 
```
    "status": Status of the call.
    "tx_blob": Hex representation of the transaction blob.
    "tx_hash_to_sign": Hash of the transaction created for the gateway transfer.

```
<sub>Auto-doc built with: 2.2.0.461[d830c07]</sub>