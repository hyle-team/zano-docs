---
slug: /use/deeplinks
---

# Deeplinks

Based on materials of Matthew Reichardt [me@matthewreichardt.com](mailto:me@matthewreichardt.com) ([https://github.com/hyle-team/zano/issues/269](https://github.com/hyle-team/zano/issues/269))

### Zano URI Scheme

**action** - type of action requested, supported actions:

- send - simply send coins to given address
- escrow - create escrow-contract
- marketplace\_offer\_create - create marketplace offer

### Action "send"

Example of **send** command:

**zano:action
=send&address=ZxCkvE7zhS6JuFE5neAaTtcY8PUT2CwfLZJQWP32jrELB1Vg9oSJyGJDyRWurqX6SXSqxjGz2yrAKaMqmxDa7E8313igosBVT\&comment=Some%20payment**

- address - address of recipient
- amount - amount of asset to be transfered (in a units with decimal point, like 10.0 coins)
- asset_id - id of the asset to be transfered
- comment - comment about payment\[optional]

Here is how link would look like in html:
```html
<p>
  <a href="zano:action=send&address=ZxCkvE7zhS6JuFE5neAaTtcY8PUT2CwfLZJQWP32jrELB1Vg9oSJyGJDyRWurqX6SXSqxjGz2yrAKaMqmxDa7E8313igosBVT&amount=0.1&comment=Some%20payment">Zano link</a>
</p>
```
