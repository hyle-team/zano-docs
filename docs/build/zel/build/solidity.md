---
sidebar_position: 3
title: Solidity development
---

# Solidity development

ZEL's EVM environment is intended to work with familiar Solidity contracts and tooling. Compatibility does not remove application-level security or network-specific integration work.

## Development workflow

1. Connect only to chain ID `9350` during the current testnet phase.
2. Pin the compiler and EVM target supported by the active node release.
3. Use established libraries for access control, token handling, and signature verification.
4. Write unit, fuzz, invariant, and integration tests.
5. Test pause, failure, replay, and recovery paths—not only successful execution.
6. Deploy from a recorded source commit and publish reproducible metadata.
7. Verify bytecode and exercise the deployed contract with test assets.

## Network-aware contracts and clients

Do not assume an address has the same meaning on another chain or after a testnet reset. Client applications should keep a versioned registry keyed by chain ID and deployment release.

For bridge or cross-chain integration, model an operation as a durable lifecycle rather than one EVM transaction. Source confirmation, signing, destination submission, fallback, retry, cancellation, and reconciliation can happen independently.

## Security baseline

- Use checks-effects-interactions and explicit reentrancy protection where appropriate.
- Avoid unbounded iteration in state-changing paths.
- Protect initialization and upgrade authorities.
- Enforce domain separation and replay protection for signed messages.
- Validate token behavior instead of assuming every ERC-20 returns or accounts consistently.
- Treat oracle freshness, decimals, and failure modes as explicit state.
- Bound fees, slippage, expiry, recipients, and amounts in user authorizations.
- Document privileged roles and timelocks.

Testnet deployment is not an audit. Do not represent a contract as mainnet-ready based only on successful testnet transactions.
