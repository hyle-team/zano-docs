Return wallet seed, which could be password-protected(seed secured with passphrase) or open(unsecured seed). If no password provided it returns open (unsecured) seed. 

URL: ```http:://127.0.0.1:11211/json_rpc```
### Request: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "get_restore_info",
  "params": {
    "seed_password": "010101012"
  }
}
```
### Request description: 
```
    "seed_password": Password to secure wallet's seed

```
### Response: 
```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "creation_timestamp": 212100,
    "derivation_secret": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
    "is_auditable": false,
    "seed_phrase": "girlfriend unlike offer mutter tightly social silent expect constant bid nowhere reach flower bite salt becomeconversation dog rush quietly become usually lightning midnight each secret class"
  }
}
```
### Response description: 
```
    "creation_timestamp": Prety mych self explanatory
    "derivation_secret": Wallet's secret that is used for key derivations, presented in hex, 32 bytes
    "is_auditable": Point if the wallet is auditable or regular
    "seed_phrase": Wallet's seed(secured with password if it was provided in argument)

```
<sub>Auto-doc built with: 2.2.0.461[7ecf73f]</sub>