---
sidebar_position: 2
---

# Create and Manage Wallets (GUI)

Zano Wallet lets you manage multiple ZANO wallets, which can be easily created, restored, and removed from the app. The core of each wallet is a seed phrase, a sequence of 24–26 words (26 for wallets created in current versions) that can be used to recover your wallet's private and public keys. A unique sequence is generated every time you create a new wallet within the app. **It's important to always keep it safe and accessible.**

For your convenience, it's not necessary to use a seed phrase to manage your wallet. In the official Zano Wallet apps, when you create a wallet, a wallet file is generated as well. This file is secured with an additional password, granting access to wallet features and the seed phrase. It can be copied to another device and used with another app.

Zano is available for mobile (Android/iOS) and desktop (Windows, Linux and MacOS). It can be downloaded [here](https://zano.org/wallets).

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

Some antivirus programs do not recognize wallet software and automatically flag it as a virus, resulting in a false positive. Before adding any exclusion, make sure you downloaded the wallet from [zano.org/wallets](https://zano.org/wallets) or the official [GitHub releases](https://github.com/hyle-team/zano/releases), and that its SHA256 checksum matches the one published in the release notes. Only then add zano.exe to your antivirus exclusion list.

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

You will be prompted to add an extra password to further secure the seed, known as a passphrase ([Learn more about what this means here](/docs/use/seed-phrase)). If you choose to generate it without it, you can still later add it in the `Wallet options` menu.

:::danger

IMPORTANT: Using the seed phrase, anyone can restore and take full control of the wallet. Keep it in a secure location and avoid unauthorized access to it by any means. Note that you can review the seed phrase later in the `Wallet options` menu.

:::

![alt createwallet-5](/img/use/gui-wallet/wallet.png "create-wallet-5")

The wallet has been created. You can copy your wallet address to receive ZANO or Confidential Assets from exchanges, mining pools, and other sources.

### Wallet options

Each Zano wallet can be identified by a custom name assigned upon creation. This name can be edited in `Wallet options` the section at any time. Information about the wallet file location and its seed phrase is available here. Note that you can copy the seed phrase by clicking the right mouse button over it and choosing `COPY` from the context menu.

You can remove a wallet from the Zano app by clicking `Close` in the same section. Note that the wallet file will remain unaffected, and you can import it again anytime if necessary.

### Changing wallet password

The GUI has no built-in option to change a wallet file's password (the password field in Settings changes the app's master password, not the wallet file's). To change the wallet file password, you need to use `Restore from backup`. Do **not** delete your existing wallet file until the restored wallet is verified and working:

1. Make sure you have the seed phrase saved (and the seed passphrase, if you set one)
2. Copy the current wallet file to a separate location as a backup
3. Click `Close` from the wallet's `Details` section
4. Click `+Add` from `Wallets` menu and choose `Restore from backup`
5. Enter new wallet info with the new password
6. Recover and enter the previously stored seed phrase
7. Click `Select wallet location` and choose a **new** file name, so the old wallet file is not overwritten
8. Continue with `Create wallet`
9. Verify the restored wallet shows the expected address and, after syncing, the expected balance — only then archive or remove the old wallet file
