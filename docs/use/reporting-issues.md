---
sidebar_position: 98
---

# Reporting issues

If you run into a problem with Zano, the best way to get help is to open a support ticket at [zano.org/support](https://zano.org/support). It goes straight to the Zano support team and we reply by email, so you have a record and don't need to chase anyone in chat.

Use the ticket form for wallet and sync problems, transactions, Zano Trade, Wrapped Zano, exchange deposits, and anything else you need a hand with. If it's a wallet issue, attaching your log file helps us debug much faster (see below).

:::caution Watch out for scams
Zano support will never DM you first, and never asks for your seed phrase, private keys, or wallet password. Discord and Telegram are run by the community, not the dev team. For anything involving your wallet or funds, use the support ticket above.
:::

If you're a developer and found a bug in the code, you can also open a [GitHub issue](https://github.com/hyle-team/zano/issues). For critical network updates like hard forks and urgent upgrades, follow [@zano_critical](https://t.me/zano_critical).

## Log files

In most cases log files are essential for troubleshooting. It could be wise to attach them to the report you submit. Specifically, `Zano.log` or `zanod.log` would be useful for our dev team. They are stored in different locations depending on OS:

### Windows

```
C:\Users\<USER NAME>\AppData\Roaming\Zano
```

### MacOS

```
/Users/<USER NAME>/Library/Application Support/Zano
```

### Linux

```
~/.Zano
```
