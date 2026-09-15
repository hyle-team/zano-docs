---
sidebar_position: 2
title: Network access
---

# Network access

Use these identifiers and endpoints to connect to ZEL testnet. Mainnet is not live.

## Network identity

| Setting | Testnet | Reserved mainnet |
| --- | --- | --- |
| EVM chain ID | `9350` (`0x2486`) | `935` (`0x3A7`) |
| Short name | `tzel` | `zel` |
| Cosmos chain ID | `zel_9350-1` | Not published |
| Native gas ticker | `ZANO` | Not live |

Cosmos base denominations are `uzel` for gas and fees and `ustake` for staking. They are not display tickers. See the [asset model](/docs/build/zel/core-concepts/asset-model).

## Testnet endpoints

| Interface | Endpoint |
| --- | --- |
| EVM JSON-RPC | [eth-rpc.node1.testnet.zano.org](https://eth-rpc.node1.testnet.zano.org) |
| EVM WebSocket | `wss://eth-ws.node1.testnet.zano.org` |
| Consensus RPC | [rpc.node1.testnet.zano.org](https://rpc.node1.testnet.zano.org) |
| Core REST / OpenAPI | [rpc-api.node1.testnet.zano.org](https://rpc-api.node1.testnet.zano.org) |
| EVM explorer: Blockscout | [explorer.testnet.zano.org](https://explorer.testnet.zano.org) |
| Cosmos explorer: Big Dipper | [scan.testnet.zano.org](https://scan.testnet.zano.org) |
| TSS integration reference | [tss1.testnet.zano.org/api](https://tss1.testnet.zano.org/api) |

Third-party TSS integrations are supported in principle. Authentication, rate limits, versioning, and lifecycle guarantees are not specified yet; see [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status).

The existing [Zano testnet faucet](https://faucet.testnet.zano.org) serves Zano L1. ZEL ZANO will be added there; that addition is not available yet. Until then, arrange ZEL test funds with the team.

Public gRPC client settings and the ZEL-specific genesis, configuration, and peer package are still to be supplied. A DNS record alone does not establish an API contract.

## Verify the connection

```bash
curl --fail https://eth-rpc.node1.testnet.zano.org \
  -H "content-type: application/json" \
  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

Expect `0x2486`. Confirm the consensus node reports `zel_9350-1` and that block height is advancing before using the endpoints. Availability and enabled methods may change during testnet.

For wallet setup, use the [quickstart](/docs/build/zel/build/quickstart). For source access, use [repositories and releases](/docs/build/zel/reference/repositories).
