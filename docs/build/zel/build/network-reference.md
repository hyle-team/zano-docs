---
sidebar_position: 2
title: Network and JSON-RPC reference
---

# Network and JSON-RPC reference

## Chain identifiers

| Environment | Status | Decimal chain ID | Hex chain ID | Short name |
| --- | --- | ---: | --- | --- |
| Mainnet | Not live | `935` | `0x3A7` | `zel` |
| Testnet | Available for development | `9350` | `0x2486` | `tzel` |

Always verify `eth_chainId` after connecting. Do not rely only on a wallet's display name because users can add arbitrary networks with duplicate names.

## Endpoint and deployment data

The following public endpoints were verified against the active testnet on 2026-08-28:

| Interface | Endpoint |
| --- | --- |
| EVM JSON-RPC | `https://eth-rpc.node1.testnet.zano.org` |
| EVM WebSocket | `wss://eth-ws.node1.testnet.zano.org` |
| Consensus RPC | `https://rpc.node1.testnet.zano.org` |
| Core REST and OpenAPI | [`https://rpc-api.node1.testnet.zano.org`](https://rpc-api.node1.testnet.zano.org) |
| Explorer | [`https://explorer.testnet.zano.org`](https://explorer.testnet.zano.org) |

Verify the EVM endpoint before use:

```bash
curl https://eth-rpc.node1.testnet.zano.org \
  -H "content-type: application/json" \
  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

The expected result is `0x2486`. Faucet, application, contract, genesis, peer, and gRPC client details remain release-specific and are not yet published. If a value is unavailable or cannot be verified against the chain, do not guess it.

## Common EVM methods

EVM clients can begin with standard JSON-RPC calls:

- `eth_chainId` to verify the selected environment.
- `eth_blockNumber` to check node progress.
- `eth_getBalance` and `eth_call` for reads.
- `eth_estimateGas` before a state-changing transaction.
- `eth_sendRawTransaction` to broadcast a signed transaction.
- `eth_getTransactionReceipt` to confirm execution status.

Support for tracing, archive reads, subscriptions, debug methods, transaction types, and specific EVM revisions depends on the current node release and endpoint configuration.

## Integration requirements

- Reject a mismatched chain ID before signing or broadcasting.
- Display network and recipient on every transaction preview.
- Pin verified bridge, router, token, oracle, staking, and governance addresses by release.
- Handle RPC disagreement, stale blocks, reorgs, timeouts, and replacement transactions.
- Do not use a single public RPC as the sole source for value-bearing backend decisions.
- Record deployment and ABI versions alongside every indexed event.

For source code, see the [repository guide](/docs/build/zel/reference/repositories).
