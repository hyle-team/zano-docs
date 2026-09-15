---
sidebar_position: 2
title: Mainnet node setup
draft: true
---

# Mainnet node setup

Mainnet is not live. This draft is excluded from the published documentation.

## Team inputs required before publication

- Approved release, checksums, genesis, configuration files, and peers.
- Confirmed Cosmos chain ID; the reserved EVM chain ID is `935` and short name is `zel`.
- Hardware, storage, network, service-account, and monitoring requirements.
- A tested installation and upgrade procedure using the exact `zel-cored` binary name.
- Trusted synchronization checkpoints and their verification procedure.
- Backup and recovery instructions that preserve consensus keys and last-signing state.

Write and test this guide against the approved mainnet release before enabling the network selector. Do not reset validator signing state or reuse a validator key across independently running nodes.
