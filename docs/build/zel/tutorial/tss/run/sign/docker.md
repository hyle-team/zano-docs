---
sidebar_position: 4
---

# Running in the Docker

The TSS service can be run in Docker, which is a convenient way to manage dependencies and ensure a consistent environment.

The example **docker-compose.yml** file below demonstrates how to set up the TSS service in Docker with the necessary dependencies.

```yml title="docker-compose.yml"
services:
  vault:
    image: hashicorp/vault:1.18
    container_name: vault
    hostname: vault
    ports:
      - 8200:8200
    volumes:
      - ./config.hcl:/vault/config/config.hcl
      - ./vault-data:/vault/file/
    environment:
      - VAULT_ADDR=http://localhost:8200
    cap_add:
      - IPC_LOCK
    command: server
    restart: always

  vault-init:
    image: hashicorp/vault:1.18
    container_name: vault-init
    environment:
      - VAULT_ADDR=http://vault:8200
    volumes:
      - ./vault-init.sh:/usr/local/bin/vault-init.sh
      - ./vault-keys:/keys
    command: /usr/local/bin/vault-init.sh
    restart: on-failure
    depends_on:
      - vault

  tss-db:
    image: postgres:16
    container_name: tss-db
    environment:
      POSTGRES_DB: "db"
      POSTGRES_USER: "user"
      POSTGRES_PASSWORD: "pgp"
      PGDATA: "/var/lib/postgresql/data/pgdata"
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d db"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    restart: unless-stopped

  tss:
    image: ghcr.io/Zano-Execution-Layer/tss-svc:latest
#    alternatively, build from source (locate docker-compose.yml in the root of the repository)
#    build:
#      context: .
#      dockerfile: ./build/Dockerfile
    hostname: tss
    container_name: tss
    environment:
      VAULT_PATH: http://vault:8200
      VAULT_TOKEN: hsv.....
      MOUNT_PATH: tss
    ports:
      - "8080:8080"
      - "8085:8085"
      - "8090:8090"
    volumes:
#     add parties certs here
      - ./configs/certs/party1.crt:/party1.crt
      - ./configs/certs/party3.crt:/party3.crt
#     path to the config file (use /config.yaml to use without -c flag)
      - ./configs/tss2.local.yaml:/config.yaml
    entrypoint: sh -c "tss-svc service migrate up && tss-svc service run sign"
    depends_on:
      vault_init:
        condition: service_completed_successfully
      tss-db:
        condition: service_healthy

volumes:
  db-data:
```