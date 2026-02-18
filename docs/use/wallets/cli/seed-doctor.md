---
sidebar_position: 10
slug: /use/wallets/seed-doctor
---

# Seed Doctor: Recovering a Broken Seed Phrase

Made a typo when writing down your seed phrase? Accidentally swapped two words? The `--seed-doctor` flag is an experimental tool built into simplewallet that can help you recover your wallet from a slightly corrupted seed phrase.

## When to Use Seed Doctor

This tool is useful when:

- You have a seed phrase that doesn't work during normal wallet restoration
- You suspect one word is misspelled or doesn't match the wordlist
- You think two adjacent words might be swapped

It won't help if multiple words are wrong or missing entirely.

## How to Run It

No wallet file or daemon connection is needed. Just run:

```bash
./simplewallet --seed-doctor
```

You'll get three prompts:

1. **Enter your seed phrase** — type in the full (broken) seed phrase
2. **Enter your wallet address** — the address you expect the seed to produce (optional but strongly recommended)
3. **Enter your passphrase** — only if the seed was protected with a passphrase (Secured Seed)

## What It Does

Seed Doctor applies two recovery strategies, one after another:

### Strategy 1: Invalid Word Detection

The tool checks every word in your seed phrase against Zano's mnemonic wordlist. If exactly one word isn't recognized, it tries every valid word in that position and checks whether the resulting seed produces the expected wallet address (or passes the internal checksum for V2 seeds).

### Strategy 2: Adjacent Word Swap

After the brute-force check, the tool tries swapping every pair of neighboring words in the seed phrase. This catches cases where you wrote down two words in the wrong order.

## Seed Phrase Versions

How Seed Doctor behaves depends on how many words your seed phrase has:

| Word Count | Seed Version | Recovery Notes |
|:---:|:---:|---|
| 24 | Legacy (no timestamp) | A placeholder word is appended internally before recovery begins |
| 25 | V1 | **Wallet address is required** — without it, recovery is not possible |
| 26 | V2 (with checksum) | Can recover without a wallet address, thanks to the built-in checksum |

## Limitations

- **One error at a time.** The tool can fix one wrong word *or* one adjacent swap, not both.
- **V1 seeds need an address.** If you have a 25-word seed and don't know the wallet address, recovery won't work.
- **Wrong passphrase = no recovery.** If the seed was protected with a passphrase and you enter the wrong one, the chance of recovery is effectively zero.
- **Experimental.** This feature is provided as-is. It covers the most common mistakes but can't handle heavily corrupted phrases.

## Tips for Successful Recovery

- **Always provide your wallet address** when you have it. This narrows the search down fast and works across all seed versions.
- **Double-check your passphrase** before running the tool. A wrong passphrase will make every candidate fail.
- If seed doctor doesn't find a match, try re-examining your written seed for any words that look ambiguous (e.g., "though" vs "through", "bard" vs "bird") and correct them manually before running it again.
