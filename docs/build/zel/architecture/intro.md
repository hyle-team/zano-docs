---
sidebar_position: 1
---

# Introduction

ZEL is an innovative, standalone system designed to facilitate interoperability across various blockchain
networks. By enabling seamless interaction between blockchains, ZEL empowers users to perform cross-chain
activities such as transferring assets efficiently and securely.

---

## Purpose of ZEL

The primary goal of ZEL is to allow users to interact across multiple blockchain networks. It achieves this by:

- Tracking specific transactions on a source blockchain.
- Generating cryptographic proof (witness) of these transactions.
- Storing the generated proof in a decentralized ledger.
- Facilitating appropriate actions on the target blockchain using the stored proof.

--- 

## Key Functionalities

ZEL ensures robust cross-chain operations by enabling users to initiate specific actions, such as asset deposits,
on a source blockchain. It tracks supported blockchains to identify and monitor transactions related to these actions.
Once relevant transactions are identified, ZEL generates a witness, serving as cryptographic proof of the
completed action on the source chain.

This witness is then securely stored in a decentralized ledger, ensuring its integrity and availability. Leveraging the
stored witness, ZEL facilitates corresponding actions on the target blockchain, such as asset withdrawal,
completing the cross-chain interaction seamlessly and securely.

--- 

## Use Case: Asset Transfer

For the asset transfer use case, ZEL enables users to:

1. Lock (Deposit) Assets on Source Chain
    - Users can deposit assets on the source blockchain.
    - Tracks these deposits and records the associated transaction details.

2. Generate Witness for Asset Lock
    - Generates a cryptographic proof (witness) confirming the asset lock on the source chain.

3. Store Witness in Decentralized Ledger
    - The witness, along with deposit details, is stored in a secure and decentralized manner.

4. Withdraw Assets on Target Chain
    - Users can withdraw their assets on the target blockchain using the stored witness as proof of the original
      deposit.
