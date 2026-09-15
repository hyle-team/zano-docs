---
sidebar_position: 6
title: Operation lifecycle and recovery
---

# Operation lifecycle and recovery

A bridge operation spans source confirmation, deposit validation, authorization, and destination execution. These stages describe the process; they are not backend status enum names.

## Track the operation

Save the original deposit identifier and source transaction hash. Use the [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status) to track processing, and retain any returned authorization and destination transaction hash.

The implementation reference mentions `WITHDRAWAL_STATUS_PENDING`, `WITHDRAWAL_STATUS_PROCESSED`, and `WITHDRAWAL_STATUS_FAILED`. This is not a verified exhaustive enum list or a mapping to user-facing completion. Confirm the deployed schema and meanings before relying on them.

In particular, a processed authorization may still require a user-submitted destination transaction. API processing and destination-chain finality must be checked separately.

## Recovery rules

1. Check the original operation and source transaction before retrying.
2. Do not create a second deposit to resolve a delayed first operation.
3. Use the release-specific retry or reconciliation procedure; do not assume resubmission is idempotent.
4. Verify the recipient, asset, amount, destination receipt, and required confirmations.
5. Treat fallback delivery as a different outcome from the requested swap.
6. Contact [Zano support](https://zano.org/support) with public identifiers only.

:::warning Verify the destination
A frontend success screen, signer authorization, or relayer acknowledgement does not prove the requested transfer completed. Verify the final destination state before displaying completion.
:::

Cancellation, expiry, refunds, paused routes, and reorganization recovery need explicit guidance from the deployed release. Do not infer them from a generic status label.
