---
sidebar_position: 3
---

# Set up database

The TSS service uses a PostgreSQL to store various data related to the TSS network.

## Running in Docker

The simplest way to run PostgreSQL in **docker-compose.yml** is shown below:
```yml title="docker-compose.yml"
services:
  tss-db:
    image: postgres:16
    container_name: tss-db
    environment:
      POSTGRES_DB: "db"
      POSTGRES_USER: "user"
      POSTGRES_PASSWORD: "pgp"
      PGDATA: "/var/lib/postgresql/data/pgdata"
    volumes:
      - ./db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d db"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped
```

:::note
No additional table migrations required. This will be done by the TSS service automatically.
:::

:::warning
Do not forget to set secure `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` values in the script.
:::