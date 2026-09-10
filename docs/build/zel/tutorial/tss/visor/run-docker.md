---
sidebar_position: 4
---

# Run Visor in Docker

Run Visor as a container built from the upstream `build/Dockerfile`. This is
the recommended way to keep the Postgres + Visor + TSS stack reproducible.

## Prerequisites

- **Docker 20+** with the `docker compose` plugin.
- A reachable **ZEL Core node** (RPC + gRPC) — see
  [Nodes](../prerequisites/nodes.md).
- The **TSS binary** built for `linux/amd64` (the base image is
  `alpine:3.9`) on the host, plus its config and certificates directory.
  See:
    - [Install binary](../prerequisites/binary.md)
    - [Configuration file](../configuration/config.md)
    - [TLS certificates](../configuration/tls-certs.md)
    - [Secrets](../configuration/secrets.md)
    - [Key generation](../run/keygen.md)

## On-host layout that will be mounted

Keep Visor's config and the TSS binary assets on the host and mount them
into the container:

```text
./deploy/
├── config.yaml                # Visor config
└── binary/
    ├── tss                    # TSS binary         -> mounted at /binary/tss
    └── configs/
        ├── tss.yaml           # TSS binary config  -> /binary/configs/tss.yaml
        └── certs/             # certificates dir   -> /binary/configs/certs
```

Matching `config.yaml` snippet (note the in-container paths):

```yaml title="deploy/config.yaml"
tss:
  binary_path: "/binary/tss"
  binary_params: ""
  api_params: ""
  config_path: "/binary/configs/tss.yaml"
  certificates_path: "/binary/configs/certs"
  core_address: "bridge1..."
```

See [Configuration file](./configuration.md) for the full field reference.

## 1. Build the image

```bash
docker build -f build/Dockerfile -t tss-wrapper-svc .
```

The image's entrypoint is `tss-wrapper-svc`, so any arguments you pass to
`docker run` are treated as CLI arguments to Visor — including the
`-c` / `--config` flag.

## Option 1 — plain `docker run`

### Bring up Postgres (once)

```bash
docker compose -f build/docker-compose.yaml up -d db
```

This exposes Postgres on `localhost:5435` with user / password / db
`tss-wrapper` / `tss-wrapper` / `db`. For alternative Postgres setups see
[Set up database](../prerequisites/db.md).

### Apply migrations (one-off)

```bash
docker run --rm \
  --network host \
  -v $(pwd)/deploy/config.yaml:/config.yaml \
  tss-wrapper-svc service migrate up -c /config.yaml
```

### Run Visor

```bash
docker run -d --name tss-wrapper \
  --network host \
  -v $(pwd)/deploy/config.yaml:/config.yaml \
  -v $(pwd)/deploy/binary:/binary \
  -p 8080:8080 -p 9090:9090 \
  tss-wrapper-svc service run -c /config.yaml
```

Notes:

- `--network host` is the simplest way to let the container reach the
  Postgres exposed on `localhost:5435`. If you don't use host networking,
  change `db.url` to point at the Postgres container's service name and
  place both containers on the same Docker network.
- The `-v .../binary:/binary` mount covers `tss.binary_path`,
  `tss.config_path` and `tss.certificates_path` in one shot, as long as
  those paths live under the `binary/` tree.
- `-p 8080:8080 -p 9090:9090` publishes Visor's HTTP gateway and gRPC
  server.

## Option 2 — `docker-compose`

`build/docker-compose.yaml` already defines the `db` service and ships a
commented-out `tss-wrapper-svc` service. Its entrypoint already runs
migrations before the service:

```yaml
entrypoint: sh -c "tss-wrapper-svc service migrate up && tss-wrapper-svc service run"
```

To use it:

1. Uncomment the `tss-wrapper-svc` block in `build/docker-compose.yaml`.
2. Adjust `volumes:` to mount your `config.yaml` and, if needed, the
   `binary/` tree.
3. Update `db.url` in your `config.yaml` to use the compose service name
   `db` instead of `localhost`, for example:

   ```yaml title="config.yaml"
   db:
     url: postgres://tss-wrapper:tss-wrapper@db:5432/db?sslmode=disable
   ```

4. Start the stack:

```bash
make docker-up
# equivalent to: docker-compose -f build/docker-compose.yaml up
```

## Verify

- HTTP gateway:

```bash
curl http://localhost:8080/
```

- gRPC:

```bash
grpcurl -plaintext localhost:9090 list
```

- Container logs:

```bash
docker logs -f tss-wrapper
```

You should see the orchestrator log `started default mode` once Visor has
launched the TSS binary, plus observer lines for events consumed from
ZEL Core.