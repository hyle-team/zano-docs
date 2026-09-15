---
sidebar_position: 4
title: Events and indexing
---

# Events and indexing

Decode events using the verified address and ABI for the active deployment. The adapter reference names `DepositedERC20` and `DepositedNative`; names alone do not provide the event parameter types, indexed fields, or complete event inventory.

## Identify a log

Use a durable log identity:

```text
chain_id + block_hash + transaction_hash + log_index
```

Also record block number, contract address, ABI/release version, and decoded data. One transaction may contain multiple deposits.

## Confirm and reconcile

Ingest logs as unconfirmed, then apply the release's confirmation policy. If a source block leaves the canonical chain, roll back affected derived state before continuing the operation.

For upgradeable contracts, track the implementation and ABI active at each block. Reconcile indexed deposits and withdrawals with the bridge operation and destination-chain result.

The team must publish the exact event inventory, proxy history where applicable, and finality policy before an indexer can rely on this as a complete implementation guide.
