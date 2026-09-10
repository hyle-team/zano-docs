---
sidebar_position: 1
toc_max_heading_level: 5
---

# General Flow

Basic bridging flow description for all supported networks.

Basic bridging flow is as follows:

1. Before initiating the deposit operation, the user should check the:
   - supported source and target chains;
   - supported assets on the source and target chains;
   - token decimals on the source and target chains, transform deposit amount properly
   (e.g. if specific token has 6 decimals on target chain, the user should deposit at least `0.000001` of this token);
   - **Bridge fee (in percent) for token on the target chain, it will be deducted from the deposit amount;**
   - **minimum withdrawal amount on the target chain (the deposit will be rejected if the deposit amount, converted to the target chain decimals, minus the fee, is less than the minimum withdrawal amount);**
2. User initiates the deposit operation on the source network. If the transaction has a referral, it should be included in the deposit transaction data:
    - `0` if there is no referral;
    - any identifier of the referral otherwise (matched by the backend with the list of known referrals).
3. After the deposit transaction **is included in the block and enough confirmations are received**, the user should provide any of the available parties with
   the deposit operation data (transaction hash, transaction nonce, source chain id):
    ``` json title="POST https://tss1.testnet.zano.org/submit"
    {
        "tx_hash": "{tx hash, ^0x[a-fA-F0-9]{64}$}", // can differ for specific chains
        "chain_id": "{deposit chain identifier, should be same as chain identifier on core}",
        "tx_nonce": {tx deposit nonce, differs for specific chains and transaction types}
    }
    ```
    :::info
    Some chains (e.g. UTXO-based, Zano, TON) does not have a **`0x`** prefix in the transaction hash.
    Make sure to append it when sending the request to the TSS API.
    :::
4. After the deposit operation is verified, the backend will initiate the signing process. The user can request the signing status using:
    ```
    GET https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce
    ```
5. After the signing is completed, the user **either** automatically receives the withdrawal asset (UTXO, Zano) **or** should execute the withdrawal operation on the target network (EVM, TON, Solana).

:::info
- When withdrawing a non-native asset (for example, ERC20 on EVM chains), the TSS API returns withdrawal token address and `isWrapped` flag along with the signature.
  You have to use this address to execute the withdrawal operation on the target network.
- When transferring tokens to native chains (for example, wBTC to Bitcoin), the withdrawal token address will be set to `0x0000...0000`
- Be careful with the token decimals, they are held by the backend properly, but during the deposit transaction generation
  you have to care about it by yourself.
- The presented examples should be enough to create another type of bridge transfers. UTXO withdrawal flow has much in
  common with ZANO withdrawals (executed automatically). EVM, Solana and TON withdrawals should always be processed on the client-side
  after receiving of the signature.
- Deposits of the ERC20 tokens on EVM chains will always require the approval.
  :::

:::warning
Make sure to wait until the deposit transaction is confirmed enough (depends on the source chain) before requesting the withdrawal.
:::