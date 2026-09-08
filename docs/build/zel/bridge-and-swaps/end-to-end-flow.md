---
sidebar_position: 2
title: End-to-end bridge flow
---

# End-to-end bridge flow

:::caution Testnet only
Use test assets only. Route configuration, contracts, fees, limits, confirmations, and finalization behavior may change between testnet releases.
:::

Every bridge integration should follow the same high-level sequence even when the source and destination transaction formats differ.

## 1. Discover the route

Before constructing a transaction, resolve the current route configuration:

- Source and destination chain identifiers.
- Source asset and destination representation.
- Token addresses or Zano asset identifiers.
- Decimals and amount-conversion rules.
- Minimum, maximum, cap, and rate-limit rules.
- Fee calculation and expected destination amount.
- Required source confirmations.
- Deposit contract or Zano bridge destination data.
- Whether destination finalization is automatic or user-submitted.

Do not hardcode this data without also pinning the deployment release that published it.

## 2. Construct the source operation

The client must bind the user’s intended asset, amount, destination chain, and destination recipient into the source operation. An EVM source may require a token approval followed by a bridge-contract call. A Zano source requires the Zano transaction format defined for the active bridge release.

The confirmation screen should show:

- Source and destination networks.
- Source asset and destination representation.
- Gross amount, fee, and minimum destination amount.
- Destination recipient in its native address format.
- Contract or bridge destination being called.
- Whether a second destination-chain transaction will be required.

## 3. Wait for source finality

A submitted source transaction is not immediately eligible for authorization. Track it by its canonical operation identifier and wait for the route’s published confirmation requirement.

Handle source-chain reorganization explicitly. If the deposit disappears or changes before finality, do not continue with the old operation data.

## 4. Submit or observe the deposit

Depending on the release, an application may need to notify a bridge API about the source transaction, or bridge operators may discover it automatically. The request must identify one deposit unambiguously.

A portable operation record should include:

```text
source_chain
source_transaction_hash
source_deposit_index_or_nonce
destination_chain
destination_recipient
asset
amount
deployment_release
```

The exact identifier fields and encoding are route-specific and must come from the confirmed API specification.

## 5. Validate and authorize

Bridge participants validate the source operation, route configuration, finality, asset mapping, amount, limits, and destination intent. The resulting authorization must be bound to the exact destination action and protected against replay.

Clients should treat authorization as an intermediate state, not proof that destination execution has completed.

## 6. Finalize on the destination

| Destination behavior | Client responsibility |
| --- | --- |
| Automatic finalization | Track the destination transaction produced by the bridge service or relayer |
| User-submitted finalization | Retrieve the authorization, verify its fields, call the confirmed destination contract, and pay destination gas |
| Application relaying | Track both the authorization and relayer transaction; preserve a path for the user to finalize if supported |

The route must publish which model it uses before deposits are enabled.

## 7. Verify the final result

Completion requires the expected destination-chain state:

- The destination transaction succeeded and reached the required finality.
- The intended recipient received the expected asset representation and amount.
- The bridge operation cannot be executed again.
- Explorer, API, and on-chain state agree on the result.

Continue with [Zano to ZEL](/docs/build/zel/bridge-and-swaps/zano-to-zel), [ZEL to Zano](/docs/build/zel/bridge-and-swaps/zel-to-zano), or the [API and status model](/docs/build/zel/bridge-and-swaps/api-and-status).

:::note Route details pending
The canonical route source, confirmation rules, fee formula, minimum calculation, deposit identifier, authorization payload, finalization model, and retry policy have not yet been published for the active testnet release.
:::
