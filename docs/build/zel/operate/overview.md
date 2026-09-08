---
sidebar_position: 1
title: Operator overview
---

# Operator overview

ZEL operation includes consensus validation, bridge signing, relaying, indexing, oracle submission, monitoring, and incident response. Some deployments combine responsibilities, but their authorities and failure modes must remain explicit.

:::caution Testnet only
Operator procedures and parameters are still being exercised on testnet. Do not reuse testnet keys, hosts, snapshots, or secrets for a future production deployment.
:::

## Validator baseline

A validator needs hardened key management, redundant and monitored infrastructure, controlled upgrades, backups, time synchronization, peer connectivity, alerting, and a tested response to missed blocks or consensus faults. Exact binaries, genesis, peers, ports, stake, and admission steps must come from the active testnet release.

## Bridge-signer baseline

A bridge signer has additional responsibilities:

- Participate in distributed key generation and key rotation.
- Authenticate peers and authorize only fully specified operations.
- Validate source-chain finality and destination transaction details.
- Prevent nonce, UTXO, operation, attempt, and key-epoch reuse.
- Maintain monitoring independent of the relayer proposing an action.
- Exercise pause, recovery, and custody-migration procedures.

## Never mix environments

Use separate keys, hosts, credentials, databases, monitoring channels, and access policies for testnet and any future mainnet. The chain ID is part of the safety boundary: testnet is `9350`; reserved mainnet is `935`.

## Before joining

Confirm the current binary commit and checksum, genesis hash, chain ID, peer list, minimum hardware, state-sync or snapshot source, key-backup process, upgrade schedule, telemetry requirements, and official incident channel. If any of these are unavailable, wait for the operator release package rather than assembling configuration from old notes.
