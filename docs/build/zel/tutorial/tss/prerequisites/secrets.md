---
sidebar_position: 2
title: Prepare secrets storage
---

# Prepare secrets storage

TSS operators store key shares, account keys, and TLS material in HashiCorp Vault. Use the team's approved Vault deployment and access policy before starting a signer.

:::danger Protect signing material
Never enable shell tracing while handling secrets. Do not put unseal keys, root tokens, or private shares in command output, container logs, screenshots, source control, or support messages.
:::

## Operator prerequisites

The Vault administrator must provide:

- A reachable HTTPS endpoint and its trusted certificate chain.
- A KV v2 mount and paths dedicated to this party.
- A scoped service identity with only the permissions required by the approved TSS release.
- A documented initialization, unseal, backup, restore, and token-renewal procedure.

Initialization and unsealing are administrative tasks. Keep unseal material separate from service tokens and the Vault data volume. Do not use an automatic initialization script that stores all recovery keys alongside the service.

## Before connecting TSS

1. Verify the Vault endpoint and TLS configuration.
2. Confirm that the party can access only its assigned secrets.
3. Configure the service token through the approved secret-injection mechanism. Do not run TSS with a Vault root token.
4. Confirm backup and recovery procedures with the operator team.
5. Continue with [adding secrets](../configuration/secrets.md).

Do not expose an unencrypted Vault listener on a public interface. If a local development environment uses HTTP, bind it to loopback and use disposable secrets only. That configuration is not suitable for shared testnet signers.

See the official [Vault deployment guidance](https://developer.hashicorp.com/vault/tutorials/get-started/setup). The team must confirm the TSS release's supported authentication and TLS options before deployment.
