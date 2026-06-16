Collects and retreives UTXO statistics

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "get_utxo_stats",
  "params": {
    "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852"
  }
}
```
### Request description: 
```
    "asset_id": (optional) If specified, only UTXO with the given asset id will be analyzed. If omitted, native coin asset id is assumed.

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
    "buckets": [{
      "lower_bound": 10000000,
      "total_amount": 800000000,
      "total_utxo": 13,
      "upper_bound": 500000000
    }]
  }
}
```
### Response description: 
```
    "asset_id": Asset ID the statistics were collected for.
    "buckets": Power-of-ten histogram of UTXO grouped by amount range; empty buckets are omitted.
      "lower_bound": Lower bound of this bucket's amount range (inclusive).
      "total_amount": Sum of amounts of all UTXO in this bucket.
      "total_utxo": Number of UTXO whose amounts fall within this bucket's range.
      "upper_bound": Upper bound of this bucket's amount range (inclusive).

```
<sub>Auto-doc built with: 2.1.19.477[1761256]</sub>