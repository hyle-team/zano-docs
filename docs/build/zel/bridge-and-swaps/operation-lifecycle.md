---
sidebar_position: 6
title: Operation lifecycle and recovery
---

# Operation lifecycle and recovery

Cross-chain operations take multiple transactions and can remain pending across confirmations, signer coordination, relayer retries, and destination-chain finality.

## Common states

These display labels use the provisional normalized states defined in the [Bridge API and status model](/docs/build/zel/bridge-and-swaps/api-and-status). They must still be mapped to the confirmed bridge API enums before an application relies on them.

| Normalized state | Display label | Meaning |
| --- | --- | --- |
| `awaiting_source` | Awaiting deposit | The expected source operation has not been confirmed |
| `confirming_source` | Confirming | The source operation is visible but has not reached the route's confirmation requirement |
| `validating` | Validating | Bridge participants are checking the operation |
| `authorized` | Authorized | The destination action is authorized but not yet finalized |
| `submitting_destination` | Submitting | A relayer or application is broadcasting the destination action |
| `completed` | Completed | The expected destination state is confirmed |
| `retryable` | Retry available | Processing can resume without creating a new source deposit |
| `rejected` | Rejected | The source operation is not eligible |
| `paused` | Paused | Route processing is administratively or automatically paused |
| `manual_review` | Manual review | Automated processing stopped for reconciliation or safety review |

Fallback delivery, refunds, cancellation, expiry, and reorganization rollback should be documented as explicit outcomes or recovery details. They should not be introduced as additional normalized states unless the confirmed API publishes them that way.

## Recovery rules

1. Save the operation ID and every source or destination transaction hash.
2. Check the explorer and operation page before retrying.
3. Do not create a second operation to solve a delayed first operation.
4. Treat fallback delivery as different from successful swap execution.
5. Contact [Zano support](https://zano.org/support) with IDs and public transaction hashes; never share a seed phrase or private key.

:::warning Do not rely on a frontend success screen
For cross-chain operations, verify the final destination state. A submitted transaction, fallback asset, or relayer acknowledgement is not necessarily the requested final result.
:::

Retries must preserve the intended recipient and amount and must not make both the old and new attempts executable. Those are protocol requirements; users should still verify that the current testnet release documents its retry behavior.
