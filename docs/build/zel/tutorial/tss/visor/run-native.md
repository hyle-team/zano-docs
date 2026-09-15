---
sidebar_position: 3
---

# Run Visor on a Linux host

:::note Operator package TBA
This is a deployment template. The team still needs to confirm the release, Core endpoints, and environment-specific configuration before it can be used.
:::

Run Visor directly on the host as a regular process. Postgres can still come
from Docker or any managed provider — only Visor itself runs as a native
binary here.

## Prerequisites

- **Go 1.25+** (only for building from source).
- A reachable **PostgreSQL** instance whose DSN matches `db.url` — see
  [Set up database](../prerequisites/db.md).
- A reachable **ZEL Core node** (RPC + gRPC) — see
  [Nodes](/docs/build/zel/tutorial/tss/overview).
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
  binary_path: "/opt/tss-wrapper/binary/tss"
  binary_params: "service run sign --config /opt/tss-wrapper/binary/configs/tss.yaml"
  api_params: ""
  config_path: "/opt/tss-wrapper/binary/configs/tss.yaml"
  certificates_path: "/opt/tss-wrapper/binary/configs/certs"
  core_address: "REPLACE_WITH_ZEL_NODE_ADDRESS"
```

See [Configuration file](./configuration.md) for the full field reference.

## 1. Build Visor

From a clone of the `tss-wrapper-svc` repo:

```bash
go build -o tss-wrapper-svc .
install -m 0755 tss-wrapper-svc /opt/tss-wrapper/tss-wrapper-svc
```

## 2. Prepare a dedicated Visor database

Use the [database template](../prerequisites/db.md) with the Visor values: a separate `visor-db` Compose project, database and role, and loopback port `5435`. A managed PostgreSQL instance with equivalent isolation is also suitable.

Set `db.url` in `/opt/tss-wrapper/config.yaml` to that database's DSN. Do not reuse the TSS database or its credentials. Keep the configuration file readable only by the service account.

## 3. Configure Visor

Fill in the [configuration template](./configuration.md), including approved Core endpoints and the ZEL node address. Keep the HTTP and gRPC listeners on loopback unless the team has approved remote access.

The commands below pass Visor's config with `-c` (`--config` is equivalent). The TSS process needs its own explicit `--config` argument in `binary_params`; Visor does not add it automatically.

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

Replace the service-user placeholder with a dedicated account. Before enabling the unit, give that account read access to the protected configuration and write access to the TSS binary, its directory, and the configuration and certificate directories used by update tasks. Keep the Visor binary and systemd unit root-owned.

```ini title="/etc/systemd/system/tss-wrapper.service"
[Unit]
Description=TSS Visor service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=REPLACE_WITH_DEDICATED_SERVICE_USER
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
