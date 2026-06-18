# Gateway RPC Proxy (`gateway_rpc_proxy`)

## 1. What is it and why you need it

`gateway_rpc_proxy` is a **local** JSON-RPC service that lets you read the history of a Gateway (GW) address **without ever sending your gateway view secret key to the daemon**.

GW transactions keep amounts and the recipient `gateway_addr` in plaintext, but the **payment ID** and **comments/attachments** are encrypted and can only be decrypted with the gateway **view secret key**. Historically the only way to get a decrypted history was the daemon method `gateway_get_address_history`, which takes that secret key as a parameter:

> **THE PROBLEM**
>
> When you call `gateway_get_address_history` with `gateway_view_secret_key`, that key is sent to the daemon. Whoever runs the daemon (a public node, a hosted node, a compromised host, or anyone sniffing an unencrypted RPC port) can then **permanently decrypt every payment ID and comment of that gateway address - past and future**. It does not let them steal funds (view != spend), but it fully de-anonymizes which deposit belongs to which customer.

`gateway_rpc_proxy` fixes this. You should run it **on your own machine, next to your integration**. It holds the view secret key locally, asks the daemon for the **public** history plus the **raw transactions** (no key involved), decrypts everything **in-process**, and returns the same decrypted history you used to get from the daemon.

```
BEFORE:

  Exchange -> gateway_get_address_history  ->  DAEMON(decrypts here)
          { ..., gateway_view_secret_key }      
               key sent over the wire, leaks to the node operator


AFTER (gateway_rpc_proxy):

  ┌─ your trust boundary (key never leaves) ─────────────┐
  │  Exchange - gateway_get_address_history -> PROXY     │    DAEMON
  │            { gateway_address, offset, count }        │ -> keyless
  │  Exchange <- decrypted history - decrypt             │ <- public + raw txs
  └──────────────────────────────────────────────────────┘
```

The view secret key lives only inside the proxy process. The daemon only ever sees public data.

---

## 2. One method, key optional

No new method was added. The existing `gateway_get_address_history` simply branches on whether you pass the view secret key, so old integrations keep working unchanged.

| `gateway_view_secret_key` | Where | Decrypts? | Returns `raw_txs`? | Use it when |
|---|---|---|---|---|
| **provided** | daemon | daemon-side | no | legacy; only if you run your OWN daemon and accept sending the key to it |
| **omitted** | daemon | no | **yes** | the keyless source the proxy consumes (raw data for client-side decryption) |
| held by the proxy | **proxy** | **locally, in the proxy** | no (stripped) | **recommended** - what your integration should call |

Same method name everywhere - `gateway_get_address_history`. What changes is the key and where you point it:
- daemon **with** key -> decrypted history (key on the wire, insecure unless it is your own node),
- daemon **without** key -> public history + raw txs (undecrypted),
- **proxy** (you send no key) -> fully decrypted history, and the key never leaves the proxy.

---

## 3. Running and configuration

```
gateway_rpc_proxy --gateway-view-secret-key-file=/secure/gw_view.key --daemon-address=http://127.0.0.1:12111 --rpc-bind-port=12333
```

| Option | Default | Meaning |
|---|---|---|
| `--gateway-view-secret-key-file` | - | path to a file containing the 64-hex gateway view secret key (use restricted FS permissions) |
| `--daemon-address` | `http://127.0.0.1:<rpc port>` | upstream zanod RPC address |
| `--rpc-bind-ip` | `127.0.0.1` | interface the proxy listens on (keep it loopback) |
| `--rpc-bind-port` | `12333` | port the proxy listens on |
| `--jwt-secret` | - | enable JWT (HS256) auth on the proxy's RPC (recommended if not loopback) |
| `--unsecure-no-auth` | off | explicitly acknowledge running without auth |

The view secret key can also be provided via the `ZANO_GATEWAY_VIEW_SECRET_KEY` environment variable (note: env vars are visible to process inspection, e.g. `/proc/<pid>/environ`, and are inherited by child processes, so the key-file is preferred). **Never pass the key as a plain command-line argument** - it would land in shell history and process listings.

---

## 4. Reading history — `gateway_get_address_history`

Point your existing integration at the proxy and **drop the `gateway_view_secret_key` from the request** - the proxy holds it.

### Request (to the proxy on `127.0.0.1:12333`)

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "gateway_get_address_history",
  "params": {
    "gateway_address": "gwZ5spcFbYUS2o6A6WWMyzYFRGH8YAZXWSXZ2wBzCtdp8PkBLGoM6fK4W",
    "offset": 0,
    "count": 10
  }
}
```

Parameters:
- `gateway_address` - address `gwZ...` or `gwiZ...`
- `offset` - pagination offset (starting from 0)
- `count` - number of transactions (maximum 200 per request)

### Response (decrypted by the proxy)

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "status": "OK",
    "total_transactions": 2,
    "transactions": [
      {
        "tx_hash": "0d0a3dd1cd5846fe881a2f67918fa8b95b63c737d6e9260214aba9775a4b3fe2",
        "height": 51483,
        "subtransfers_by_pid": [
          {
            "payment_id": "",
            "subtransfers": [
              {
                "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
                "is_income": true,
                "amount": 2000000000000
              }
            ]
          }
        ]
      },
      {
        "tx_hash": "67ea5f84b1c97d3dff7c627c603511513a8d7d10fa04497d80c503ab24dd16d9",
        "height": 58203,
        "subtransfers_by_pid": [
          {
            "payment_id": "",
            "subtransfers": [
              {
                "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
                "is_income": true,
                "amount": 2000000000000
              }
            ]
          }
        ]
      }
    ],
    "balances": [
      {
        "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
        "amount": 4000000000000
      }
    ]
  }
}
```

This is exactly the same shape the legacy `gateway_get_address_history` returned - `subtransfers_by_pid` is decrypted and grouped by `payment_id`, and `balances` holds the current GW balances. (`payment_id: ""` means "no payment id" - a plain deposit. Deposits to a `gwiZ...` integrated address carry a real payment ID here)

---

## 5. What the daemon returns without a key (and why the proxy is needed)

Call the daemon's `gateway_get_address_history` **without** `gateway_view_secret_key` and you get the public history **plus** `raw_txs`, but the transactions are **not** decrypted:

```json
{
  "result": {
    "status": "OK",
    "total_transactions": 2,
    "transactions": [
      { "tx_hash": "0d0a3dd1...", "height": 51483 },
      { "tx_hash": "67ea5f84...", "height": 58203 }
    ],
    "balances": [
      { "asset_id": "d6329b5b...498a", "amount": 4000000000000 }
    ],
    "raw_txs": [
      "040125101a97390000... hex ...",
      "040125101a3d7c0000... hex ..."
    ]
  }
}
```

Note: **no `subtransfers_by_pid`** - the daemon never decrypted anything because it never received the key. The `raw_txs` are exactly what the proxy parses and decrypts locally with the held view secret key. That is the whole point: the daemon is a dumb data source, the secret stays with you.

---

## 6. Migration for exchanges

You were calling the daemon like this (key on the wire — insecure unless it's your own node):

```javascript
// OLD
const history = await callDaemonRpc('gateway_get_address_history', {
  gateway_address: gwAddress,
  gateway_view_secret_key: viewSecretKey,   // <-- leaks to the daemon operator
  offset: 0, count: 50,
});
```

Switch to the proxy — same response, no key in the request:

```javascript
// NEW: point at the local proxy, same method, NO key
const PROXY_RPC_URL = 'http://127.0.0.1:12333/json_rpc';

async function callProxyRpc(method, params = {}) {
  const r = await axios.post(PROXY_RPC_URL, { jsonrpc: '2.0', id: 0, method, params });
  if (r.data.error) throw new Error(`Proxy RPC [${method}]: ${JSON.stringify(r.data.error)}`);
  return r.data.result;
}

const history = await callProxyRpc('gateway_get_address_history', {
  gateway_address: gwAddress,   // the proxy already holds the view secret key
  offset: 0, count: 50,
});

console.log('Total transactions:', history.total_transactions);
for (const tx of history.transactions) {
  for (const pidGroup of tx.subtransfers_by_pid) {
    for (const st of pidGroup.subtransfers) {
      console.log(`${tx.tx_hash}  pid=${pidGroup.payment_id || '(none)'}  ` +
                  `${st.is_income ? '+' : '-'}${st.amount}  asset=${st.asset_id}`);
    }
  }
}
```

The legacy `gateway_get_address_history` on the daemon keeps working unchanged, so you can migrate at your own pace.

---

## 7. Status codes

Same convention as the rest of the gateway API - `status` is `"OK"` on success, otherwise a string code (with `status_error` text):

| `status` | Meaning |
|---|---|
| `OK` | success |
| `BAD_ARG_INVALID_ADDRESS` | `gateway_address` could not be parsed |
| `BAD_ARG_INVALID_ADDRESS_TYPE` | not a gateway address (e.g. a regular `Zx...`) |
| `ARG_OUT_OF_LIMITS` | `count` exceeds the limit (200) |
| `INTERNAL_ERROR` | upstream daemon unreachable, returned no `raw_txs`, or a tx failed to decrypt (see `status_error`) |

If the proxy returns `INTERNAL_ERROR` with `"upstream daemon did not return raw txs..."`, your daemon is too old - it must return `raw_txs` for a keyless `gateway_get_address_history`.

---
