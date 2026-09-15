---
sidebar_position: 1
title: Testnet node in Docker
---

# Run a testnet full node in Docker

This guide connects a full node to the shared testnet. It does not create a validator or a new local chain.

## Obtain the deployment inputs

Ask the team for the approved image digest, testnet genesis and application configuration, peer list, and any state-sync checkpoint. Verify the checksums and confirm the Cosmos chain ID is `zel_9350-1`.

Set `ZEL_IMAGE` to the approved lowercase image repository and immutable digest, `ZEL_HOME` to a new absolute data directory, and `MONIKER_NAME` to your node's name.

```bash
: "${ZEL_IMAGE:?Set the approved image digest}"
: "${ZEL_HOME:?Set a new absolute data directory}"
: "${MONIKER_NAME:?Set the node name}"
mkdir -p "$ZEL_HOME"
docker run --rm --entrypoint zel-cored \
  --mount "type=bind,src=$ZEL_HOME,dst=/node" \
  "$ZEL_IMAGE" init "$MONIKER_NAME" --chain-id zel_9350-1 --home=/node
```

Do not initialize over an existing node directory. Install the approved `genesis.json` and `app.toml` under `$ZEL_HOME/config`. Configure peers in `config.toml`; use only a current, team-verified checkpoint if enabling state sync.

## Compose configuration

The host directory and container home must match the initialization step:

```yaml title="docker-compose.yml"
services:
  node:
    image: ${ZEL_IMAGE:?Set the approved image digest}
    entrypoint: ["zel-cored"]
    command: ["start", "--home=/node", "--rpc.laddr=tcp://0.0.0.0:26657"]
    volumes:
      - ${ZEL_HOME:?Set the node data directory}:/node
    ports:
      - "26656:26656"
      - "127.0.0.1:26657:26657"
      - "127.0.0.1:1317:1317"
      - "127.0.0.1:9090:9090"
      - "127.0.0.1:8545:8545"
      - "127.0.0.1:8546:8546"
    restart: unless-stopped
```

RPC ports bind to host loopback. Expose public APIs only through the approved gateway and firewall policy. Enable the required API listeners in the supplied application configuration.

```bash
docker compose up -d
docker compose ps
docker compose exec node zel-cored status --node tcp://127.0.0.1:26657
```

Check the reported network and synchronization state before relying on the node.

## Recovery

Stop the node and inspect the error before changing data. Preserve the entire home directory and obtain the recovery procedure for that release.

:::danger Preserve validator signing state
Never zero, delete, or restore an older `data/priv_validator_state.json` for a key that has signed blocks on the same chain. Do not run two nodes with the same consensus key. Coordinate validator recovery with the team before restarting.
:::
