---
sidebar_position: 2
---

# Estimating PoS Rewards

Proof-of-stake earnings depend on the current PoS difficulty and the number of coins being staked. The more coins you stake, the better chance you have to "win" the right to sign the next PoS block. Of course, it's important to estimate your chances and predict how much you can earn in some way. **The most straightforward way to do so is to use the community-made [Staking Simulator](https://zanostats.com/staking).**

:::note

Please keep in mind that this is just an estimation and can vary heavily. Similarly to PoW, you only get a reward if your stake wins a block, and since block creation is probabilistic, your rewards are too.

:::

## Manual Calculation

You can calculate your estimation manually using the following approach:

First, we need to get the current PoS difficulty, which can be found in the [block explorer](https://explorer.zano.org/). This value is then divided by `1000000000000=10¹²`, which in the Zano network is one coin basis.

Second, we again divide it by 288. This operation lets us take the PoS mining timestamp frame into account. Without further details, this factor provides hash variety in PoS mining and can be somewhere between 256 and 320. It's reasonable to use the value of 288 here.

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