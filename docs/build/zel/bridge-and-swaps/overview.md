---
sidebar_position: 1
title: Bridge and swaps overview
---

# Bridge and swaps

:::caution Testnet only
Bridge and swap routes are active on testnet. Use test assets only, and confirm that the selected route is available before submitting an operation.
:::

ZEL distinguishes four operations that can look similar in an interface but have different guarantees.

| Operation | Where it settles | Typical behavior |
| --- | --- | --- |
| Zano–ZEL bridge | Zano plus ZEL | Locks/accounts for value on the source side and makes an equivalent representation available on the destination side |
| External bridge | ZEL plus another chain | Moves a supported asset through a route with its own confirmations, signer policy, caps, and recovery behavior |
| Cross-chain swap | Two networks | Combines a bridge operation with destination execution; the bridge may complete even if the destination swap falls back |
| ZEL-local AMM swap | ZEL only | Executes against an on-chain liquidity pool in one ZEL transaction |

Zano Ionic Swaps are a fifth, separate mechanism: private peer-to-peer swaps that settle on Zano L1. They should never be presented as a ZEL AMM swap.

## Before starting

Verify all of the following in the active application or explorer:

- Source and destination networks.
- Asset identity and contract address.
- Recipient address and who controls it.
- Route status, minimum and maximum amount, cap, and rate limit.
- Expected confirmations, delay, fee, and minimum received.
- Refund, fallback, cancellation, and manual-review behavior.

Never send funds directly to an observed gateway or contract address unless the current guide explicitly instructs you to do so. Bridge deposits often require operation-specific metadata or a generated address.

## Follow the bridge path

1. Start with the [end-to-end bridge flow](/docs/build/zel/bridge-and-swaps/end-to-end-flow).
2. Choose [Zano to ZEL](/docs/build/zel/bridge-and-swaps/zano-to-zel) or [ZEL to Zano](/docs/build/zel/bridge-and-swaps/zel-to-zano).
3. Integrators should implement the [bridge API and status model](/docs/build/zel/bridge-and-swaps/api-and-status).
4. Use [operation lifecycle and recovery](/docs/build/zel/bridge-and-swaps/operation-lifecycle) when an operation is delayed or incomplete.
