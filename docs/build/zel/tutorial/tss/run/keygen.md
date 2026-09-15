---
sidebar_position: 1
title: Key generation
---

# Key generation

Key generation is a coordinated ceremony for approved testnet signing parties. Each party keeps its own private share; the shared public key identifies the resulting signing group.

## Before the ceremony

Complete the team's Vault, account, TLS, database, and service configuration prerequisites. The coordinator must provide a unique session identifier, a future UTC start time, the party list, and the threshold setting for the approved release.

For the documented threshold convention, signing requires at least `threshold + 1` parties. Confirm that convention against the approved release and use matching session settings across participants.

## Generate preparameters

Each party generates its own private preparameters and stores them in its assigned Vault location:

```bash
tss-svc helpers generate preparams --output vault --config /path/to/approved-config.yaml
```

:::danger Keep private material in Vault
Do not use console or ordinary file output for preparameters or key shares. Do not trace commands, record terminal sessions containing secrets, or reuse another party's private material. Confirm the destination Vault path before generating or replacing anything.
:::

## Run the ceremony

At the agreed time, each party starts key generation with the approved configuration:

```bash
tss-svc service run keygen --output vault --config /path/to/approved-config.yaml
```

The coordinator must verify that every required party completed the same session and obtained the expected public key before authorizing signing. An incomplete or failed ceremony requires the team's recovery procedure; do not overwrite an active signing share to retry.

For container deployment, use the [signer Docker configuration](./sign/docker.md) with a team-approved key-generation command and configuration. Key rotation follows the separate [rotation and resharing runbook requirements](./reshare.md).
