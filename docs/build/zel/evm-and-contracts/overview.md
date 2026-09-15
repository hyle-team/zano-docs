---
sidebar_position: 1
title: EVM compatibility
---

# EVM compatibility

ZEL supports Solidity contracts and EVM tooling alongside its Cosmos-based protocol modules. EVM accounts, contracts, balances, calldata, and logs are public.

Use [network access](/docs/build/zel/status-and-access) for chain IDs and endpoints, and the [developer quickstart](/docs/build/zel/build/quickstart) to connect a wallet or client.

## Developing contracts

Follow [Solidity and deployment](/docs/build/zel/build/solidity) for compiler settings, current testnet compatibility notes, and the deployment workflow. Check the [contract registry](/docs/build/zel/evm-and-contracts/contract-registry) before integrating with an existing contract.

## JSON-RPC

Applications use Ethereum-style methods such as `eth_call`, `eth_estimateGas`, `eth_sendRawTransaction`, and `eth_getTransactionReceipt`. Verify `eth_chainId` before signing and estimate gas and fees for each transaction.

Availability of subscriptions, tracing, archive reads, and individual methods depends on the endpoint.
