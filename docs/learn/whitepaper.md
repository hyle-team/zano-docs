---
sidebar_position: 3
---

# Research & Whitepapers

### Zano Whitepaper (2019)

Original Zano whitepaper, describes general concepts used in project.

[https://github.com/hyle-team/docs/blob/master/zano/Zano_WP_latest.pdf](https://github.com/hyle-team/docs/blob/master/zano/Zano_WP_latest.pdf)

### PoS Analysis and improvements proposal (2019)

With help of Maxwell Sanches we come up with more effective PoS model and upgraded the network, this document hold details of this research and improvement.

[https://github.com/hyle-team/docs/blob/master/zano/arch/PoS_Analysis_and_improvements_proposal.pdf](https://github.com/hyle-team/docs/blob/master/zano/arch/PoS_Analysis_and_improvements_proposal.pdf)

### Auditable wallets in CryptoNote (2020)

This article explores several possible implementations of extending CryptoNote 2.0 with full-scale wallets auditing

[https://github.com/hyle-team/docs/blob/master/zano/arch/Auditing%20wallets%20in%20CryptoNote.pdf](https://github.com/hyle-team/docs/blob/master/zano/arch/Auditing%20wallets%20in%20CryptoNote.pdf)

### Zarcanum: A Proof-of-Stake Scheme for Confidential Transactions with Hidden Amounts (2021)

Presenting a Proof-of-Stake mining scheme that does not reveal amounts and is compatible with ring confidential transactions. Paper also introduces an extension to the Bulletproofs+ protocol that allows range proofs on double-blinded commitments, with corresponding security statements.

[https://eprint.iacr.org/2021/1478](https://eprint.iacr.org/2021/1478)

### Zano: Confidential Assets Scheme for RingCT and Zarcanum (2024)

In this paper, we describe a practical way of implementing confidential assets (a.k.a. tokens or colored
coins) in Zano with unlimited decoy mixing capability and hidden amounts, as an extension to the Ring
Confidential Transactions scheme. Our approach preserves public verifiability that no transaction either
creates or destroys coins. We further extend this approach to show how it can be combined with
Zarcanum, a Proof-of-Stake scheme for transaction with hidden amounts

[https://hyle-team.github.io/docs/zano/CA_paper/Zano_CA_for_RingCT_and_Zarcanum_v1.1.pdf](https://hyle-team.github.io/docs/zano/CA_paper/Zano_CA_for_RingCT_and_Zarcanum_v1.1.pdf)

### d/v-CLSAG: Extension for Concise Linkable Spontaneous Anonymous Group Signatures (2024)

Extension for the CLSAG (Concise Linkable Spontaneous Anonymous Group Signatures)

[https://eprint.iacr.org/2025/1513](https://eprint.iacr.org/2025/1513)

<br />
<br />
<br />

## Archive: drafts and legacy docs for history and context

### Zano Tokenization Platform (2022)

Introducing a solution that allows users to issue tokens that work inside Zano blockchain, which have the same properties as transactions with a native token—namely hidden amounts and hidden addresses, as well as auditable wallets.

Note: this paper used one of the early approach to implementing assets, when each asset has unique scalar identifier but common asset-type generator, it's now oudated.

[https://raw.githubusercontent.com/hyle-team/docs/master/zano/arch/Zano_tokenization_platform.pdf](https://raw.githubusercontent.com/hyle-team/docs/master/zano/arch/Zano_tokenization_platform.pdf)

### Zano: confidential assets scheme (2022 - DRAFT)

Paper describes a practical way of implementing confidential assets (a.k.a. tokens) in Zano with unlimited decoy mixing capability and hidden amounts as an extension to the Ring Confidential Transactions scheme

[https://raw.githubusercontent.com/hyle-team/docs/master/zano/tokens_maths_paper/Zano__confidential_assets_with_hidden_amounts_DRAFT.pdf](https://raw.githubusercontent.com/hyle-team/docs/master/zano/tokens_maths_paper/Zano__confidential_assets_with_hidden_amounts_DRAFT.pdf)



## Additional research papers

The following papers represent research toward a novel logarithmic-sized linkable ring signature scheme.

- Lin2-Xor Lemma and Log-size Linkable Ring Signature (2020)  
  In this paper we introduce a novel method for constructing an efficient linkable ring signature without a trusted setup which is logarithmic in the size of the signer anonymity set, its verification complexity is linear in the anonymity set size  
  [https://github.com/hyle-team/docs/blob/master/zano/arch/Lin2-Xor_Lemma_and-Log-size_Linkable_Ring_Signature.pdf](https://github.com/hyle-team/docs/blob/master/zano/arch/Lin2-Xor_Lemma_and-Log-size_Linkable_Ring_Signature.pdf)
- Hidden amounts scheme on the base of a ring signature for independent generators (2021)  
  Draft of a hidden amounts scheme based on Lin2-Xor Linkable Ring Signature  
  [https://github.com/hyle-team/docs/blob/master/zano/arch/Hidden%20amounts%20scheme%20v6%20Sokolov.pdf](https://github.com/hyle-team/docs/blob/master/zano/arch/Hidden%20amounts%20scheme%20v6%20Sokolov.pdf)
- Log-size Linkable Ring Signature and Hidden Amounts integrated listing (2021)  
  Unified pseudo-code listing for the Lin2-Xor Signature and Hidden Amounts schemes  
  [https://github.com/hyle-team/docs/blob/master/zano/arch/Log-size%20Linkable%20Ring%20Signature%20and%20Hid-den%20Amounts%20integrated%20listing%20v3.pdf](https://github.com/hyle-team/docs/blob/master/zano/arch/Log-size%20Linkable%20Ring%20Signature%20and%20Hid-den%20Amounts%20integrated%20listing%20v3.pdf)
