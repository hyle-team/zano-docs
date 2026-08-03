---
sidebar_position: 1
---

# Common Issues

Quick fixes for the problems users hit most often. If your issue isn't here, see [Reporting Issues](/docs/use/reporting-issues) for how to get help.

### "Transaction is too large" when sending coins

This happens when the amount you are sending is composed of many small inputs (for example, lots of small staking rewards or incoming payments). Split the payment up and send several smaller amounts instead; each transaction then uses fewer inputs and stays under the size limit.

### Part of my balance is locked

Change from your own outgoing transactions is temporarily locked for 10 confirmations (about 10 minutes). See [Locked Balance](/docs/use/locked-balance) for the full explanation.

### The desktop wallet takes a long time to start

The desktop wallet is a full-node application: on startup it loads the blockchain and synchronizes your wallets. Start time depends on your system specifications and can be bottlenecked by disk and internet speed. Subsequent starts are faster than the first sync.

### My antivirus flags the wallet as a virus

Some antivirus programs flag wallet software as a false positive. Before adding any exclusion, make sure you downloaded the wallet from [zano.org/wallets](https://zano.org/wallets) or the official [GitHub releases](https://github.com/hyle-team/zano/releases) and that its SHA256 checksum matches the one published in the release notes; the [GUI wallet guide](/docs/use/wallets/gui-wallet) covers this in more detail.
