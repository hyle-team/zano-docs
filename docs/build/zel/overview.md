---
sidebar_position: 1
title: ZEL overview
---

# Zano Execution Layer (ZEL)

:::caution Testnet only
ZEL is currently available only on testnet. Mainnet is not live. Do not use real assets or rely on testnet state remaining available.
:::

Zano Execution Layer (ZEL) is a public, EVM-compatible Layer 1 connected to Zano. Zano remains the confidential base layer; ZEL provides public smart-contract execution.

## Network

| Network | Chain ID | Short name | Status |
| --- | ---: | --- | --- |
| Testnet | `9350` (`0x2486`) | `tzel` | Active development environment |
| Mainnet | `935` (`0x3A7`) | `zel` | Not live |

Use the **Network** selector in the top navigation to confirm which environment the documentation describes. Testnet is the only selectable network; Mainnet remains disabled until a production release is confirmed.

## Documentation structure

- **Core concepts:** shared explanations of Zano, ZEL, assets, privacy, and network security.
- **Architecture:** components and trust boundaries.
- **Bridge and swaps:** bridging flows, operation states, and integration points.
- **EVM and contracts:** compatibility, deployments, events, and indexing.
- **DeFi:** active testnet AMM swaps and lending under development.
- **Stake and govern (planned):** the future stZANO participation model.
- **Build on ZEL:** developer setup and Solidity integration guidance.
- **Operate ZEL:** service-operation and release-readiness guidance.
- **Reference:** repositories and terminology.

Start with [Zano and ZEL](/docs/build/zel/core-concepts/zano-and-zel), then review [Network access](/docs/build/zel/status-and-access).
