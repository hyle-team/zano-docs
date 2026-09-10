---
sidebar_position: 1
---

# [Administrator only] System environment pre-setup

Before starting the TSS service in the signing mode, there are several steps that need to be done after the key generation process completed.

## Steps

### 1. Fill the Bridge Core module settings
The Bridge Core module settings, parameters, and data should be set up.
This includes:
- parameters:
    - `tss_threshold` - the threshold value for the TSS network;
    - `parties` - list of parties (ZEL Core adresses) that are running the TSS service;
- state:
    - `chains` - list of chains that are supported by the TSS network;
    - `tokens` - list of tokens that are supported by the TSS network;

:::info
Samples of the CLI commands to update the Bridge Core module settings can be found [here](https://github.com/Zano-Execution-Layer/zel-core/blob/main/x/bridge/README.md#cli).
:::

To obtain addresses of the TSS service for each chain, there is a list of CLI
commands that can be executed:

- Retrieving the TSS public key points:
```bash
tss-svc helpers vault get pubkey
```
- Parsing the Ethereum address from the public key points:
```bash
tss-svc helpers parse address-eth <x-cord> <y-cord>
```
- Parsing the Bitcoin address (P2PKH) rom the public key points:
```bash
tss-svc helpers parse address-btc <x-cord> <y-cord> --network testnet|mainnet 
```

### 2. Fill the EVM contracts
The TSS service address should be set in the EVM contracts as the signer address.

Use the following function to add the TSS service address to the signers list:
```solidity
function addSigners(address[] calldata signers_) public onlyOwner;
```

### 3. Configure ZANO tokens
When the TSS service public key is generated, Zano tokens should be configured with the new `owner_eth_pub_key` field
to be able to execute the ADO operations using the TSS service signatures.
