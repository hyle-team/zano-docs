---
sidebar_position: 1
---

# Exchange integration full guide

## Introduction

Zano is a privacy-oriented blockchain from the CryptoNote family, which makes working with the wallet somewhat different from traditional blockchains like Bitcoin or Ethereum. In this article, we will show how to work with the wallet and how to build multi-user custody on it.

Architecturally, Zano consists of two modules - a **full node(daemon)** and a **wallet**. Both of these modules provide their own RPC API. Therefore, when you set up Zano on your server, you compile the **full node** (make target “**daemon**”, executable name **zanod**) and the console wallet (**simplewallet**), and run both, so that the wallet can connect to the full node through the RPC API via localhost (For security reasons, it is highly recommended to use ONLY your own full node).

<u>Recommended security practice</u>: run the wallet process (simplewallet) on an internal host that **has no Internet connectivity**. The only outbound connection this host should make is to the full‑node RPC service (zanod, port 11211 by default). Keeping the machine that holds your private keys completely isolated from the public network greatly reduces your attack surface and provides a markedly more secure setup.

Thus, the RPC API in Zano is divided into two parts - the DAEMON RPC API and the WALLET RPC API. This is due to the fact that, unlike EVM or Bitcoin networks, you cannot simply request the balance of a specific address from the Zano node. To get the balance of a specific address, you need to know its secret key and perform computationally complex operations. Therefore, there is a process of synchronizing the wallet with the daemon. If you have a wallet created, for example, a year or two ago and you haven't opened it for a long time or have restored it, the synchronization process may take some time. If the wallet was online a few days ago, the synchronization happens quickly - less than a minute.

Zano is a platform where anyone can deploy their own asset, which will have the same privacy features as Zano itself. Such assets are called **Confidential Assets**. Support for Confidential Assets is reflected in the API documentation and in this manual. Each asset has an identifier (**asset_id**), and only this asset_id identifies this specific asset. All other attributes of the asset may match similar attributes of other assets.

Note: All critical updates are posted in this telegram chat, if you run custody or any other service that involves Zano software, please subscribe to it and do not mute it: https://t.me/+LZvLUpbyrukwYzk6





## Hardware requirements

Zano is a privacy blockchain, so both the daemon and the wallet carry a heavy computation load (cryptographic proofs, ring signatures, wallet-side scanning). To minimize issues, we recommend the following minimum specs for a custody host:

- **RAM:** 16 GiB, plus 16 GiB of swap.
- **CPU:** 4 cores.
- **Drive:** SSD. Do **not** use a spinning HDD or a network-mapped/remote drive; both lead to severe slowdowns and synchronization problems.

## Custom transaction generation process and TSS
Some exchanges and custody services use their own frameworks for working with cryptocurrencies, which require manually constructing transactions. This approach generally works well for non-privacy blockchains such as Ethereum or Bitcoin with regular ECDSA signatures, but it can be extremely challenging with Zano. As a privacy coin, a Zano transaction includes a sophisticated set of proofs and signatures that secure it. As far as we are aware, there are no complete implementations of the Zano transaction-generation process and its proofs in languages other than the C++ reference implementation used in the official wallet codebase. If, for any reason, you still want to implement a manual process for creating Zano transactions, please review the following materials to understand the mathematics behind these proofs: 

* Original CryptoNote protocol description(basic concepts of ring signatures and ephemeral keys) https://github.com/hyle-team/docs/blob/master/arch/cryptonote_wp_v2.0.pdf
* Zano original whitepaper(describes the way the payload is encrypted in a tx) https://github.com/hyle-team/docs/blob/master/zano/Zano_WP_latest.pdf
* Extension of CLSAG that is used in Zano signatures:  https://github.com/hyle-team/docs/blob/master/zano/dv-CLSAG-extension/dv-CLSAG-extension.pdf
* RingCT and Confidential Assets: https://github.com/hyle-team/docs/blob/master/zano/CA_paper/Zano_CA_for_RingCT_and_Zarcanum_v1.1.pdf
* [optional] Confidential PoS:  https://github.com/hyle-team/docs/blob/master/zano/PoS_with_Hiden_amounts_Zarcanum/Zarcanum-PoS-with-hidden-amounts.pdf


## Creating a Wallet

To create a new wallet, you need to run the following command (you will be prompted to enter a new password for the wallet; do not use simple passwords and make sure to remember this password):

```
~/zano/build # src/simplewallet --generate-new-wallet=custody_wallet.zan
Zano simplewallet v2.2.1.501
password: *******
Generated new wallet: ZxCk74TxaFsRvbHrvebi5fgBLXDWukJ3VRXk6PENQ4orUTRfh11EHjCgCBxokeg5FEPHumvqJ76ikKHnD43iGjsE1cVfgebFa
view key: f665686bbc719569e9f6c1e36058dcda011ddd55a584443b64c1e7bca5bbdd04
**********************************************************************
Your wallet has been generated.
**********************************************************************
```

A wallet can operate in two modes - command line interface mode, when it is started only with the **--wallet-file** parameter, or RPC server mode, when in addition it has the **--rpc-bind-port=port_number** parameter. When the wallet is in command line mode, you can run various commands to it, such as **transfer** or **deploy_new_asset**, and thus work with the wallet. You can view the list of commands by typing **help** in command line mode.

### Creating a Wallet from custom seed phrase
If you want to generate private keys from manually chosen words, you can pick 24 words from the list of words in this ([source file](https://github.com/hyle-team/zano/blob/master/src/common/mnemonic-encoding.cpp)) (keep in mind that these words are not compatible with bip39). Then you can use simplewallet to extend this seed to standard Zano seed phrase by using "--derive_custom_seed" command line option:

```
~/zano/build # src/simplewallet --derive_custom_seed
```
    

## Seed phrase backup

After you have created a new wallet, run it in command line mode to save the seed phrase:
```
src/simplewallet --wallet-file=custody_wallet.zan
Zano simplewallet v2.2.1.501
password: *******
Opened wallet: ZxCk74TxaFsRvbHrvebi5fgBLXDWukJ3VRXk6PENQ4orUTRfh11EHjCgCBxokeg5FEPHumvqJ76ikKHnD43iGjsE1cVfgebFa
**********************************************************************
Use "help" command to see the list of available commands.
**********************************************************************
Starting refresh...
Refresh done, blocks received: 1440
 balance unlocked      / [balance total]        ticker   asset id
 0.0                                            ZANO     d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a
 [Zano wallet ZxCk74]:
```

After the wallet has synchronized, enter the command **show_seed**. First, the wallet will ask for its own password for security reasons (the one you specified when creating the wallet). After this, you will be prompted to enter a special password that will protect your seed phrase. ([More about Secure Seed](/docs/use/seed-phrase/)) If you leave this password empty, an unprotected seed phrase will be generated, and anyone who gains access to the seed phrase will be able to control all assets.

```
[Zano wallet ZxCk74]: show_seed
Enter password to confirm operation:
*****
Please enter a password to secure this seed. Securing your seed is HIGHLY recommended. Leave password blank to stay unsecured.
Remember, restoring a wallet from Secured Seed can only be done if you know its password.
Enter seed password: **********
Confirm seed password: **********
heart eat cost little goodbye arrive commit dreamer stick  reason freeze left okay cousin frustrate certainly focus town proud chin stretch difference easily content couple land
[Zano wallet ZxCk74]:
```

!!! Be sure to save this seed phrase in a secure place. If the seed phrase is lost, the wallet may become impossible to restore, and all assets may be lost.

Once you’ve backed up your seed phrase, you can launch the wallet in server mode for future operations:

```
src/simplewallet --wallet-file=custody_wallet.zan --rpc-bind-port=12345 --daemon-address=192.168.1.3:11211
```

## Receiving Money with Payment ID

Each wallet file in Zano is always one address and one secret key (in fact, there are two secret keys, but this is not important in the context of this manual). Zano does not support HD wallets for a number of technical reasons. Instead, for multi-user support, a so-called **payment ID** (PID) is used, which is an arbitrary identifier associated with a payment. An incoming transaction may contain different outputs associated with different payment IDs, and thus, corresponding funds are credited to balances of corresponding users. Since ver. 2.2 a payment ID is an 8-byte random number generated by an exchange or service. Technically, its max size used to be 128 bytes, but now the default is 8 bytes. Before HF6 only one payment ID could be used within a transaction; after HF6 activation a single transaction may carry multiple PIDs (different payment IDs and assets per output); s.a. [HF6 migration guide](/docs/build/exchange-guidelines/HF6-migration-guide) for details.

**IMPORTANT**: Users should never "operate" their payment ID anywhere under any circumstances. Instead, an **integrated address** is used: a special address format that encodes the user's payment ID along with the base wallet address, eliminating errors or typos. To generate an integrated address, you can use the WALLET RPC API [make_integrated_address](/docs/build/rpc-api/wallet-rpc-api/make_integrated_address/) (similar API present in daemon [get_integrated_address](/docs/build/rpc-api/daemon-rpc-api/get_integrated_address) ):

```json
   Request:
    {
     "id": 0,
     "jsonrpc": "2.0",
     "method": "make_integrated_address",
     "params": {
       "payment_id": "1dfe5a88ff9effb3"
     }
    }

   Response:
    {
     "id": 0,
     "jsonrpc": "2.0",
     "result": {
       "integrated_address": "iZ2EEMZWeKBRvbHrvebi5fgBLXDWukJ3VRXk6PENQ4orUTRfh11EHjCgCBxokeg5FEPHumvqJ76ikKHnD43iGjsECvV53PeAEkM3CLGRmST3",
       "payment_id": "1dfe5a88ff9effb3"
     }
    }
```

An address that starts with a lowercase letter "i" is an **Integrated Address**. It is always longer than a regular address and looks something like this: "iZ2EEMZWeKBRvbHrvebi5fgBLXDWukJ3VRXk6PENQ4orUTRfh11EHjCgCBxokeg5FEPHumvqJ76ikKHnD43iGjsECvV53PeAEkM3CLGRmST3". Only such an address can be shown to the user as their own deposit address. Transactions sent to this address will always have the payment ID specified when creating the address.
Note: if **payment_id** parameter is empty or missing when calling [make_integrated_address](/docs/build/rpc-api/wallet-rpc-api/make_integrated_address/), random 8 bytes will be generated instead. Please use this feature with caution, since it might not be safe to use without potential collision verification (i.e. check every newly generated PID against existing users).

## Processing Incoming Transactions

There are several ways to get information about transactions for a Zano wallet. We will review the most convenient one and also mention other legacy approaches at the end.

The main method for obtaining transaction history information is [get_recent_txs_and_info3](/docs/build/rpc-api/wallet-rpc-api/get_recent_txs_and_info3/). In the example below, we removed information that is excessive and irrelevant to this article from the response and left only those fields that are essential for processing custody.

```json
Request:​
{
 "id": 0,
 "jsonrpc": "2.0",
 "method": "get_recent_txs_and_info3",
 "params": {
   "count": 2,
   "exclude_mining_txs": false,
   "exclude_unconfirmed": true,
   "offset": 0,
   "order": "FROM_END_TO_BEGIN",
   "update_provision_info": true
 }
}
Response:​
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "last_item_index": 1,
    "pi": {
      "balance": 12000000000000,
      "curent_height": 89513,
      "transfer_entries_count": 3,
      "transfers_count": 2,
      "unlocked_balance": 12000000000000
    },
    "total_transfers": 2,
    "transfers": [{
      "comment": "",
      "employed_entries": {
        "receive": [{
          "amount": 1000000000000,
          "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
          "index": 0,
          "payment_id": 0
        }]
      },
      "fee": 10000000000,
      "height": 89485,
      "is_mining": false,
      "is_mixing": false,
      "is_service": false,
      "show_sender": false,
      "subtransfers_by_pid": [{
        "payment_id": "",
        "subtransfers": [{
          "amount": 1000000000000,
          "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
          "is_income": true
        }]
      }],
      "timestamp": 1783427677,
      "transfer_internal_index": 0,
      "tx_blob_size": 3206,
      "tx_hash": "62792c3f629797d00b176e1b3561fbf57773a8857e746f5836cccbd93910a353",
      "tx_type": 0,
      "unlock_time": 0
    },{
      "comment": "",
      "employed_entries": {
        "receive": [{
          "amount": 137,
          "asset_id": "455f7a84e0ac8886c3c1fcf64411f8e9901642593b1e07f8ece4b81f51c04267",
          "index": 1,
          "payment_id": 4408250233360810730
        },{
          "amount": 11000000000000,
          "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
          "index": 2,
          "payment_id": 1146447202350282245
        }]
      },
      "fee": 10000000000,
      "height": 89474,
      "is_mining": false,
      "is_mixing": false,
      "is_service": false,
      "show_sender": false,
      "subtransfers_by_pid": [{
        "payment_id": "0536d409a8ffe80f",
        "subtransfers": [{
          "amount": 11000000000000,
          "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
          "is_income": true
        }]
      },{
        "payment_id": "ea0281383b402d3d",
        "subtransfers": [{
          "amount": 137,
          "asset_id": "455f7a84e0ac8886c3c1fcf64411f8e9901642593b1e07f8ece4b81f51c04267",
          "is_income": true
        }]
      }],
      "timestamp": 1783427483,
      "transfer_internal_index": 1,
      "tx_blob_size": 7012,
      "tx_hash": "66741c8259538a7053e1d1dbc8604c0b6e4983de1376bbd5fc7537f2530da2bc",
      "tx_type": 0,
      "unlock_time": 0
    }]
  }
}
```

You can read the transaction feed either from the oldest to the most recent (set "**order**" to "**FROM_END_TO_BEGIN**"), or vice versa - from the most recent to the oldest (set "**order**" to "**FROM_BEGIN_TO_END**"). Generally, when doing custody, you read the transaction feed from the wallet starting from the oldest transactions and read the entire history to the most recent transactions. To do this, set the "**order**" field in the request to "**FROM_END_TO_BEGIN**". If the response returns fewer elements than the "count" specified in the request (in our example, this is 100), it means that you have read the entire transaction history from end to the most recent transactions. If not, you need to continue calling [get_recent_txs_and_info3](/docs/build/rpc-api/wallet-rpc-api/get_recent_txs_and_info3/) in such a way that each subsequent call passes the "**offset**" value, which indicates how many elements have already been read from the feed (if using the **FROM_END_TO_BEGIN** mode, you can also use the value from the "**transfer_internal_index**" field in the most recent element of the "transfers" array). Keep in mind that the number of transactions you count as transfers to users may differ from the total number of transactions read due to some transactions that you may decide to ignore as non-legit.

The list of transactions is in the "transfers" array. The response header has a **pi.curent_height** field (note the field name is spelled `curent_height` in the API), which indicates the current highest known blockchain height to the wallet. Relative to this number, you will calculate the number of confirmations for each transaction in the "**transfers**" array (specifically, subtract the "**height**" field from **pi.curent_height**).

Each element in the "transfers" array represents a description of a transaction with its details. The important fields in this structure are:

- **"height"**: block number when transaction got included
- **"subtransfers_by_pid"**: the payments carried by this transaction, grouped
  first by **payment_id**, then by asset. Each group's **payment_id** is the
  user-associated identifier that was encoded in the user's integrated address
  (empty string when no payment ID is present). Incoming amounts under a known
  payment_id should be credited to the user associated with that payment_id.

> Do **not** use the deprecated tx-wide `payment_id` and `subtransfers` fields
> (returned by the older `get_recent_txs_and_info`/`get_recent_txs_and_info2`
> methods); after HF6 those methods fail on transactions that carry an
> intrinsic (per-output) payment ID. Read `subtransfers_by_pid` instead.

Since Zano is a multi-asset platform, and, after HF6, a single transaction may carry multiple payments, the “**subtransfers_by_pid**” array groups amounts by payment ID and then lists each asset under **subtransfers**:

```json
  "subtransfers_by_pid": [
    {
      "payment_id": "1dfe5a88ff9effb3",
      "subtransfers": [
        {
          "amount": 1000000000000,
          "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
          "is_income": false
        },
        {
          "amount": 1000000000000,
          "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
          "is_income": true
        }
      ]
    }
  ]
```

IMPORTANT:

- Do not credit deposits for transactions that have not reached 10 confirmations. Sometimes the network undergoes reorganisation among the last 2-3 blocks. This is normal, and within this number of confirmations, the transaction sequence may change, including the removal of transactions that previously appeared with 2-3 confirmations. Read the history only until those transactions that got 10 confirmations, when it comes to transactions that haven't matched this number of confirmations - re-read **get_recent_txs_and_info3** until you see those transactions in response with 10 confirmations. Make your code fully aware of such situations and re-read history for those transactions.
- Do not count on **"remote_addresses"** or **"remote_aliases"** fields, as those fields are optional and might be or **might not be present** in transactions, due to the privacy nature of transactions.
- Consider only those **asset_id** that you know, and ignore any others.
- When depositing an asset, ensure the correct interpretation of the decimal point, as it may differ for each asset. You can request asset details via the DAEMON RPC API [get_asset_info](/docs/build/rpc-api/daemon-rpc-api/get_asset_info/). Native coins have the asset_id `d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a` and should always be credited.
- A transaction may contain both incoming and outgoing subtransfers. Check the **is_income** field for each element.
- We also recommend specifying the **"exclude_unconfirmed": true** field in your request, as unconfirmed transactions are not important in the context of custody.
- Do not deposit transactions where the "**unlock_time**" field is different from 0, as such transactions may be locked for a long period.
- Over time, the payment_id may be pruned from old transaction history (over a year old), so back up the transfer history of your users to avoid future issues.

## Requesting Wallet Balance

To request the current balance of the wallet, you can use the WALLET RPC API [getbalance](/docs/build/rpc-api/wallet-rpc-api/getbalance).

```json
Request:​
{
 "id": 0,
 "jsonrpc": "2.0",
 "method": "getbalance",
 "params": {
 }
}

Response:
{
  "id": 0,
  "jsonrpc": "2.0",
  "result": {
    "balances": [
      {
        "asset_info": {
          "asset_id": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
          "current_supply": 500000000000000000,
          "decimal_point": 12,
          "full_name": "Zano wrapped USD",
          "hidden_supply": false,
          "meta_info": "Stable and private",
          "owner": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
          "ticker": "ZUSD",
          "total_max_supply": 1000000000000000000
        },
        "awaiting_in": 1000000000000,
        "awaiting_out": 2000000000000,
        "total": 100000000000000,
        "unlocked": 50000000000000
      },
      {
        "asset_info": {
          "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
          "current_supply": 13000000000000000000000,
          "decimal_point": 12,
          "full_name": "Zano",
          "hidden_supply": false,
          "meta_info": "",
          "owner": "",
          "ticker": "ZANO",
          "total_max_supply": 18000000000000000000000
        },
        "awaiting_in": 2000000000000,
        "awaiting_out": 1000000000000,
        "total": 500000000000000,
        "unlocked": 10000000000000
      }
    ]
  }
}
```

Response returns a list of assets that are present in the wallet, and for each asset, there are details ("**asset_info**") as well as the balances in the "**total**" and "**unlocked**" fields. The "**unlocked**" field shows how many coins are currently available for sending (this does not include incoming transactions that have not reached 10 confirmations, for example change). The "**total**" field shows all assets, including those that have not reached the required number of confirmations.

IMPORTANT: Assets not included in the public or private whitelist do not appear in the [getbalance](/docs/build/rpc-api/wallet-rpc-api/getbalance) response. There is a public whitelist maintained by the project community, as well as a private whitelist for each wallet, which is stored in the wallet's file. If you want to see the balance of an asset not present in the public whitelist, you need to call the WALLET RPC API [assets_whitelist_add](/docs/build/rpc-api/wallet-rpc-api/assets_whitelist_add):

```json
Request:
{
 "id": 0,
 "jsonrpc": "2.0",
 "method": "assets_whitelist_add",
 "params": {
   "asset_id": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8"
 }
}
Response:
{
 "id": 0,
 "jsonrpc": "2.0",
 "result": {
   "asset_descriptor": {
     "current_supply": 500000000000000000,
     "decimal_point": 12,
     "full_name": "Zano wrapped USD",
     "hidden_supply": false,
     "meta_info": "Stable and private",
     "owner": "f74bb56a5b4fa562e679ccaadd697463498a66de4f1760b2cd40f11c3a00a7a8",
     "ticker": "ZUSD",
     "total_max_supply": 1000000000000000000
   },
   "status": "OK"
 }
}
```

## Searching for Transactions in the Wallet

You can also search for an arbitrary transaction by its tx_id or using other available parameters in the API [search_for_transactions2](/docs/build/rpc-api/wallet-rpc-api/search_for_transactions2):

```json
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "search_for_transactions2",
  "params": {
    "filter_by_height": true,
    "in": true,
    "max_height": 20000,
    "min_height": 11000,
    "out": true,
    "pool": false,
    "tx_id": "97d91442f8f3c22683585eaa60b53757d49bf046a96269cef45c1bc9ff7300cc"
  }
}
```

## Transfer Coins

Transferring coins is done using the WALLET RPC API [transfer](/docs/build/rpc-api/wallet-rpc-api/transfer/):

```json
Request:
{
 "id": 0,
 "jsonrpc": "2.0",
 "method": "transfer",
 "params": {
   "destinations": [{
     "address": "ZxBvJDuQjMG9R2j4WnYUhBYNrwZPwuyXrC7FHdVmWqaESgowDvgfWtiXeNGu8Px9B24pkmjsA39fzSSiEQG1ekB225ZnrMTBp",
     "amount": 10000000000000,
     "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852"
   }],
   "fee": 10000000000
 }
}
Response:
{
 "id": 0,
 "jsonrpc": "2.0",
 "result": {
   "tx_hash": "01220e8304d46b940a86e383d55ca5887b34f158a7365bbcdd17c5a305814a93",
   "tx_size": 1234,
   "tx_unsigned_hex": ""
 }
}
```

It is good practice to check that your balance is sufficient for sending the desired asset before making a transfer; otherwise, there may be an error in sending the transaction. Sometimes, you need to wait up to 10 minutes to gather the required number of confirmations for the change (if the value in the unlocked field is still less than the value in the total field in the balances response). If you received a transaction hash in the “**tx_hash**” field, it means the transaction has been successfully created and accepted by the daemon for relay across the network. Once this transaction is included in a block and starts getting confirmations, you will see it in the results of [get_recent_txs_and_info3](/docs/build/rpc-api/wallet-rpc-api/get_recent_txs_and_info3/) (the **is_income** field will be false).


**IMPORTANT**: Before sending, be sure to validate the address and also check that the address you are sending to does not belong to your wallet, even if it is an integrated address of another user on your base wallet. You cannot send transactions between users within the same wallet. To validate address and check the base wallet address from integrated address, you need to call the WALLET RPC API [split_integrated_address](/docs/build/rpc-api/wallet-rpc-api/split_integrated_address):

```json
Request:
{
 "id": 0,
 "jsonrpc": "2.0",
 "method": "split_integrated_address",
 "params": {
   "integrated_address": "iZ2EMyPD7g28hgBfboZeCENaYrHBYZ1bLFi5cgWvn4WJLaxfgs4kqG6cJi9ai2zrXWSCpsvRXit14gKjeijx6YPCLJEv6Fx4rVm1hdAGQFis"
 }
}
Response:
{
 "id": 0,
 "jsonrpc": "2.0",
 "result": {
   "payment_id": "1dfe5a88ff9effb3",
   "standard_address": "ZxBvJDuQjMG9R2j4WnYUhBYNrwZPwuyXrC7FHdVmWqaESgowDvgfWtiXeNGu8Px9B24pkmjsA39fzSSiEQG1ekB225ZnrMTBp"
 }
}
```

You need to first check that the API managed to parse the address, if **"standard_address"** is not empty then the address that you passed is valid. You also need to check the **standard_address** field and ensure it is different from your own custody wallet. If the fields match, it means an attempt is being made to perform an internal transfer within your own custody, from one user to another. Such internal transactions are typically handled offchain by well-designed services.

**IMPORTANT**: Sending to multiple destinations in a single transaction is subject to some limitations: before HF6, any **integrated address** must be used **only in a single-destination transaction**. After HF6 activation this restriction is relaxed: a transaction may target multiple integrated addresses (multiple payment IDs per tx); see the [HF6 migration guide](/docs/build/exchange-guidelines/HF6-migration-guide) for details.

## Legacy methods

[get_bulk_payments](/docs/build/rpc-api/wallet-rpc-api/get_bulk_payments)
[get_payments](/docs/build/rpc-api/wallet-rpc-api/get_payments)
