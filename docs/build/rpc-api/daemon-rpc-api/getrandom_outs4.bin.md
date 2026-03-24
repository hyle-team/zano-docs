Version 4 of the command to retrieve random decoy outputs for specified amounts, focusing on either pre-zarcanum or post-zarcanum zones based on the amount value.

URL: ```http:://127.0.0.1:11211/getrandom_outs4.bin```
### Request: 
```json
{
  "batches": [{
    "heights": [0],
    "input_amount": 1000000
  }],
  "height_upper_limit": 2555000,
  "look_up_strategy": "LOOK_UP_STRATEGY_REGULAR_TX"
}
```
### Request description: 
```
  "batches": List of request batches, each containing an amount and corresponding heights to be processed.
    "heights": Array of heights to be processed in the batch.
    "input_amount": Amount to be processed in the batch.
  "height_upper_limit": Maximum blockchain height from which decoys can be taken. If nonzero, decoys must be at this height or older.
  "look_up_strategy": LOOK_UP_STRATEGY_REGULAR_TX or LOOK_UP_STRATEGY_POS_COINBASE

```
### Response: 
```json
{
  "blocks_batches": [{
  }],
  "status": "OK"
}
```
### Response description: 
```
  "blocks_batches": Blocks collected by node
  "status": Status of the call.

```
<sub>Auto-doc built with: 2.2.0.461[d830c07]</sub>