---
sidebar_position: 2
toc_max_heading_level: 5
---

# EVM networks

:::note Release scope
These are implementation-reference examples, not a list of enabled routes or verified deployment instructions. Confirm the active route, service release, and contract ABI before integration. See [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status).
:::
Bridging from EVM-compatible chains (like Ethereum BNB Chain, etc.)

## Deposit
To initiate a transfer from an EVM network, the user should call the Bridge contract on the deposit chain and execute either **`depositERC20`** or **`depositNative`** functions.

**`depositERC20`** function:
```solidity
function depositERC20(
    address token_, // token address that should be transferred
    uint256 amount_, // amount of tokens to transfer
    string calldata receiver_, // receiver address on the target network
    string calldata network_, // destination network identifier
    bool isWrapped_, // if the token is wrapped or not
    uint16 referralId_ // referral identifier (0 if no referral is used)
)
```

:::note
- before executing the **`depositERC20`** function, the user should approve the contract to spend the amount of tokens that should be transferred;
  :::

**`depositNative`** function:
```solidity
function depositNative(
    string calldata receiver_, // receiver address on the target network
    string calldata network_, // destination network identifier
    uint16 referralId_ // referral identifier (0 if no referral is used)
) payable
```

After the transaction execution, the according event will be emitted, either **`DepositedERC20`** or **`DepositedNative`**.

To initiate the transfer processing, the user should provide any of the available parties with the deposit operation data:
- transaction hash — the hash of the transaction that contains the deposit operation;
- transaction nonce — the emitted event index, containing the information about the deposit operation and transfer memo;
- source chain id — the identifier of the source chain where the deposit operation was executed.

## Withdrawal

To withdraw the tokens on the destination chain, the user should call either **`withdrawERC20`** or **`withdrawNative`** functions on the Bridge contract on the withdrawal chain.

**`withdrawERC20`** function:
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
- **txHash_** field stands for the hash of the transaction that contains the deposit operation
- **txNonce_** field stands for the event id of the deposit (same as has been specified during the _/submit_ method
  call)
- **signatures** field stands for the signature requested from backend
- **amount** stands for the amount of tokens to withdraw (make sure to specify the withdrawal amount, without commission)
- **token** stands for the withdrawal token address
- **isWrapped_** should be *true* if the token is wrapped, otherwise *false*.

**`withdrawNative`** function:
```solidity
     function withdrawNative(
        uint256 amount_,
        address receiver_,
        bytes32 txHash_,
        uint256 txNonce_,
        bytes[] calldata signatures_
    )
  ```
- **txHash_** field stands for the hash of the transaction that contains the deposit operation
- **txNonce_** field stands for the event id of the deposit (same as has been specified during the _/submit_ method
  call)
- **signatures** field stands for the signature requested from backend
- **amount** stands for the amount of tokens to withdraw (make sure to specify the withdrawal amount, without commission)

:::warning
The withdrawal methods require the `txHash_` - the hash of the transaction that contains the deposit operation.
32 bytes hash is required, so make sure to:
- provide the full transaction hash (with `0x` prefix) if it is 32 bytes long;
- `keccak256(hash)` if the transaction hash is longer than 32 bytes (e.g Solana tx).
:::

## Bridging to EVM

### Native to wrapped

- Execute the following methods on the smart contract with an attached Ethereum:
  ```solidity
    function depositNative(
        string calldata receiver_, // tokens receiver address on the target EVM chain
        string calldata network_ // corresponding target chain id
        uint16 referralId_ // referral identifier (0 if no referral is used)
    )
  ```
  Example:
  ```solidity
    bridgeContract.depositNative{value: amount}(
        "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E", // some receiver address on the target EVM chain
        "11155111", // Sepolia chain id as a withdrawal destination
        0, // no referral
    ) // do not forget to attach the ETH deposit amount
  ```
- After submitting the deposit transaction you have to request withdrawal on the
  backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^0x[a-fA-F0-9]{64}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": {an emitted **DepositedNative** event index}
  }
  ```
  For EVM to EVM bridging the **tx_nonce** is an emitted **DepositedNative** event index, containing the
  information about the deposit operation and transfer memo.

  Example:
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "80002", // assuming the deposit was made on Amoy (Polygon testnet)
    "tx_nonce": 0 // the EXAMPLE index of the DepositedNative event
  }
  ```
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. The
  response will contain the information with the signature to be used on the EVM  smart contract to unlock your wToken.
- Finally, you have to execute the following method on the EVM smart contract:
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
    - **txNonce_** field stands for the event id of the deposit (same as has been specified during the _/submit_ method
      call)
    - **signatures** field stands for the signature requested from backend
    - **amount** stands for the amount of tokens to withdraw (make sure to specify the withdrawal amount, without commission)
    - **token** stands for the wrapped ETH address
    - **isWrapped_** should be *true*.

### Wrapped to native

- Execute the approval method on the corresponding wToken token.
- Execute the following method on the smart contract with attached Ethereum:
  ```solidity
    function depositERC20(
        address token_,
        uint256 amount_,
        string calldata receiver_,
        string calldata network_,
        bool isWrapped_,
        uint16 referralId_
    )
  ```
  Example:
  ```solidity
    bridgeContract.depositERC20(
        "0x111111cf1046e68e36E1aA2E0E07105eDDD1f08E", // wETH address on the source (in this case, Amoy) EVM chain
        1000000000000, // amount of wETH to transfer
        "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E", // some receiver address on the target EVM chain
        "11155111", // Sepolia chain id as a withdrawal destination
        true, // as we are transferring wrapped token
        1 // some referral identifier
    )
  ```
  The **receiver_** field stands for the tokens receiver address on the target EVM chain, **network_** stands for the
  corresponding target chain id, **token_** stands for the wETH address, and **isWrapped_** should be *true*.
- After submitting the deposit transaction you have to request withdrawal on the
  backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^0x[a-fA-F0-9]{64}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": {an emitted **DepositedERC20** event index}
  }
  ```
  Example:
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "80002", // assuming the deposit was made on Amoy (Polygon testnet)
    "tx_nonce": 2 // the EXAMPLE index of the DepositedERC20 event
  }
  ```
  For EVM to EVM bridging the **tx_nonce** is the emitted **DepositedERC20** event index, containing the
  information about the deposit operation and transfer memo.
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. The
  response will contain the information with the signature to be used on the EVM
  smart contract to unlock your ETH.
- Finally, you have to execute the following method on the EVM smart contract:
  ```solidity
     function withdrawNative(
        uint256 amount_,
        address receiver_,
        bytes32 txHash_,
        uint256 txNonce_,
        bytes[] calldata signatures_
    )
  ```
- **txNonce_** field stands for the event id of the deposit (same as has been specified during the _/submit_ method
  call)
- **signatures** field stands for the signature requested from backend
- **amount** stands for the amount of tokens to withdraw (make sure to specify the withdrawal amount, without commission)

### Wrapped to wrapped
The flow requires user to execute the **`depositERC20`** function with **isWrapped_** set to *true* and then execute the **`withdrawERC20`**
function on the target chain with **isWrapped_** set to *true* as well.
The details of the functions are described in the sections above.

## Bridging to Zano

### ERC20 to asset

- Execute the approval method on the corresponding wETH token.
- Execute the following methods on the smart contract with attached Ethereum:
  ```solidity
    function depositERC20(
        address token_,
        uint256 amount_,
        string calldata receiver_,
        string calldata network_,
        bool isWrapped_,
        uint16 referralId_
    )
  ```
  Example:
  ```solidity
    bridgeContract.depositERC20(
        "0x111111cf1046e68e36E1aA2E0E07105eDDD1f08E", // token address on the source (in this case, Amoy) EVM chain
        1000000000000, // amount of tokens to transfer
        "ZxCQtdbr6YPHEWr5Yucy2wTT87yKPwBMHGfJg8RVXg2m3bCDzgWjtbxR7TtGPgDxhWNrauwyPAKEyDdknkBG3Rit1Do9rXG1q", // some receiver address on the Zano chain
        "2", // EXAMPLE Zano chain id as a withdrawal destination
        false, // as we are transferring non-wrapped token
        1 // some referral identifier
    )
  ```
  The **receiver_** field stands for the tokens receiver address on the target ZANO chain, **network_** stands for the
  corresponding target chain id (Zano), **token_** stands for the wETH address, and **isWrapped_** should be *false*.
- Submit the deposit identifier to https://tss1.testnet.zano.org/submit. Set `chain_id` to the **source EVM chain** registered on Core, not the Zano destination. Set `tx_nonce` to the emitted deposit event index.
  Example for an Amoy source deposit (`80002`):
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "80002",
    "tx_nonce": 2
  }
  ```
  For EVM to ZANO bridging the **tx_nonce** is the emitted **DepositedERC20** event index, containing the
  information about the deposit operation and transfer memo.
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. After
  the response status becomes withdrawn you will receive your tokens.

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is EVM-compatible).
Zano withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
:::

### Wrapped to asset

In general, the flow is the same as for EVM(ERC20)-to-ZANO(asset) with only difference that you should call the
**`depositERC20`** function with **isWrapped_** set to *true*

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is EVM-compatible).
Zano withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
:::

### Native to asset

- Execute the following methods on the smart contract with an attached Ethereum:
  ```solidity
    function depositNative(
        string calldata receiver_, // tokens receiver address on ZANO
        string calldata network_, // corresponding ZANO chain id
        uint16 referralId_ // referral identifier (0 if no referral is used)
    )
  ```
  Example:
  ```solidity
    bridgeContract.depositNative{value: amount}(
        "ZxCQtdbr6YPHEWr5Yucy2wTT87yKPwBMHGfJg8RVXg2m3bCDzgWjtbxR7TtGPgDxhWNrauwyPAKEyDdknkBG3Rit1Do9rXG1q",
        "2", // EXAMPLE Zano chain id as a withdrawal destination
        1 // some referral identifier
    ) // do not forget to attach the ETH deposit amount
  ```
- Submit the deposit identifier to https://tss1.testnet.zano.org/submit. Set `chain_id` to the **source EVM chain** registered on Core, not the Zano destination. Set `tx_nonce` to the emitted deposit event index.
  The **tx_nonce** is an emitted **DepositedNative** event index, containing the
  information about the deposit operation and transfer memo.

  Example for an Amoy source deposit (`80002`):
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "80002",
    "tx_nonce": 0
  }
  ```
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce.
  After the response status becomes withdrawn you will receive your tokens.

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is EVM-compatible).
Zano withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
:::

## Bridging to TON

### Wrapped to native

- Execute the approval method on the corresponding wTON token.
- Execute the following methods on the smart contract with attached Ethereum:
  ```solidity
    function depositERC20(
        address token_,
        uint256 amount_,
        string calldata receiver_,
        string calldata network_,
        bool isWrapped_,
        uint16 referralId_
    )
  ```
  Example:
  ```solidity
    bridgeContract.depositERC20(
        "0x111111cf1046e68e36E1aA2E0E07105eDDD1f08E", // token address on the source (in this case, Amoy) EVM chain
        1000000000000, // amount of tokens to transfer
        "EQDmNYXGiGpYTWvmpJ_Ht5uDUHdrssnLFgC75AibPuqmmAnT", // some receiver address on the TON chain
        "2", // EXAMPLE TON chain id as a withdrawal destination
        true, // as we are transferring wrapped token
        1 // some referral identifier
    )
  ```
  The **receiver_** field stands for the tokens receiver address on the target TON chain, **network_** stands for the
  corresponding target chain_id, **token_** stands for the wTON address, and **isWrapped_** should be
  *true*.
- After submitting the deposit transaction you have to request withdrawal on the
  backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^0x[a-fA-F0-9]{64}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": {an emitted **DepositedERC20** event index}
  }
  ```
  Example:
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "80002", // assuming the deposit was made on Amoy (Polygon testnet)
    "tx_nonce": 2 // the EXAMPLE index of the DepositedERC20 event
  }
  ```
  For EVM to TON bridging the **tx_nonce** is the emitted **DepositedERC20** event index, containing the
  information about the deposit operation and transfer memo.
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce.

- Finally, user has to send the following message to the TVM Bridge contract:
  ```tact
  MsgWithdrawNative { 
    amount: Int; 
    receiver: Address; // the address that will receive the native tokens on the TON network
    txHash: Int as int257; //the hash of the transaction on the source network
    txNonce: Int; // the nonce of the transaction on the source network
    signature: Slice; // the signed message hash (512 bits)
    network: Slice; // the name of destination network (TON based)
  }
  ```
  The **txNonce_** field stands for the event id of the deposit (same as has been specified during the _/submit_ method
  call), **network** stands for the  corresponding target chain_id, the **signatures** field stands for the signature requested from backend.

### Wrapped to Jetton

- Execute the approval method on the corresponding wJETTON token.
- Execute the following methods on the smart contract with attached Ethereum:
  ```solidity
    function depositERC20(
        address token_,
        uint256 amount_,
        string calldata receiver_,
        string calldata network_,
        bool isWrapped_,
        uint16 referralId_
    )
  ```
  Example:
  ```solidity
    bridgeContract.depositERC20(
        "0x111111cf1046e68e36E1aA2E0E07105eDDD1f08E", // token address on the source (in this case, Amoy) EVM chain
        1000000000000, // amount of tokens to transfer
        "EQDmNYXGiGpYTWvmpJ_Ht5uDUHdrssnLFgC75AibPuqmmAnT", // some receiver address on the TON chain
        "2", // EXAMPLE TON chain id as a withdrawal destination
        true, // as we are transferring wrapped token
        2 // some referral identifier
    )
  ```
  The **receiver_** field stands for the tokens receiver address on the target TON chain, **network_** stands for the
  corresponding target chain_id, **token_** stands for the wJETTON address, and **isWrapped_** should be
  *true*.
- After submitting the deposit transaction you have to request withdrawal on the
  backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^0x[a-fA-F0-9]{64}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": {an emitted **DepositedERC20** event index}
  }
  ```
  Example:
  ```json
  {
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6",
    "chain_id": "80002", // assuming the deposit was made on Amoy (Polygon testnet)
    "tx_nonce": 2 // the EXAMPLE index of the DepositedERC20 event
  }
  ```
  For EVM to TON bridging the **tx_nonce** is the emitted **DepositedERC20** event index, containing the
  information about the deposit operation and transfer memo.
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce.

- Finally, you have to send the following message to the TVM Bridge contract:
  ```tact
  message(0x255667d) MsgWithdrawJetton { 
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
    forwardTonAmount: Int; // The amount of TONs(native) to be sent from the receiver on the final Transfer/Mint notification
    totalTonAmount: Int; // The amount of TONs to be used to process the withdrawal on Jetton Wallet/Master contracts (after all validations). It sends from the Bridge balance and is limited by JETTON_FEE
  }
  ```
  The **txNonce_** field stands for the event id of the deposit (same as has been specified during the _/submit_ method
  call), **network_** stands for the  corresponding target chain_id, the **signatures** field stands for the signature
  requested from backend, **token** stands for the wrapped ETH address, and **isWrapped_** should be *true*.


## Bridging to UTXO networks

In general, the deposit flow is the same as for bridging wrapped EVM tokens. You should call the
**`depositERC20`** function with **isWrapped_** set to *true*, and specify the UTXO destination address and chain id in the
**receiver_** and **network_** fields respectively.

Example:
```solidity
  bridgeContract.depositERC20(
      "0x111111cf1046e68e36E1aA2E0E07105eDDD1f08E", // token address on the source (in this case, Amoy) EVM chain
      1000000000000, // amount of tokens to transfer
      "bc1q42u6dp420zz33740nqgzvxc5s3tf4sgdrh6n0s", // some receiver address on the BTC chain
      "0", // EXAMPLE BTC chain id as a withdrawal destination
      true, // as we are transferring wrapped token
      1 // some referral identifier   
  )
```

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is EVM-compatible).
UTXO withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
However, the commission for the withdrawal transaction will be taken from the withdrawal amount.
:::

## Bridging to Solana
The bridging flow is not different from the described examples above. You should call either **`depositNative`** or **`depositERC20`** functions on the Bridge contract on the deposit chain, and then request withdrawal on the backend.

To withdraw the tokens on the Solana see the [Solana withdrawal guide](./solana.md#withdrawal).
