---
sidebar_position: 3
title: Team confirmation checklist
draft: true
---

# ZEL documentation confirmation checklist

Use this page to turn the structured placeholders in the ZEL documentation into release-authoritative technical guidance. Each item should be backed by an on-chain value, tagged source release, verified deployment, test, or approved specification.

## Release identity

- [ ] Assign a public release identifier and publication date.
- [ ] Record the node, bridge, signer, relayer, indexer, and application commits.
- [ ] Publish binary and artifact checksums.
- [ ] Record the activation block or genesis identifier.
- [ ] State which previous release this one replaces.
- [ ] Publish known issues and incompatible changes.

## ZEL network and EVM

- [x] Testnet EVM chain ID: `9350`.
- [x] Testnet short name: `tzel`.
- [x] Reserved mainnet EVM chain ID: `935`.
- [x] Reserved mainnet short name: `zel`.
- [ ] Confirm native asset name, symbol, and decimals.
- [ ] Publish RPC, WebSocket, explorer, and faucet URLs.
- [ ] Confirm EVM revision, transaction types, fee behavior, precompiles, and RPC namespaces.
- [ ] Publish block-time, finality, and reorganization guidance.
- [ ] Document tested wallets, SDKs, and Solidity toolchains.

## Contract deployments

- [ ] Publish the bridge gateway address and deployment transaction.
- [ ] Publish all token or wrapped-asset addresses.
- [ ] Publish route, signer, verifier, staking, governance, and application contract addresses that are part of the release.
- [ ] Publish verified source, ABI, compiler settings, constructor arguments, and runtime bytecode for every contract.
- [ ] Identify proxies and implementation addresses.
- [ ] Identify owner, administrator, pause, signer-management, and upgrade roles.
- [ ] State upgrade delays, emergency powers, and notification procedure.
- [ ] Publish event signatures and the first block each ABI applies to.

## Bridge route configuration

- [ ] Publish the canonical route and asset registry.
- [ ] List supported source and destination chains.
- [ ] List supported assets, representations, identifiers, addresses, and decimals.
- [ ] Publish minimums, maximums, caps, rate limits, and fee formulas.
- [ ] Publish confirmation requirements for every source chain.
- [ ] Define how a client calculates the expected destination amount.
- [ ] State whether each destination is finalized by the user, application, relayer, or bridge service.
- [ ] Define route pause, deprecation, and migration behavior.

## Zano to ZEL

- [ ] Confirm the required Zano operation type.
- [ ] Publish the wallet RPC request and one decoded testnet transaction.
- [ ] Confirm service metadata fields, serialization, instruction, service identifier, padding, and limits.
- [ ] Confirm whether a bridge observer or signer address is required in the transaction.
- [ ] Define the destination route identifier and whether it differs from EVM chain ID `9350`.
- [ ] Define the deposit index or nonce when multiple service entries exist.
- [ ] Define the canonical operation identifier.
- [ ] Confirm the ZEL finalization contract and function.

## ZEL to Zano

- [ ] Publish native and ERC-20 deposit function signatures.
- [ ] Publish the deposit events and log-index rule.
- [ ] Confirm ERC-20 allowance behavior and unsupported token types.
- [ ] Define Zano recipient validation and destination route encoding.
- [ ] Confirm how Zano withdrawals are constructed and broadcast.
- [ ] Publish the Zano destination transaction lookup method.
- [ ] Define recovery when a valid ZEL deposit does not finalize on Zano.

## Bridge API and status

- [ ] Publish API base URLs, authentication, rate limits, and schema versions.
- [ ] Publish route, asset, limit, fee, deployment, health, submit, and status schemas.
- [ ] Define the canonical deposit identifier for every supported source-chain type.
- [ ] Publish raw status enums and map them to user-facing states.
- [ ] Publish WebSocket or subscription behavior, ordering, reconnection, and replay rules.
- [ ] Define idempotency and safe retry behavior.
- [ ] Publish error codes with user action and recovery policy.
- [ ] Ensure completed operations include a verifiable destination result.

## Signer and relayer security

- [ ] Publish signer algorithm, threshold, membership, and fault assumptions.
- [ ] Document distributed key generation and signer rotation or resharing.
- [ ] Publish the exact authorization payload, encoding, signature format, and domain separation.
- [ ] Define signer-set or key-epoch activation rules for pending operations.
- [ ] Document relayer gas payment, retry, replacement, and duplicate-prevention behavior.
- [ ] Publish route monitoring, reconciliation, pause, and incident procedures.
- [ ] Link security reviews, audits, formal specifications, and unresolved findings.

## Documentation sign-off

| Area | Technical owner | Security reviewer | Documentation status | Release link |
| --- | --- | --- | --- | --- |
| ZEL network and EVM | TBD | TBD | Draft | TBD |
| Contract deployments | TBD | TBD | Draft | TBD |
| Zano→ZEL bridge | TBD | TBD | Draft | TBD |
| ZEL→Zano bridge | TBD | TBD | Draft | TBD |
| Bridge API | TBD | TBD | Draft | TBD |
| Signer and relayer | TBD | TBD | Draft | TBD |
| Recovery and support | TBD | TBD | Draft | TBD |

:::warning Publication gate
A checked box means the linked release evidence has been reviewed, not merely that a value was supplied. Do not remove testnet warnings or describe a route as production-ready while required safety, deployment, or recovery items remain unconfirmed.
:::
