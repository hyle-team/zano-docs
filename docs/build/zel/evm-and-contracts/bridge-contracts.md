---
sidebar_position: 2
title: Bridge contracts
---

# Bridge contracts

Bridge contracts accept source deposits and verify authorizations for destination withdrawals. Use the [contract registry](/docs/build/zel/evm-and-contracts/contract-registry) to identify the approved addresses, source, and ABI.

## Integration surface

| Operation | Documented method family | Client requirement |
| --- | --- | --- |
| Native deposit | `depositNative` | Send the intended value and destination data |
| Token deposit | `depositERC20` | Check the enabled token and required allowance |
| Native withdrawal | `withdrawNative` | Verify and submit the returned authorization |
| Token withdrawal | `withdrawERC20` | Use the returned token and representation flag |

The [EVM adapter reference](/docs/build/zel/architecture/signer/integration/bridging/evm) contains implementation examples. They must be checked against the release ABI before use; a method name does not establish its parameter list, event signature, or supported token behavior.

## Verified testnet deposit signatures

The current Bridge implementation's explorer ABI includes:

```text
depositNative(string receiver, uint256 chainId, uint16 referralId)
depositERC20(address token, uint256 amount, string receiver, uint256 chainId, bool isWrapped, uint16 referralId)
```

Both signatures include `referralId`; omitting it selects a different function signature. The presence of this field does not establish a public referral program. Program details remain TBA.

Use the verified implementation ABI at the proxy address from the registry. Fetch the current ABI again after an upgrade; these signatures describe the inspected ZEL deployment, not every external-chain bridge.

## Deposits and withdrawals

An ERC-20 approval is not a deposit. Track the actual bridge call and its deposit event, preserving the event index used by the source-chain adapter.

For withdrawals, verify the recipient, amount, asset, operation identifier, and authorization domain before submitting. Do not hardcode the wrapped-token flag. Confirm replay-protection behavior and verify the destination result afterward.

## Administrative boundaries

The current verified implementation uses owner-authorized upgrades and signer-management controls. The [contract registry](/docs/build/zel/evm-and-contracts/contract-registry) records the observed proxy, implementation, and owner. The full operational authority and upgrade policy still need documentation.

Exact signatures, events, authorization encoding, and enabled controls remain release-specific. See [events and indexing](/docs/build/zel/evm-and-contracts/events-and-indexing) for receipt handling.
