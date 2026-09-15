---
sidebar_position: 5
title: Bridge API
---

# Bridge API

Bridge integrations use Core queries for route and asset configuration and the TSS service for deposit processing. [Network access](/docs/build/zel/status-and-access) lists the endpoints.

## Core queries

The Core API publishes its [OpenAPI schema](https://rpc-api.node1.testnet.zano.org/static/openapi.yml). Use that schema for field names, types, pagination, and available queries.

The implementation reference includes:

| Query | Purpose |
| --- | --- |
| `GET /cosmos/bridge/chains` | Chain identifiers, types, bridge destinations, and confirmation settings |
| `GET /cosmos/bridge/tokens` | Asset mappings, representations, decimals, and fee information |
| `GET /cosmos/bridge/token-info/:chainid/:tokenaddress` | Asset information for one chain and address |

Fetch the current route and token information before constructing a deposit. Adapter support in source code does not establish that a particular route is enabled.

## Deposit processing

The TSS integration reference uses:

| Operation | Path |
| --- | --- |
| Submit a source deposit | `POST /submit` |
| Read its processing result | `GET /check/:chainid/:txhash/:tx_nonce` |
| Subscribe to result changes | `/ws/check/:chainid/:txhash/:nonce` over WebSocket |

These paths are relative to the TSS endpoint, not the Core REST API. Use the [TSS API schema](https://tss1.testnet.zano.org/api) for the approved release's payloads, hash encoding, and response types.

:::note Integration details TBA
Third-party integrations are supported in principle. Authentication, rate limits, versioning, complete status semantics, and retry guarantees are not specified yet. This reference is not a service-availability commitment.
:::

## Identify one source operation

Store the source-chain identifier, transaction hash, and route-specific event index or nonce. A transaction can contain multiple deposits, so its hash alone may be insufficient.

For the inspected Zano adapter, nonce zero selects a wallet burn and a positive nonce selects gateway history; the memo is read from the first service entry in both cases. See [Zano to ZEL](/docs/build/zel/bridge-and-swaps/zano-to-zel). Do not replace a route-specific identifier with a guessed index.

## Interpret the result

Keep the raw status and returned operation data. Do not invent backend enum values or assume an API processing result proves destination execution. The full status mapping must come from the approved service release.

When an EVM withdrawal requires the client to submit a transaction, use the returned asset, representation flag, amount, and authorization with the verified deployment ABI. Then verify the destination receipt and outcome.

See [operation lifecycle and recovery](/docs/build/zel/bridge-and-swaps/operation-lifecycle). A failed status request is not a reason to create another source deposit.
