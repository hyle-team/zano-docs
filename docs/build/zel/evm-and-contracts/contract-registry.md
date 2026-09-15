---
sidebar_position: 3
title: Contract registry
---

# Contract registry

These deployments were checked on ZEL testnet, chain ID `9350`, on 14 September 2026. They are an observed deployment snapshot, not a list of supported routes or a security audit. Recheck the chain registry and proxy implementations before use.

## Testnet contracts

| Component | Address | Deployment block | Source verification |
| --- | --- | --- | --- |
| Bridge proxy | [`0x89d5aa702960FD0aE868e21a26f1F419e29431ef`](https://explorer.testnet.zano.org/address/0x89d5aa702960FD0aE868e21a26f1F419e29431ef) | 48019 | Proxy and implementation verified |
| Swapper proxy | [`0x9d56a6741bfBc2f49BaE8a69aF4955DBcd09DB14`](https://explorer.testnet.zano.org/address/0x9d56a6741bfBc2f49BaE8a69aF4955DBcd09DB14) | 48612 | Proxy and implementation verified |
| AMM router | [`0x509945dCDda4DCc056935fFeb5b4c30B723b966e`](https://explorer.testnet.zano.org/address/0x509945dCDda4DCc056935fFeb5b4c30B723b966e) | 48587 | Verified |
| AMM factory | [`0xac6d9cc15746248f120985568B79d8AD27ad4062`](https://explorer.testnet.zano.org/address/0xac6d9cc15746248f120985568B79d8AD27ad4062) | 48583 | Verified |
| ZANO representation / router wrapper | [`0xa8837A67c88e4C74D903952C8275A831Bf52eb15`](https://explorer.testnet.zano.org/address/0xa8837A67c88e4C74D903952C8275A831Bf52eb15) | 48025 | Not verified |

The [Core chain registry](https://rpc-api.node1.testnet.zano.org/cosmos/bridge/chains) identifies the Bridge proxy for chain `9350`. Read-only contract calls confirm that the Swapper points to this Bridge and router, and that the router points to the listed factory and wrapper.

:::note Token metadata
The [Core token registry](https://rpc-api.node1.testnet.zano.org/cosmos/bridge/tokens) identifies the wrapper as ZANO. Its current on-chain metadata is still `Wrapped Zel / wZel`; the intended ticker is `ZANO`. This deployment mismatch remains to be corrected. Identify the asset by chain and address, not its ticker alone.
:::

## Proxy implementations and ABIs

- Bridge implementation: [`0x34d83c9Dcf9E59D16c63fC25f2C9d59c6006F1A3`](https://explorer.testnet.zano.org/address/0x34d83c9Dcf9E59D16c63fC25f2C9d59c6006F1A3).
- Swapper implementation: [`0xe536266770CB94d67855131AC5c0820A468c5A91`](https://explorer.testnet.zano.org/address/0xe536266770CB94d67855131AC5c0820A468c5A91).

The EIP-1967 implementation storage slots match the explorer records. Bind each implementation ABI to its proxy address; do not use the proxy constructor ABI for application calls.

Blockscout's contract pages provide verified source and ABIs. The same records are available through `GET /api/v2/smart-contracts/{address}`. Bridge and Swapper were compiled with Solidity 0.8.9, the router with 0.6.6, and the factory with 0.5.16.

## Administrative boundaries

The verified Bridge restricts upgrades to its owner. Swapper upgrades require `DEFAULT_ADMIN_ROLE`, while the factory restricts pair creation through `CREATE_PAIR_ROLE`.

At the time of inspection, the Bridge owner and member zero of the Swapper and factory default-admin roles were `0xE425646Ac72E9a1425861e8Cfa6bB69B711BFAd4`. This does not establish who controls that account or enumerate every role member.

## Still to complete

The release manifest needs the deployed source revisions, complete authority and upgrade policy, and verified wrapper source. Supported tokens, pairs, routes, fees, and operational guarantees remain TBA. Contract presence alone does not establish them.

See [Bridge contracts](/docs/build/zel/evm-and-contracts/bridge-contracts) for the deposit interface and [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status) for live configuration queries.
