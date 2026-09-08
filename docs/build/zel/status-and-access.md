---
sidebar_position: 2
title: Network access
---

# ZEL testnet network access

Use this page for the connection data associated with the active testnet release.

| Service | URL or value | Status | Last verified |
| --- | --- | --- | --- |
| EVM JSON-RPC | `https://eth-rpc.node1.testnet.zano.org` | Active; `eth_chainId` returns `0x2486` | 2026-08-28 |
| EVM WebSocket | `wss://eth-ws.node1.testnet.zano.org` | Endpoint responding | 2026-08-28 |
| Consensus RPC | `https://rpc.node1.testnet.zano.org` | Active; reports network `zel_9350-1` | 2026-08-28 |
| Core REST and OpenAPI | [`https://rpc-api.node1.testnet.zano.org`](https://rpc-api.node1.testnet.zano.org) | Active; Swagger UI available | 2026-08-28 |
| Explorer | [`https://explorer.testnet.zano.org`](https://explorer.testnet.zano.org) | Active | 2026-08-28 |
| Faucet | Not published | Pending | 2026-08-28 |
| gRPC client details | Not published | Schema and client guidance pending | 2026-08-28 |
| Genesis or peer information | Not published | Pending | 2026-08-28 |

:::note Verification scope
The EVM RPC returned chain ID `0x2486`, and the consensus RPC reported network `zel_9350-1`, when checked on 2026-08-28. Other DNS hostnames used by testnet infrastructure are not public API contracts unless they are documented here.
:::

Before testing, confirm the client reports chain ID `9350`, the RPC and explorer agree on the latest block, and the required route or contract is active.
