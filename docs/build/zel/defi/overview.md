---
sidebar_position: 1
title: DeFi
---

# DeFi on ZEL testnet

Swaps are active on testnet through a Uniswap V2-style AMM. Lending is in development and is not presented as an available feature.

:::note Deployment details pending
Verified contract addresses, source revisions, approved pairs, and detailed flow coverage have not been published yet. Confirm them against the active testnet release before integrating.
:::

## Contract map

| Component | Purpose | Testnet address | Source revision | Status |
| --- | --- | --- | --- | --- |
| Factory | Creates approved liquidity pairs | TBD | TBD | TBD |
| Pair | Holds reserves and executes constant-product swaps | Per pair | TBD | TBD |
| Router | Executes swaps and manages liquidity | TBD | TBD | TBD |
| Native-coin wrapper | Provides an ERC-20-compatible native asset | TBD | TBD | TBD |
| Multicall | Batches read-only contract queries | TBD | TBD | TBD |

## Flow coverage

AMM swaps are active on testnet. The detailed routing and liquidity capabilities below still require release-specific confirmation.

| Flow | Published status |
| --- | --- |
| AMM swaps | Active on testnet |
| Approved tokens and pairs | Details pending |
| Native-coin-to-token routes | Details pending |
| Multi-hop routes | Details pending |
| Add and remove liquidity | Details pending |
| LP-token permit flows | Details pending |
| Fee-on-transfer token support | Details pending |

## Release details to confirm

- Approved tokens and pairs.
- Swap fee and protocol-fee recipient.
- Pair-creation and administrative role holders.
- Router, wrapper, and Factory versions.
- Application and indexer links.
- Security-review status and known limitations.

Do not add APY, liquidity, volume, lending, oracle, or liquidation claims until the corresponding deployment and data source are confirmed.
