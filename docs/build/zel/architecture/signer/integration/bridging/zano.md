---
sidebar_position: 4
toc_max_heading_level: 5
---

# Zano
Bridging from Zano chain

## Deposit
To initiate a transfer from the Zano network, the user should construct a transaction aligning with the next requirements:
- the transaction type should be a [`burn_asset`](https://docs.zano.org/docs/build/rpc-api/wallet-rpc-api/burn_asset) transaction;
- the amount of burned asset and its identifier will be tracked as the deposit amount and token;
- the transaction should contain the memo (located in `service_entries` array) with the required information about transfer parameters (destination address, chain id etc.) to be processed by the TSS network.
  It should be the present in the hex-encoded string format of the following structure:

```js
    const bodyData : {...} = {
      dst_add: destinationAddress,
      dst_net_id: destinationChainId,
      referral_id: referralId, // 0 if no referral
      uniform_padding: "    ",
    };
    const jsonString : string = JSON.stringify(bodyData);
    const bytes : Uint8Array = new TextEncoder().encode(jsonString);
    const bodyHex : string = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  ```

  ```json title="Example of the service entries"
    "service_entries": [{
      "body": {bodyHex},
      "flags": 0,
      "instruction": "BI",
      "service_id": "B"
    }]
  ```
- **transaction should be pointed to TSS network account address using the `point_tx_to_address` transaction field.
  In this case, the burning transaction will be visible and processable in the TSS network.**

Some explanations regarding the fields in the memo:
- **dst_add** stands for the address on the destination network;
- **dst_net_id** stands for the identifier of the destination chain;
- **referral_id** is used to track referrals:
  - `0` if there is no referral;
  - any identifier of the referral otherwise (matched by the backend with the list of known referrals);
- **uniform_padding** is used to make the memo less predictable in size. (better to match the example above);
- **service_id** with value `B` stands for the Bridge service (should be used in the memo);
- **instruction** with value `BI` stands for the Bridge In instruction (should be used in the memo).

After the transaction is broadcast, the user should provide the TSS network with the deposit operation data:
- transaction hash—the hash of the transaction that contains the deposit operation, prepended with the `0x` prefix (if not present);
- transaction nonce—the index of `service_entries` array item with transfer destination information;
- source chain id—the identifier of the source chain where the deposit operation was executed.

## Withdrawal
TSS network will automatically send the withdrawal transaction to Zano network after the signing is completed. 
The user does not need to submit any additional transactions.

## Bridging to EVM

- Form the **destination_info** that contains the **dst_add** and **dst_net_id**.
- Execute the asset burn transaction with specified **asset_id**, **burn_amount**, **service_entries** (where tou should
  place the **destination_info** at the beginning of the array), **point_tx_to_address** (ZANO operator address).
  The **destination_info** should be encoded into the base64 string:
  ```js
    const bodyData : {...} = {
      dst_add: destinationAddress,
      dst_net_id: destinationChainId,
      referral_id: referralId, // 0 if no referral
      uniform_padding: "    ",
    };
    const jsonString : string = JSON.stringify(bodyData);
    const bytes : Uint8Array = new TextEncoder().encode(jsonString);
    const bodyHex : string = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  ```
  Example of the service entries:
  ```json
    "service_entries": [{
      "body": {bodyHex},
      "flags": 0,
      "instruction": "K",
      "security": "d8f6e37f28a632c06b0b3466db1b9d2d1b36a580ee35edfd971dc1423bc412a5",
      "service_id": "C"
    }]
  ```
- After submitting the deposit transaction you have to request withdrawal on the
  backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^0x[a-fA-F0-9]{64}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": 0
  }
  ```
  For ZANO to EVM bridging the **tx_nonce** is the index of **service_entries** array item with transfer destination
  information. We restrict the **tx_nonce** always be zero, so the destination info should be placed at the beginning of
  the **service_entries** array. Then your withdrawal id for the backend can be built as follows: **$tx
  hash$-$tx_nonce$-$chain id$**.
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. The
  response will contain the information with the signature to be used on the EVM
  smart contract to unlock your tokens on EVM.
- Finally, user has to execute the following method on the EVM smart contract:
  ```solidity
     function withdrawERC20(
        address token_,
        uint256 amount_,
        address receiver_,
        bytes32 txHash_,
        uint256 txNonce_,
        bool isWrapped_,
        bytes[] calldata signatures_
     )
  ```
  The **txNonce_** field stands for the event id of the deposit (same as has been specified during the _/submit_ method
  call), the **signatures** field stands for the signature
  requested from backend, **token** stands for the ERC20 token address, and **isWrapped__** should be
  *false*.

## Bridging to UTXO networks

In general, the flow is the same as for bridging to EVM-compatible chains.
The example structure of the transaction memo for UTXO destination looks like this:
```
{
    "dst_add": "bc1q42u6dp420zz33740nqgzvxc5s3tf4sgdrh6n0s", // example BTC address as a withdrawal destination
    "dst_net_id": "12345" // example UTXO chain id as a withdrawal destination
    "referral_id": 0 // referral id or 0 if no referral
}
```

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is EVM-compatible).
UTXO withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
However, the commission for the withdrawal transaction will be taken from the withdrawal amount.
:::

## Bridging to Solana

In general, the flow is the same as for bridging to EVM-compatible chains.
The example structure of the transaction memo for Solana destination looks like this:
```
{
    "dst_add": "4Nd1mYg1L6k5b8dgq5h9y3z7fXq7d4Z2Z5X3fZ4k5g6h", // example Solana address as a withdrawal destination
    "dst_net_id": "2" // example Solana chain id as a withdrawal destination
    "referral_id": 0 // referral id or 0 if no referral
}
```

To withdraw the tokens on the Solana see the [Solana withdrawal guide](./solana.md#withdrawal).

## Bridging to TON

In general, the flow is the same as for bridging to EVM-compatible chains.
The example structure of the transaction memo for TON destination looks like this:
```
{
    "dst_add": "EQC2...your_ton_address", // example TON address as a withdrawal destination
    "dst_net_id": "3" // example TON chain id as a withdrawal destination
    "referral_id": 0 // referral id or 0 if no referral
}
```

To withdraw the tokens on the TON see the [TON withdrawal guide](./ton.md#withdrawal).



