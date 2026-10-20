---
sidebar_position: 1
---

# Privacy Technology

Every transaction on Zano is private at the protocol level. Three technologies work together to hide the sender, the receiver, and the amount:

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
  <iframe
    src="https://www.youtube.com/embed/I8Gyq1Hfcf8"
    title="Zano's Privacy Technologies"
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

- **d/v-CLSAG ring signatures** hide the sender. Inputs spending non-auditable post-Zarcanum outputs—the standard outputs created by current wallets—require at least 15 decoys. Official wallets use 15, producing a ring size of 16, and an observer cannot tell which ring member is the real source. Legacy pre-HF4 outputs retain their historical mixin rules.
- **Stealth addresses** hide the receiver. Every payment goes to a unique one-time address that only the recipient can recognize and spend from. Asset types are hidden as well, through the blinded asset tags of the [Confidential Assets](/docs/learn/how-zano-works/confidential-assets) scheme.
- **Bulletproofs+** hide the amounts. Amounts live inside cryptographic commitments that let the network verify inputs and outputs balance without revealing any numbers, and Bulletproofs+ range proofs ensure no hidden overflow can create coins out of thin air.

Because transaction history is hidden, every ZANO is identical: no coin carries a traceable "history" that can be flagged or blacklisted, and no transaction can be selectively blocked or reversed. Privacy at the protocol level is what makes the coin fungible and censorship-resistant.

The one deliberate exception is [auditable wallets](/docs/learn/how-zano-works/auditable-wallets), which opt out of decoys so their history stays verifiable.

Protocol-level privacy covers what is recorded on-chain. Network-level metadata (your IP address when broadcasting) is a separate concern; see the [SOCKS5 proxy guide](/docs/use/socks5-proxy-relay) for routing wallet traffic through Tor.

The cryptography is specified in the [research papers](/docs/learn/research), and the ring-signature and Zarcanum schemes have been independently audited.
