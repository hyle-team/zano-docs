---
sidebar_position: 2
title: Assets and reward configuration
---

# Assets and reward configuration

The user-facing asset model distinguishes ZANO used for gas from the separate planned staking asset. See the [asset model](/docs/build/zel/core-concepts/asset-model) and [planned staking and governance](/docs/build/zel/core-concepts/network-security).

Internal Cosmos denominations are not display tickers. The testnet uses `uzel` for gas and fees and `ustake` for staking. Do not label a user's gas balance "ZEL" just because the base denomination contains that name.

## Read the active configuration

Use the testnet query API to inspect parameters:

```bash
curl --fail https://rpc-api.node1.testnet.zano.org/cosmos/staking/v1beta1/params
curl --fail https://rpc-api.node1.testnet.zano.org/cosmos/mint/v1beta1/params
curl --fail https://rpc-api.node1.testnet.zano.org/cosmos/distribution/v1beta1/params
```

These responses describe a particular deployment. Record its chain ID, block height, release, denominations, reward settings, and parameter values when documenting it.

Module support for NFT delegations or rewards does not establish that a user-facing staking product is available. Testnet parameters are not a commitment to mainnet economics.

## Team confirmation required

Before publishing token allocation or reward guidance, the team must confirm:

- The staking asset's name, denomination, supply, and allocation.
- Which reward mechanisms are enabled and how their parameters are interpreted.
- NFT participation, locking, delegation, and withdrawal rules.
- Governance authority and activation of parameter changes.
