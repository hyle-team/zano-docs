---
sidebar_position: 5
title: Bridge API and status
---

# Bridge API and status model

Bridge clients need authoritative configuration and operation status in addition to normal ZEL JSON-RPC. This page defines the interface areas that the ZEL team must publish; it does not invent endpoint paths or backend enum names.

## Published testnet query API

The active testnet exposes a public query API at [`https://rpc-api.node1.testnet.zano.org`](https://rpc-api.node1.testnet.zano.org). Its root page provides Swagger UI, and the machine-readable schema is available at [`/static/openapi.yml`](https://rpc-api.node1.testnet.zano.org/static/openapi.yml).

The published schema includes bridge chain, token, transaction, submission, epoch, commission, and swap query paths. Treat the live OpenAPI schema as the path and field reference for the current testnet; testnet routes, addresses, confirmations, and response fields can change.

## Required API areas

| Area | Minimum response data |
| --- | --- |
| Release information | Environment, release identifier, build or commit, activation block, and schema version |
| Networks and routes | Chain identifiers, types, names, status, confirmations, and bridge destination |
| Assets | Source and destination identifiers, addresses, decimals, representation type, and enabled routes |
| Limits and fees | Minimum, maximum, remaining cap, rate limit, fee formula, and expected destination amount |
| Deployments | Contract addresses, ABI and source links, implementation addresses, code hashes, and start blocks |
| Submit or register deposit | Canonical deposit identifier and idempotent acknowledgement, if explicit submission is required |
| Operation status | Raw backend state, normalized state, source and destination transaction hashes, timestamps, and actionable error |
| Status stream | Ordered updates through polling, WebSocket, or another documented subscription mechanism |
| Health | Chain observers, signer availability, relayer availability, indexer lag, and maintenance state |

:::note Interface details pending
The public query API and schema are live. Authentication rules, rate limits, write-operation guidance, stability guarantees, example responses, and the mapping from backend enums to the normalized states below still require confirmation.
:::

## Canonical operation identifier

One source transaction can contain more than one bridge-relevant action. A transaction hash alone may therefore be insufficient. The API specification must define an immutable identifier using the source-chain fields needed to select exactly one deposit.

Clients should store the identifier as structured fields rather than parsing a display string.

```json
{
  "sourceChain": "<confirmed route identifier>",
  "sourceTransactionHash": "<transaction hash>",
  "sourceDepositIndex": "<log, output, or service-entry index>",
  "deploymentRelease": "<release identifier>"
}
```

The actual field names and types must match the confirmed API.

## Documentation-level states

The following states provide a stable user-facing model. They must be mapped to the real backend enums before integration.

| Normalized state | Meaning | Client action |
| --- | --- | --- |
| `awaiting_source` | The expected source operation has not been confirmed | Continue watching the source chain |
| `confirming_source` | The source operation exists but lacks required finality | Wait; do not resubmit |
| `validating` | Bridge participants are checking the operation | Continue status tracking |
| `authorized` | Destination action is authorized but not yet finalized | Submit or monitor destination execution as specified by the route |
| `submitting_destination` | A relayer or application is broadcasting the destination action | Track the destination transaction |
| `completed` | The expected destination state is confirmed | Verify recipient, asset, and amount |
| `retryable` | Processing can resume without creating a new source deposit | Follow the published retry action |
| `rejected` | The source operation is not eligible | Show the exact reason and recovery policy |
| `paused` | Route processing is administratively or automatically paused | Preserve identifiers and wait for an official update |
| `manual_review` | Automated processing stopped for reconciliation or safety review | Contact [Zano support](https://zano.org/support) with public identifiers |

Do not expose raw backend strings without also giving the user a clear meaning and next action.

## Status update rules

- Updates must be monotonic or explicitly identify a reorganization rollback.
- Every update should include a server timestamp and schema version.
- Duplicate events must be safe to process.
- A reconnecting client must be able to recover the latest state through a normal status query.
- `completed` must include the destination transaction identifier or another verifiable on-chain result.
- An error should distinguish invalid input, unsupported route, insufficient amount, unavailable signer threshold, relayer failure, contract revert, pause, and internal failure.

## Idempotency and retries

Submitting the same canonical deposit identifier more than once must not create multiple executable withdrawals. A retry endpoint, if provided, should resume the original operation rather than generate a new authorization with ambiguous validity.

See [operation lifecycle and recovery](/docs/build/zel/bridge-and-swaps/operation-lifecycle) for user-facing recovery guidance.
