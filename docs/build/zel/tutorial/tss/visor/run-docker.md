---
sidebar_position: 4
---

# Run Visor in Docker

:::note Operator package TBA
This is a deployment template. The team still needs to confirm the release, image, Core endpoints, and environment-specific configuration before it can be used.
:::

## Prerequisites

- Docker Engine on Linux, with Compose support.
- An approved Visor source release and its Dockerfile.
- A dedicated Visor PostgreSQL database.
- Approved Core RPC and gRPC endpoints.
- A TSS binary compatible with the container runtime, its configuration, TLS certificates, and the required Vault access.

## On-host layout that will be mounted

```text
./deploy/
  config.yaml
  binary/
    tss
    configs/
      tss.yaml
      certs/
```

In `deploy/config.yaml`, use paths as seen inside the container:

```yaml
tss:
  binary_path: "/binary/tss"
  binary_params: "service run sign --config /binary/configs/tss.yaml"
  api_params: ""
  config_path: "/binary/configs/tss.yaml"
  certificates_path: "/binary/configs/certs"
  core_address: "REPLACE_WITH_ZEL_NODE_ADDRESS"
```

Keep the `--config` argument and `config_path` identical: Visor does not append the configuration path during default launch. The `/binary` directory must be writable for the approved update, certificate, and configuration tasks.

Use the [configuration template](./configuration.md) for the remaining fields. Keep configuration files protected; do not bake credentials into the image.

## 1. Build the image

From the approved Visor source checkout:

```bash
docker build -f build/Dockerfile -t tss-wrapper-svc .
```

The image uses `tss-wrapper-svc` as its entrypoint, so the commands below pass only its arguments.

## 2. Prepare the database

Use the [database template](../prerequisites/db.md) with the Visor values: a separate `visor-db` Compose project, database and role, and loopback port `5435`.

Set `db.url` in `deploy/config.yaml` to the dedicated Visor DSN. Do not reuse the TSS database or its credentials.

These commands use Linux host networking, so Visor connects to the database through `127.0.0.1:5435`. Set Visor's HTTP and gRPC listeners to `127.0.0.1:8080` and `127.0.0.1:9090`. Host networking uses those listener bindings directly; Docker port-publishing flags do not restrict access.

## 3. Apply migrations

Apply the approved release's upward migrations before starting Visor. Back up an existing database before upgrading. Rollback migrations are not part of setup.

```bash
docker run --rm \
  --network host \
  -v "$(pwd)/deploy/config.yaml:/config.yaml:ro" \
  tss-wrapper-svc service migrate up -c /config.yaml
```

## 4. Run Visor

```bash
docker run -d --name tss-wrapper \
  --network host \
  -v "$(pwd)/deploy/config.yaml:/config.yaml:ro" \
  -v "$(pwd)/deploy/binary:/binary" \
  tss-wrapper-svc service run -c /config.yaml
```

A release-specific Compose package remains [TBA](./launch-scripts.md). For a deployment using a private Docker network, configure the database service address and listener access for that network instead of copying the host-network settings.

## 5. Verify

Check logs and the local listeners:

```bash
docker logs --tail 100 tss-wrapper
curl http://127.0.0.1:8080/
grpcurl -plaintext 127.0.0.1:9090 list
```

Listener responses alone do not confirm signing readiness. Check that the expected TSS process started and the Core observer connected before accepting traffic.
