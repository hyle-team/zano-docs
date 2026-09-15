---
sidebar_position: 1
title: Architecture
---

# ZEL architecture

Zano Execution Layer combines public EVM execution with cross-chain services connecting ZEL, Zano, and enabled external networks. Zano L1 and ZEL remain separate chains: Zano provides confidential transfers and Confidential Assets; ZEL exposes public accounts, contracts, logs, and application state.

## Components

| Component | Responsibility |
| --- | --- |
| ZEL Core | Consensus, EVM execution, bridge configuration, and recorded operation state |
| Chain adapters | Interpret source deposits, asset identifiers, recipients, and confirmation rules |
| Threshold signers | Validate deposits and cooperate to authorize destination actions |
| Destination contracts or services | Verify authorization and finalize the transfer |
| Relayers and indexers | Submit or observe transactions and expose operation progress |

These are logical responsibilities. A deployment may combine them, but their permissions and failure modes remain distinct.

## Trust boundaries

ZEL consensus does not independently prove that a deposit on another chain is valid. A threshold signature is also not a light-client proof: safety depends on source-chain observations, signer membership, key handling, contract checks, and administrative controls.

Moving value from Zano to ZEL exposes destination activity to public EVM state. See [privacy boundaries](/docs/build/zel/core-concepts/privacy-boundary) and [validators and bridge signers](/docs/build/zel/core-concepts/network-security).

## Read next

- [Core modules](/docs/build/zel/architecture/core/)
- [Threshold signer internals](/docs/build/zel/architecture/signer/tss)
- [End-to-end bridge flow](/docs/build/zel/bridge-and-swaps/end-to-end-flow)
- [Operator guides](/docs/build/zel/operate/overview)

Match implementation references to the approved release. Module capabilities and example adapters do not establish which features or routes are enabled on testnet.
