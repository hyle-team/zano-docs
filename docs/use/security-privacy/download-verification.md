---
sidebar_position: 3
slug: /use/download-verification
---

# Verifying Your Download

Wallet software is a favorite target for tampering: a modified build can steal your seed phrase and funds. Two habits protect you.

## 1. Download only from official sources

- [zano.org/wallets](https://zano.org/wallets)
- [GitHub releases](https://github.com/hyle-team/zano/releases) (hyle-team/zano)

Never install a wallet from a link sent to you in chat or email, even if it looks official. No legitimate team member will ever DM you a download link first.

## 2. Check the SHA256 checksum

Every release publishes SHA256 hashes in its [release notes](https://github.com/hyle-team/zano/releases). After downloading, compute the hash of your file and compare:

**Linux**

```bash
sha256sum <downloaded-file>
```

**macOS**

```bash
shasum -a 256 <downloaded-file>
```

**Windows (PowerShell)**

```powershell
Get-FileHash <downloaded-file> -Algorithm SHA256
```

If the output doesn't match the published hash exactly, delete the file and re-download from an official source.

A verified download is also the precondition for adding an antivirus exclusion when the wallet gets a false positive; see [Common Issues](/docs/use/troubleshooting/common-issues) for that flow.
