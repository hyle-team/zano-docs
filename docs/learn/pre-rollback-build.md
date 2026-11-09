---
sidebar_position: 7
sidebar_label: Pre-Rollback Build
description: How to prove funds lost in the September 2026 chain rollback with a wallet snapshot from the Pre-Rollback Build, exactly what the snapshot reveals, and how to limit the privacy cost.
---

# Pre-Rollback Build and Wallet Snapshots

In September 2026 the Zano blockchain was rolled back to undo an attack. About a month of transactions was removed from the chain, and some users lost funds they had received during that time. We are reimbursing those losses. Because Zano hides who owns what, we needed a special tool that lets you prove your loss without handing over your private keys: the **Pre-Rollback Build** of the Zano wallet and the **wallet snapshot** it creates.

This page explains why the tool exists, exactly what information a snapshot reveals, how to decide whether to share one, and how to create and submit it.

:::tip In short
- If funds you **received** between 26 August and 27 September 2026 disappeared after the rollback, you may be eligible for reimbursement.
- If those funds came from an exchange or another service, they are most likely already covered. Check with the service first.
- To claim, you create a wallet snapshot with the Pre-Rollback Build and send it to us. The snapshot contains your secret **view** key, never your seed phrase or spend key.
- Sharing it has a real, permanent privacy cost for that wallet. Read [What a snapshot reveals](#what-a-snapshot-reveals) before deciding. We recommend moving your funds to a brand-new wallet first.
:::

## What happened

On 25 September 2026 we discovered a vulnerability in the Gateway Addresses feature introduced by Hard Fork 6. An attacker had been exploiting it since late August to create ZANO and fUSD that should never have existed. The only way to remove that illegitimate supply was to roll the chain back to block 3,833,000, the height at which Hard Fork 6 activated, produced on 26 August 2026 at 15:50 UTC. The emergency release v2.2.3.600 did this on 27 September 2026.

Blocks 3,833,001 to 3,878,977, which we call the **rollback window**, are no longer part of the Zano blockchain. Every transaction in them was undone:

- Funds you **received** during the window disappeared from your wallet.
- Funds you **sent** during the window returned to your wallet, and the recipient lost them.
- Other outputs created in the window, such as staking rewards, no longer exist either.

The full timeline and technical details are in the [September and October 2026 project update](https://blog.zano.org/zano-monthly-project-update-24-september-october-2026/) and the [v2.2.3.600 release notes](https://github.com/hyle-team/zano/releases/tag/2.2.3.600). Which losses are reimbursed, and how, is described in our official announcements. This page only covers how to prove what your wallet held.

{/* maintainers: link the reimbursement-policy announcement in the paragraph above once it is published. */}

## Why a special tool is needed

On a transparent blockchain we could simply look at the old chain, see who received what during the window, and pay them back. Zano is private by default: addresses, amounts and asset types are hidden on chain, and that includes being hidden from us. Nobody but the owner of a wallet can tell which outputs belong to it.

The straightforward solution would be to ask you for your wallet's private keys. We will never do that, and you should never give them to anyone. Instead we built the Pre-Rollback Build: a special version of the Zano wallet (the v2.2.2.518 series) that connects to a frozen copy of the pre-rollback chain kept on a node we run, and that can export a **wallet snapshot**. A snapshot is a small file that proves, cryptographically, which outputs your wallet owned in the rollback window and whether they were spent, without revealing your spend key and without giving anyone the ability to spend your funds.

On our side, a node that still holds the pre-rollback chain checks the snapshot. It does not take the file's word for anything: it re-derives your wallet's outputs, amounts and spends from the chain itself and produces a report of your wallet's movements in the window. We then cross-check the report against transactions that exchanges and services have already reimbursed, and against funds that originated from the exploit itself, and process your reimbursement.

Both the exporting wallet and the verifying node are open source, in the `rollback` branch of the [Zano repository](https://github.com/hyle-team/zano/tree/rollback), so anyone can check what a snapshot contains and how it is verified.

## What is in a snapshot

The snapshot is a plain-text JSON file named `<your-address>.snapshot-json`, where `<your-address>` is your wallet's public address. You can, and should, open it in any text editor before sending it. It contains three things:

| Field             | What it is                                                                                                                                                                                                                                                                                                                                                                                                             |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `address`         | Your wallet's public address.                                                                                                                                                                                                                                                                                                                                                                                          |
| `view_secret_key` | Your wallet's **secret view key**.                                                                                                                                                                                                                                                                                                                                                                                     |
| `outputs`         | The list of outputs (the "coins" your wallet received) that are in scope, see below. Each entry has the output's position on the chain (`gindex` and `index`), its amount if it is an old non-confidential output (`bare_amount`, which is 0 for confidential outputs), its **key image** (`ki`), and a proof (`kiss`) that the key image really belongs to that output. |

What is **not** in it: your seed phrase, your secret spend key, your wallet password, your contacts, your transaction comments, or any other wallet data. The tool has to run on a spendable wallet, because computing the key images and proofs requires the spend key, but the spend key is only used on your computer and is never written to the file.

**Which outputs are in scope.** Outputs your wallet received inside the rollback window, plus older outputs that transactions in the window referred to, either because you spent them then or because somebody else's transaction used them as decoys. Outputs outside this set are left out entirely. This is deliberate: it keeps the exposure as small as the verification allows, and it is the reason a snapshot usually cannot reveal your full balance.

## What a snapshot reveals

When you create a snapshot, the wallet shows this warning. It is accurate, so we repeat it here:

> This snapshot will contain your wallet's secret VIEW key and a filtered subset of its outputs (limited to the pre-rollback window), together with the key images for those outputs. It is a partial record and may or may not be enough to reconstruct the wallet's full balance, depending on the actual UTXO distribution. Anyone with this file can see this wallet's past and future incoming transactions and trace the listed outputs' spends — keep it private and share it only with a party you trust.

In more detail, anyone who holds your snapshot can learn:

- **Every incoming transaction of this wallet, past and future.** The secret view key lets its holder recognize every output ever sent to your address and decrypt its amount and asset type. This covers the wallet's whole history, not only the rollback window, and it keeps working for anything the address receives in the future. The view key does **not** allow spending, and on its own it does not show what you spent or whom you paid.
- **Whether and when the listed outputs were spent.** For each output in scope, its key image shows whether it was spent, when, and in which transaction. This holds on the pre-rollback chain and, for outputs that also exist on the current chain (those received before the window), on the current chain as well, now and in the future. A spend reveals the fact, the time and the transaction ID, never the recipient. Because the view key also shows any change that came back to your wallet, the holder can often work out how much that transaction sent.
- **Usually not your balance.** Your balance is everything received minus everything spent. The snapshot only reveals spends for outputs in scope, so for most wallets the holder cannot tell whether your older outputs are still unspent and cannot compute the balance. Our report therefore shows only a "partial balance", a lower bound restricted to the window. Keep two exceptions in mind: the view key reveals the *total* your wallet has ever received, which is an upper bound on the balance, and if every output your wallet ever received is in scope (for example a wallet created and funded inside the window), its full balance is effectively visible.

The node we verify with produces a text report containing: your address, the number of outputs, whether the snapshot is valid, and, for each asset, the partial balance at the start and at the end of the window, the amounts received and spent inside the window, and a list of movements with time, block height, direction (received or spent), amount, asset and transaction ID. These are the facts we use to process your reimbursement.

One more thing to know: while the Pre-Rollback Build synchronizes, it downloads blocks from our node and scans them on your computer. Your keys are not sent to the node, but like any remote node it sees your IP address.

## Decide consciously

:::warning Your privacy is yours to give
Sending us a snapshot means sharing the secret view key of that wallet. This cannot be undone: whoever holds the key can see that address's incoming transactions forever. We will treat your snapshot as sensitive data, limit access to it to the people handling reimbursements, and use it for nothing else. But you have to be comfortable with this trade-off. If you are not, do not submit a snapshot.
:::

{/* maintainers: confirm that the data-handling statement above (who has access, retention) matches the actual policy. */}

If you want to claim but want extra assurance, do what the wallet itself recommends, and do it **before** making the snapshot:

1. Install the latest official Zano wallet (v2.2.3.603 or newer) from [zano.org/wallets](https://zano.org/wallets) and [verify the download](/docs/use/download-verification).
2. Create a **brand-new wallet**, with a new seed phrase, on the current chain.
3. Send everything the affected wallet holds to the new one.
4. Only then open the affected, now empty, wallet in the Pre-Rollback Build and make the snapshot.

The wallet you expose then holds nothing, and as long as you stop handing out its address it will never receive anything again, so the view key you share can only ever show the past. Moving your funds does not affect the snapshot: it is taken from the frozen pre-rollback chain, where your old wallet's history is unchanged.

:::danger Never share your seed phrase or spend key
Nobody from the Zano team will ever ask you for your seed phrase, your secret spend key or your wallet password, not for this process and not for anything else. The snapshot file is the only thing we need. Download the Pre-Rollback Build only from the official link on this page and [verify it](/docs/use/download-verification). See [Reporting issues](/docs/use/reporting-issues) for the scam patterns we know about.
:::

## Check first: you may already be covered

We have worked directly with the exchanges and other services affected by the rollback and reconciled their users' balances with them. If the funds you lost were a deposit to, or a withdrawal from, an exchange or another service, your case is most likely already handled on their side. Contact that service's support first. You probably do not need a snapshot at all.

A snapshot is meant for losses no service can see: funds you received directly from another person or business into your own wallet during the rollback window.

## Step by step

### 1. Move your funds to a new wallet (recommended)

See [Decide consciously](#decide-consciously) above. Do this first.

### 2. Install the Pre-Rollback Build

Download it from the official link below and [verify the download](/docs/use/download-verification).

{/* maintainers: add the official download link for the Pre-Rollback Build (v2.2.2.518 series) here. */}

A few things to know about this build:

- It is a separate application that keeps its own settings and logs in its own folder (named `Zano_rollback`), so your regular Zano wallet installation is not touched.
- It does not run a node of its own and does not download the blockchain database. By default it connects to the node we run with the frozen pre-rollback chain.
- It never modifies your original wallet file. When you open a wallet, it works on a copy placed next to the original and named `<wallet-file>.hf6-pre-rollback`.
- It is only meant for making snapshots. Do your everyday transactions with the regular wallet.

### 3. Open the affected wallet and let it sync

Close the regular Zano wallet first if it has the same wallet file open. In the Pre-Rollback Build, open the wallet file you were using during the rollback window (with your usual password), or restore the wallet from its seed phrase. The build performs a full rescan of that wallet against the pre-rollback chain, which can take a long time, up to several hours for an old wallet. Wait until it is fully synchronized. The snapshot cannot be created before that.

### 4. Create the snapshot

In the wallet view, click **Make snapshot**. The button is next to your address at the top of the wallet page, and also in the wallet's menu. Read the disclaimer, tick **I understand and agree**, click **Make snapshot** and choose where to save the file. The file name is fixed to `<your-address>.snapshot-json`; only the folder can be chosen. A progress bar shows the scan, and you can cancel at any time. When it finishes, the dialog shows the location of the file.

Command-line users can do the same with the `simplewallet` from the Pre-Rollback Build. Point it at the pre-rollback node, wait for the wallet to sync, then run `make_hf6_snapshot`. The file is written next to the wallet file:

```text
simplewallet --wallet-file <your-wallet-file> --daemon-address 157.180.54.169:4499
[wallet]: make_hf6_snapshot
```

{/* maintainers: confirm that the node address above may be published, or replace it with a hostname. */}

### 5. Review the file

Open the file in a text editor. It should contain only `address`, `view_secret_key` and `outputs`, as described above, and the address should be your own. If anything else is in it, do not send it and contact support.

### 6. Send it to us

Open a support ticket at [zano.org/support](https://zano.org/support), attach the snapshot file, and describe what you lost: which transactions, amounts and assets you received in the rollback window, as far as you know them. Do not post the file anywhere public, do not send it over chat, and do not send it to anyone who contacts you first.

{/* maintainers: confirm the submission channel above (support ticket) and add a deadline if there is one. */}

### 7. What happens next

Our node verifies the snapshot against the pre-rollback chain and produces the report described above. Only a report that passes every check is used. We cross-check its transactions against those already reimbursed by exchanges and services, and against funds that came from the exploit, and then contact you through your ticket about the reimbursement.

## Troubleshooting and FAQ

**The wallet says the snapshot requires a fully synced wallet.** Wait for the synchronization to reach 100% and try again. If it never finishes, restart the Pre-Rollback Build; if that does not help, contact support.

**I only have a watch-only wallet, or an auditable wallet restored from its tracking seed.** A snapshot needs the spendable wallet, because computing the proofs requires the spend key. Restore the wallet from its seed phrase in the Pre-Rollback Build.

**My wallet holds multisig outputs.** Multisig outputs are not supported by the verifier, and the snapshot of such a wallet would be rejected. Contact support instead.

**My wallet was created after the rollback.** Then it received nothing in the rollback window and there is nothing to prove.

**Can I see what the report will say?** Not exactly, because the report is produced by our node against the pre-rollback chain. But you can see everything you are sharing: open the snapshot file. The report never contains more than what can be derived from that file and the public chain.

**Does the snapshot let you spend my funds?** No. It contains no spend key, and the proofs in it cannot be turned into one.

**Why can't I just send transaction IDs or screenshots?** Because they prove nothing: anyone could claim any transaction. The proofs in a snapshot can only be produced by the wallet that owns the outputs.

**Does making a snapshot change my wallet?** No. The Pre-Rollback Build works on a copy of your wallet file and only reads the chain.

## How it works, technically

For the curious, here is what makes a snapshot both verifiable and limited.

Every output on Zano has a one-time public key `P`, and the owner's wallet is the only one that can compute the matching secret `x`, because doing so needs the spend key. From `x` the wallet derives the output's key image `KI`, the value that appears on chain when the output is spent. A view key can recognize outputs and decrypt their amounts, but it cannot compute key images, which is why it cannot see spends or balances.

The snapshot adds, for every output in scope, its key image and a Chaum-Pedersen proof that `KI` and `P` are derived from the same secret `x`, without revealing `x`. The proof is bound to your address keys and to the output's position on chain, so it cannot be reused for another output or another address.

Our verifying node then:

1. checks that the view key matches the address;
2. rescans the whole pre-rollback chain with the view key to find every output the wallet owns, applies the same scope rule as the wallet, and requires the two sets to match exactly: an owned output missing from the file, or a listed output the wallet does not own, makes the snapshot invalid;
3. for every output, checks that `P` and `KI` are valid points in the main subgroup of the curve and verifies the proof against the on-chain `P`;
4. looks each verified key image up in its own index of spent key images to find whether, when and in which transaction the output was spent;
5. takes all amounts and asset IDs from the chain, decrypted with the view key, never from the file.

The report's partial balances count an output as unspent at a given height when it was created before that height and not spent before it, restricted to the outputs in scope. They are therefore lower bounds on the real balance, while the amounts received and spent inside the window are exact.

## We are sorry

We know that an attack and a rollback are the last things you expect from a project whose whole purpose is to keep your funds and your privacy safe. We are sorry for the losses, for the uncertainty, and for the time this process costs you. We are also sorry that making it right requires asking some of you to give up part of your privacy. We have tried to keep that cost as small as the verification allows and to be completely transparent about it on this page. Thank you for your patience and for staying with Zano. If anything here is unclear, open a ticket at [zano.org/support](https://zano.org/support) and we will help.
