---
sidebar_position: 1
---

# Overview

Testnet is a test network that is used to test new features and updates before they are released on the main network.
The testnet is a separate network that is not connected to the main network.

- Chain id: `zel_9350-1`
- zel-cored binary (linux/amd64): https://github.com/Zano-Execution-Layer/zel-core/releases/tag/v12.2.0-rc11
- Genesis file: https://github.com/Zano-Execution-Layer/zel-core/blob/chains/testnet/config/genesis.json
- App.toml file: https://github.com/Zano-Execution-Layer/zel-core/blob/chains/testnet/config/app.toml
- Trust height: `219808`
- Trust hash: `D41D0E27D532A22D20BD19142BA9E6CF40FB0D21516455A721D767F87DCD1305`
- Native denom (gas and fees): `uzel`
- Staking denom: `ustake`
- Minimal delegation: `1000000000000ustake`

:::warning
To connect to the Testnet chain you should request the following information from our team:

- IP addresses of nodes with corresponding seeds to satisfy `persistent_peers` and `rpc_servers`;
- Trusted height (if changed);
- Trusted hash (if changed);
- Actual core version (if changed);

Also, to become a validator you may need to receive tokens from our team.
:::
