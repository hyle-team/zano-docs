---
sidebar_position: 3
title: Key rotation and resharing
---

# Key rotation and resharing

Changing signer membership or signing keys is a coordinated bridge operation. The required process depends on the approved TSS release and each connected chain. It is not a standalone command that an individual party should run.

:::danger Preserve the active keys
Do not overwrite the active key share, print private shares, or export them to an ordinary local file. Preserve the existing signing material until the team has verified the migration and approved its retirement.
:::

## Team runbook requirements

Before a rotation, the operator team must define:

1. The participating parties, threshold, session identifier, start time, and responsible coordinators.
2. Whether the release supports share resharing under the same public key or requires a new key and account migration.
3. Separate, access-controlled Vault paths for the active and replacement material, with tested backup and recovery.
4. The pause or drain procedure for pending bridge operations.
5. Chain-specific contract authorization changes, asset ownership updates, and any account or funds migration.
6. Updates to the bridge registry, party configuration, TLS identities, and monitoring.
7. Verification of the replacement public keys, completed migrations, and a test operation on each enabled route.
8. Abort conditions and recovery procedures for every stage, including changes that cannot be rolled back.

## Execution and verification

Use the release-specific, team-approved runbook. Rehearse it with disposable keys before touching shared testnet signing material.

Keep a record of public identifiers and transaction hashes. Never attach private shares, Vault tokens, or recovery material to that record. Resume bridge operations only after all parties and chain administrators confirm the resulting state.
