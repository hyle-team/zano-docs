---
sidebar_position: 6
---

# Auditable Wallets

Auditable wallets are opt-in transparency: a special wallet type whose balance and transaction history can be verified by anyone holding its tracking seed, while spending stays under the owner's control. They exist for organizations, funds, and anyone who prefers "verify" over "trust".

Transactions sent from an auditable wallet use no decoys, so the audit trail stays fully verifiable. This is a property of that wallet alone; it does not weaken privacy for anyone else on the network, and regular wallets keep the protocol-enforced ring size of 15.

Zano itself uses an auditable wallet for the [foundation fund](/docs/learn/emission#the-premine-and-how-zano-will-be-funded), so anyone can check its balance at any time.

To create one or track an existing one, see the [auditable wallets user guide](/docs/use/auditable-wallets). The underlying design is described in "Auditable wallets in CryptoNote" in the [research papers](/docs/learn/research).
