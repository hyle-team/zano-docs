---
sidebar_position: 1
title: Architecture overview
---

# ZEL architecture

Zano Execution Layer combines a public EVM execution environment with a bridge to the private Zano network. The two chains remain separate systems: Zano provides confidential value transfer and Confidential Assets, while ZEL provides public accounts, contracts, events, and application state.

## System at a glance

| Layer | Responsibility | Publicly observable? |
| --- | --- | --- |
| Zano L1 | Private transfers, Confidential Assets, and the source or destination side of a Zano bridge operation | Zano privacy rules apply |
| ZEL consensus | Orders blocks and finalizes ZEL state transitions | Yes |
| EVM execution | Runs contracts, accounts for gas, and emits logs | Yes |
| Bridge control and verification | Defines supported routes and validates source-chain operations | Its published configuration and results should be auditable |
| Threshold authorization | Authorizes cross-chain releases without relying on one complete signing key | Membership and threshold policy must be published before production |
| Relaying and finalization | Delivers an authorized operation to the destination chain | Destination transactions are public where the destination is public |
| Applications and indexers | Present routes, construct transactions, track state, and explain recovery | Yes, except locally held secrets |

This table describes logical responsibilities, not confirmed service or binary names. One implementation may combine responsibilities, but its security boundaries should remain explicit.

## Cross-chain operation path

1. A client discovers a supported route, asset, fee policy, limits, and current deployment.
2. The user authorizes and submits the source-chain operation.
3. The bridge waits for the required source-chain finality.
4. Independent bridge participants validate the same source operation and destination intent.
5. The required authorization is produced for the exact asset, amount, recipient, destination, operation identifier, and signer epoch.
6. A user, application, or relayer submits the destination action, depending on the route.
7. The client verifies the destination-chain result rather than relying only on an API response.

See the [end-to-end bridge flow](/docs/build/zel/bridge-and-swaps/end-to-end-flow) for the integration sequence.

## Security boundaries

- ZEL consensus finality does not by itself prove that a source-chain deposit is valid.
- A bridge authorization must commit to the complete destination action and be protected against replay.
- A relayer may transport a valid action, but it must not be able to change the authorized recipient or amount.
- A frontend is a transaction-construction tool, not a source of final truth.
- Contract administrators, upgrade authorities, pause roles, and signer-set changes are part of the trust model.
- Moving value from Zano to ZEL crosses from private state into public EVM state.

:::note Deployment details pending
Production component names, public source references, and the boundary between on-chain and externally operated services have not yet been published. This page describes roles and trust questions, not a confirmed deployment topology.
:::
