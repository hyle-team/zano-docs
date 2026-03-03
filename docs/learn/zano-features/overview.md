# Overview

## Zano's Values

### Privacy

Every transaction on Zano is private at the protocol level. Amounts, addresses, and asset types are hidden by default. Only you decide what to reveal.

### Security

A hybrid PoW/PoS consensus algorithm makes attacks on Zano infeasible. An attacker would need both majority hashrate and a large share of staked coins at the same time.

### Stability

Zano's codebase has been live and tested since the Boolberry days, over a decade of production use. The network is stable, and new releases go through extensive testing before deployment.

### Decentralization

Anyone can participate in the network. There are no validator nodes (master nodes), no minimum staking amounts, and no lock-up times. Mine, stake, or just use it.

### Fungibility

No coin is tainted. No blacklists. Hidden transaction history makes every ZANO identical. Unlike transparent blockchains where coins can be flagged or rejected based on their history, Zano's privacy guarantees mean every coin is equal.

### Uncensorable

When transactions are invisible, they can't be blocked, reversed, or selectively enforced. Privacy at the protocol level means no one can discriminate against specific transactions or addresses.

### Easy to use

Desktop, mobile, and third-party wallets. A browser extension for dApps. Documentation that covers the basics and the deep stuff. We try to make privacy practical, not just possible.

## Technologies

Zano was built from scratch, not forked. The technologies below are what make it work. Each one has a corresponding [research paper](/docs/learn/whitepaper).

### Hybrid PoW/PoS consensus

Zano alternates between Proof-of-Work and Proof-of-Stake blocks. The PoS side uses Zarcanum, the first scheme where stakers don’t reveal their balances. A 51% attack would require majority hashrate **and** a large share of staked coins simultaneously, which makes it impractical.

### Untraceable transactions

Transactions are hidden using **d/v-CLSAG Ring Signatures** (hide the sender) and **Stealth Addresses** (hide the receiver and asset type). Only the parties involved in a transaction can see its details.

### Amount privacy

**Bulletproofs+** hide the amounts in every transaction. The proofs verify that inputs and outputs balance (no coins created or destroyed) without revealing the actual numbers.

### Escrow contracts

Both parties lock a deposit into a contract. If either side tries to cheat, they lose their deposit. No intermediary needed. This is how Zano Trade’s P2P platform settles trades.

### Aliases

Register a human-readable name like @username instead of using a long address. Aliases are on-chain and already used for the Zano Messenger, dApp authentication, and receiving payments.

### Marketplace API

Create, update, or deactivate on-chain offers. Once published, offers are visible to everyone on the network. Anyone can build a decentralized store on top of this.

### Ionic Swaps

An improvement on atomic swaps. Two parties exchange assets peer-to-peer with full privacy, and neither side can cheat or gain an unfair advantage. This is what powers the DEX.

### Zarcanum: anonymous Proof of Stake

The first PoS scheme where stakers don’t reveal their balances or identity. You earn staking rewards without exposing how much you hold. Nobody else has done this.

### Auditable wallets

Opt-in transparency for when a third party needs to verify balances. Useful for organizations, funds, and compliance. Enabling it on one wallet doesn’t weaken privacy for anyone else on the network.

### Confidential Assets

Issue your own tokens on Zano. They get the same privacy as native ZANO: hidden addresses, hidden amounts, hidden asset type. Private stablecoins, wrapped assets, whatever you need. No separate blockchain required.

## Products

These are the products built on Zano's tech stack. Anyone can build on top of the same technologies.

### Zano Trade: P2P trading

Peer-to-peer trading using escrow contracts. Both parties lock collateral, so neither can walk away. Trade any crypto or fiat without a middleman.

### Zano Trade: DEX

Trade ZANO and Confidential Assets with on-chain order matching and Ionic Swaps. No registration. The asset type, amount, and addresses involved are all hidden.

### Zano Governance

Anonymous on-chain voting for stakers. Network participants vote on protocol decisions without revealing their identity or stake.

### FUSD

A private stablecoin on Zano. Send dollars without anyone knowing how much, to whom, or when. Built as a Confidential Asset, FUSD has the same privacy guarantees as native ZANO.

### Zano Stats

Live blockchain explorer with network analytics, staking data, and market insights. Available at [zanostats.com](https://zanostats.com).

### Zano Wallets

- **Desktop**: Full-node wallet with all features including staking.
- **Mobile**: Remote-node wallet, everything except staking.
- **Third-party**: [Cake Wallet](https://cakewallet.com), [Bitcoin.com](https://bitcoin.com) wallet, [Edge Wallet](https://edge.app).

### Zano Companion

Browser extension that connects the desktop wallet to web-based dApps. Handles authentication and transaction signing.

### Zano MCP

An [MCP server](https://github.com/PRavaga/zano-mcp) that connects AI agents (Claude Code, Cursor, Windsurf, and other MCP-compatible tools) to the Zano blockchain. 45+ tools for querying blocks, wallets, assets, DEX order books, and trading data. See the [blog post](https://blog.zano.org/zano-mcp-give-your-ai-agent-eyes-on-a-privacy-blockchain/) for setup and use cases.

## Wider ecosystem

- **[Wrapped Zano](https://wrapped.zano.org)** — WZANO, an ERC-20 token on Ethereum. Exchangeable 1:1 for native ZANO.
- **[Obscura](https://obscura.zano.org)** — Private NFT minting and management.
- **[Zano Messenger](/docs/use/zano-matrix-guide)** — Encrypted communication built on Matrix, linked to your Zano alias.
- **[Bridgeless](https://bridgeless.com)** — Non-custodial bridge between public and privacy blockchains. Uses Zano gateway addresses with ETH-compatible signatures for cross-chain asset commands.
- **[Zano Bay](https://zanobay.com)** — Private marketplace for buying and selling goods.
- **[Bandit City](https://bandit.city)** — Community hub with its own token and staking.
- **[Alias Auction](https://auction.zano.org)** — Bid on @usernames registered on-chain.
- **[Zano Pay](https://pay.zano.org)** — Payment widgets for any website.
- **[Zano Cash POS](https://zanocash.com)** — Point-of-sale for physical shops.

Full list at [zano.org/ecosystem](https://zano.org/ecosystem).
