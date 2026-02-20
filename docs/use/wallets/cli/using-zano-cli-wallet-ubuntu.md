---
sidebar_position: 5
slug: /use/wallets/using-zano-cli-wallet-ubuntu
---

# Using a Zano CLI Wallet

This guide assumes you've already [installed Zano and created a wallet](/docs/use/wallets/install-zano-cli-wallet-ubuntu).

## Starting up

Start the daemon in one terminal:

```bash
./zanod
```

Once it's synced, open a second terminal and launch your wallet:

```bash
./simplewallet --wallet-file name.wallet
```

Enter your password when prompted. The wallet will display your receive address after "Opened wallet."

![Open an existing wallet](/img/use/using-zano-cli-wallet-ubuntu/usage-open-wallet.png)

To close the wallet cleanly, use the `exit` command. The daemon can be left running.

## Checking your balance

If you've received funds but they aren't showing, resynchronize:

```
refresh
```

To see your balance:

```
balance
```

To see balances for all assets (ZANO, confidential assets, etc.):

```
balance raw
```

![Check balance](/img/use/using-zano-cli-wallet-ubuntu/usage-balance.png)

## Sending ZANO

The `transfer` command takes a mixin count, destination address, and amount:

```
transfer <mixin_count> <address> <amount>
```

- **mixin_count**: the number of decoy outputs mixed with yours for privacy. Use **15** for standard wallets, **0** for auditable wallets.
- **address**: the recipient's Zano address (starts with `Zx` or `aZx`)
- **amount**: the amount of ZANO to send

Example — send 10 ZANO:

```
transfer 15 ZxD4wSgHgE5TRVHQRbPKNthSpNSJoQp6DPLNaL4f3YT5dDQarAEHB2bVroPWhkCD59GDfVDjBBHmgLd2M1P92h5c21KwPZqg 10
```

You can send to multiple recipients in one transaction:

```
transfer 15 <address_1> <amount_1> <address_2> <amount_2>
```

An optional **payment_id** can be appended at the end for services that require it.

![Send ZANO](/img/use/using-zano-cli-wallet-ubuntu/usage-transfer.png)

### Sending assets

To send a confidential asset other than ZANO, prefix the address with the asset ID:

```
transfer 15 <asset_id>:<address> <amount>
```

## Receiving ZANO

Your receive address is shown when the wallet opens, or at any time with:

```
address
```

To generate an integrated address with an embedded payment ID (useful for exchanges or services):

```
integrated_address
```

Or with a specific payment ID:

```
integrated_address <payment_id>
```

## Transaction history

View recent transactions (last 100 by default):

```
list_recent_transfers
```

With offset and count:

```
list_recent_transfers <offset> <count>
```

Export transaction history to CSV:

```
export_history
```

Export recent transfers as JSON:

```
export_recent_transfers
```

## Restoring a wallet from seed

If you've lost your wallet file or password, you can restore it using your seed phrase.

Start the daemon, then in another terminal:

```bash
./simplewallet --restore-wallet name.wallet
```

You'll be prompted to create a password for the restored wallet file, then enter your seed phrase. Current wallets use 26-word seeds; older wallets may have 24 or 25 words. If the seed was secured with a [passphrase](/docs/use/seed-phrase#passphrase), you'll need that too.

![Restore wallet from seed](/img/use/using-zano-cli-wallet-ubuntu/usage-restore-wallet.png)

If your seed phrase has a typo or swapped words, try the [Seed Doctor](/docs/use/wallets/seed-doctor) tool:

```bash
./simplewallet --seed-doctor
```

## Auditable wallets

Zano wallets are private by default — no third party can see balances or transactions on the blockchain. An **auditable wallet** lets a third party see your balances and transactions (e.g., for a public foundation or compliance).

For more details, see the [Auditable Wallets](/docs/use/auditable-wallets) page.

### Create an auditable wallet

```bash
./simplewallet --generate-new-auditable-wallet name.wallet
```

Set a password when prompted. Note that auditable wallet addresses start with `aZx` (standard wallets start with `Zx`).

![Create an auditable wallet](/img/use/using-zano-cli-wallet-ubuntu/usage-auditable-wallet.png)

### Get the tracking seed

Open the auditable wallet and run:

```
tracking_seed
```

Share this tracking seed with anyone who needs to audit the wallet. They can restore a read-only copy using `--restore-wallet` and entering the tracking seed instead of a seed phrase.

![Get tracking seed](/img/use/using-zano-cli-wallet-ubuntu/usage-tracking-seed.png)

### Back up the seed phrase

Just like a standard wallet:

```
show_seed
```

## Watch-only wallets

A watch-only wallet lets someone view your wallet without being able to spend from it. Open the wallet you want to create a watch-only copy of, then:

```
save_watch_only <filename> <password>
```

Example:

```
save_watch_only mywallet_watchonly.wallet mypassword
```

## PoS staking

You can stake ZANO directly from the CLI wallet by launching it with the `--do-pos-mining` flag:

```bash
./simplewallet --wallet-file name.wallet --do-pos-mining
```

To send staking rewards to a different address:

```bash
./simplewallet --wallet-file name.wallet --do-pos-mining --pos-mining-reward-address <address>
```

For an automated staking setup with PM2, see [Stake Zano on Boot](/docs/stake/advanced-setup/stake-zano-on-boot).

![PoS staking](/img/use/using-zano-cli-wallet-ubuntu/usage-staking.png)

## Command-line flags

These flags are passed when launching simplewallet.

| Flag | Description |
|------|-------------|
| `--wallet-file <file>` | Open an existing wallet |
| `--generate-new-wallet <file>` | Create a new standard wallet |
| `--generate-new-auditable-wallet <file>` | Create a new auditable wallet |
| `--restore-wallet <file>` | Restore a wallet from seed phrase or tracking seed |
| `--password <pass>` | Supply wallet password (skip interactive prompt) |
| `--daemon-address <host>:<port>` | Connect to a specific daemon (local or [public node](/docs/build/public-nodes)) |
| `--offline-mode` | Don't connect to the daemon (for [cold-signing](/docs/build/exchange-guidelines/signing-transactions-offline)) |
| `--do-pos-mining` | Enable PoS staking |
| `--pos-mining-reward-address <addr>` | Send staking rewards to a different address |
| `--rpc-bind-port <port>` | Run wallet as an RPC server on this port |
| `--rpc-bind-ip <ip>` | Bind RPC server to this IP (default: 127.0.0.1) |
| `--jwt-secret <secret>` | Enable JWT authentication for RPC |
| `--disable-tor-relay` | Disable Tor relay (may help if Tor network is down) |
| `--seed-doctor` | Attempt to recover a broken seed phrase (see [Seed Doctor](/docs/use/wallets/seed-doctor)) |
| `--derive_custom_seed` | Derive a seed from custom 24 words (advanced) |
| `--no-refresh` | Don't sync the wallet on startup |
| `--log-file <path>` | Set log file location |
| `--log-level <0-4>` | Set log verbosity |
| `--deaf` | Ignore all RPC commands (safe PoS mining mode) |
| `--command <cmd>` | Execute a wallet command non-interactively |

## In-wallet commands

These commands are used inside the wallet console after opening.

| Command | Description |
|---------|-------------|
| `address` | Show wallet public address |
| `balance` | Show balance (`balance raw` for all assets) |
| `refresh` | Resynchronize transactions and balance |
| `resync` | Reset all transfers and re-synchronize from scratch |
| `save` | Save wallet state |
| `exit` | Close the wallet |
| `help` | Show all available commands |
| `transfer` | `transfer <mixin> <addr> <amount> [payment_id]` |
| `list_recent_transfers` | `[offset] [count]` — show recent transactions (max 1000) |
| `list_outputs` / `lo` | `[spent\|unspent] [ticker=ZANO]` — list UTXOs |
| `show_seed` | Display seed recovery phrase (26 words for current wallets) |
| `spendkey` | Display secret spend key |
| `viewkey` | Display secret view key |
| `tracking_seed` | Display tracking seed (auditable wallets) |
| `save_watch_only` | `<file> <password>` — export a watch-only wallet |
| `integrated_address` | `[payment_id]` — generate or decode an integrated address |
| `show_staking_history` | `[days]` — show PoS staking rewards |
| `export_history` | Export transaction history to CSV |
| `export_recent_transfers` | Export recent transfers as JSON |
| `sweep_below` | `<mixin> <address> <amount_limit> [payment_id]` — consolidate small outputs |
| `sweep_bare_outs` | Transfer all bare (non-ZC) outputs to self |
| `set_log` | `<level>` — change log verbosity (0-4) |
| `deploy_new_asset` | `<json_file>` — deploy a new confidential asset |
| `emit_asset` | `<asset_id> <amount>` — mint more of an asset you own |
| `burn_asset` | `<asset_id> <amount>` — burn asset tokens |
| `check_all_tx_keys` | Verify one-time secret keys for all sent transactions |
