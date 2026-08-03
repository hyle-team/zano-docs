---
sidebar_position: 3
slug: /use/auditable-wallets
---

# Auditable Wallets

### What is an auditable wallet?

Auditable is the type of wallet that allows a 3rd party to see the balance and transaction history without permission to spend it or interact in any other way. Zano itself uses this feature for the [foundation fund](/docs/learn/emission#the-premine-and-how-zano-will-be-funded), so anyone can verify its balance at any time.

### How can I tell if a wallet is auditable?

It's a wallet with an address in a special format that starts with "aZx", for instance: aZxawtNNdH8CyS25PR7HseZwxPMdFiiDnD7w3wC8LbvNE3KbXTVsbRSTzKn1jW27fS1ySYhH77DeCYwMb6xKrevF3DzBr1cNGVv

### What is the purpose of auditable wallets?

Having an auditable wallet, you can allow someone to watch your balance and transaction history without giving them the right to spend your funds. This is useful for organizations, funds, and anyone who prefers "verify" over "trust". Enabling it for one wallet doesn't affect the privacy of anyone else on the network.

### Can I get an auditable address for my existing normal wallet?

No. You need to create a new auditable wallet and transfer your coins into it.

### How can I create an auditable wallet?

Using the simplewallet CLI application (see [Install a Zano CLI Wallet](/docs/use/wallets/install-zano-cli-wallet-ubuntu) if you don't have it):

```
>simplewallet --generate-new-auditable-wallet=my_auditable_wallet
Zano simplewallet v2.2.1.502[76a791c]
password: ***
Generated new AUDITABLE wallet: aZxawtNNdH8CyS25PR7HseZwxPMdFiiDnD7w3wC8LbvNE3KbXTVsbRSTzKn1jW27fS1ySYhH77DeCYwMb6xKrevF3DzBr1cNGVv
view key: a2cb567ff766fa92e1d3f8f48ed3bdd23a525fd71fca7dc2b57813ac835f0b0d
tracking seed:
aZxawtNNdH8CyS25PR7HseZwxPMdFiiDnD7w3wC8LbvNE3KbXTVsbRSTzKn1jW27fS1ySYhH77DeCYwMb6xKrevF3DzBr1cNGVv:a2cb567ff766fa92e1d3f8f48ed3bdd23a525fd71fca7dc2b57813ac835f0b0d:1785345370
**********************************************************************
Your wallet has been generated.
**********************************************************************
```

### Using an auditable wallet, how can I give someone the ability to track my balance and transaction history?

Give them the **tracking seed** for your auditable wallet. It is shown when the wallet is generated, and you can display it again at any time with the `tracking_seed` command in simplewallet:

```
>simplewallet --wallet-file my_auditable_wallet
Zano simplewallet v2.2.1.502[76a791c]
password: ***
Opened auditable wallet: aZxawtNNdH8CyS25PR7HseZwxPMdFiiDnD7w3wC8LbvNE3KbXTVsbRSTzKn1jW27fS1ySYhH77DeCYwMb6xKrevF3DzBr1cNGVv
[Zano wallet aZxawt]: tracking_seed
Auditable watch-only tracking seed for this wallet is:
aZxawtNNdH8CyS25PR7HseZwxPMdFiiDnD7w3wC8LbvNE3KbXTVsbRSTzKn1jW27fS1ySYhH77DeCYwMb6xKrevF3DzBr1cNGVv:a2cb567ff766fa92e1d3f8f48ed3bdd23a525fd71fca7dc2b57813ac835f0b0d:1785345370
Anyone having this tracking seed is able to watch your balance and transaction history, but unable to spend coins.
```

Technically, a tracking seed is the auditable address, the secret view key, and a creation timestamp joined with colons.

### I got a tracking seed. How can I track the wallet it is bound to?

Restore a wallet from the tracking seed the same way you restore a regular wallet from a seed phrase. In simplewallet:

```
>simplewallet --restore-wallet=tracking-wallet
Zano simplewallet v2.2.1.502[76a791c]
password: ***
please, enter wallet seed phrase or an auditable wallet's tracking seed: ***
Tracking wallet restored: aZxawtNNdH8CyS25PR7HseZwxPMdFiiDnD7w3wC8LbvNE3KbXTVsbRSTzKn1jW27fS1ySYhH77DeCYwMb6xKrevF3DzBr1cNGVv
**********************************************************************
Your wallet has been restored.
To start synchronizing with the daemon use "refresh" command.
**********************************************************************
```

Or in the GUI wallet, choose `Restore from backup` and paste the tracking seed instead of a seed phrase:

![alt auditable-wallets-gui-wallet](/img/use/wallet-features/auditablewallet.png "auditable-wallets-gui-wallet")

### Are there any restrictions on using auditable wallets?

Only one: transactions sent from an auditable wallet don't use decoys, so the audit trail stays fully verifiable. Regular Zano wallets use the protocol-enforced ring size of 15. This is a property of the auditable wallet only; it doesn't affect anyone else's privacy.

### Can I use integrated addresses with the auditable feature?

Yes. An integrated address for an auditable wallet can be generated as usual. Such addresses have the "aiZX" prefix.

### Can I mine PoS with my auditable wallet?

Yes, you can. Also, you can use a corresponding watch-only wallet to monitor your balance without the risk of leaking your spend key.
