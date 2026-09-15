---
sidebar_position: 1
title: Operate ZEL
---

# Operate ZEL

Application developers can use the [public RPC](/docs/build/zel/build/quickstart) without running a node. These guides are for full-node operation and approved validator or signer deployments.

:::note Team-managed testnet
The active validator and bridge-signer sets are managed by the team. Running a node or funding an account does not grant either role.
:::

## Choose a task

- [Configure a testnet full node](/docs/build/zel/tutorial/testnet/setup).
- [Run a testnet full node in Docker](/docs/build/zel/tutorial/localstart/info).
- [Register an approved validator](/docs/build/zel/tutorial/testnet/become-validator).
- [Advanced signer operations](/docs/build/zel/tutorial/tss/overview).

## Before starting

:::note Operator package TBA
The setup templates are in place. Release downloads, ZEL-specific configuration, and deployment instructions will be completed when the operator package is ready.
:::

Before running a template, obtain the approved binary or image digest, genesis and configuration, peers, and recovery procedure. Use the [network reference](/docs/build/zel/status-and-access) to confirm chain identity.

Keep node data, consensus keys, and last-signing state together in the recovery plan. Never run two nodes with the same consensus key. Signers additionally need approved Vault access, authenticated peers, coordinated key ceremonies, and chain-specific migration procedures.

Use separate keys, credentials, databases, and hosts for testnet and a future mainnet deployment. Mainnet operator instructions remain unpublished.
