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

**zano\:action
\=send\&address=ZxCkvE7zhS6JuFE5neAaTtcY8PUT2CwfLZJQWP32jrELB1Vg9oSJyGJDyRWurqX6SXSqxjGz2yrAKaMqmxDa7E8313igosBVT\&comment='Some%20payment'\&mixins=11\&hide\_sender=true\&hide\_receiver=true**

- address - address of recipient
- amount - amount of asset to be transfered (in a units with decimal point, like 10.0 coins)
- asset_id - id of the asset to be transfered
- comment - comment about payment\[optional]
- mixins - number of mixins\[optional]
- hide\_sender - specify if sender address should be included in transaction(and visible for receiver)
- hide\_receiver - specify if receiver address should be included in transaction(and visible for sender later, if wallet been restored from seed phrase)

### Action "marketplace\_offer\_create"

Example of **marketplace\_offer\_create** command:

**zano\:action
\=marketplace\_offer\_create\&mixins=11\&hide\_sender=true\&hide\_receiver=true\&title='Random t-shirt'\&description='One size fits all'\&category='merch-tshirt'\&price=10\&img-url=''\&contact='@ravaga'\&comments='zzzz'**

**Basic params:**

- mixins - number of mixins\[optional]
- hide\_sender - specify if sender address should be included in transaction(and visible for receiver)
- hide\_receiver - specify if receiver address should be included in transaction(and visible for sender later, if wallet been restored from seed phrase)

**Offer details:**

- title – offer title
- description – detailed offer description
- category – store defined category
- price – price in ZANO
- img-url – ipfs/arweave link to offer image
- contact – preferred way of communication (telegram, email, zano alias)
- comments -additional comments about the offer

### Action "escrow"

Example of **escrow** command:

**zano\:action
\=escrow\&description='Some Description'\&seller\_address='ZxCXALhZRodKmqRCWUPNAUCXqprJBNKv4eFsjzcMooAGVM6J2U2vSyTNpxNybwBnvzGWLtSWpBiddSZhph8HNfBn1bVE3c6ix'\&amount='10'\&my\_deposit='5'\&seller\_deposit='5'\&comment='Some comment if needed'**

**Escrow parameters:**

- description – Escrow description
- seller\_address – Address of the wallet that have to accept/reject this offer
- amount – Total amount of the deal (not include security deposits)
- my\_deposit – amount of coins that buyer put as a deposit
- seller\_deposit – amount of coins that seller supposed to put as a deposit if he accept escrow
- comment – any comments regarding this deal

All mentioned information will be encrypted and won't be available for third party.
