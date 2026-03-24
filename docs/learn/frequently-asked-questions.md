---
sidebar_position: 8
---

# Frequently Asked Questions

- [Beginner Questions](#beginner-questions)
- [Privacy Technologies](#privacy-technologies)
- [Tokenomics & Trust](#tokenomics--trust)
- [Cross-Chain Bridging](#cross-chain-bridging)
- [Dealing with Misuse & Bad Actors](#dealing-with-misuse--bad-actors)
- [Troubleshooting](#troubleshooting)

---

## Beginner Questions

### What is Zano, and how is it different from other cryptocurrencies?

Zano is an open-source layer-1 blockchain where every transaction is private by default. Amounts, addresses, and even asset types are hidden, enforced at the protocol level, not opt-in. You can send funds, stake, issue your own tokens, trade peer-to-peer, and build apps on Zano.

**Key characteristics:**

- **Privacy protocol**, all transactions are private by default, enforced at the protocol level.
- **Hybrid consensus algorithm**, makes the cost of a double-spend attack extremely high.
- **Platform for dApps**, infrastructure for building decentralized applications.
- **Confidential Assets**, create and manage private tokens on the Zano blockchain.

**Two main use cases:**

1. Peer-to-peer private transactions.
2. An ecosystem with infrastructure for dApps and assets to build on.

### Is Zano like Ethereum?

Zano is not an EVM chain since it lacks smart contracts; we prioritize default privacy instead. Smart contracts, which require publicly verifiable code and execution, conflict with privacy, implementing private smart contracts demands complex solutions, introducing potential risks.

This doesn't mean Zano lacks "smart" functionality, many of the use cases typically associated with smart contracts can actually be achieved without them. For example, Zano supports the creation and management of tokens (Confidential Assets) and enables private trading through a built-in decentralized exchange (DEX).

Zano is more limited in terms of how programmable assets are, but the flip side is that it protects your privacy. Consider it a trade-off.

### Is Zano like Monero? What makes it different?

Zano and Monero share common roots in the CryptoNote protocol, and use similar core privacy primitives. But **Zano is not a fork of Monero**. Our co-founder, Andrey Sabelnikov, was the lead developer who built the original CryptoNote codebase alongside its creator, Nicholas van Saberhagen. That codebase became the foundation for over 300 projects, Monero among them.

The biggest difference is in scope. Monero focuses on being private peer-to-peer digital cash. Zano is building a platform with a wider set of tools, including user-creatable privacy tokens, on-chain identity, and decentralized trading, all protected by the same privacy guarantees at the base layer.

On the consensus side, Zano runs a hybrid PoW/PoS model instead of Monero's pure PoW. This makes the network harder to attack, since a bad actor would need to control both hash power and staked coins. It also gives us faster block times (1 minute vs. Monero's 2 minutes) and shorter lock-up periods (10 minutes vs. 20).

### How do I set up a Zano wallet?

1. Go to the Apple/Play store or download from [zano.org/downloads](https://zano.org/downloads).
2. Create a wallet by following the steps in the app.
3. Store your keys in a safe place.

**Mobile wallet** is ideal for everyday transactions on the go. **Desktop wallet** runs a full local node, required for staking and offers the most complete feature set.

See all compatible wallets: [zano.org/wallets](https://zano.org/wallets)

### Where can I trade Zano?

See all places where you can trade Zano: [zano.org/exchanges](https://zano.org/exchanges)

You can also mine coins and stake them to increase your balance, or trade directly on our built-in DEX.

### Are there private stablecoins on Zano?

Yes. Zano's Confidential Assets technology enables private stablecoins to be built on the network. One example is [fUSD (Freedom Dollar)](https://www.freedomdollar.com/), the first private stablecoin launched on Zano. It's backed by Zano and overcollateralized, check the current ratio at [freedomdollar.com/how-it-works](https://www.freedomdollar.com/how-it-works). All the Zano that is swapped into fUSD goes straight to collateral reserves, and this amount is also being staked, increasing the reserve every day.

### Can I stake Zano on mobile or just desktop?

Zano staking is done through the desktop wallet only, since it requires running a full local node, which is currently unfeasible on mobile devices.

### What is the Zano DEX and what are the advantages over a CEX?

The Zano Trade DEX (Decentralized Exchange) is a platform for trading Zano and Confidential Assets within the Zano ecosystem, offering peer-to-peer trading without custodial risks. It leverages Ionic Swaps to maintain privacy during trades.

- **Decentralized:** No central authority controls the exchange.
- **Privacy:** Trades are conducted with confidentiality through Ionic Swaps.
- **Non-custodial:** Users retain control of their funds.
- **Peer-to-peer:** Direct trading between users.

Learn more: [Zano Trade](/docs/use/zano-trade)

### What is the most important feature that Zano has over other privacy projects?

Confidential Assets are a key feature because they allow users to create their own private tokens on the Zano blockchain, secured by the same privacy mechanisms as Zano itself. This opens up possibilities for private dApps and tokenized assets.

### What are Confidential Assets and how are they used on Zano?

Anyone can easily issue user-creatable currencies and digital tokens on the Zano chain. Such assets are secured by the same mechanisms that make Zano so much more secure than first-generation cryptocurrencies, namely hidden addresses and hidden amounts. This unique technology can be used to create private stablecoins, shielded versions of existing assets, and much more, without the overhead of having to create, manage, and secure your own blockchain.

**Projects built on or integrating Zano Confidential Assets include:**

- [Confidential Layer](https://confidentiallayer.com/), Bridge between transparent and privacy blockchains
- [Freedom Dollar](https://www.freedomdollar.com/), Private USD stablecoin collateralized with ZANO
- [Obscura](https://obscura.art/), Mint private NFTs on Zano

### What are Ionic Swaps?

Ionic Swaps are an improvement on Atomic Swaps, innovating seamless cryptocurrency exchanges while preserving user privacy. Ionic Swaps are a safe and consistent way to perform peer-to-peer swaps in which neither party has an unfair advantage. This technology is used by our DEX: Zano Trade.

### What is an alias and how does it work?

All Zano network users can create [aliases](/docs/use/aliases), for example: @username. These aliases provide a short, easy-to-remember name rather than a long string of characters that form a blockchain address. To send coins to an alias, simply type it in the address field starting with @, and wallets will automatically detect it.

Zano dApps can use alias-based authentication, as [Zano Matrix](/docs/use/zano-matrix-guide), a private dedicated messenger, already does. Aliases will also be integrated into a user reputation service.

### What is Zarcanum?

Zarcanum is the world's first Proof of Stake scheme that enhances traditional PoS with untraceability and hidden amounts, revolutionizing blockchain consensus. Thanks to this innovative approach, our stakers can stake in complete anonymity.

### How is the network secured?

Zano uses a hybrid consensus algorithm that alternates between Proof-of-Work (PoW) and Proof-of-Stake (PoS) blocks.

This approach combines the benefits of both mechanisms to enhance blockchain security and decentralization. If performing a 51% attack on Zano, one would need the majority of the hash rate **and** a significant amount of the total amount of staked coins, making the cost of an attack incredibly high, thus becoming infeasible.

### What's the plan for scaling?

We'll continue to improve our dynamic blocksize (which our team pioneered initially with CryptoNote). Horizontal L1 scaling (sharding) is also on our radar as a long-term direction we're excited about.

---

## Privacy Technologies

### How are Zano transactions kept private by default?

Zano leverages the proven and time-tested cryptographic primitives that were first introduced with CryptoNote, a protocol of which one of our founders was a lead-dev for, origin for over 300 forks and used by the biggest private cryptocurrencies:

- **d/v-CLSAG Ring Signatures** make transactions between Zano network members untraceable.
- **Stealth Addresses** conceal sending and receiving addresses.
- **Pedersen Commitments** hide amounts/balances, the asset type being transacted, and facilitate private staking (Zarcanum).

This makes sure that **by default**, transaction data stored on the blockchain is **only** accessible by parties who authorized the transactions, none of it is ever publicly published.

### What makes Zano more private than Bitcoin or Ethereum?

Zano achieves greater privacy through the use of Ring Signatures, Stealth Addresses, and Pedersen Commitments. These features conceal transaction origins, destinations, and amounts. Unlike Bitcoin and Ethereum, where this information is publicly available on-chain, Zano hides it by default.

### What are stealth addresses and how do they protect my identity on Zano?

Stealth Addresses create random one-time addresses for every transaction on behalf of the recipient. The recipient can publish just one address, yet have all their incoming payments go to unique addresses on the blockchain, where they cannot be linked back to either the recipient's published address or any other transaction's addresses. By using stealth addresses, only the sender and receiver can determine where a payment was sent.

### How do ring signatures work in Zano to obscure the sender?

A Ring Signature is a type of digital signature that can be performed by any member of a group of users who each have a key. Therefore, a message signed with a ring signature is endorsed by someone in a particular group of people (senders). It should be computationally infeasible to determine *which* of the group members' keys was used to produce the signature, and therefore, who actually is the sender.

### What is a mixin and what is it used for?

The mixin count refers to the number of signatures (apart from yours) in the ring signature that authorizes the transaction. A higher mixin value will typically provide more privacy because it will provide greater plausible deniability. It is impossible for any observer to know which is the real source of the funds.

### Can I create auditable wallets on Zano for transparency when needed?

Yes, Zano supports auditable wallets, which allow people and organizations to create transparent wallets for situations where a third party would rather verify than trust. You can share your wallet's transaction history and balance with others without granting them spending ability. Creating auditable wallets doesn't affect the privacy of the Zano network in any way. We use this feature for our foundation fund.

Learn how to set one up: [Auditable Wallets](/docs/use/auditable-wallets)

### Does Zano's privacy slow down transactions or increase fees?

Privacy in general incurs higher complexity and therefore impacts the size of transactions. However, when comparing a regular Zano transaction (private by default) to a private Bitcoin transaction (CoinJoin), a regular Zano transaction is vastly simpler, therefore lighter and cheaper.

### Why is Zano's on-chain privacy better than using privacy add-ons or mixers on other chains?

When privacy isn't built into the base layer from the start and instead depends on opt-in, add-on solutions, the result is a cumbersome user experience. And in the privacy space, where even a small mistake can be catastrophic, that approach almost always ends poorly.

On Zano, you don't need to be an expert to enjoy instant privacy, simply using the network is enough. Everything is built so you don't have to worry, and this comes with an added benefit: true *fungibility*. Every asset you receive is just as private and indistinguishable as any other.

### What is fungibility, and why is it important?

Fungibility is one of the basic properties of money, it means that any unit is replaceable by another identical one; mutually interchangeable. Just like when you lend someone a \$100 bill and they return a different \$100 bill, it makes no difference.

Without fungibility, money systems quickly become impractical, and the same holds true in the digital realm. In first-generation public blockchains, every coin (or output) carries its full transaction history, making them traceable. This leads to issues such as:

- Exchanges freezing your funds because a coin you received has a "suspicious" origin (something you had no way of knowing).
- Merchants refusing your payment because they don't like the history attached to it.
- Uncertainty about the actual value of your funds, since past transactions can affect how they're perceived.

But if someone accepts ZANO or its Confidential Assets, you don't have to worry about this. All Zano assets are treated equally thanks to not having a public transaction history in the first place, improving user experience while maximizing security.

---

## Tokenomics & Trust

### Was Zano pre-mined, and how was it structured?

Yes, the premine consisted of 3.6M ZANO; it was set aside for ongoing project expenses, marketing, partnerships, and to pay a loan to fund initial development back in 2018.

As of July 2025, considering what has already been spent for development, the foundation fund sits at just ~4.4% of the total ZANO supply.

You can track the amount of the foundation fund via our [explorer](https://explorer.zano.org/) or by importing its tracking seed into your wallet:

`aZxat4HAWriVQ3enkGcVsrZRdMseAJswG3CSEwTqZS246VsFQ53w26eZstYsu1jWE74Atz9ajLxFnBsVTafncWNH5SMv4zHFaTS:1780c4d5dd7e97cc4a75ea8baa7977d12ef948b9a6dddc2a9a37e5e22ac7180e:1599495055`

Read more about why we took this decision and our future plans for Zano's funding [here](/docs/learn/emission#the-premine-and-how-zano-will-be-funded).

### How is the project funded if there was no ICO or VC backing?

The project is funded through the premine described above. Unlike Bitcoin and Monero, which have benefited from substantial community donations, most cryptocurrencies struggle to secure funding through donations alone. Boolberry, the team's previous project, had just a 1% dev-tax and no premine, it was impossible to sustain development, as donations weren't enough given the extremely small community.

A premine was seen as a necessary step to ensure that Zano has the resources needed to grow, innovate, and maintain a dedicated team.

### Can the Zano team dump on the market, or are their funds locked?

No funds are locked; however, all foundation fund transactions are public, and as of July 2025, the fund represents less than 5% of the total supply.

### How does Zano ensure decentralization if the devs hold some supply?

Besides the fact that the foundation fund sits below 5% of the supply, Proof of Stake incentives ensure that all holders remain honest, if they were to harm the network, they would be attacking their own investment.

### Is there a public breakdown of the ZANO token distribution?

No. Zano is a private-by-default blockchain and all balances remain hidden.

### Why should I trust a project that had a pre-mine?

The decision to proceed with a premine was rooted in the team's previous experiences and the broader crypto landscape. Unlike Bitcoin and Monero, which have benefited from substantial community donations, most cryptocurrencies struggle to secure funding through this method alone.

A premine was seen as a necessary step to ensure that Zano has the resources needed to grow, innovate, and maintain a dedicated team.

Read more about our future plans for Zano's funding [here](/docs/learn/emission#the-premine-and-how-zano-will-be-funded).

### What steps has Zano taken to build trust and transparency with the community?

Beyond making the foundation fund wallet publicly accessible and publishing monthly project updates, Zano is also exploring ways to further decentralize its development fund. One promising approach under consideration is implementing multisig wallets, where control over funds is shared across multiple keys, including community members or other trusted parties.

---

## Cross-Chain Bridging

### Can I bridge assets like BTC or ETH to Zano?

Yes. Zano supports cross-chain bridging, allowing users to move assets from other blockchains into the Zano ecosystem and benefit from its privacy features. One of the bridges that has integrated Zano is [Confidential Layer](https://confidentiallayer.com/), a protocol built on the [Bridgeless](https://bridgeless.com/) L1 blockchain that enables seamless, decentralized, and non-custodial bridging between various blockchains (like Ethereum and Bitcoin) and privacy chains like Zano. It allows users to move assets like BTC, BCH, and EVM tokens into privacy-focused environments.

This means users can upgrade their favorite crypto assets with the privacy and security of the Zano blockchain, bringing massive utility to Zano's ecosystem.

### What do I receive when using the Confidential Layer bridge?

When bridging an asset to Zano using Confidential Layer, you receive its decentralized wrapped version on the Zano blockchain. This asset is trustlessly pegged 1:1 and doesn't rely on a third-party custodian, it's secured by a network of validators.

### How does Confidential Layer increase privacy? How is it different from mixers?

It adds to bridged assets the same [technologies used by native Zano](#privacy-technologies).

Unlike mixers, which obscure your transaction flow at a certain point (and you still need to watch your steps after), Confidential Layer cryptographically hides your balance, the data is never visible in the first place.

### How are the wrapped assets stored?

In Zano wallets, both the official wallet and multicoin wallets like Edge, Cake Wallet, and Bitcoin.com.

### How does unwrapping work?

By sending the wrapped coins back to the protocol, you retrieve the locked original asset at any time. No KYC required.

### Is there a fee involved in wrapping/unwrapping?

Currently set at 0.1%, plus regular transaction fees.

### Is there a custodian involved, like with WBTC?

No. The entire protocol is decentralized and non-custodial, no central third party holds your assets at any point.

---

## Dealing with Misuse & Bad Actors

### What does Zano do to prevent bad actors from abusing its privacy features?

Zano is built as a truly permissionless network, no member of the development team or anyone else can prevent others from using its features. This ensures that every user has equal access, regardless of who they are or where they come from. We firmly believe this is the core ethos of cryptocurrency. If a network isn't open and resistant to control or censorship, then calling it decentralized has little meaning.

### How do privacy coins like Zano balance user freedom with responsibility?

Every user is responsible for their own actions, the network doesn't judge anyone.

### What would Zano say to regulators or critics who claim privacy coins are only for criminals?

We affirm that **privacy is a fundamental human right** (UDHR, 1948) and applies online as well as offline (UN Human Rights Council, 2013). It is the foundation of freedom, dignity, and self-determination in an increasingly digital world. Without privacy, individuals cannot fully exercise other rights such as freedom of expression, freedom of association, or the right to participate in society without coercion or surveillance.

In the realm of money and communication, privacy is not a privilege but a necessity. It protects individuals from unjust discrimination, economic exclusion, and authoritarian control. Just as we expect confidentiality in our personal lives, our medical records, or our votes, we must demand the same for our digital interactions and financial transactions.

### Is there a way to track or flag suspicious activity on Zano's blockchain?

No. Zano is built precisely so you can't distinguish one transaction from another.

### How does Zano differentiate between protecting user rights and enabling bad behavior?

Zano is designed as a **decentralized, permissionless network**, which means it does not (and cannot) make judgments about who uses it or for what purpose. Just as the internet itself does not distinguish between "good" and "bad" traffic, a truly decentralized financial system must remain neutral.

---

## Troubleshooting

### When trying to send coins I get an error stating that the transaction is too large.

This is due to sending many small inputs to the address. The solution is to split up the transaction and send smaller amounts.

### What is a seed phrase?

To access the wallet in the event of a loss, you need something called a mnemonic recovery phrase or seed. This group of words that you received while creating your wallet is designed to add an extra layer of security. With these phrases you can easily restore lost wallets if you don't have the passkey.

### Why does the desktop wallet take so long to start?

Zano wallet is a full node application. Due to loading the blockchain and multiple wallets synchronizing, start time depends on your system specifications and may be bottlenecked by internet connection speed.
