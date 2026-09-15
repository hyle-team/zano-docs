---
title: Advanced signer operations
---

# Advanced signer operations

These public reference pages describe TSS and Visor operations for approved operators. Publishing the procedures does not open validator or signer membership to everyone, or provide a complete deployment package.

Before using a procedure, obtain the approved service releases, source access where required, ZEL configuration, party membership, and recovery runbook.

## Prepare the service

1. [Obtain the TSS binary](./prerequisites/binary.md).
2. [Prepare secrets storage](./prerequisites/secrets.md) and the [database](./prerequisites/db.md).
3. [Prepare the Core account](./prerequisites/core-account.md).
4. Configure [service settings](./configuration/config.md), [TLS](./configuration/tls-certs.md), and [Vault material](./configuration/secrets.md).

## Coordinated operations

- [Key generation](./run/keygen.md)
- [Signing prerequisites](./run/sign/prerequisites.md) and [administrator setup](./run/sign/setup.md)
- [Signing mode](./run/sign/sign-mode.md) or [Docker deployment](./run/sign/docker.md)
- [Key rotation and resharing requirements](./run/reshare.md)
- [Visor supervisor](./visor/intro.md)

:::danger Protect signing material
Do not print private keys, shares, recovery material, or service tokens. Follow the approved custody procedure before generating or replacing keys. A local service restart is not authorization to rotate bridge keys or migrate funds.
:::
