---
sidebar_position: 4
---

# Become a validator

:::warning
Please, follow these instructions **ONLY** if you need to become a validator. If you want to set up only the RPC node or
just validate the consensus rules you have already finished with it.
:::

If you want to validate blocks and participate in consensus you have to make your node a validator.

:::info
Please note that `app.toml` file contains the configuration for the minimum gas price acceptable by your validator. For
example:

- `minimum-gas-prices = "1uzel"`

:::

## Step 1: Key generation

First you have to generate keys for the `validator` account. Run the following commands to generate the key:

```bash
zel-cored keys add validator_key --keyring-backend test --home=$ZEL_HOME
```

:::danger
Please, backup the following files and folders:

- `$ZEL_HOME/keyring-test`

:::

Share your validator address (zel...) with our team to receive the tokens required for validator creation.

After receiving confirmation about token accrual, execute the following command to stake tokens and become a validator.

1. **Stake Tokens**: You need to stake exactly `1000000000000000000` (which is equal to 1STAKE).

2. **Run the Command**: Use the following command to stake your tokens and become a validator:
    ```bash
    zel-cored tx staking create-validator --amount 1000000000000000000 ustake --commission-max-change-rate "0.01" --commission-max-rate "0.2" --commission-rate "0.1" --min-self-delegation "1" --details "Meet new ZEL validator" --pubkey $(zel-cored tendermint show-validator --home=$ZEL_HOME) --moniker $MONIKER_NAME --chain-id zel_935-1 --fees 0uzel --from $(zel-cored keys show validator_key -a --home $ZEL_HOME --keyring-backend test) --home=$ZEL_HOME --node=$ZEL_NODE --keyring-backend=test --log_level="debug" --broadcast-mode="block" --trace --gas 10000000
    ```

- `--amount`: The amount of tokens you want to stake (1STAKE).
- `--commission-max-change-rate`: The maximum rate at which your commission can change.
- `--commission-max-rate`: The maximum commsission rate you can charge.
- `--commission-rate`: The commission rate you will charge.
- `--min-self-delegation`: The minimum amount of tokens you must always stake.
- `--details`: A description of your validator.
- `--pubkey`: The public key of your validator (automatically filled in by the command).
- `--moniker`: The name of your validator (replace `YOUR_VALIDATOR_NAME` with your chosen name).
- `--chain-id`: The ID of the blockchain network.
- `--fees`: The transaction fees (set to 0 uzel).
- `--from`: The address of your validator (automatically filled in by the command).
- `--home`: The path to your configuration files.
- `--node`: The address of the node you are connecting to (replace `ZEL_NODE` with the actual node address).
- `--keyring-backend`: The backend you are using for the keyring.
- `--log_level`: The level of logging detail.
- `--broadcast-mode`: The mode for broadcasting the transaction.
- `--trace`: Enables tracing of the transaction.
- `--gas`: The amount of gas to use for the transaction.

:::info
`$ZEL_NODE` is a node address that you can get from our team.
:::