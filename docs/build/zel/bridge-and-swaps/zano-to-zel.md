---
sidebar_position: 3
title: Zano to ZEL
---

# Bridge from Zano to ZEL

This direction starts with a Zano transaction and ends with a public balance or token representation on ZEL.

:::warning Privacy boundary
The source transaction begins on Zano, but the destination address, balance, contract calls, and subsequent activity on ZEL are public. Do not describe this route as preserving end-to-end privacy.
:::

## What the user provides

- A supported Zano asset and amount.
- A ZEL recipient address.
- ZEL testnet as the destination (`9350`).
- Any route data required by the active release.

## Source transaction structure

The Zano transaction must identify the bridge route and destination intent in the exact format understood by the bridge validators.

| Field | Required documentation |
| --- | --- |
| Source operation type | Confirm whether the route requires an asset burn or another Zano operation |
| Asset and amount | Canonical Zano asset identifier, atomic-unit rules, and permitted range |
| Destination address | Exact EVM address encoding and validation rules |
| Destination network | Confirm the bridge’s route identifier for ZEL testnet; do not assume it is interchangeable with EVM chain ID `9350` |
| Service metadata | Confirm field names, serialization, instruction, service identifier, padding, and maximum size |
| Bridge observer address | Confirm whether the transaction must be pointed to a particular bridge or signer address |
| Deposit index or nonce | Confirm how one bridge instruction is selected when the transaction contains multiple service entries |

:::note Deposit interface pending
The exact Zano wallet RPC request, transaction schema and encoding, and a decoded testnet example have not yet been published. Do not construct a deposit from unverified field or method names.
:::

## Integration sequence

1. Fetch the active Zano→ZEL route and deployment release.
2. Validate the ZEL recipient address and destination route identifier.
3. Convert the requested amount to Zano atomic units without losing precision.
4. Construct and display the complete Zano transaction intent.
5. Broadcast once and save the transaction hash.
6. Wait for the route’s Zano confirmation requirement.
7. Submit or observe the deposit using the confirmed transaction hash and deposit index.
8. Track validation and authorization through the canonical status API.
9. If ZEL finalization is user-submitted, call the confirmed ZEL withdrawal function with the returned authorization.
10. Verify the ZEL receipt, event, recipient, token address, and amount.

## Failure handling

- Do not resubmit the Zano transaction because an API is temporarily unavailable.
- Do not guess the deposit index or destination network identifier.
- If the deposit is valid but destination finalization fails, retain the original operation identifier and authorization.
- If route configuration changed after signing, stop and follow the release-specific recovery procedure.

The [contract registry](/docs/build/zel/evm-and-contracts/contract-registry) must identify the ZEL contract used for finalization.
