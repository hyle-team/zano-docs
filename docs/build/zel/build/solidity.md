---
sidebar_position: 3
title: Solidity and deployment
---

# Solidity and deployment

Use Solidity tooling with the [ZEL testnet RPC](/docs/build/zel/status-and-access). Pin your compiler, dependencies, and build settings so the deployment can be reproduced.

## Compiler settings

Use `evmVersion: "london"` as a conservative starting point for the current testnet. Newer compiler defaults can generate unsupported bytecode. Test the compiled contract and its dependencies before deployment.

## Client-side hashing

Generate function selectors and hashes with your client library's Keccak-256 helper. The current testnet's `web3_sha3` method does not follow Ethereum's hex-input behavior.

## Deployment workflow

1. Connect to testnet and verify chain ID `9350`.
2. Pin compiler, dependencies, optimizer settings, and source commit.
3. Test successful and failing paths with test assets.
4. Estimate gas, deploy, and record the transaction, block, contract address, and constructor arguments.
5. Compare deployed bytecode with the build artifact and verify source in the explorer where supported.
6. Record the ABI and any proxy implementation or administrator in the [contract registry](/docs/build/zel/evm-and-contracts/contract-registry).

Never assume an address retains the same meaning across chains or a testnet reset. Index deployments by chain ID and release.

For bridge integrations, also test authorization, replay protection, and recovery using the [bridge contract reference](/docs/build/zel/evm-and-contracts/bridge-contracts). A successful source deposit is not a completed destination transfer.

Testnet deployment is not a security audit or evidence of mainnet readiness.
