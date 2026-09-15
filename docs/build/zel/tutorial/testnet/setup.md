---
sidebar_position: 2
title: Configure a testnet node
---

# Configure a testnet node

This template covers full-node setup on ZEL testnet. Validator enrollment is a separate, team-approved operation.

:::note Setup package TBA
Release downloads and the matching genesis, configuration, and peer details will be added when the ZEL operator package is ready. The steps below provide the setup structure; they are not a complete installation guide yet.
:::

## 1. Obtain the release and configuration

Get the following from the ZEL team before initializing a node:

- The approved `zel-cored` binary or source commit, its checksum, and platform requirements.
- The matching testnet `genesis.json` and `app.toml`, with checksums.
- Approved peers and, if using state sync, a recent trusted height, block hash, RPC servers, and trust period.
- The supported Cosmovisor version and upgrade/recovery runbook.

Use the ZEL release's genesis and configuration. Do not substitute another chain's files or construct a genesis from this template.

Verify the binary and configuration before use. Install the executable under the consistent name `zel-cored`. A binary built for Alpine may require a compatible libc; confirm its runtime requirements with the release owner.

## 2. Initialize a new home

Set a new absolute data directory and your node name:

```bash
export ZEL_HOME=/absolute/path/to/zel-testnet
export MONIKER_NAME=your-node-name
zel-cored init "$MONIKER_NAME" --chain-id zel_9350-1 --home="$ZEL_HOME"
```

Do not initialize over an existing node. Install the approved genesis and application configuration in `$ZEL_HOME/config`. Confirm that the genesis Cosmos chain ID is `zel_9350-1`; the EVM chain ID is `9350`.

Edit `config.toml` to use the supplied peers. State sync is optional and requires the release owner's current checkpoint. Do not copy a historical height or hash from another environment.

Enable only the API listeners you need. Bind local APIs to loopback, and expose public RPC through the approved gateway and firewall policy. Port 26656 is P2P; 26657 is consensus RPC; 9090 is gRPC; 1317 is REST; 8545 and 8546 are EVM HTTP and WebSocket.

Choose pruning and snapshot retention for the node's purpose and disk capacity. Archival history and unlimited snapshot retention are not required for every node.

## 3. Initialize Cosmovisor

Install the approved Cosmovisor version. Its daemon name must match the executable filename:

```bash
export DAEMON_NAME=zel-cored
export DAEMON_HOME="$ZEL_HOME"
export DAEMON_ALLOW_DOWNLOAD_BINARIES=false
export UNSAFE_SKIP_BACKUP=false
cosmovisor init "$(command -v zel-cored)"
```

This installs the binary at `$DAEMON_HOME/cosmovisor/genesis/bin/zel-cored`. Keep automatic binary downloads disabled and retain upgrade backups. Stage reviewed upgrades through the team's release procedure.

For a foreground check:

```bash
cosmovisor run start --home="$ZEL_HOME" --rpc.laddr=tcp://127.0.0.1:26657
```

Stop the foreground process before starting a service against the same home.

## 4. Optional systemd service

Use a dedicated non-root account that owns the data directory. The following example assumes Cosmovisor is installed at `/usr/local/bin/cosmovisor`. Set `ZEL_USER` to that account and verify the absolute home path before creating the unit.

```bash
: "${ZEL_USER:?Set the dedicated service account}"
: "${ZEL_HOME:?Set the absolute node home}"
sudo tee /etc/systemd/system/zel.service > /dev/null <<EOF
[Unit]
Description=ZEL testnet node
After=network-online.target
Wants=network-online.target

[Service]
User=${ZEL_USER}
Environment="DAEMON_NAME=zel-cored"
Environment="DAEMON_HOME=${ZEL_HOME}"
Environment="DAEMON_ALLOW_DOWNLOAD_BINARIES=false"
Environment="UNSAFE_SKIP_BACKUP=false"
ExecStart=/usr/local/bin/cosmovisor run start --home=${ZEL_HOME} --rpc.laddr=tcp://127.0.0.1:26657
Restart=on-failure
RestartSec=10
LimitNOFILE=10000

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now zel
```

Use an absolute home path without whitespace in this unit, or apply systemd argument escaping.

## 5. Verify the node

```bash
zel-cored status --node tcp://127.0.0.1:26657
sudo journalctl -u zel -n 100 --no-pager
```

Confirm the chain identity, peers, advancing block height, and synchronization state before relying on the node. A running full node is not automatically a consensus validator or bridge signer.

## Recovery

Stop the service, preserve the home directory, and inspect the failure before modifying data. Ask the team for the recovery procedure for that release.

:::danger Preserve consensus signing history
Never zero, delete, or roll back `data/priv_validator_state.json` for a key that has signed on the same chain. This state prevents double-signing. Never run two nodes with the same consensus key. Coordinate validator recovery before restarting.
:::

For a sync failure, first check the approved peers, checkpoint freshness, genesis, and binary version. Do not repeatedly reset a validator's data as a general troubleshooting step.
