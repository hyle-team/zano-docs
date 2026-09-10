---
sidebar_position: 2
---

# Configuration file

Visor is configured via a single YAML file. Every `tss-wrapper-svc` subcommand
accepts `-c` / `--config` and defaults to `./config.yaml` in the current
working directory.

:::info
This file is **Visor's own configuration** — it is separate from the TSS
binary's `tss.yaml`. The TSS binary config (`tss.yaml`), party TLS
certificates and Vault secrets are the artifacts you produced by following
the previous guide in `docs/tutorial/tss/`. Visor only points at them.
:::

## Field reference

Fields marked **required** must be present.

### `log`

- `log.level` — `debug`, `info`, `warn`, `error`.
- `log.disable_sentry` — disable Sentry reporter.

### `db`

- **`db.url`** (required) — PostgreSQL DSN used by Visor. See
  [Set up database](../prerequisites/db.md) for how to run a suitable
  Postgres instance.

### `listeners`

- **`listeners.api_grpc_addr`** (required) — `host:port` for Visor's gRPC
  server.
- **`listeners.api_http_addr`** (required) — `host:port` for Visor's HTTP
  gateway.

### `tendermint_connector`

- **`tendermint_connector.tendermint_rpc`** (required) — Tendermint RPC URL of the ZEL Core node.
- **`tendermint_connector.tendermint_grpc`** (required) — Tendermint gRPC
  URL of the ZEL Core node.

See [Nodes](../prerequisites/nodes.md) for how to obtain these
endpoints.

### `tss`

- **`tss.binary_path`** (required) — absolute path to the TSS binary. See
  [Install binary](../prerequisites/binary.md).
- **`tss.binary_params`** (required) — arguments used when Visor launches
  the binary in default mode.
- `tss.api_params` — arguments for the optional API-mode instance. Leave
  empty to disable.
- **`tss.config_path`** (required) — path to the **TSS binary's own YAML
  config** (produced in
  [Configuration file](../configuration/config.md)). During a reshare,
  Visor mutates the `parties.list` section of this file; during a
  `timechanger` task, Visor rewrites its timing fields.
- **`tss.certificates_path`** (required) — directory where party TLS
  certificates are written. Must be writable by Visor and readable by the
  TSS binary. Party certificates are stored as `<domain>.crt`. The initial
  set of certificates is the one produced in
  [TLS certificates](../configuration/tls-certs.md).
- **`tss.core_address`** (required) — Cosmos address of this TSS node. See
  [Core account](../prerequisites/core-account.md).

### `events`

Each entry in `events.list` binds a ZEL Core event to a TSS task.

- **`events.list[].event`** (required) — event name emitted by
  ZEL Core.
- **`events.list[].task_type`** (required) — one of:
    - `auto_resharing`
    - `update`
    - `migrate_up`
    - `timechanger`
- `events.list[].prestart` — if `true`, the task is also executed once,
  before Visor starts the binary's default mode.

## Minimal working example

```yaml title="config.yaml"
log:
  level: debug
  disable_sentry: true

db:
  url: postgres://db:db@localhost:5435/db?sslmode=disable

listeners:
  api_grpc_addr: "0.0.0.0:9090"
  api_http_addr: "0.0.0.0:8080"

tendermint_connector:
  tendermint_rpc:  "https://rpc.node1.testnet.zano.org:443"
  tendermint_grpc: "core-api.node1.testnet.zano.org:443"

tss:
  binary_path: "path/to/tss/binary/"
  binary_params: ""
  api_params: ""
  config_path: "path/to/tss/configs/tss.yaml"
  certificates_path: "path/to/tss/configs/certs"
  core_address: "zel1t8xw56.....ylx"

events:
  list:
    - event: "STARTED_NEW_EPOCH"
      task_type: "auto_resharing"
    - event: "TSS_UPDATE_REQUESTED"
      task_type: "update"
    - event: "MIGRATE_UP"
      task_type: "migrate_up"
```

## Event-to-task mapping

A typical production setup wires the three core lifecycle events to their
respective task types:

- `STARTED_NEW_EPOCH` → `auto_resharing` — starts the multi-step autoresharing
  flow. Manual flow described in [Key resharing](../run/reshare.md).
- `TSS_UPDATE_REQUESTED` → `update` — in-place update of the running TSS
  binary.
- `MIGRATE_UP` → `migrate_up` — launches the TSS binary in migrate-up mode

Use `prestart: true` on an entry if you want Visor to run that task once on
startup before handing control to the TSS binary's default mode.

:::info
`tss.config_path` points at the TSS binary config produced in
[Configuration file](../configuration/config.md);
`tss.certificates_path` must contain the TLS certs produced in
[TLS certificates](../configuration/tls-certs.md); the initial share
stored in Vault must already exist per
[Key generation](../run/keygen.md).
:::
