Give an estimation of block height by the given date.

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "alias_lookup",
  "params": {
    "alias_first_leters": "al",
    "n_of_items_to_return": 10
  }
}
```
### Request description: 
```
    "alias_first_leters": Prefix by which the search will be performed.
    "n_of_items_to_return": Maximum number of elements returned (not bigger then 10)

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "aliases": [{
      "address": "ZxCSpsGGeJsS8fwvQ4HktDU3qBeauoJTR6j73jAWWZxFXdF7XTbGm4YfS2kXJmAP4Rf5BVsSQ9iZ45XANXEYsrLN2L2W77dH7",
      "alias": "zxdya6q6whzwqjkmtcsjpc3ku",
      "comment": "Society is never gonna make any progress until we all learn to pretend to like each other.",
      "tracking_key": "18bb94f69ed61b47b6556f3871b89dff8f9a6f4f798f706fd199b05ccf8ef20c"
    }],
    "error_code": "",
    "status": "OK"
  }
}
```
### Response description: 
```
    "aliases": List of alias_rpc_details objects, each containing detailed information about each alias registered to the specified address.
      "address": Address of the alias.
      "alias": Alias itself, a brief shortcut for an address.
      "comment": Arbitrary comment (optional).
      "tracking_key": View secret key of the corresponding address (optional).
    "error_code": Error code, if any.
    "status": Status of the call.

```
<sub>Auto-doc built with: 2.2.0.461[7ecf73f]</sub>