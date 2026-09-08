---
sidebar_position: 1
title: EVM overview
---

# EVM on ZEL

ZEL exposes a public EVM-compatible environment for accounts, smart contracts, JSON-RPC clients, wallets, and indexers. Compatibility should be documented as a tested matrix, not assumed from the word “EVM.”

## Network identity

| Environment | Status | Decimal chain ID | Hex chain ID | Short name |
| --- | --- | ---: | --- | --- |
| Mainnet | Not live | `935` | `0x3A7` | `zel` |
| Testnet | Development environment | `9350` | `0x2486` | `tzel` |

Applications must verify `eth_chainId` before reading addresses, requesting signatures, or broadcasting transactions.

## Compatibility checklist

The active release should publish:

- Execution-engine and EVM revision.
- Supported transaction envelope types.
- Gas accounting and fee-market behavior.
- Block time, finality guidance, and reorganization policy.
- Supported JSON-RPC, WebSocket, trace, debug, and archive capabilities.
- Native asset symbol and decimals.
- Supported precompiles and any ZEL-specific precompiles.
- Contract size, code-init, log, and RPC limits that differ from common Ethereum defaults.
- Wallets and development tools tested against the release.

:::note Compatibility details pending
A compatibility matrix backed by tests against the current ZEL node release has not yet been published. Treat ZEL as EVM-compatible, not fully Ethereum-equivalent, until each exception is documented.
:::

## Contract development

Standard Solidity development practices apply where the compatibility matrix confirms them:

1. Pin the compiler and dependency versions.
2. Configure testnet chain ID `9350` explicitly.
3. Verify the connected chain immediately before deployment.
4. Record the deployment transaction, block, deployer, bytecode, ABI, source commit, and constructor arguments.
5. Verify proxy implementation and administrative roles where applicable.
6. Publish addresses through the versioned [contract registry](/docs/build/zel/evm-and-contracts/contract-registry).

Continue with [Solidity development](/docs/build/zel/build/solidity) for the toolchain baseline.

## Public-state implications

EVM addresses, balances, calldata, logs, contract storage, token approvals, bridge recipients, swaps, and application interactions are public. Contracts must not imply that activity becomes private merely because an asset originated on Zano.
