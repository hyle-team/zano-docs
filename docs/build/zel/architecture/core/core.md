---
sidebar_position: 1
---

# General design

- [Core repository](https://github.com/Zano-Execution-Layer/zel-core)
- [CosmosSDK repository](https://github.com/Zano-Execution-Layer/cosmos-sdk)
- [Ethermint version](https://github.com/evmos/evmos/releases/tag/v12.1.6)

## Overview

The core service of ZEL operates as a decentralized ledger, facilitating the storage of information related to
cross-chain operations. The core employs the Delegated Proof of Stake (DPoS) consensus algorithm and utilizes CosmosSDK
as the framework to meet its requirements. CosmosSDK offers a modular architecture and tools for creating custom
blockchains that are interoperable within the Cosmos ecosystem. While leveraged
on [ethermint](https://github.com/evmos/evmos/releases/tag/v12.1.6), in a couple with EVM compatibility, ZEL Core
provides additional or extended functionality for NFTs, staking, rewarding, etc.

---

## CosmosSDK

CosmosSDK provides a vanilla edition with default modules that cover fundamental blockchain functionality, including:

- User account and balance management.
- Issuance of fungible and non-fungible tokens.
- Staking mechanisms.
- etc.

For ZEL’s unique business needs, some custom modules have been developed, and some default modules have been
modified:

- [Changes](./tokenomics.md) in Staking, Distribution and Mint modules.
- [Accumulator module](./accumulator.md).
- [NFT module](./nft.md).
- [Bridge module](./bridge.md)
- [Multisig module](./multisig.md)

By leveraging CosmosSDK, ZEL’s core service ensures a robust, modular, and extensible architecture capable of
handling complex cross-chain operations. With a focus on compatibility, deterministic behavior, and future-proofing, the
custom modules and modifications to existing modules are aligned with the highest standards of decentralized application
development.

