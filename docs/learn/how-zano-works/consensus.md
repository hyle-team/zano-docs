---
sidebar_position: 2
---

# Hybrid PoW/PoS Consensus

Zano alternates between Proof-of-Work and Proof-of-Stake blocks. The PoW side runs on the ProgPowZ hash algorithm; the PoS side uses **Zarcanum**, the first scheme where stakers don't reveal their balances. Blocks arrive about once a minute, and 100% of each block reward goes to the miner or staker who found it.

<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
  <iframe
    src="https://www.youtube.com/embed/ExT-7YGd4DM"
    title="Hybrid Consensus Mechanism"
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

## Why a hybrid?

To perform a classic 51% attack on Zano, an attacker needs the majority of the PoW hashrate **and** a large share of the staked coins at the same time. Other ratios are possible (for example, roughly 20% of hashrate against 90% of stake), but every combination requires attacking both resources at once, and buying up a significant share of the coins would drive the price up against the attacker. This makes an attack expensive enough that the network can keep a relatively low block reward while staying secure. The exact math is covered in the [research papers](/docs/learn/research).

## Zarcanum: anonymous Proof-of-Stake

Zarcanum is the world's first Proof-of-Stake scheme with hidden amounts: you earn staking rewards without exposing how much you hold. Staking is open to everyone. There are no validator or master nodes, no minimum staking amounts, and no lock-up periods.

## Take part

- [Stake ZANO](/docs/stake/getting-started/proof-of-stake-mining) to earn PoS rewards with the desktop wallet
- [Mine ZANO](/docs/mine/overview) by pointing ProgPowZ hashpower at the PoW side
