# Zano Hard Fork 6 (v2.1 -> v2.2) services migration guide

This document is intended for services / exchanges and describes how to prepare for the upcoming HF6.

## Key features in HF6
Hard Fork 6 will bring to life two major features among others:

  1\) gateway addresses;

  2\) intrinsic payment IDs.

Gateway addresses are described in a separate [guide](https://docs.zano.org/docs/build/exchange-guidelines/gateway_addresses). Here we focus on payment IDs.

## What is Intrinsic Payment ID and what happens to existing Payment ID?

Payment ID (a.k.a. PID) is arbitrary data that can be attached to a transaction and it is mainly intended to help the receiver distinguish between different payments (e.g. an exchange receiving deposits on the same hot wallet address from different users).
This data is encrypted in such a way that only the sender and the receiver can decode it.
Before HF6, the PID is stored in the transaction's `extra` or (encrypted) `attachment` section and thus it's tx-wide by nature — you can put only one PID into a transaction regardless of the number of outputs.
A PID can be packed together with a normal Zano address into an *integrated address*. When someone sends funds to an integrated address, the sender's wallet extracts PID from the address and then makes a standard transaction to the stripped address with PID included into tx's extra.

Since HF6 we introduce so-called *intrinsic payment ID* — 8 bytes of arbitrary data that is put into each transaction's output. This data is encrypted similarly to outputs' amounts, and it is always present even if no payment ID is actually used for a particular output, making a transaction more uniform.
Old tx-wide payment IDs will still be usable even after HF6, although with some limitations.

#### Table 1. Difference between tx-wide payment IDs and intrinsic payment IDs

| Aspect | Legacy tx-wide Payment ID | Intrinsic Payment ID |
|--------|------------------------------------|----------------------|
| Maximum length | 128 bytes | 8 bytes |
| Count per tx | 0 or 1 | Equal to the number of outputs |
| Encryption | Only one (primary) receiver can decrypt the payment ID | Each receiver decrypts their own payment ID alongside the output data |
| Conceptual model | One tx corresponds to zero or one payment, identified by a single payment ID | One tx can correspond to zero, one, or multiple payments, each with its own payment ID |
| Supported before HF6? | Yes | No |
| Supported after HF6? | Yes (with limitations) | Yes |
| Can be used in a tx with gateway outputs? | No | Yes |

The most important change to note: a single transaction **may contain multiple payments** with different payment ID and different asset. From user's perspective it looks like sending a tx to multiple integrated addresses — which is not allowed before HF6 (multiple destinations are allowed, but an integrated address must be the first and only one) — but becomes possible after HF6 activation.

## API changes (important!)


#### Data structure: `wallet_transfer_info`

The data structure `wallet_transfer_info` that is exposed in some API responses is changing: it doesn't have `payment_id` and `subtransfers` anymore, instead new field `subtransfers_by_pid` should be used.

Example:

    "subtransfers_by_pid": [{
        "payment_id": "",
        "subtransfers": [{
          "amount": 6,
          "asset_id": "45eab91922c86ae056a849b39a439112cc2d4819262c24acd4bb4bb0b6c56696",
          "is_income": true
        }]
      },{
        "payment_id": "ec2d180100000000",
        "subtransfers": [{
          "amount": 600000000000,
          "asset_id": "45eab91922c86ae056a849b39a439112cc2d4819262c24acd4bb4bb0b6c56696",
          "is_income": true
         },
         {
          "amount": 137,
          "asset_id": "cc608f59f8080e2fbfe3c8c80eb6e6a953d47cf2d6aebd345bada3a1cab99852",
          "is_income": true
        }]
      }]


As shown, `subtransfers_by_pid` may contain multiple elements with different `payment_id` values, each containing multiple subtransfers (e.g. native coins and an asset).

When a PID is not specified, an empty string is used as the value of `payment_id`.


#### API methods

| API method | Before HF6 | After HF6 | data fields |
|---|---|---|---|
| get_recent_txs_and_info (deprecated) | works | fails on txs with intrinsic PID | subtransfers, payment_id |
| get_recent_txs_and_info2 (deprecated) | works | fails on txs with intrinsic PID | subtransfers, payment_id |
| get_recent_txs_and_info3 | works | works | subtransfers_by_pid |
| make_integrated_address | up to 8-byte PID by default | up to 8-byte PID by default | legacy sizes (up to 128 bytes) require `--allow-legacy-payment-id-size` |



## HF6-ready checklist

  1\) Zano daemon and wallet binaries (zanod and simplewallet) are updated to v2.2.1.501 or more recent;

  2\) API: we don't use deprecated `get_recent_txs_and_info`, `get_recent_txs_and_info2` (`get_recent_txs_and_info3` should be used instead);

  3\) we use 8-byte-long PIDs when generating a deposit integrated address for a user;

  4\) we generate integrated addresses for depositing and don't provide a user with a standalone plaintext PID;

  5\) we expect that a single incoming tx may correspond to multiple payments/deposits with different PIDs;

