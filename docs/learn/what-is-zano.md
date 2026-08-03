---
sidebar_position: 1
---

# What is Zano

Zano is an open-source layer-1 blockchain where every transaction is private by default. Amounts, addresses, and even asset types are hidden. This is enforced at the protocol level, not opt-in.

You can send funds, stake, issue your own tokens, trade peer-to-peer, and build apps on Zano. Nobody can see what you sent, who received it, or which asset was involved. All an outside observer sees is that a transaction happened.

![Comparison of details revealed by ETH’s transactions and Zano ones.](/img/learn/what-is-zano/transfer.png)

The sender and receiver can verify transactions through transaction IDs, but none of the data is publicly exposed.

### Origin

Zano’s lead developer Andrey Sabelnikov wrote the original CryptoNote reference implementation, the codebase that Monero and hundreds of other projects forked from. Zano is his next evolution of that work, built from scratch with a wider scope: not just private payments, but a private economy.

### Key technologies

Each technology has its own page under [How Zano Works](/docs/learn/how-zano-works). The papers behind them are in [Research & Audits](/docs/learn/research).

**[Hybrid PoW/PoS Consensus](/docs/learn/how-zano-works/consensus)** alternates Proof-of-Work and Proof-of-Stake blocks. Attacking Zano requires both hashpower and stake, so no single vector is enough. The PoS side is **Zarcanum**, the world's first Proof-of-Stake scheme with hidden amounts: stakers secure the network without revealing their balances, with no validator nodes, minimum amounts, or lock-ups.

**[Privacy technology](/docs/learn/how-zano-works/privacy-technology)**: d/v-CLSAG ring signatures, stealth addresses, and Bulletproofs+ hide the sender, receiver, and amount of every transaction.

**[Confidential Assets](/docs/learn/how-zano-works/confidential-assets)** let anyone issue privacy tokens on the Zano chain, with the same protections as native ZANO: hidden addresses and hidden amounts. You can create private stablecoins, shielded versions of existing assets, and more, without running your own blockchain.

**[Ionic Swaps](/docs/learn/how-zano-works/ionic-swaps)** improve on atomic swaps by enabling peer-to-peer asset exchange with full privacy. Neither party has an unfair advantage. This is what powers Zano Trade, the ecosystem's DEX, and the Swap function built into the official wallets.

**[Auditable Wallets](/docs/learn/how-zano-works/auditable-wallets)** are opt-in transparent wallets for situations where a third party needs to verify balances. Enabling them on one wallet doesn’t affect privacy for anyone else on the network.

### Key properties

Those technologies add up to two properties that set Zano apart:

**Fungibility**: every ZANO is identical. No coin has a "history" that can be traced, flagged, or blacklisted.

**Censorship resistance**: when transactions are invisible, they can’t be blocked, reversed, or selectively enforced.

### A stable, open network

The Zano network has run in production since 2019, and the team's engineering lineage goes back further, through Boolberry to the original CryptoNote reference implementation. New releases go through extensive testing before deployment, and anyone can participate: mine, stake, build, or just use it.

Check the [ecosystem](/docs/learn/ecosystem) for what's built on Zano, the [roadmap](https://zano.org/roadmap) for what’s coming next, or the [FAQ](/docs/learn/frequently-asked-questions) for common questions.
