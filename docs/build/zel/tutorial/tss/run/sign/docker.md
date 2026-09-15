---
sidebar_position: 4
title: Run TSS in Docker
---

# Run TSS in Docker

Use this template only with the team's approved TSS image, configuration, signer identity, and [Vault deployment](../../prerequisites/secrets.md). It does not initialize Vault or generate a new signer share.

## Prerequisites

- Set `TSS_IMAGE` to the approved lowercase image repository and immutable digest.
- Load a scoped `VAULT_TOKEN` through the approved secret-injection mechanism.
- Set `VAULT_PATH` to the approved HTTPS endpoint reachable from inside the container. Host loopback is not container loopback.
- Set `MOUNT_PATH` and a strong `POSTGRES_PASSWORD`.
- Prepare `./config.yaml` and `./certs/`. Restrict access to configuration that contains database credentials.
- Set `db.url` in the TSS configuration to the `tss-db:5432` service, with database/user `tss` and the same database password. Percent-encode reserved characters in the password.

Never use a Vault root token. Do not print resolved Compose configuration when it contains credentials.

```yaml title="docker-compose.yml"
services:
  tss-db:
    image: postgres:16
    environment:
      POSTGRES_DB: tss
      POSTGRES_USER: tss
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set a database password}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tss -d tss"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  tss:
    image: ${TSS_IMAGE:?Set the approved TSS image digest}
    environment:
      VAULT_PATH: ${VAULT_PATH:?Set the approved Vault endpoint}
      VAULT_TOKEN: ${VAULT_TOKEN:?Load a scoped service token}
      MOUNT_PATH: ${MOUNT_PATH:?Set the party KV mount}
    ports:
      - "127.0.0.1:8080:8080"
      - "127.0.0.1:8085:8085"
      - "8090:8090"
    volumes:
      - ./config.yaml:/config.yaml:ro
      - ./certs:/certs:ro
    entrypoint: ["sh", "-c", "tss-svc service migrate up && tss-svc service run sign"]
    depends_on:
      tss-db:
        condition: service_healthy
    restart: unless-stopped

volumes:
  db-data:
```

Configure certificate paths under `/certs` in the TSS configuration. Restrict port 8090 to approved peers. HTTP and gRPC API ports bind to host loopback; publish them only through the approved authenticated or filtered gateway.

Start the deployment only after completing the [signing prerequisites](./prerequisites.md) and obtaining operator approval:

```bash
docker compose up -d
docker compose ps
```

Keep the existing Vault shares and database when restarting. Do not replace signing mode with key generation or resharing as a troubleshooting step.
