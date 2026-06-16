Returns a list of UTXO/STXO of the wallet (i.e. outputs that were sent to this wallet).

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "get_outputs",
  "params": {
    "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
    "output_type": "unspent"
  }
}
```
### Request description: 
```
    "asset_id": (optional) If specified, only outs with the given asset id will be returned.
    "output_type": (optional) Type of outputs to get. Options are: 'all'/'', 'spent'/'unavailable', 'unspent'/'available', default is 'all'. Note: old spent transfers are truncated from wallet's history unless the wallet is in concise mode.

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "outputs": [{
      "amount": 1000000000000,
      "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
      "block_height": 2734512,
      "block_timestamp": 1712590951,
      "flags": 8,
      "global_index": 123456,
      "key_image": "97d91442f8f3c22683585eaa60b53757d49bf046a96269cef45c1bc9ff7300cc",
      "native_coin": true,
      "out_id": 10,
      "pub_key": "01220e8304d46b940a86e383d55ca5887b34f158a7365bbcdd17c5a305814a93",
      "spendable": true,
      "spent": false,
      "spent_height": 0,
      "tx_id": "5509650e12c8f901e6731a2bfaf3abfd64409e3e1366d3d94cd11db8beddb0c3",
      "tx_out_index": 2
    }]
  }
}
```
### Response description: 
```
    "outputs": List of outputs.
      "amount": Output amount.
      "asset_id": Asset ID of the output.
      "block_height": Height of the block containing the producing transaction.
      "block_timestamp": Unix timestamp of the block containing the producing transaction.
      "flags": Bitmask of state flags: 0x01 -- spent, 0x02 -- blocked, 0x04 -- reserved for an escrow proposal, 0x08 -- mined output, 0x10 -- reserved for cold-signing, 0x80 -- reserved for an asset operation with external signing.
      "global_index": Global output index assigned by the blockchain.
      "key_image": Key image computed for this output.
      "native_coin": True if 'asset_id' is the native-coin asset ID.
      "out_id": Wallet-internal output ID (stable for the wallet's lifetime). Can be passed to 'transfer' via 'out_ids_to_spend' to constrain output selection.
      "pub_key": Output's public key.
      "spendable": True if the output is currently eligible for a new transfer (unspent, unblocked, and not reserved).
      "spent": True if the output is marked as spent.
      "spent_height": Height of the block in which this output was spent on-chain, or 0 if not yet spent on-chain.
      "tx_id": Hash of the transaction that produced this output.
      "tx_out_index": Index of this output within the producing transaction's output vector.

```
<sub>Auto-doc built with: 2.1.19.477[1761256]</sub>