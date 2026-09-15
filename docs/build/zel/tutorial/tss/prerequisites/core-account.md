---
sidebar_position: 5
title: Prepare a ZEL Core account
---

# Prepare a ZEL Core account

Each approved TSS party needs a ZEL Core account to identify itself and submit transactions. Prepare the account only after the team's [Vault setup](./secrets.md) and service configuration are complete.

## Generate the account

Use the approved service configuration and explicitly select Vault output and the ZEL address prefix:

```bash
tss-svc helpers generate cosmos-account --hrp zel --output vault --config /path/to/approved-config.yaml
```

:::danger Private key output
Do not omit `--output vault`. The helper's default output is the console and includes the private key. Do not use console or file output for shared testnet signer accounts, or capture key-generation output in session logs.
:::

Account creation must use the party's assigned Vault path and scoped identity. Do not overwrite an existing signing account. Follow the team's recovery and account-rotation procedure when replacing a party.

## Fund and register the account

Give the operator coordinator only the public `zel...` account address. Obtain testnet gas funds and confirm the balance through the approved node.

The team must provide the funding amount, gas settings, account registration procedure, and current party list. Funding an account does not make it an authorized signer.
