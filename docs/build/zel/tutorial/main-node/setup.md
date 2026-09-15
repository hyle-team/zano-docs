---
draft: true
sidebar_position: 1
title: Prepare a private development chain
---

# Prepare a private development chain

This is a planning checklist for a new, disposable development chain. To join the shared testnet, use the [testnet node guide](../testnet/setup.md).

:::note Configuration required
The complete development genesis and release-specific initialization commands must be supplied by the team. This page is not a ready-to-run network launch recipe.
:::

## Define the chain

Record a distinct Cosmos chain ID and EVM chain ID, binary release, native and staking denominations, and the initial validator set. Do not reuse the shared testnet or reserved mainnet identity for an unrelated chain.

## Prepare genesis

The release owner must provide and review:

- Initial balances and the separate staking denomination.
- Validator genesis transactions and consensus parameters.
- Bridge, multisig, accumulator, NFT, and reward-module configuration.
- Administrator identities and the procedure for deriving any module multisig addresses.
- Disabled routes and features that are not part of this environment.

A transaction command against a running chain cannot be used to create prerequisites for that chain's genesis. Use the release's documented genesis tooling and validate the resulting file before launch.

## Isolate the environment

Use new data directories and disposable keys. Restrict RPC access to loopback or the development network. Never copy a shared-network consensus key or TSS share into this environment.

Record genesis and binary checksums, distribute the same reviewed genesis to every node, and verify that all nodes report the intended chain identity.

## Launch and verify

The team-provided runbook must cover startup, peer connectivity, block production, EVM chain-ID checks, and a test transaction. Validate those steps in this disposable environment before adapting the runbook for shared infrastructure.

For service-management conventions, see the [testnet setup guide](../testnet/setup.md). Consensus state, balances, and module settings must still come from this chain's own configuration.

## Recovery

Preserve the chain's data and consensus signing state before investigating a failure. Never reset signing history for a key that will be reused on the same chain. A clean development reset requires a deliberately new chain identity and new keys, coordinated across all participating nodes.
