---
sidebar_position: 2
---

# Prerequisites

Before starting the TSS service in signing mode, there are several steps that need to be done after the key generation process is completed.

## Steps

### 1. Configure the Bitcoin wallet [If used]

The Bitcoin wallet should be configured to track the outputs of the TSS service address.
The `importdescriptors` wallet command should be executed to import the TSS service address descriptor for P2PKH transactions.

:::info
When importing new address descriptor, remember to use the compressed public key format, f.e. `pkh(027356..00)#[hash]`
:::

To get the compressed public key of the TSS, the next CLI commands can be executed:
- Retrieving the TSS public key points:
```bash
tss-svc helpers vault get pubkey
```
- Parsing the public key info:
```bash
tss-svc helpers parse pubkey <x-cord> <y-cord>
```

### 2. Complete the configuration file
The configuration file should be fully completed before starting the TSS service.
This includes complete chains configuration (bridge addresses, confirmations, network, RPC endpoints)

:::info
Remember to fill up the `tss` configuration section with the start time, session id and threshold values.
Make sure that the `tss` section is the same for all parties.
:::


### 3. Run the database migration
Run the database migration to create the required tables and indexes:
```bash
tss-svc service migrate up
```

