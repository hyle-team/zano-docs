---
sidebar_position: 4
title: Events and indexing
---

# Events and indexing

Indexers and bridge clients should derive public ZEL state from confirmed blocks, verified contract addresses, and exact event signatures for the active release.

## Required event inventory

The deployed ABI should identify events for the following state transitions where they exist.

| Transition | Fields an integrator needs | Exact event signature |
| --- | --- | --- |
| Native or token deposit | Sender, asset, amount, destination route, destination recipient, deposit identifier | TBD |
| Withdrawal finalized | Source operation identifier, asset, amount, recipient, representation mode | TBD |
| Operation invalidated or blocked | Operation identifier and reason or reference | TBD |
| Route paused or resumed | Route identifier, scope, authority, and effective block | TBD |
| Signer set changed | Old and new epoch or set identifier, activation block | TBD |
| Contract upgraded | Proxy, previous implementation, new implementation, and authority | TBD |
| Ownership or role changed | Role, previous account, new account, and authority | TBD |

:::note Event details pending
The verified ABI event inventory has not yet been published. Indexers must not assume the draft inventory is complete, especially for state transitions that may require another detection method.
:::

## Indexing key

Use a durable log identity:

```text
chain_id + block_hash + transaction_hash + log_index
```

Also store block number, contract address, event signature, deployment release, and decoded fields. Do not deduplicate only by transaction hash because one transaction may contain multiple deposits or withdrawals.

## Confirmation and reorganization handling

1. Ingest a log as unconfirmed.
2. Associate it with the exact block hash.
3. Promote it only after the release’s confirmation policy is satisfied.
4. If the canonical block hash changes, roll back the affected derived state.
5. Re-evaluate any bridge operation that depended on the removed event.

The confirmation count and finality definition are release parameters and must not be guessed.

## Proxy and upgrade handling

- Index the proxy address users call, while also recording the implementation active at each block.
- Start decoding with a new ABI only from its activation transaction or block.
- Preserve historical ABI versions so old events remain decodable.
- Alert when the implementation, administrator, pause state, or signer set changes outside the published release process.

## Consistency checks

An indexer should regularly reconcile:

- Deposits against bridge API operations.
- Authorized operations against finalized withdrawals.
- Processed-operation or replay-protection state against withdrawal events.
- Locked or burned source value against issued or released destination value.
- Contract state against the current registry release.

Disagreement should degrade or pause the affected route in the application rather than being hidden behind stale cached data.
