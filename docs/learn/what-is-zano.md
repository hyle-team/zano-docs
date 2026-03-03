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

Each technology is covered in detail in the [Features Overview](/docs/learn/zano-features/overview). The research papers behind them are in [Whitepapers](/docs/learn/whitepaper).

**Zarcanum** is the world’s first Proof of Stake scheme with hidden amounts. Stakers secure the network without revealing their balances.

**Confidential Assets** let anyone issue privacy tokens on the Zano chain, with the same protections as native ZANO: hidden addresses and hidden amounts. You can create private stablecoins, shielded versions of existing assets, and more, without running your own blockchain.

**Ionic Swaps** improve on atomic swaps by enabling peer-to-peer asset exchange with full privacy. Neither party has an unfair advantage. This is what powers Zano Trade, the built-in DEX.

**Hybrid PoW/PoS Consensus** alternates Proof of Work and Proof of Stake blocks. Attacking Zano requires both hashpower and stake, so no single vector is enough.

**Auditable Wallets** are opt-in transparent wallets for situations where a third party needs to verify balances. Enabling them on one wallet doesn’t affect privacy for anyone else on the network.

**Fungibility**: every ZANO is identical. No coin has a "history" that can be traced, flagged, or blacklisted.

**Uncensorable**: when transactions are invisible, they can’t be blocked, reversed, or selectively enforced.

Check the [roadmap](https://zano.org/roadmap) for what’s coming next, or the [FAQ](/docs/learn/frequently-asked-questions) for common questions.
