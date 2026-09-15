---
sidebar_position: 4
title: Validators and bridge signers
---

# Validators and bridge signers

ZEL separates chain consensus from cross-chain custody and authorization.

## Validators

Validators propose and attest to ZEL blocks and execute protocol state transitions. Validator admission and exit behavior are testnet parameters. User-facing stZANO staking, delegation, rewards, and ordinary governance are planned rather than active testnet features.

## Bridge signers

Bridge signers authorize cross-chain actions that cannot be completed by ZEL consensus alone, such as releasing assets controlled on another network. They are a security-qualified subset of operators, not a synonym for every validator.

The target signer design uses threshold signing so no single signer holds the complete bridge key. Security still depends on correct membership, key generation and rotation, replay protection, transaction construction, monitoring, and recovery procedures.

## Key epochs

A signer set and its threshold key belong to a key epoch. Bridge operations must be bound to the correct epoch and operation details so an authorization cannot be replayed after membership changes or applied to another withdrawal.

## Trust model

Users should evaluate more than validator count. Relevant questions include:

- What threshold can authorize a release?
- How are signers admitted, removed, and rotated?
- How are destination address, amount, fee, expiry, and attempt number committed?
- What happens if a signer set is unavailable?
- How are cancellations and retries prevented from producing duplicate releases?
- Can reserves and issued supply be independently reconciled?

Testnet participation does not prove production security. Mainnet requires published deployment, audit, reconciliation, and operational evidence.
