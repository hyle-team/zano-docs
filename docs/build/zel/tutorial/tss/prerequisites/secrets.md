---
sidebar_position: 2
---

# Set up secrets storage

HashiCorp Vault is used to store the most sensitive data like keys, private TSS key shares, etc.
It is a powerful tool that provides secure storage and access to secrets, making it an ideal choice for managing sensitive information in a TSS network.

## Running in Docker

To run HashiCorp Vault in Docker, firstly create a **config.hcl**:
```hcl title="config.hcl"
# whether to enable the UI
ui = true

listener "tcp" {
  address     = "0.0.0.0:8200"
  # disabling TLS
  tls_disable = 1
}

# path to the storage directory
storage "file" {
  path = "/vault/file"
}

# The default address for the API
api_addr = "http://127.0.0.1:8200"

disable_mlock = "true"
```

When running Vault in non-dev mode, we need to further init and unseal it. This will be done by the **vault-init.sh** init script.
It will:
- initialize the vault and save the unseal keys and root token to the provided path;
- unseal the vault using the unseal keys;
- **login and enable the `kv2` secrets engine under the selected mount path.**

```sh title="vault-init.sh"
#!/usr/bin/env sh

set -ex

export KEYS_PATH=/keys/data
export MOUNT_PATH=mount-path

unseal () {
vault operator unseal $(grep 'Key 1:' $KEYS_PATH | awk '{print $NF}')
vault operator unseal $(grep 'Key 2:' $KEYS_PATH | awk '{print $NF}')
vault operator unseal $(grep 'Key 3:' $KEYS_PATH | awk '{print $NF}')
}

init () {
vault operator init > $KEYS_PATH
}

enable_kv () {
   export ROOT_TOKEN=$(grep 'Initial Root Token:' $KEYS_PATH | awk '{print $NF}')
   vault login $ROOT_TOKEN
   vault secrets enable -path=$MOUNT_PATH -version=2 kv
}

if [ -s $KEYS_PATH ]; then
   unseal
else
   init
   unseal
   enable_kv
fi
```

:::warning
Make sure to set your `KEYS_PATH` and `MOUNT_PATH` values in the script.
:::

:::warning
The `vault secrets enable -path=$MOUNT_PATH -version=2 kv` command allows us to create the required key-value secrets engine under the specified mount path.
In case the single instance of the HashiCorp Vault can be used by multiple nodes, there should be a unique key-value storage for each node.
:::

Now we can set up the **docker-compose.yml** file to run the vault:
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
```

The `vault-init` container will be used to run the init script and set up the vault. It can additionally be used later to unseal the Vault.

:::danger
Unseal keys and root token will be dumped into `vault-keys/data` file and should be stored securely. Do not share them with anyone.
:::

## Guidelines

Use the following guidelines to set up the secret storage:
- [Installing HashiCorp Vault](https://developer.hashicorp.com/vault/tutorials/get-started/install-binary)
- [Set up self-managed Vault](https://developer.hashicorp.com/vault/tutorials/get-started/setup)
