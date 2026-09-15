---
sidebar_position: 4
title: Approved validator setup
---

# Approved validator setup

:::warning Team approval required
The testnet validator set is team-managed. This reference does not open validator applications. Continue only after the team has approved the node, assigned the required staking funds, and provided the release-specific transaction parameters.
:::

A full node does not need to become a validator to serve RPC or verify consensus. A consensus validator is also not automatically a bridge signer.

## Prepare the account

Use an encrypted keyring on the approved operator host:

```bash
zel-cored keys add validator_key --keyring-backend file --home="$ZEL_HOME"
```

Back up the account recovery material securely. Share only the public address with the team; never share the mnemonic or consensus private key.

## Create the validator

The team must supply the approved stake amount in `ustake`, gas price in `uzel`, and target RPC. Do not use native gas tokens as the staking denomination or assume zero fees are accepted.

After the node is synchronized, set `ZEL_STAKE_AMOUNT`, `ZEL_GAS_PRICES`, and `ZEL_NODE` to those reviewed values:

```bash
: "${ZEL_STAKE_AMOUNT:?Set the approved amount including ustake}"
: "${ZEL_GAS_PRICES:?Set the approved gas price including uzel}"
: "${ZEL_NODE:?Set the approved consensus RPC}"
zel-cored tx staking create-validator \
  --amount "$ZEL_STAKE_AMOUNT" \
  --commission-max-change-rate "0.01" \
  --commission-max-rate "0.2" \
  --commission-rate "0.1" \
  --min-self-delegation "1" \
  --pubkey "$(zel-cored tendermint show-validator --home="$ZEL_HOME")" \
  --moniker "$MONIKER_NAME" \
  --chain-id zel_9350-1 \
  --from validator_key \
  --keyring-backend file \
  --home "$ZEL_HOME" \
  --node "$ZEL_NODE" \
  --gas auto --gas-adjustment 1.3 --gas-prices "$ZEL_GAS_PRICES"
```

The commission settings above are examples and must also be approved for the operator. Review the transaction before confirming it. Verify successful inclusion and validator status afterward; broadcasting alone does not prove admission to the active set.

## Preserve consensus state

Keep the consensus key and its latest signing state together in the approved recovery process. Never reset `data/priv_validator_state.json`, restore an older signing state, or start another node with the same consensus key.
