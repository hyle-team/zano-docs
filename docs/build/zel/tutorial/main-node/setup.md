---
sidebar_position: 1
---

# Prepare the main node

## Step 1: Download the binary

First, you have to install all necessary dependencies. You can download the binary file from
the [GitHub release](https://github.com/Zano-Execution-Layer/zel-core/releases/tag/v12.2.0-rc11). Alternatively, you can
build the core binary from the source code by yourself.

:::warning
The release binary is built under the Alpine linux. If you are using Ubuntu linux, please install the "musl-dev" package
using the following command to be able to use Alpine binary on your machine:

```shell
sudo apt install musl-dev
```

:::

To generate the configuration files, download the core binary file and rename it to `ZEL Core` if needed.

## Step 2: Prepare configuration

To generate configs file download the core binary file (we will name it `ZEL Core` but you probably will
download `zel-cored`). Then, set up the environment:

```bash
export MONIKER_NAME=YOUR_VALIDATOR_NAME
export ZEL_HOME=YOUR_CORE_HOME_PATH
```

To initialize the node struct and generate configs execute the following command:

```bash
zel-cored init $MONIKER_NAME --chain-id <chaiID_xxxx-x>  --home=$ZEL_HOME --keyring-backend test
```

- `--chain-id` specifies the chain ID of the network (this can be changed).
- `--home` specifies the path to the configuration files.
- `--keyring-backend` specifies the backend you are using for the keyring. It is okay to use `test` keyring.

:::danger
Please, backup the following files and folders:

```bash
$ZEL_HOME/config/priv_validator_key.json
$ZEL_HOME/config/node_key.json
```
:::

After, you may need to configure the **app.toml**, **config.toml** and **genesis.json** files in the `$ZEL_HOME/config`.

:::info
The **config.toml** file contains the following useful properties that you may want to configure:

```toml
# Maximum number of unique clientIDs that can /subscribe
# If you're using /broadcast_tx_commit, set to the estimated maximum number
# of broadcast_tx_commit calls per block.
max_subscription_clients = 100

# Maximum number of unique queries a given client can /subscribe to
# If you're using GRPC (or Local RPC client) and /broadcast_tx_commit, set to
# the estimated # maximum number of broadcast_tx_commit calls per block.
max_subscriptions_per_client = 5
```

In turn, **app.toml** contains necessary API configuration that you may want to enable:

```toml
[api]

# Enable defines if the API server should be enabled.
enable = true

# Swagger defines if swagger documentation should automatically be registered.
swagger = true

# Address defines the API server to listen on.
address = "tcp://0.0.0.0:1317"
```

Also, in  **app.toml** you can find some necessary configs for state syncing of other nodes in the future:

```toml
[state-sync]
# snapshot-interval specifies the block interval at which local state sync snapshots are
# taken (0 to disable).
snapshot-interval = 500

# snapshot-keep-recent specifies the number of recent snapshots to keep and serve (0 to keep all).
snapshot-keep-recent = 0
```

Finally, **app.toml** contains the blocks pruning configuration that is responsible for storing all blocks history. We recommend usage
of the `nothing` mode that will activate all RPC features.
```toml
# default: the last 362880 states are kept, pruning at 10 block intervals
# nothing: all historic states will be saved, nothing will be deleted (i.e. archiving node)
# everything: 2 latest states will be kept; pruning at 10 block intervals.
# custom: allow pruning options to be manually specified through 'pruning-keep-recent', and 'pruning-interval'
pruning = "nothing"

# These are applied if and only if the pruning strategy is custom.
pruning-keep-recent = "2"
pruning-keep-every = "0"
pruning-interval = "10"
```

:::

:::tip
You may need to setup additional keys in the genesis. Run the following commands to generate the keys:

```bash
zel-cored keys add <key_name> --home=$ZEL_HOME --keyring-backend test
```

This will create a `keyring-test` folder containing the generated keys.

Next, you need to add these keys to the genesis file, which initializes the accounts with a balance. Run the following
commands:

```bash
zel-cored add-genesis-account $(zel-cored keys show <key_name> -a --home=$ZEL_HOME --keyring-backend test) <inital_balance>uzel --home=$ZEL_HOME --keyring-backend test
```

This will add the `<key_name>` account to the genesis file with a balance of `<inital_balance>uzel`.
:::


:::danger
Do not forget to backup your keys from `$ZEL_HOME/keyring-test`
:::


The next step is a setting peers in the **config.toml**. Find a `persistent_peers` field and set here your node
info:

```toml
persistent_peers = "node_id@node_ip:26656"
```

:::tip
You can check your node ID by executing the following command:

```bash
zel-cored tendermint show-node-id --home=$ZEL_HOME
```
:::
## Step 3: Init validator

Finally, you have to initialize the first validator. This is crucial for a new chain launch. Follow these steps:

1. Generate a `validator_key` genesis key with an appropriate balance as has been shown before.

2. Generate a genesis transaction for the `validator_key` with a staking of `100000000000000000000000000uzel` (
   10M ZEL):
    ```bash 
    zel-cored gentx validator_key 100000000000000000000000000uzel --chain-id <chainID_xxxx-x> --home=$ZEL_HOME --keyring-backend test
    ```

3. Collect all the genesis transactions (gentxs) into the genesis file:
    ```bash 
    zel-cored collect-gentxs --home=$ZEL_HOME
    ```

   4. Validate the genesis file to ensure everything is set up correctly:
       ```bash
       zel-cored validate-genesis --home=$ZEL_HOME
       ```

:::info
You also may need to satisfy requirements for other modules by configuring them in the genesis file.
:::

These steps will initialize the first validator and prepare the node for startup.


## Step 4: Prepare genesis file

Before launching chain `genesis.json` file has to be configured.

Bridge module admin and noaccumulator module super_admin must be **multisig** accounts.
These addresses must be generated from the validators' keys. Each validator is required to generate and share their address.

:::info 
As a multisig account addresses are determined they can be set in genesis.json file.
:::


To create multisig account via CLI use:

```bash
zel-cored tx multisig groups create bridge1... bridge1..., bridge1... 1
```

After updating genesis run validate-genesis to ensure everything is set up correctly:

```bash
zel-cored validate-genesis --home=$ZEL_HOME
```

To get more about module`s params and configuration follow:
- Evmos modules: https://github.com/evmos/evmos/tree/v12.1.6/x
- CosmosSDK modules: https://github.com/cosmos/cosmos-sdk/tree/v0.46.13/x
- ZEL modules: /docs/build/zel/architecture/core

## Step 5: Config file structure

The configuration files should be structured as follows:

```
ZEL_HOME
└───config
   └───validator
        └───config
            │  app.toml     
            │  genesis.json     
            │  client.toml
            │  node_key.json
            │  priv_validator_key.json
            │  config.toml
```

Where `ZEL_HOME` is the path to the directory where you store the configuration files.
The `config` directory contains the configuration files for the `validator` node. The `config` directory contains the
following files:
Here's a concise list of file names and descriptions:

| **File Name**                 | **Description**                                                                                   |
|-------------------------------|---------------------------------------------------------------------------------------------------|
| **`app.toml`**                | Configures application-specific settings (API, gRPC, telemetry, pruning) for the Cosmos SDK node. |
| **`genesis.json`**            | Initializes the blockchain with initial chain state, validators, and configuration parameters.    |
| **`client.toml`**             | Configures CLI client preferences (chain ID, node address, keyring backend).                      |
| **`node_key.json`**           | Stores the private key of the node for P2P network identification.                                |
| **`priv_validator_key.json`** | Contains the validator's private key for signing blocks and proving validator identity.           |
| **`config.toml`**             | Configures core Tendermint settings (P2P, consensus, RPC server options).                         |

## Step 6: Run the node

To run define the following environment variables:

```bash
export DAEMON_NAME="ZEL Core"
export DAEMON_HOME=$ZEL_HOME
export DAEMON_ALLOW_DOWNLOAD_BINARIES="true"
export UNSAFE_SKIP_BACKUP="true"
```

:::info
Note, that your node has several ports that is required to be opened on your machine:

- "26656" - P2P port
- "26657" and "9090" - Cosmos RPC
- "1317" - REST Swagger API
- "8545" - EVM HTTP RPC
- "8546" - EVM WS RPC
  :::

### Cosmovisor

To enable the automatic blockchain upgrades you may need to install "cosmovisor". To download the cosmovisor binary file
for your architecture follow: https://github.com/cosmos/cosmos-sdk/releases/tag/cosmovisor%2Fv1.5.0

Then, execute the following commands:

```bash
mv <path_to_cosmovisor_binary_file> /usr/local/bin/cosmovisor
chmod u+x /usr/local/bin/cosmovisor
mkdir -p $DAEMON_HOME/cosmovisor/genesis/bin && cp zel-cored $DAEMON_HOME/cosmovisor/genesis/bin
```

1. You can start the cosmovisor as the system service (best practise):
    ```bash
    sudo tee /etc/systemd/system/zel.service > /dev/null << EOF
    ```
    ```text
    [Unit]
    Description=ZEL Node
    After=network-online.target
    [Service]
    Environment="DAEMON_NAME=ZEL Core"
    Environment="DAEMON_HOME=${ZEL_HOME}" 
    Environment="DAEMON_ALLOW_DOWNLOAD_BINARIES=true"
    User=root
    ExecStart=/usr/local/bin/cosmovisor run start --home=${ZEL_HOME} --rpc.laddr tcp://0.0.0.0:26657
    Restart=on-failure
    RestartSec=10
    LimitNOFILE=10000
    [Install]
    EOF
    ```

   And then start the system service:

    ```shell
    sudo systemctl daemon-reload
    sudo systemctl enable zel
    sudo systemctl start zel
    ```

   You can check logs by executing:

    ```bash
    sudo journalctl -u zel -f --no-hostname -o cat
    ```

2. Or, simply start with command:
    ```bash
    cosmovisor run start --home=$ZEL_HOME --rpc.laddr tcp://0.0.0.0:26657
    ```

## Common questions

### How to clean node data?

If you failed to run node for some reason, it is required to clean data before re-lunch with fixed configuration:
- Clean `$ZEL_HOME/data` files except of `priv_validator_state.json`
- Edit `priv_validator_state.json` as follows:
   ```json
   {
   "height": "0",
   "round": 0,
   "step": 0
   }
   ```