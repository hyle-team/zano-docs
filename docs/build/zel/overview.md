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
| Testnet | `9350` (`0x2486`) | `zel` | Active development environment |
| Mainnet | `935` (`0x3A7`) | `zel` | Not live |

Use the **Network** selector in the top navigation to confirm which environment the documentation describes. Testnet is the only selectable network; Mainnet remains disabled until a production release is confirmed.

## Documentation structure

- **Architecture:** how the system is built, including the [core modules](/docs/build/zel/architecture/core) (bridge, accumulator, multisig, NFT, tokenomics) and the [signer](/docs/build/zel/architecture/signer) with its TSS and per-chain bridging and swap integrations.
- **Tutorial:** hands-on guides for running a local network, setting up a main node, joining testnet or mainnet as a validator, and operating a TSS node.

Start with the [Architecture introduction](/docs/build/zel/architecture/intro), then follow the [Tutorial](/docs/build/zel/tutorial/intro) to run a node.
