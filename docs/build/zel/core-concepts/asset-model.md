---
sidebar_position: 2
title: Asset model
---

# Asset model

ZEL distinguishes native or bridged ZANO, its contract-compatible wrapped form, and the separate stZANO participation asset. Interfaces must identify the network and contract address where applicable instead of relying on a ticker alone.

## ZANO across the boundary

Native ZANO begins on Zano L1. A confirmed bridge deposit makes an equivalent amount available on ZEL, where ZANO is the native gas asset. A completed withdrawal removes the ZEL-side amount before releasing the corresponding ZANO on Zano.

This one-to-one accounting is a protocol invariant, not a promise that every testnet route is continuously available. Users must check route status, caps, fees, and delay before starting an operation.

## ZANO in ERC-20 interfaces

When an ERC-20 interface is required, the wrapped form uses the same `ZANO` ticker rather than `wZANO`. This is especially important for EVM listings: identify it with the chain ID and verified contract address in addition to the ticker. On ZEL itself, applications should distinguish native and wrapped ZANO by asset type or contract address without inventing a second ticker.

Wrapping and unwrapping should preserve value one-to-one apart from transaction fees. The wrapped form does not add privacy and must not be confused with a similarly named asset on another network.

## stZANO

`stZANO` is a separate fixed-supply asset planned for consensus staking and ordinary governance. It does not represent, wrap, or back ZANO, and it does not automatically grant a bridge-signer seat. User-facing stZANO staking and delegation are not active on the current testnet; future lock, transfer, reward, voting, and slashing behavior must come from the release in which those features are enabled.

## Display rules for applications

Every balance or transaction should show:

- Asset name and contract address, when applicable.
- Network: Zano, ZEL testnet, or an external chain.
- Spendable, locked, delegated, bonded, pending, or claimable state.
- The operation that changes one form into another.
- A verified registry source for contract assets.

:::warning Verify assets
Testnet tokens can be redeployed and copied. Verify the current contract address and network before approving or transferring a token. A matching name or ticker is not proof of identity.
:::
