---
sidebar_position: 1
title: Stake and govern
---

# Stake and govern (planned)

:::note Planned feature
User-facing stZANO staking, delegation, rewards, validator NFTs, and governance are not active on the current ZEL testnet. This page records the intended structure for a future release.
:::

ZEL testnet consensus validators and bridge signers are operational roles. Planned stZANO participation is separate from those roles and from [Zano L1 staking](/docs/stake/overview).

## stZANO and delegation

stZANO is intended to be a separate fixed-supply asset for consensus staking and ordinary governance. It does not represent or back ZANO. A future delegation interface is expected to let holders assign stZANO to a validator without operating one, but commission, unbonding, redelegation, slashing, and reward rules are not yet published.

## Validators and bridge signers

Consensus validators operate the ZEL network. Bridge signers perform a separate threshold-authorization role for cross-chain operations. Neither role should be presented as equivalent to user-facing delegation, and validator participation does not automatically grant a bridge-signer seat.

## Genesis validator NFTs

The planned design may use Genesis validator NFTs carrying permanently bonded stZANO. Quantity, allocation, sale, transfer, reward, and concentration rules must come from the release in which the feature is enabled.

## Governance

Ordinary governance is planned. Its release must document proposal scope, voting power, execution authority, activation timing, emergency controls, and which decisions remain outside token governance.

See [validators and bridge signers](/docs/build/zel/core-concepts/network-security) for the underlying role separation.
