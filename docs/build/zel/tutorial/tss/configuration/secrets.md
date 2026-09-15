---
sidebar_position: 3
---


# Adding secrets to Vault
Prepare the approved party secrets before starting TSS. Use the scoped service identity provided by the Vault administrator.

To make this process easier, we will use the TSS service CLI which provides a command to set the required secrets in
the correct secret storage in the Vault.

:::info
The Vault configuration is not stored in the TSS service configuration file.
Instead, we use the environment variables to set the Vault path, access token, and mount path.

Make sure these environment variables are set before running the TSS service commands:
```bash
export VAULT_PATH="https://vault.example.invalid"
export MOUNT_PATH="party-kv-mount"
# Load VAULT_TOKEN through the approved secret-injection mechanism.
```

Never use a Vault root token for the TSS service. Keep shell tracing disabled and do not print the token.
:::

## Required secrets
The following secrets should be preconfigured in the Vault before running the TSS service:
- local party's Cosmos account private key;
- local party's self-signed TLS certificate. 

Other secrets will be generated and saved automatically during the TSS service launch.

## ZEL Core account secret

For a new party, [generate the account directly into Vault](../prerequisites/core-account.md). Do not pass a private key as a CLI argument: it can appear in shell history and process listings. Importing or rotating an existing account requires the team-approved protected import procedure.

## Adding TLS certificate secret
To save the self-signed TLS certificate and private key to the Vault, use the following command:
```bash
tss-svc helpers vault set tls-cert <path-to-cert> <path-to-key>
```

Example usage:
```bash
tss-svc helpers vault set tls-cert ./certs/tls.crt ./certs/tls.key
```
