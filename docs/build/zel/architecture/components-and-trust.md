---
sidebar_position: 2
title: Components and trust model
---

# Components and trust model

This page is a review map for the ZEL implementation. It identifies the information developers and users need without assuming unconfirmed deployment details.

## Component map

### ZEL node and EVM RPC

The node validates ZEL blocks, executes transactions, exposes EVM-compatible JSON-RPC, and provides the canonical chain state used by contracts and indexers.

Confirm before release:

- Consensus implementation and validator admission model.
- Supported EVM revision, transaction types, precompiles, and RPC namespaces.
- Finality assumptions and reorganization handling.
- Upgrade process and binary provenance.

### Bridge route registry

A client needs an authoritative way to discover supported chains, assets, representations, contract addresses, decimals, limits, fees, and confirmation requirements. The source of that data may be on-chain, exposed through an API, or both.

Confirm before release:

- Canonical registry location and schema.
- Authority allowed to add, pause, or update routes.
- How clients detect a stale registry or deployment mismatch.

### Source-chain adapters

Each supported source chain has different deposit identifiers, confirmation rules, and transaction formats. The Zano adapter must interpret Zano bridge transactions; an EVM adapter must interpret contract calls and event logs.

Confirm before release:

- Exact Zano transaction and metadata schema.
- Exact EVM event signatures and log-index rules.
- Deposit uniqueness and replay-protection keys.

### Signer network

The signer network independently validates eligible source operations and jointly authorizes destination actions. No documentation should claim a threshold, party count, cryptographic library, or rotation procedure until it is confirmed for the active ZEL release.

Confirm before release:

- Signing algorithm, threshold, membership, and fault assumptions.
- Distributed key generation and signer replacement process.
- Authorization payload and domain separation.
- Liveness behavior when the threshold is unavailable.

### Relayer or finalizer

Some routes can be finalized automatically; others require a connected user wallet to submit the destination transaction and pay gas. The interface must state which model applies before the user deposits.

Confirm before release:

- Who submits each destination action.
- Gas payer and retry policy.
- Idempotency, replacement, and duplicate-prevention rules.
- Recovery path when authorization succeeds but finalization fails.

### EVM contracts

Bridge contracts accept deposits, verify authorizations, release or mint assets, enforce replay protection, and emit indexable events. Their verified source, ABI, proxy state, implementation address, and administrator roles belong in the [contract registry](/docs/build/zel/evm-and-contracts/contract-registry).

## Trust questions to answer publicly

| Question | Why it matters |
| --- | --- |
| What exact data do signers authorize? | Prevents a valid signature from being reused for another action |
| Who can upgrade or pause contracts? | Defines administrative control over user funds and availability |
| How are signer changes activated? | Protects operations that span a membership transition |
| How are reserves and issued representations reconciled? | Detects accounting divergence |
| What happens when finalization fails? | Determines whether users retry, wait, or request recovery |
| Which source is authoritative for routes and addresses? | Prevents clients from following stale or malicious configuration |

:::note Trust details pending
Authoritative specifications, public source links, deployment transactions, governance decisions, and operator references will be added as they are confirmed. Do not infer an answer from an unresolved item.
:::
