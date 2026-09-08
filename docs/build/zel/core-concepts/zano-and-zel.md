---
sidebar_position: 1
title: Zano and ZEL
---

# Zano and ZEL

Zano and ZEL provide two different execution environments in one ecosystem.

| | Zano L1 | ZEL |
| --- | --- | --- |
| Primary purpose | Private money and confidential assets | Public smart contracts and EVM applications |
| Visibility | Amounts, asset types, and addresses are protected by Zano's privacy model | Accounts, balances, and contract activity are public |
| Execution model | Zano-native transactions and features | EVM-compatible smart contracts plus ZEL protocol modules |
| Participation | Hybrid Proof-of-Work mining and private Proof-of-Stake mining | Testnet consensus validators and bridge signers; planned stZANO delegation and governance |
| Current availability | Mainnet and testnet | Testnet only |

## Why two environments?

Privacy and general-purpose public smart-contract composability have different requirements. Zano focuses on confidential value transfer and private assets. ZEL provides the transparent shared state expected by EVM tooling, automated markets, lending protocols, and public governance.

The bridge joins those environments without pretending they are the same. A deposit locks or accounts for value on one side before a corresponding representation becomes usable on the other. A withdrawal reverses that flow after the required confirmations and signing steps.

## What users should remember

- Moving to ZEL means choosing public execution.
- A ZEL address is not automatically the same thing as a Zano address.
- Never paste a Zano address into an EVM recipient field or an EVM address into a Zano recipient field unless the application explicitly validates and explains the mapping.
- Bridge, local swap, cross-chain swap, and Zano Ionic Swap operations have different trust, timing, privacy, and recovery properties.
- Zano L1 staking and planned ZEL delegation are separate activities.

Continue with the [asset model](/docs/build/zel/core-concepts/asset-model) and [privacy boundary](/docs/build/zel/core-concepts/privacy-boundary).
