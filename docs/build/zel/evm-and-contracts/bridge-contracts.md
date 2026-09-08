---
sidebar_position: 2
title: Bridge contracts
---

# EVM bridge contracts

This page defines the contract surface that ZEL integrators need documented. Exact names, signatures, roles, and addresses must come from the verified ZEL ABI and deployment release.

## Contract responsibilities

An EVM bridge deployment normally needs to provide these logical functions:

| Responsibility | Required behavior |
| --- | --- |
| Native deposit | Accept value, bind it to a destination route and recipient, and emit one unambiguous deposit record |
| Token deposit | Transfer or burn an approved token amount, bind destination intent, and emit a deposit record |
| Native withdrawal | Verify bridge authorization, prevent replay, and transfer native value to the authorized recipient |
| Token withdrawal | Verify authorization, mint or release the correct representation, and transfer it to the authorized recipient |
| Replay protection | Record processed source operations or authorization hashes so they cannot execute twice |
| Route and token checks | Reject unsupported, paused, mismatched, or out-of-limit operations |
| Emergency control | Pause narrowly defined actions without silently changing balances or authorizations |
| Administration | Expose ownership, signer management, upgrade, and role changes through auditable transactions and events |

## ABI inventory

The team should complete this table directly from the deployed ABI.

| Capability | Exact contract and signature | Payable? | Required approval | Event | Test coverage |
| --- | --- | --- | --- | --- | --- |
| Deposit native asset | TBD | TBD | None | TBD | TBD |
| Deposit ERC-20 | TBD | TBD | ERC-20 allowance | TBD | TBD |
| Finalize native withdrawal | TBD | TBD | None | TBD | TBD |
| Finalize token withdrawal | TBD | TBD | None | TBD | TBD |
| Check processed operation | TBD | No | None | N/A | TBD |
| Compute or expose authorization hash | TBD | No | None | N/A | TBD |
| Pause or unpause | TBD | No | Role-gated | TBD | TBD |
| Add, remove, or rotate signers | TBD | No | Role-gated | TBD | TBD |
| Upgrade implementation | TBD | No | Role-gated | TBD | TBD |

:::note Contract details pending
Each `TBD` still requires a verified ABI, public source reference, deployment address, and test reference. A blank entry does not mean that the capability is supported.
:::

## Deposit integration rules

### Native asset

- Pass the exact value once.
- Validate the destination route and recipient before requesting a signature.
- Estimate gas against the same calldata that will be submitted.
- Parse the deposit event from the confirmed receipt.

### ERC-20

- Confirm the token is enabled for the selected route.
- Read token decimals from the confirmed registry; do not infer them from a symbol.
- Check the current allowance before requesting an approval.
- Prefer an exact allowance when the application does not require repeated deposits.
- Handle tokens that return `false`, return no value, charge transfer fees, rebase, or implement callbacks only if the route explicitly supports them.
- Do not treat an approval transaction as a bridge deposit.

## Withdrawal integration rules

- Verify the authorization fields before submitting a destination transaction.
- Use the token address and representation type returned by the authoritative route or authorization data.
- Refuse an authorization for a different chain, contract, recipient, amount, operation identifier, or signer epoch.
- Check replay-protection state before and after submission.
- Treat a successful receipt without the expected event or balance change as an integration error.

## Authorization domain

The signed authorization format must document every committed field and its encoding. At minimum, reviewers should be able to determine whether it binds:

- Source chain and source operation identifier.
- Destination chain and verifying contract.
- Asset or token address and representation mode.
- Amount and recipient.
- Signer-set or key epoch.
- Expiry, attempt, or recovery mode where used.

The specification must also state how signatures are encoded, ordered, deduplicated, and validated.

## Administration and upgrades

For every bridge contract, publish:

- Proxy type and implementation address, or confirmation that it is immutable.
- Owner, administrator, pause, upgrade, and signer-management roles.
- Whether roles are EOAs, multisigs, contracts, or governance-controlled.
- Upgrade delay and user-notification process.
- Storage-layout and migration review procedure.
- Emergency actions and their effect on pending operations.

Use the [contract registry](/docs/build/zel/evm-and-contracts/contract-registry) as the release manifest.
