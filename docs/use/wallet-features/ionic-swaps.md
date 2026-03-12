---
sidebar_position: 4
slug: /use/ionic-swaps
---

# Peer-to-Peer Ionic Swaps

Ionic Swaps are a privacy-preserving evolution of traditional atomic swaps, enabling peer-to-peer exchange of cryptocurrencies and [Confidential Assets](/docs/learn/zano-features/overview#confidential-assets) directly on the Zano blockchain. They eliminate intermediaries, prevent unfair advantage between parties, and preserve user custody and transaction privacy throughout the swap process.

You can perform Ionic Swaps on [Zano Trade](/docs/use/zano-trade), which provides a superior user experience with quality-of-life features. However, if you prefer a completely censorship-resistant and decentralized experience that does not rely on any website, you can perform swaps directly from your wallet app using the guide below.

- [Create a Swap Proposal](#create-a-swap-proposal)
- [Accept a Swap Proposal](#accept-a-swap-proposal)

---

## Create a Swap Proposal

On the official Zano Desktop app, open your wallet and select the **Swap** tab.

![Swap tab](/img/use/wallet-features/ionic-swaps/2.7.1.wallet_swap.png)

1. Click the **+** or **Create Swap** button to create a new swap proposal.

2. Fill in the swap details:
   - **Sending**: Select the asset and specify the amount you wish to sell.
   - **Receiving**: Select the asset and specify the amount you wish to receive in return.
   - **Receiver address**: Enter the wallet address or alias of the counterparty you wish to trade with.
   - **Expiration Time**: Set when the swap proposal expires.

![Creating a swap proposal](/img/use/wallet-features/ionic-swaps/2.7.3.wallet_create-swap.png)

:::note

If your asset does not appear in the selection list, you will need to [whitelist it first](https://youtu.be/pGRDO2999IE).

:::

3. Click **Create Proposal**. A unique swap proposal code will be generated.

4. Use the **Copy** button to copy the swap proposal code and share it with your trading partner using any messaging application.

![Generated swap proposal hex](/img/use/wallet-features/ionic-swaps/2.7.4.wallet_swap-proposal-hex.png)

:::warning

Copy and share the swap proposal code immediately after creation. Once you close the screen, the code will no longer be accessible and you will need to create a new proposal.

:::

:::tip

You can "cancel" a proposal at any time by moving your funds to another wallet.

:::

---

## Accept a Swap Proposal

Once you receive a swap proposal code from your trading partner:

1. Open your wallet and select the **Swap** tab.

2. Select **Confirm Swap**.

3. Paste the proposal code you received.

![Accepting a swap proposal](/img/use/wallet-features/ionic-swaps/2.7.5.wallet_confirm-swap.png)

4. Verify the swap conditions (assets and amounts) are correct.

5. Click **Accept Proposal** to submit the swap to the blockchain.

Once accepted, the swap will be processed on-chain. You can monitor its progress in the **Swap** tab, where it will appear as an ongoing swap until the transaction is confirmed.

![Ongoing swap](/img/use/wallet-features/ionic-swaps/2.7.2.wallet_swap.png)
