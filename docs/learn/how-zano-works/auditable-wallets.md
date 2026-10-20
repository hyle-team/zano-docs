---
sidebar_position: 6
---

# Auditable Wallets

Auditable wallets are opt-in transparency: a special wallet type whose balance and transaction history can be verified by anyone holding its tracking seed, while spending stays under the owner's control. They exist for organizations, funds, and anyone who prefers "verify" over "trust".

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
  <iframe
    src="https://www.youtube.com/embed/lwnAvsDXga0"
    title="Auditable Wallets"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
  />
</div>

Transactions sent from an auditable wallet use no decoys, so the audit trail stays fully verifiable. This is a property of that wallet alone; it does not weaken privacy for anyone else on the network. Inputs spending non-auditable post-Zarcanum outputs—the standard outputs created by current wallets—use 15 decoys in official wallets, producing a ring size of 16. Legacy pre-HF4 outputs retain their historical mixin rules.

Zano itself uses an auditable wallet for the [foundation fund](/docs/learn/emission#the-premine-and-how-zano-will-be-funded), so anyone can check its balance at any time.

To create one or track an existing one, see the [auditable wallets user guide](/docs/use/auditable-wallets). The underlying design is described in "Auditable wallets in CryptoNote" in the [research papers](/docs/learn/research).
