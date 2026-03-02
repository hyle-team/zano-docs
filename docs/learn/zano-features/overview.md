# Overview

## Zano's Values

### Privacy

Zano has privacy by default throughout its entire network at the base layer (protocol level) ensuring your data remains secure. Only you decide what you’d like to reveal.

### Security

Our hybrid PoW/PoS consensus algorithm makes attacks on Zano infeasible, ensuring the highest security standard for launching your asset or dApp on Zano’s ecosystem.

### Stability

The extensive amount of testing that our blockchain has undergone minimizes the issues often encountered in the early days of any project. This makes the Zano network stable and release-ready from day 1. Our decade of experience with both Boolberry and Zano confirms this.

### Decentralization

When we say decentralization we mean it, Zano is truly decentralized as anyone can participate in the network, and nobody has an unfair advantage. There are no validator nodes (master nodes), no minimum staking amounts, and no lock-up times. Whether you are a miner, a staker, or a user, **Zano is for everyone**.

### Fungibility

No coin is tainted. No blacklists. Hidden transaction history makes every ZANO identical. Unlike transparent blockchains where coins can be flagged or rejected based on their history, Zano's privacy guarantees mean every coin is equal.

### Uncensorable

When transactions are invisible, they can't be blocked, reversed, or selectively enforced. Privacy at the protocol level means no one can discriminate against specific transactions or addresses.

### Easy-to-Use

From our wide variety of wallets to our documentation and to our products, we always keep the end user in mind ensuring a good user experience to drive adoption of the Zano blockchain.

## Technologies

Zano has developed and adopted a wide variety of technologies that can be used to create all kinds of privacy-focused decentralized applications (dApps) and other projects. These technologies make Zano truly different from other projects and are summed below.

Zano hasn’t forked from any project and has been built from scratch, all of our technologies are backed by research papers that you can find [here](https://docs.zano.org/docs/learn/whitepaper).

### Network Security: Hybrid PoW/PoS Consensus Algorithm

Zano uses a hybrid consensus algorithm that alternates between Proof-of-Work (PoW) and Proof-of-Stake (PoS) blocks. It incorporates the world’s first Proof-of-Stake scheme with hidden amounts. This approach combines the benefits of both mechanisms to enhance blockchain security and decentralization. If performing a 51% attack on Zano, one would need the majority of the hash rate **and** a significant amount of the total amount of staked coins, making the cost of an attack incredibly high, resulting in the attack becoming infeasible.

### Untraceable Transactions

The transactions between Zano network members are made untraceable with the help of several technologies, most importantly **d/v-CLSAG Ring Signatures** and **Stealth Addresses.** Also, the way transaction data is stored on the blockchain allows access by parties who authorized the transactions only, and none of the private data is ever publicly published.

### Amount Privacy

A secure scheme with a set of proofs allows for the concealment of the amount of coins transferred. The **Bulletproofs+** technology is used for these proofs, enabling the creation of both performance-effective and size-effective proofs. These ensure that the sum and type of the inputs match the sum and type of the outputs, without revealing the actual details.

### Escrow Contracts

With Zano’s Escrow Contracts, users can create fully customizable contracts, which essentially allow for any agreement conditions to be followed by all parties in a trustless way without any intermediary involvement. When using escrow contracts, a deposit is required from all parties involved as a financial incentive to alleviate any malicious activity—peer-to-peer settlements in its purest form.

### Aliases

All Zano network users can create aliases, for example: @username. These aliases provide a short, easy-to-remember name rather than a long string of characters that form a blockchain address. Aliases will be used in a dedicated messenger, a user reputation service, and an alias-based authentication system that can connect to the dApps running on Zano’s ecosystem.

### Marketplace API

You create, update, or deactivate on-chain offers with the Zano Marketplace API. Offers contain information about a user who is selling or buying something. As soon as an offer is published in the blockchain it is visible to everyone. This feature allows anyone to spin up their own decentralized online stores.

### Ionic Swaps

Ionic Swaps are an improvement on Atomic Swaps, innovating seamless cryptocurrency exchanges while preserving user privacy. Ionic Swaps are a safe and consistent way to perform peer-to-peer swaps in which neither party has an unfair advantage. This technology is used by the DEX and for instant swaps.

### Zarcanum: Anonymous Proof of Stake

Zano incorporates the world’s first Proof of Stake scheme that enhances traditional PoS with untraceability and hidden amounts, revolutionizing blockchain consensus. Thanks to this innovative approach our stakers can stake in complete anonymity. A first in all of crypto.

### Auditable Wallets

Auditable wallets allow people and organizations to create transparent wallets for situations where we would rather verify than trust. Creating auditable wallets doesn’t affect the privacy of the Zano network in any way.

### Confıdential Assets

Anyone can easily issue user-creatable privacy tokens on the Zano chain; assets secured by the same mechanisms that make Zano so much more secure than first-generation cryptocurrencies, namely because of hidden addresses and hidden amounts. This unique technology can be used to create private stablecoins, shielded versions of existing assets, and much more, without the overhead of having to create, manage, and secure your own blockchain.

## Products

All of the above-named technologies can be used to create all kinds of privacy-focused, decentralized applications (dApps). Below you can find examples of the products we created with these technologies, but of course, others can use these technologies as well to develop on Zano.

### Zano Trade: P2P Cryptocurrency Trading Platform

A peer-to-peer trading platform that uses Zano's built-in escrow contracts to eliminate the need for a third party in the trade settlement process. The escrow contract requires both parties to lock up collateral until the trade is concluded, creating a financial incentive for both sides to cooperate. Any crypto, and even fiat, can be traded natively on this platform.

### Zano Trade: Decentralized Exchange

A decentralized exchange to trade native Zano and all the Confidential Assets launched on Zano’s ecosystem. Zano Trade requires no user registration and uses an on-chain order matching system to facilitate Ionic Swaps between native Zano and the Confidential Assets. It is impossible to see what asset type, amount, or address was involved in the transaction.

### Zano Governance System

Zano Governance is an anonymous on-chain voting system where our stakers who secure the network can vote on major decisions regarding the Zano blockchain, further decentralizing the Zano ecosystem.

### FUSD

A private stablecoin on Zano. Send dollars without anyone knowing how much, to whom, or when. Built as a Confidential Asset, FUSD has the same privacy guarantees as native ZANO.

### Zano Stats

Live blockchain explorer with network analytics, staking data, and market insights. Available at [zanostats.com](https://zanostats.com).

### Zano Wallets

Zano has a variety of wallets available for every type of user:

- **Desktop Wallet**: A full-node wallet that gives you access to all features, including staking.

- **Mobile Wallet**: A remote-node wallet that supports all features except staking, ready for instant use that fits in your pocket.

- **Third-Party Wallets**: Zano is available in [Cake Wallet](https://cakewallet.com), [Bitcoin.com](https://bitcoin.com) wallet, and [Edge Wallet](https://edge.app).

### Zano Companion

A browser extension that connects the Zano desktop wallet to web applications built on Zano. Handles authentication and transaction signing for dApps in the Zano ecosystem.

### Zano MCP

An [MCP server](https://github.com/PRavaga/zano-mcp) that connects AI agents (Claude Code, Cursor, Windsurf, and other MCP-compatible tools) to the Zano blockchain. 45+ tools for querying blocks, wallets, assets, DEX order books, and trading data — giving AI assistants direct read access to a privacy chain. See the [blog post](https://blog.zano.org/zano-mcp-give-your-ai-agent-eyes-on-a-privacy-blockchain/) for setup and use cases.

## Wider Ecosystem

Beyond the core products above, the Zano ecosystem includes:

- **[Wrapped Zano](https://wrapped.zano.org)**: WZANO — an ERC-20 token on Ethereum, exchangeable 1:1 for native ZANO at any time.
- **[Obscura](https://obscura.zano.org)**: Mint and manage NFTs privately. Digital ownership without broadcasting your collection to the world.
- **[Zano Messenger](https://docs.zano.org/docs/use/zano-matrix-guide)**: Decentralized, encrypted communication built on Matrix, linked to your Zano alias.
- **[Bridgeless](https://bridgeless.com)**: Non-custodial bridge between public and privacy blockchains. Uses Zano gateway addresses with ETH-compatible signatures for cross-chain asset commands.
- **[Zano Bay](https://zanobay.com)**: A private marketplace. Buy and sell goods with end-to-end encrypted transactions.
- **[Bandit City](https://bandit.city)**: Community hub with its own token, staking, and culture built on Zano.
- **[Alias Auction](https://auction.zano.org)**: Bid on human-readable @usernames registered on-chain as your Zano identity.
- **[Zano Pay](https://pay.zano.org)**: Embeddable payment widgets for any website. Accept private payments in minutes.
- **[Zano Cash POS](https://zanocash.com)**: Point-of-sale for physical shops. Customers scan, pay, done — private, no bank required.

See the full ecosystem at [zano.org/ecosystem](https://zano.org/ecosystem).
