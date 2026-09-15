---
sidebar_position: 1
title: DeFi
---

# DeFi on ZEL

AMM swaps are active on testnet. The implementation follows a Uniswap V2-style factory, pair, and router model. Lending remains in development.

Use the [contract registry](/docs/build/zel/evm-and-contracts/contract-registry) for release-specific addresses, ABIs, and administrative roles. Do not treat an example contract or similarly named token as the deployed version.

## Integration coverage to complete

The observed router, factory, Swapper, and wrapper addresses are listed in the contract registry. Supported tokens and pairs, fees, liquidity operations, token behavior, and the application entry point remain TBA. A deployed method is not a commitment that the corresponding operation is supported.

Once those details are verified, this section should cover swaps, adding and removing liquidity, and transaction verification. Cross-chain swap routing is documented separately in the [swap reference](/docs/build/zel/architecture/signer/integration/swap/general_flow).

Lending, yield, oracle, and liquidation guidance will be added only when the corresponding product and deployment are confirmed.
