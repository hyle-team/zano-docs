---
sidebar_position: 4
title: ZEL to Zano
---

# Bridge from ZEL to Zano

This direction starts with a public EVM transaction on ZEL and ends with a Zano asset sent to a Zano address.

## What the user provides

- A supported ZEL asset or native balance.
- An amount within the current route limits.
- A valid Zano recipient address.
- Any route or representation choice required by the active release.

## Choose the deposit path

| Source asset | Expected EVM preparation |
| --- | --- |
| Native ZEL asset | Call the confirmed native-deposit function and attach the exact transaction value |
| ERC-20 representation | Approve only the required amount, then call the confirmed token-deposit function |
| Wrapped representation | Confirm whether the source representation is released, burned, or converted before using it |

The deployed ABI is authoritative. Function names and parameters must come from the verified contract release, not from a similar bridge implementation.

## Integration sequence

1. Verify the wallet is connected to ZEL testnet chain ID `9350`.
2. Load the active contract and route registry.
3. Validate the Zano recipient using Zano address rules.
4. Resolve the source token, destination Zano asset, decimals, fee, limits, and expected received amount.
5. For ERC-20 deposits, check allowance and approve only when necessary.
6. Display the bridge contract, recipient, route, amount, fee, and finalization model.
7. Submit the deposit transaction once.
8. Extract the canonical deposit identifier from the confirmed transaction receipt and event log.
9. Track bridge validation and authorization.
10. Track the Zano destination transaction if finalization is automatic, or follow the confirmed manual procedure if it is not.
11. Verify the recipient received the expected Zano asset and amount.

## Receipt and event checks

The client should reject a receipt when:

- The transaction reverted.
- The event came from an unexpected contract address.
- The event’s sender, token, amount, destination route, or recipient differs from the user’s intent.
- More than one plausible deposit event exists and the API does not define which log index to use.
- The contract implementation or deployment release changed during the operation.

:::note Withdrawal interface pending
The verified deposit contract, function signatures, approval model, event schema, operation and route identifiers, finalization behavior, and destination transaction lookup method have not yet been published.
:::
