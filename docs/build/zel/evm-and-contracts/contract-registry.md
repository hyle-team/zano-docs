---
sidebar_position: 3
title: Contract registry
---

# Contract and deployment registry

The registry should be the canonical, versioned manifest for contracts and external services used by ZEL applications.

:::caution No mainnet deployment
Mainnet chain ID `935` is reserved, but ZEL mainnet is not live. Do not publish mainnet addresses until a mainnet release is formally announced and independently verified.
:::

## Testnet release

| Field | Value |
| --- | --- |
| Environment | ZEL testnet |
| EVM chain ID | `9350` |
| Short name | `tzel` |
| Release identifier | TBD |
| Activation block | TBD |
| Node build or commit | TBD |
| Registry schema version | TBD |
| Published at | TBD |
| Supersedes release | TBD |

## Core contracts

Only list a contract after its runtime bytecode and deployment transaction have been verified on ZEL testnet.

| Contract or role | Proxy address | Implementation | Start block | Verified source and ABI | Admin or owner | Status |
| --- | --- | --- | ---: | --- | --- | --- |
| Bridge gateway | TBD | TBD | TBD | TBD | TBD | Unconfirmed |
| Bridge authorization verifier | TBD | TBD | TBD | TBD | TBD | Unconfirmed |
| Route or asset registry | TBD | TBD | TBD | TBD | TBD | Unconfirmed |
| Wrapped ZANO contract (ticker: `ZANO`) | TBD | TBD | TBD | TBD | TBD | Unconfirmed |
| Staking contract | TBD | TBD | TBD | TBD | TBD | Unconfirmed |
| Governance contract | TBD | TBD | TBD | TBD | TBD | Unconfirmed |
| AMM factory | TBD | TBD | TBD | TBD | TBD | Unconfirmed |
| AMM router | TBD | TBD | TBD | TBD | TBD | Unconfirmed |

Remove rows for contracts that are not part of the confirmed release. Add rows for any contract an application must trust or call.

## External services

| Service | URL | Purpose | Release or schema | Status |
| --- | --- | --- | --- | --- |
| EVM JSON-RPC | TBD | Reads and transaction broadcast | TBD | Unconfirmed |
| EVM WebSocket | TBD | Logs and new-block subscriptions | TBD | Unconfirmed |
| Explorer | TBD | Independent transaction and contract inspection | TBD | Unconfirmed |
| Bridge configuration API | TBD | Routes, assets, limits, fees, and deployments | TBD | Unconfirmed |
| Bridge operation API | TBD | Deposit submission and status | TBD | Unconfirmed |
| Faucet | TBD | Test assets | TBD | Unconfirmed |

## Verification procedure

Before using an entry:

1. Verify chain ID `9350` through the node.
2. Confirm the deployment transaction and activation block.
3. Compare runtime bytecode with the published build artifact.
4. Resolve the implementation address if the entry is a proxy.
5. Compare the ABI with verified source and the application’s generated bindings.
6. Inspect administrator and upgrade roles on-chain.
7. Record the registry release identifier with indexed events and user operations.

:::note Registry publication pending
A human-readable registry and authenticated machine-readable manifest have not yet been published. Applications should fail closed when a required entry is absent, unverified, or belongs to another release.
:::
