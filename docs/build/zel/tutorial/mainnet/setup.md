---
sidebar_position: 2
---

# Configure and launch

## Step 1: Init config files

First, you need to install the necessary dependencies. You can download the latest binary file from
the [GitHub release](https://github.com/Zano-Execution-Layer/zel-core/releases/tag/v12.2.0-rc11). Alternatively, you can
build the core from the source code yourself(chains/mainnet).

:::warning
The binary is built under Alpine linux. If you are using Ubuntu linux, please install "musl-dev" package using the
following command to be able to use Alpine binary on your machine:

```shell
sudo apt install musl-dev
```

:::

To generate configs file download the core binary file (we will name it `ZEL Core` but you probably will
download `zel-cored`). Then, set up the environment:

```bash
export MONIKER_NAME=YOUR_VALIDATOR_NAME
export ZEL_HOME=YOUR_CORE_HOME_PATH
export ZEL_NODE=tcp://x.x.x.x:26657 # Node RPC address
```

To initialize the node struct and generate configs execute the following command:

```bash
zel-cored init $MONIKER_NAME --chain-id zel_935-1  --home=$ZEL_HOME --keyring-backend test
```

- `--chain-id` specifies the chain ID of the network. Use `zel_935-1` for the Mainnet.
- `--home` specifies the path to the configuration files.
- `--keyring-backend` specifies the backend you are using for the keyring. It is okay to use `test` keyring.

Replace the generated `app.toml` and `genesis.json` file with the downloaded
from [here](https://github.com/Zano-Execution-Layer/zel-core/blob/chains/mainnet/config).

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

## Step 2: Connect to the network

To connect to the existing network you may need to update the **config.toml** file.

Firstly, you have to update the `seeds`and `persistent_peers` fields.
You can get the list of seeds and persistent peers by sent request to our team.

Get the node id:

```bash
zel-cored tendermint show-node-id --home=$ZEL_HOME
```

Find a `persistent_peers` field and set up here at least your node info and one or two other nodes.

:::tip
It's good to have at least 3 peers.

It should look as follows:

```toml
persistent_peers="node1_id@node1_ip:26656,node2_id@node2_ip:26656,..., my_node_id@my_node_ip:26656"
```

:::

Also, you have to set up information for fast catchup from trusted height in **config.toml**:

```toml
enable = true

rpc_servers = "node1_ip:26657,node2_ip:26657"
trust_height = 51554
trust_hash = "F4B638CCFDE0369CFF01ABD9E91C2097C3FCB84181AFF384A402C0CF04E3DEBC"
```

:::info
Please, use ONLY the RPC servers provided by our team. Also, at least two `rpc_servers` required.
:::

## Step 3: Run the node

To run you have to define the following environment variables:

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

   And start the system service:

    ```shell
    sudo systemctl daemon-reload
    sudo systemctl enable zel
    sudo systemctl start zel
    ```

   Check logs:

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

### Node failed to catchup

Check the peers and rpc_servers you specified for catchup or probably change them to other if possible. Also, first
launch of the node may require several restarts.
  