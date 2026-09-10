---
sidebar_position: 5
---

# Create a ZEL Core account

The TSS service requires a core account to be created to correctly interact with the TSS network.
It will be used to identify the party in the network and also submit the data processed transactions to the ZEL Core.

## Generate a new account

To create a new account, use the ZEL Core CLI:
```bash
zel-cored keys add <account_name> --keyring-backend file
```

Alternatively, you can use the previously installed TSS service CLI to generate the private key and the derived address:
```bash
tss-svc helpers generate cosmos-account
```

## Fund the account

In order to send transactions to the ZEL Core, the account must be funded with the native token of the chain.
An example of how to fund the account by transferring tokens from another account is shown below:

```bash
zel-cored tx bank send <from_account> <to_account> 1000000000000000000uzel
```