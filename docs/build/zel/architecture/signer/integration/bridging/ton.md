---
sidebar_position: 6
toc_max_heading_level: 5
---

# TON

Bridging from the TON network.
:::info
Thought this piece of documentation we refer to the following terms: 
- Jetton (aka Classical Jetton)- the standard for tokens on the TON blockchain, similar to ERC20 on Ethereum. Learn more about Jettons [here](https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons/).
- Wrapped Jetton - a special type of Jetton that is backed 1:1 with native tokens on another chain. It can be minted and burned.
- Naive TON - the native currency of the TON blockchain.
- tx_nonce - the logical time of the deposit message (message that emit Deposit event) that is used to identify the message in the event sequence. Learn more about [logical time](https://docs.ton.org/v3/documentation/smart-contracts/message-management/messages-and-transactions/#what-is-a-logical-time);

Also note that the TON Bridge contract works **ONLY** with predefined Jetton Master and Jetton Wallet addresses.
:::

If you want to learn more about the contracts,
we propose you to read the contract's documentation and tests [here](https://github.com/Zano-Execution-Layer/ton-bridge-contract).

## Deposit

The bridge supports the following types of deposits on the TON side:
- Native TON deposits
- Wrapped Jetton deposits (with burn operation on the Jetton Wallet contract)
- Classical Jetton deposits (with transfer operation on the Jetton Wallet contract)

For each deposit type, the Bridge contract emits a corresponding event. These events are consumed by the backend to track deposits and trigger withdrawals on the destination chain.
Each deposit also includes destination details, which must use fixed field sizes regardless of the deposit type, though they may be stored at different levels of the message payload:
- Receiver address: 127 bytes
- Network name: 32 bytes


### Deposit of native TON

The bridge supports deposits of native TON tokens. The user has to send a message with the following definition to the Bridge contract with an attached TON:
```tact
message(0x5386a723) MsgDepositNative {
    receiver: Slice; // the address on the destination network (127 bytes)
    network: Slice; // the name of the destination network (256bits) 
    referralId: Int as uint16; // the id of referral (16bits)
    // the amount of tokens is stored on the context 
    // the sender as well }
```

This message emits the `NativeDeposited` event, which has the following definition:
```tact
message(0xe858a993) NativeDeposited {
    // The address of the sender
    sender: Address;
    // The address of the recipient (624 bits)
    receiver: Slice;
    // The name of the destination network, used as an informational field for the event.
    network: Slice;
    // The amount being deposited
    amount: Int;
    // The id of referral 
    referralId: Int as uint16; // the id of referral (16bits)
}  
```

### Deposit of Classical Jettons
To deposit Jetton, user has to send them to Bridge's Jetton wallet. The transfer must include a forward payload that is redirected to the Bridge contract.
The payload is a Cell that stores 127 bytes for receiver address, and a ref to another Cell that stores info about the destination network and referral id, and it looks like this:

```
forwardBody 
   - refs
      (1) cell (network 32 bytes + referralId 2 bytes as uint16)
   - cell(receiver 127bytes) 
```

To be sure that the transaction will be processed by the TON network, we recommend to attach some extra TONs to the transfer message. After the successful transfer, any change will be sent back to the sender.
We recommend to attach at least 0.8-1.5 TONs to the transfer message and 0.3-0.5 TON to the forward_ton_amount field.

The Bridge's jetton wallet sends the `TransferNotification` message to the Bridge contract. The bridge contract parses the payload and emit the `JettonDeposited`.
The `JettonDeposited` message definition:

```tact
message(0x2ddcbe3) JettonDeposited {
    // The address of the sender
    sender: Address;
    // The address of the receiver (624 bits)
    receiver: Slice;
    // The amount being deposited
    amount: Int;
    // The name of the destination network
    network: Slice;
    //  The type of the operation
    isWrapped: Bool;
    // The address of the Master Jetton contract
    token: Address; // the address of the master jetton contract
    // The id of referral 
    referralId: Int as uint16; // the id of referral (16bits)
```

### Deposit of Wrapped Jettons
If the user wants to deposit some Wrapped Jettons, the user has to Burn wrapped Jettons. The Burn must include a forward payload that is redirected to the Bridge contract.
The payload is a Cell that stores 127 bytes for receiver address, and a ref to another Cell that stores info about the destination network and referral id.
We recommend to attach at least 0.8-1.5 TONs to the transfer message and 0.3-0.5 TON to the forward_ton_amount field.

```
forwardBody 
   - refs
      (1) cell (network 32 bytes + referralId 2 bytes as uint16)
   - cell(receiver 127bytes) 
```

The Bridge's jetton master sends the `BurnNotification` message to the Bridge contract. The bridge contract parses the payload and emit the `JettonDeposited`.
```tact
message(0x2ddcbe3) JettonDeposited {
    // The address of the sender
    sender: Address;
    // The address of the receiver (624 bits)
    receiver: Slice;
    // The amount being deposited
    amount: Int;
    // The name of the destination network
    network: Slice;
    //  The type of the operation
    isWrapped: Bool;
    // The address of the Master Jetton contract
    token: Address; // the address of the master jetton contract
    // The id of referral
    referralId: Int as uint16; // the id of referral (16bits)
}
```

## Withdrawal

The bridge supports withdrawals to the TON network of the following types:
- Native TON withdrawals;
- Wrapped Jetton withdrawals (with mint operation on the Jetton Master contract);
- Classical Jetton withdrawals (with transfer operation on the Jetton Wallet contract).

To execute a withdrawal, the bridge contract requires the user to provide the exact data that was signed by the TSS. The contract computes a hash of this data and verifies the accompanying signature against the TSS public keys stored on-chain.
Furthermore, the bridge contract guarantees idempotency by checking whether the hash of the withdrawal data has already been processed, preventing duplicate executions.
All necessary data for the withdrawal can be obtained from the TSS or ZEL Core RPC-API.

:::warning
The withdrawal methods require the `txHash_` - the hash of the transaction that contains the deposit operation.
32 bytes hash is required, so make sure to:
- provide the full transaction hash (with `0x` prefix) if it is 32 bytes long;
- `keccak256(hash)` if the transaction hash is longer than 32 bytes (e.g Solana tx).
:::

### Native TON withdrawal
To process the native TON withdrawal, the user has to send the `MsgWithdrawNative` message on the Bridge contract:
```tact
message(0x4cdec437) MsgWithdrawNative { 
    amount: Int; 
    receiver: Address; // the address that will receive the native tokens on the TON network
    txHash: Int as int257; //the hash of the transaction on the source network
    txNonce: Int; // the nonce of the transaction on the source network
    signature: Slice; // the signed message hash (512 bits)
    network: Slice; // the name of destination network (TON based)
}
```

To be sure that the withdrawal will be processed by the TON network, we recommend to attach some extra TONs to the withdraw message. After the successful withdraw, any change will be sent back to the sender. 
We recommend to attach at least 0.8-1.5 TONs to the withdraw message.

### Jetton withdrawal 

For the Classical and Wrapped Jetton withdrawal the Bridge contract provides the same message interface.
To process the Jetton withdrawal, the user has to send the `MsgWithdrawJetton` message on the Bridge contract:
```tact
message(0x0255667d) MsgWithdrawJetton { 
    receiver: Address; // the address that will receive the jettons on the TON network(TON wallet address)
    amount: Int ; // the amount of jettons to withdraw
    txHash: Int; //the hash of the transaction on the source network
    txNonce: Int; // the nonce of the transaction on the source network
    network: Slice; // the name of destination network (TON based)
    isWrapped: Bool; // the type of the operation(wrapped or default jetton)
    signature: Slice; // the signed message hash    
    token: Address; // the  addres of the master jetton contract

    // this data is used to send the jettons to the receiver
    bridgeJettonAddress: Address; // the jetton contract address
    forwardTonAmount: Int; // the amount of ton to be sent to the receiver
    totalTonAmount: Int; // the total amount of ton to be sent to the receiver
}
```

Same for native withdrawal, to be sure that the withdrawal will be processed by the TON network, we recommend to attach some extra TONs to the withdraw message. After the successful withdraw, any change will be sent back to the sender.
For the message we recommend to attach at least 0.8-1.5 TONs to the withdraw message and 0.05 TON to the forward_ton_amount field, and total_ton_amount 0.4-0.6TON. 


## Bridging to EVM networks
The following examples demonstrate how to perform deposits from TON to EVM-compatible chains, but similar principles apply to other supported chains. 

### Native to ERC20

- The user has to send the message with following definition to the Bridge contract with an attached TON:
  ```tact
    message(0x5386a723) MsgDepositNative {
      receiver: Slice; // the address on the destination network (127 bytes)
      network: Slice; // the name of the destination network (256bits) 
      referralId: Int as uint16; // the id of referral (16bits)
      // the amount of tokens is stored on the context 
      // the sender as well   
    }
  ```

- The **receiver** field specifies the recipient's address on the target EVM-compatible chain. The **network** field indicates the corresponding **chain_id** of the target chain. The **referralId** represents the referral identifier; if none is provided, it should be set to 0.
- After submitting the deposit transaction user have to request withdrawal on the
  backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^0x[a-fA-F0-9]{64}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": {LT of the deposit message}
  }
  ```
  Example:
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "5124", // same as chain identifier on core
    "tx_nonce": 61384500000001 // the EXAMPLE LT of the deposit message
  }
  ```
- **tx_nonce** here is the  message logical time that initiating the message's position in the event sequence.
  Learn more about [logical time](https://docs.ton.org/v3/documentation/smart-contracts/message-management/messages-and-transactions/#what-is-a-logical-time);
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. The
  response will contain the information with the signature to be used on the EVM
  smart contract to unlock your wETH.
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
  The **txNonce_** field stands for the deposit message LT (same as has been specified during the _/submit_ method
  call), the **signatures** field stands for the signature
  requested from backend, **token** stands for the wrapped TON address, and **isWrapped_** should be *true*.

### Jetton to wrapped
To deposit Jetton, user has to send them to Bridge's Jetton wallet. The transfer must include a forward payload that is redirected to the Bridge contract.
The payload is a Cell that stores 127 bytes for receiver address, and a ref to another Cell that stores info about the destination network and the referralId.

JettonTransferNotification message definition:
```tact
message(0x7362d09c) MsgJettonTransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;
    forwardPayload: Slice; 
}
```
:::info
TON Bridge contract works **ONLY** with predifined Jetton Wallet addresses.
:::

- After submitting the deposit transaction you have to request withdrawal on the
  backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^0x[a-fA-F0-9]{64}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": 61384500000001
  }
  ```
  Example:
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "5124", // same as chain identifier on core
    "tx_nonce": 61384500000001 // the EXAMPLE LT of the deposit message
  }
  ```
- **tx_nonce** here is the  message logical time that initiating the message's position in the event sequence.
  Learn more about [logical time](https://docs.ton.org/v3/documentation/smart-contracts/message-management/messages-and-transactions/#what-is-a-logical-time);
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. The
  response will contain the information with the signature to be used on the EVM
  smart contract to unlock your ETH.
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

  The **txNonce_** field stands for the deposit message LT (same as has been specified during the _/submit_ method
  call), the **signatures** field stands for the signature
  requested from backend, **token** stands for the wrapped ETH address, and **isWrapped_** should be *true*.

### Wrapped jetton to native
If the user wants to deposit some wrapped jettons, they need to Burn wrapped Jettons. The Burn must include a forward payload that is redirected to the Bridge contract.
The payload is a Cell that stores 127 bytes for receiver address, and a ref to another Cell that stores info about the destination network and referralId.
Also the message includes the forwardAddress, this address points to the receiver of the BurnNotification message.

JettonBurnNotification message definition:
```tact
message (0x7bdd97de) MsgJettonBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    owner: Address;  
    forwardPayload: Slice;
}

```

:::info
TON Bridge contract works **ONLY** with predifined Jetton Master addresses.
:::

- After submitting the deposit transaction you have to request withdrawal on the
  backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^0x[a-fA-F0-9]{64}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": 0
  }
  ```
  Example:
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "5124", // same as chain identifier on core
    "tx_nonce": 61384500000001 // the EXAMPLE LT of the deposit message
  }
  ```
- **tx_nonce** here is the  message logical time that initiating the message's position in the event sequence.
  Learn more about [logical time](https://docs.ton.org/v3/documentation/smart-contracts/message-management/messages-and-transactions/#what-is-a-logical-time);
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. The
  response will contain the information with the signature to be used on the EVM
  smart contract to unlock your ETH.
- Finally, user has to execute the following method on the EVM smart contract:
```solidity
   function withdrawNative(
      uint256 amount_,
      address receiver_,
      bytes32 txHash_,
      uint256 txNonce_,
      bytes[] calldata signatures_
  )
```
  The **txNonce_** field stands for the deposit message LT (same as has been specified during the _/submit_ method
  call), the **signatures** field stands for the signature requested from backend, and **operationType_** should be
  *wrapped*.

## Bridging to UTXO networks

In general, the process of bridging to UTXO networks is similar to bridging to EVM networks.
When depositing, the user needs to specify the receiver's address on the target UTXO chain and the corresponding network identifier.

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is EVM-compatible).
UTXO withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
However, the commission for the withdrawal transaction will be taken from the withdrawal amount.
:::

## Bridging to Zano

In general, the process of bridging to Zano is similar to bridging to EVM networks.
When depositing, the user needs to specify the receiver's address on the target Zano chain and the corresponding network identifier.

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is
EVM-compatible).
Zano withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
:::

## Bridging to Solana
In general, the process of bridging to Solana is similar to bridging to EVM networks.
When depositing, the user needs to specify the receiver's address on the target Solana chain and the corresponding network identifier.

To withdraw the tokens on the Solana see the [Solana withdrawal guide](./solana.md#withdrawal).