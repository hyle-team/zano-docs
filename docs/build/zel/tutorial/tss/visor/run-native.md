---
sidebar_position: 3
---

# Run Visor on a Linux host

Run Visor directly on the host as a regular process. Postgres can still come
from Docker or any managed provider — only Visor itself runs as a native
binary here.

## Prerequisites

- **Go 1.25+** (only for building from source).
- A reachable **PostgreSQL** instance whose DSN matches `db.url` — see
  [Set up database](../prerequisites/db.md).
- A reachable **ZEL Core node** (RPC + gRPC) — see
  [Nodes](../prerequisites/nodes.md).
- The **TSS binary** itself plus its YAML config, TLS certificates and
  Vault secrets, prepared by following the previous guide:
    - [Install binary](../prerequisites/binary.md)
    - [Configuration file](../configuration/config.md)
    - [TLS certificates](../configuration/tls-certs.md)
    - [Secrets](../configuration/secrets.md)
    - [Key generation](../run/keygen.md)

## Recommended on-disk layout

Pick a deployment root and lay the files out as follows. The absolute paths
below are what you put into `config.yaml`.

```text
/opt/tss-wrapper/
├── tss-wrapper-svc            # Visor binary (built in the next step)
├── config.yaml                # Visor config
└── binary/
    ├── tss                    # TSS binary          -> tss.binary_path
    └── configs/
        ├── tss.yaml           # TSS binary config   -> tss.config_path
        └── certs/             # certificates dir    -> tss.certificates_path
```

Requirements:

- `tss.binary_path` must be an absolute path to an executable file. Visor
  launches it with `tss.binary_params` for default mode and, during tasks,
  re-launches it with `--config <tss.config_path>`.
- `tss.config_path` is the TSS binary's own YAML. Visor mutates
  `parties.list` here during a reshare, and the `timechanger` task rewrites
  timing fields in it. Start from the config you produced in
  [Configuration file](../configuration/config.md).
- `tss.certificates_path` must be a directory writable by Visor and
  readable by the TSS binary. Party certificates are written as
  `<domain>.crt`. The initial certificates come from
  [TLS certificates](../configuration/tls-certs.md).

Matching `config.yaml` snippet:

```yaml title="config.yaml"
tss:
  binary_path: "path/to/binary/tss"
  binary_params: ""
  api_params: ""
  config_path: "path/to/binary/tss/tss.yaml"
  certificates_path: "path/to/binary/tss/certs"
  core_address: "bridge1..."
```

See [Configuration file](./configuration.md) for the full field reference.

## 1. Build Visor

From a clone of the `tss-wrapper-svc` repo:

```bash
go build -o tss-wrapper-svc .
install -m 0755 tss-wrapper-svc /opt/tss-wrapper/tss-wrapper-svc
```

## 2. Start Postgres (if you don't already have one)

Any Postgres instance works; the upstream repo bundles one for convenience:

```bash
docker compose -f build/docker-compose.yaml up -d db
```

This exposes Postgres on `localhost:5435` with:

- user: `tss-wrapper`
- password: `tss-wrapper`
- db: `db`

Make sure `db.url` in your `config.yaml` matches, for example:

```yaml title="config.yaml"
db:
  url: postgres://tss-wrapper:tss-wrapper@localhost:5435/db?sslmode=disable
```

For alternative Postgres setups, see
[Set up database](../prerequisites/db.md).

## 3. Passing the config file

Every `tss-wrapper-svc` subcommand accepts `-c` / `--config` and defaults to
`./config.yaml`:

```bash
tss-wrapper-svc service run --config /opt/tss-wrapper/config.yaml
tss-wrapper-svc service run -c /opt/tss-wrapper/config.yaml
tss-wrapper-svc service migrate up   -c /opt/tss-wrapper/config.yaml
tss-wrapper-svc service migrate down -c /opt/tss-wrapper/config.yaml
```

## 4. Apply DB migrations

Run once against each fresh database:

```bash
cd /opt/tss-wrapper
./tss-wrapper-svc service migrate up -c ./config.yaml
```

This creates Visor's `epochs`, `latest_block` and `tasks` tables.

## 5. Run Visor

```bash
cd /opt/tss-wrapper
./tss-wrapper-svc service run -c ./config.yaml
```

You should see the orchestrator log `started default mode` once Visor has
launched the TSS binary.

## 6. Verify

- HTTP gateway:

```bash
curl http://localhost:8080/
```

- gRPC:

```bash
grpcurl -plaintext localhost:9090 list
```

- Logs should include the orchestrator line `started default mode` and
  observer lines for events consumed from ZEL Core.

## 7. Run Visor as a systemd unit

```ini title="/etc/systemd/system/tss-wrapper.service"
[Unit]
Description=TSS Visor service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/opt/tss-wrapper
ExecStart=/opt/tss-wrapper/tss-wrapper-svc service run -c /opt/tss-wrapper/config.yaml
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and inspect:

```bash
systemctl daemon-reload
systemctl enable --now tss-wrapper
journalctl -u tss-wrapper -f
```

:::info
Visor will drive the TSS binary end-to-end from this point on. Epoch
transitions trigger `auto_resharing` automatically — the manual flow
documented in [Key resharing](../run/reshare.md) is only needed for
one-off operations or disaster recovery.
:::
