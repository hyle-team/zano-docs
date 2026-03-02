---
sidebar_position: 1
---

# What is Zano

Zano is an open-source layer-1 blockchain where all transactions are private by default. Amounts, addresses, and even asset types are hidden on every transaction — enforced by the protocol, not opt-in.

You can transfer funds, earn staking rewards, issue confidential tokens, trade peer-to-peer, and build decentralized applications on Zano. No one can see what you sent, who you sent it to, or what asset was involved. All an observer sees is that a transaction happened.

![Comparison of details revealed by ETH’s transactions and Zano ones.](/img/learn/what-is-zano/transfer.png)

Transactions are verifiable by the sender and receiver through transaction IDs, but the data is never publicly exposed.

### Origin

Zano’s lead developer Andrey Sabelnikov wrote the original CryptoNote reference implementation — the codebase that Monero and hundreds of other projects forked from. Zano is his next evolution of that work, built from scratch with a wider scope: not just private payments, but a private economy.

### Key Technologies

**Zarcanum**: The world’s first Proof of Stake scheme with hidden amounts. Stakers can secure the network in complete anonymity.

**Confidential Assets**: Anyone can issue privacy tokens on the Zano chain, secured by the same mechanisms as the native coin — hidden addresses and hidden amounts. Private stablecoins, shielded versions of existing assets, and more, without running your own blockchain.

**Ionic Swaps**: An improvement on atomic swaps that enables peer-to-peer asset exchange with full privacy. Neither party has an unfair advantage. This powers Zano’s DEX.

**Hybrid PoW/PoS Consensus**: Alternating Proof of Work and Proof of Stake blocks. Attacking Zano requires both hashpower and stake — no single vector is enough.

**Auditable Wallets**: An opt-in feature for transparent wallets where a third party would rather verify than trust. Does not affect privacy for the rest of the network.

**Fungibility**: No coin is tainted. No blacklists. Hidden transaction history makes every ZANO identical.

**Uncensorable**: When transactions are invisible, they can’t be blocked, reversed, or selectively enforced.

Zano also supports a [Marketplace API](https://docs.zano.org/docs/build/marketplace/marketplace-api-guide) for on-chain decentralized stores, [Escrow/P2P Contracts](https://docs.zano.org/docs/use/escrow-contracts/) for trustless peer-to-peer agreements, and human-readable [Aliases](https://docs.zano.org/docs/use/aliases) (@username instead of long addresses).

See the [roadmap](https://zano.org/roadmap) for what’s coming next, or the [FAQ](https://docs.zano.org/docs/learn/frequently-asked-questions) for common questions.
