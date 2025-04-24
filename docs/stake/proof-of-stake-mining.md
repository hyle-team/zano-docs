---
sidebar_position: 1
---

# Staking Zano

Proof-of-stake mining or staking is typically implemented in such a way that a random coin owner obtains the right to sign a new block. Zano PoS implementation keeps miners in full anonymity and is as simple as a push of a button.

## Benefits of Zano Staking

- 100% Anonymous: Your staked balance always remains hidden thanks to our [Zarcanum Technology.](https://docs.zano.org/docs/learn/zano-features/overview#zarcanum-anonymous-proof-of-stake)

- No lock-ups: Unstake your coins at any chosen time.

- No minimum amounts: Stake any amount of ZANO you want.

- Truly decentralized: Anyone can start staking. There are **no** validators or special nodes.

- No slashing.

- Easy-to-use: Flip the switch and start staking.

The only requirement is to run a Zano node (currently, this can only be done on a desktop device). The Zano desktop wallet automatically functions as a Zano node.

There is no "delegation" function in Zano Staking, as we believe that it goes against network decentralization, and running a Zano node takes very few resources.

## How to Stake Zano

Simply open the Zano desktop wallet, make sure the blockchain is synchronised, and turn on the `Staking` switch.

```mdx-code-block
<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
  <iframe
    src="https://www.youtube.com/embed/VruRhPSasPU"
    title="YouTube video player"
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
```

:::tip

You can observe your progress in the `Staking` tab of your staking wallet. The amount of earnings depends on the wallet balance. You can switch `Staking` on and off without any limitations.

:::

![Staking Tab on GUI wallet.](/img/stake/staking-zano/zano-staking.jpg)

## Estimating PoS Rewards

Proof-of-stake earnings depend on the current PoS difficulty and the number of coins being staked. The more coins you stake, the better chance you have to “win” the right to sign the next PoS block. Of course, it’s important to estimate your chances and predict how much you can earn in some way. **The most straightforward way to do so is to use the community-made [Staking Simulator](https://zanostats.com/staking).**

:::note

Please keep in mind that this is just an estimation and can vary heavily. Similarly to PoW, you only get a reward if your stake wins a block, and since block creation is probabilistic, your rewards are too.

:::

You can calculate your estimation manually using the following approach:

\
First, we need to get the current PoS difficulty, which can be found in the [block explorer](https://explorer.zano.org/). This value is then divided by `1000000000000=10¹²`, which in the Zano network is one coin basis.

Second, we again divide it by 288. This operation lets us take the PoS mining timestamp frame into account. Without further details, this factor provides hash variety in PoS mining and can be somewhere between 256 and 320. It’s reasonable to use the value of 288 here.

Now we have an estimation of how many coins participate in PoS mining currently as:

```mdx-code-block
$$
C = D_{PoS} \thinspace / \thinspace 288 \thinspace / \thinspace 10^{12} = D_{PoS} \cdot 2.88 \cdot 10^{-14}
$$

Where $C$ is the total amount of coins participating in PoS mining, and $D_{PoS} \thinspace$ is the current PoS difficulty.
```

As you may know, the Zano network emits an average of 1 coin each minute with a 50-50 spread between PoS and PoW. That makes it 720 potential PoS reward coins per day. So if you owned all the coins in PoS, that could be your total daily earnings. And if you divide C*C* by 720, you will get the number of coins you need to mine 1 Zano coin a day. Now, you can estimate the number of coins you will earn as:

```mdx-code-block
$$
E_{daily} = \frac{720 \cdot N}{C} \approx \frac{2.07 \cdot 10^{17} \cdot N}{D_{PoS}}
$$

Where $\thinspace E_{daily} \thinspace$ is the estimated number of coins you'll earn per day, and $N$ is the number of coins you're staking.
```
