---
sidebar_position: 2
---

# Create and Manage Wallets (GUI)

Zano Wallet lets you manage multiple ZANO wallets, which can be easily created, restored, and removed from the app. The core of each wallet is a seed phrase, a sequence of 24 words that can be used to recover your wallet's private and public keys. A unique sequence is generated every time you create a new wallet within the app. **It's important to always keep it safe and accessible.**

For your convenience, it's not necessary to use a seed phrase to manage your wallet. In the official Zano Wallet apps, when you create a wallet, a wallet file is generated as well. This file is secured with an additional password, granting access to wallet features and the seed phrase. It can be copied to another device and used with another app.

Zano is available for mobile (Android/iOS) and desktop (Windows, Linux and MacOS). It can be downloaded [here](https://zano.org/downloads).

## Desktop Wallet Guide

```mdx-code-block
<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
  <iframe
    src="https://www.youtube.com/embed/8UXgs-lgCYQ"
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

:::info

Some antivirus programs do not recognize wallet software and automatically flag it as a virus, resulting in a false positive. In that case, you will need to add zano.exe to your exclusion list.

:::

### Create a new wallet

![alt createwallet-1](/img/use/gui-wallet/create.png "create-wallet-1")

Once the app is open, it will start syncing with the blockchain. While in progress, some features such as sending transactions and contracts will be locked. Meanwhile, you can still create your first Zano wallet by clicking `Create new wallet`.

![alt createwallet-2](/img/use/gui-wallet/create2.png "create-wallet-2")

Enter wallet name and password, then click `Select wallet location`. Note that both can be changed later in the `Wallet options` menu.

![alt createwallet-3](/img/use/gui-wallet/create3.png "create-wallet-3")

When the wallet file is created, you can continue with `Create wallet`. This file can be used to quickly import or restore wallets in both official Zano Wallets (Desktop and Mobile).

![alt createwallet-4](/img/use/gui-wallet/seedphrase.png "create-wallet-4")

To finalise wallet creation, generate and store the wallet's seed phrase.

You will be prompted to add an extra password to further secure the seed, known as a passphrase ([Learn more about what this means here](https://docs.zano.org/docs/use/seed-phrase)). If you choose to generate it without it, you can still later add it in the `Wallet options` menu.

:::danger

IMPORTANT: Using the seed phrase, anyone can restore and take full control of the wallet. Keep it in a secure location and avoid unauthorized access to it by any means. Note that you can review the seed phrase later in the `Wallet options` menu.

:::

![alt createwallet-5](/img/use/gui-wallet/wallet.png "create-wallet-5")

The wallet has been created. You can copy your wallet address to receive ZANO or Confidential Assets from exchanges, mining pools, and other sources.

### Wallet options

Each Zano wallet can be identified by a custom name assigned upon creation. This name can be edited in `Wallet options` the section at any time. Information about the wallet file location and its seed phrase is available here. Note that you can copy the seed phrase by clicking the right mouse button over it and choosing `COPY` from the context menu.

You can remove a wallet from the Zano app by clicking `Close wallet` in the same section. Note that the wallet file will remain unaffected, and you can import it again anytime if necessary.

### Changing wallet password

In case you want to change the wallet file password, you need to use `Restore from backup`. The following steps will be required:

1. Make sure you have the seed phrase saved
2. Click `Close wallet` from wallet `Details`
3. Delete the wallet file
4. Click `+Add` from `Wallets` menu and choose `Restore from backup`
5. Enter new wallet info
6. Recover and enter the previously stored seed phrase
7. Click `Select wallet location` to choose the wallet file location and name
8. Continue with `Create wallet`
