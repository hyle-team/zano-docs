---
sidebar_position: 1
---

# Run in Docker

## Step 1: Prepare configuration

First of all you may need to init the folders structure:

```
ZEL_HOME
│   docker-compose.yaml
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

To generate folder struct execute the command:

```bash
docker run --volume $ZEL_HOME/config/validator:/config/validator ghcr.io/Zano-Execution-Layerano-Execution-Layer/zel-core:latest init $MONIKER_NAME --chain-id zel_9350-1  --home=/config/validator --keyring-backend test
```

- `--chain-id` specifies the chain ID of the network. Use `zel_9350-1` for the local network.
- `--home` specifies the path to the configuration files.
- `--keyring-backend` specifies the backend you are using for the keyring. It is okay to use `test` keyring.

Create and modify docker-compose.yml:

```docker-compose
version: "3.7"
    services:
        validator:
            image: ghcr.io/Zano-Execution-Layerano-Execution-Layer/zel-core:{TAG}
            entrypoint: sh -c "zel-cored start --home=$ZEL_HOME --rpc.laddr tcp://0.0.0.0:26657 --p2p.external-address tcp://validator:26656"
            volumes:
              - $ZEL_HOME/config:/config/validator/config
              - $ZEL_HOME/data:/config/validator/data
              ports:
              - "26657:26657" # RPC
              - "1317:1317" # REST
              - "9090:9090" # Cosmos gRPC
              - "8545:8545" # EVM HTTP RPC
              - "8546:8546" # EVM WS RPC
```

After, replace the **app.toml** and **genesis.json** files in the `$ZEL_HOME/config` with the corresponding
downloaded file for your chain.

```bash
$ZEL_HOME/config/priv_validator_key.json
$ZEL_HOME/config/node_key.json
```

Get the node id:

```bash
docker run ghcr.io/Zano-Execution-Layerano-Execution-Layer/zel-core:{last_tag} tendermint show-node-id --home=$ZEL_HOME
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
rpc_servers = "node1_ip:26657,node2_ip:26657"
trust_height = 0
trust_hash = ""
```

:::info
Please, use ONLY the RPC servers provided by our team. Also, at least two `rpc_servers` required.
:::

## Step 2: Run the node

:::info
Note, that your node has several ports that is required to be opened on your machine:

- "26656" - P2P port
- "26657" and "9090" - Cosmos RPC
- "1317" - REST Swagger API
- "8545" - EVM HTTP RPC
- "8546" - EVM WS RPC

:::

Run a command `docker compose up -d` to launch the node.

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