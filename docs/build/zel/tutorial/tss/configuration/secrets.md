---
sidebar_position: 3
---


# Adding secrets to Vault
It is a perfect time to add initial secrets to the Vault before spinning up the TSS node.

To make this process easier, we will use the TSS service CLI which provides a command to set the required secrets in
the correct secret storage in the Vault.

:::info
The Vault configuration is not stored in the TSS service configuration file.
Instead, we use the environment variables to set the Vault path, access token, and mount path.

Make sure these environment variables are set before running the TSS service commands:
```bash
export VAULT_PATH=<Vault path>
export VAULT_TOKEN=<Vault root token>
export MOUNT_PATH=<Kv v2 secrets storage path>
```

Example configuration:
```bash
export VAULT_PATH=http://localhost:8200
export VAULT_TOKEN=""
export MOUNT_PATH=tss
```
:::

## Required secrets
The following secrets should be preconfigured in the Vault before running the TSS service:
- local party's Cosmos account private key;
- local party's self-signed TLS certificate. 

Other secrets will be generated and saved automatically during the TSS service launch.

## Adding ZEL Core account secret

Provide the CLI with the hex-encoded private key of the local party's Cosmos account:
```bash
tss-svc helpers vault set cosmos-account <private_key>
```

Example usage:
```bash
tss-svc helpers vault set cosmos-account 0x4c3f2b5a1e...
```

:::info
Do not forget to specify the path to the configuration file with the `-c` flag if you are not using the default configuration file path.
:::


## Adding TLS certificate secret
To save the self-signed TLS certificate and private key to the Vault, use the following command:
```bash
tss-svc helpers vault set tls-cert <path-to-cert> <path-to-key>
```

Example usage:
```bash
tss-svc helpers vault set tls-cert ./certs/tls.crt ./certs/tls.key
```