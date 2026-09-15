---
sidebar_position: 3
---

# Set up database

TSS and Visor each need their own PostgreSQL database. Do not share their database or migration state.

## Running in Docker

Save this template as `docker-compose.yml`. Supply `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_PORT` through your deployment's protected environment. Use a strong, unique password for each instance; do not commit it or include it in shell history.

```yml title="docker-compose.yml"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ${POSTGRES_DB:?Set a dedicated database name}
      POSTGRES_USER: ${POSTGRES_USER:?Set a dedicated database user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set a strong database password}
      PGDATA: "/var/lib/postgresql/data/pgdata"
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:${POSTGRES_PORT:?Set a loopback port}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \"$$POSTGRES_USER\" -d \"$$POSTGRES_DB\""]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped
volumes:
  db-data:
```

Run each instance under a different Compose project name so its container and volume stay separate:

| Service | Compose project | Database / user | Host port |
| --- | --- | --- | --- |
| TSS | `tss-db` | `tss` / `tss` | `5432` |
| Visor | `visor-db` | `visor` / `visor` | `5435` |

For example, after loading the Visor instance's environment:

```bash
docker compose --project-name visor-db -f docker-compose.yml up -d db
```

For TSS, load its separate environment and use `--project-name tss-db`. Configure each service with its own DSN, matching its database, user, password, and port. Percent-encode reserved characters in DSN credentials.

The published ports bind only to loopback. This suits native services and Linux containers using host networking. For a private Docker network, omit `ports` and use the database's service name and container port `5432`.

:::note Migrations
Use the migrations from the approved release for the corresponding service. Apply them before starting signing or Visor. Back up an existing database before upgrading; do not run rollback migrations as part of setup.
:::
