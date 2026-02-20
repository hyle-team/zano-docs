---
sidebar_position: 4
slug: /use/wallets/install-zano-cli-wallet-ubuntu
---

# Install a Zano CLI Wallet (Linux)

Download Zano, extract the CLI binaries, sync the blockchain, and create your first wallet.

## 1. Download

Go to [zano.org](https://zano.org) and navigate to the downloads section. Download the Linux release — it's distributed as an **AppImage** file:

```
zano-linux-x64-release-v<VERSION>[<hash>].AppImage
```

## 2. Verify the download

Open a terminal in the download directory and run a checksum against the file:

```bash
sha256sum zano-linux-x64-release-v*.AppImage
```

Compare the output against the SHA256 hash published in the [release notes](https://github.com/hyle-team/zano/releases). If they don't match, re-download the file.

## 3. Extract the CLI binaries

The AppImage contains both the GUI wallet and CLI tools. To extract the CLI binaries:

```bash
chmod +x zano-linux-x64-release-v*.AppImage
./zano-linux-x64-release-v*.AppImage --appimage-extract
```

This creates a `squashfs-root/` directory. The CLI binaries you need are inside:

```
squashfs-root/usr/bin/zanod          # the daemon (node)
squashfs-root/usr/bin/simplewallet   # the CLI wallet
```

Move them to a directory of your choice:

```bash
mkdir -p ~/zano
cp squashfs-root/usr/bin/zanod squashfs-root/usr/bin/simplewallet ~/zano/
```

You can delete `squashfs-root/` after copying the binaries.

![Extract CLI binaries from AppImage](/img/use/install-zano-cli-wallet-ubuntu/install-extract-appimage.png)

## 4. Start the daemon

The daemon (`zanod`) connects to the Zano network and downloads the blockchain. Open a terminal in your Zano directory and run:

```bash
./zanod
```

Wait for the blockchain to fully sync — this can take a few hours on the first run, depending on your connection speed. Keep the daemon running; you'll need it for the next step.

![Starting the daemon](/img/use/install-zano-cli-wallet-ubuntu/install-zanod-sync.png)

:::tip Skip the sync with a public node
If you don't want to download the full blockchain, you can connect your wallet directly to a public node instead. Skip to step 5 and add `--daemon-address` when opening your wallet:

```bash
./simplewallet --generate-new-wallet name.wallet --daemon-address 37.27.100.59:10500
```

See [Public Nodes](/docs/build/public-nodes) for available endpoints.
:::

## 5. Create a new wallet

Once the daemon is synced (or if you're using a public node), open a new terminal in the same directory:

```bash
./simplewallet --generate-new-wallet name.wallet
```

Replace `name` with whatever you'd like to call your wallet (e.g., `mywallet.wallet`).

You'll be prompted to create a password. Use a strong one — a password manager like KeePass or Bitwarden is recommended.

After the password is set, the wallet will display your receive address (starts with `Zx`). This is the address you'll use to receive ZANO.

![Create a new wallet](/img/use/install-zano-cli-wallet-ubuntu/install-generate-wallet.png)

## 6. Back up your seed phrase

Your seed phrase is the only way to recover your wallet if you lose the wallet file or forget the password.

Inside the wallet console, run:

```
show_seed
```

You'll be prompted for your wallet password, then asked to set a **seed password** (also called a [passphrase](/docs/use/seed-phrase#passphrase)). This is optional — if you set one, you'll need both the seed phrase and the passphrase to restore the wallet.

The wallet will display your **seed phrase** (26 words for current wallets). Write it down and store it somewhere safe and offline.

![Back up your seed phrase](/img/use/install-zano-cli-wallet-ubuntu/install-show-seed.png)

:::warning
Anyone with access to your seed phrase (and passphrase, if set) can take full control of your wallet. Never share it, never store it digitally in plain text.
:::

## 7. Open an existing wallet

To reopen your wallet in the future:

```bash
./simplewallet --wallet-file name.wallet
```

Enter your password when prompted.

**You're done.** Head over to [Using a Zano CLI Wallet](/docs/use/wallets/using-zano-cli-wallet-ubuntu) for sending, receiving, and more advanced operations.
