---
sidebar_position: 2
toc_max_heading_level: 5
---

# EVM networks

:::note Release scope
These are implementation-reference examples, not a list of enabled routes or verified deployment instructions. Confirm the active route, service release, and contract ABI before integration. See [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status).
:::

Swap flow from EVM-compatible chains (Ethereum, BNB Chain, Polygon, etc.).

The EVM swap flow starts with a swap-aware deposit on the source EVM Bridge contract. The TSS parses the emitted swap
event, bridges the source asset to the protocol address, and submits the swap request to the Swap module. After the Swap
module creates the final deposit, it will be submitted to the TSS automatically if the current deposit chain is not a
privacy chain. The last withdrawal is processed the same way as in the regular bridging flow.

## Deposit

To initiate a swap from an EVM network, the user should call one of the swap-specific Bridge contract methods:

- **`depositNativeAndSwap`** for native coin deposits;
- **`depositERC20AndSwap`** for ERC20 deposits.

**`depositNativeAndSwap`** function:

```solidity
function depositNativeAndSwap(
    string calldata destinationToken_, // token that user wants to receive after the swap
    uint256 minDestinationAmount_, // minimum acceptable amount of destinationToken_
    uint256 swapDeadline_, // timestamp in seconds until which the swap is valid
    string calldata receiver_, // receiver address on the final target chain
    string calldata network_, // final target chain identifier
    uint16 referralId_ // referral identifier (0 if no referral is used)
) payable
```

Example:

```solidity
bridgeContract.depositNativeAndSwap{value: amount}(
    "0x111111cf1046e68e36E1aA2E0E07105eDDD1f08E", // destination token on the final target chain
    990000000000000000, // minimum acceptable output amount
    1760000000, // swap deadline, unix timestamp in seconds
    "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E", // final receiver
    "11155111", // final target chain id, e.g. Sepolia
    0 // no referral
)
```

This method emits **`BridgedNativeAndSwapped`**:

```solidity
event BridgedNativeAndSwapped(
    uint256 amount,
    string destinationToken,
    uint256 minDestinationAmount,
    uint256 swapDeadline,
    string receiver,
    string network,
    uint16 referralId
)
```

**`depositERC20AndSwap`** function:

```solidity
function depositERC20AndSwap(
    address token_, // token address that should be transferred
    uint256 amount_, // amount of tokens to transfer
    string calldata destinationToken_, // token that user wants to receive after the swap
    uint256 minDestinationAmount_, // minimum acceptable amount of destinationToken_
    uint256 swapDeadline_, // timestamp in seconds until which the swap is valid
    string calldata receiver_, // receiver address on the final target chain
    string calldata network_, // final target chain identifier
    bool isWrapped_, // if the source token is wrapped or not
    uint16 referralId_ // referral identifier (0 if no referral is used)
)
```

:::note
Before executing **`depositERC20AndSwap`**, the user should approve the Bridge contract to spend the amount of tokens
that should be transferred.
:::

Example:

```solidity
bridgeContract.depositERC20AndSwap(
    "0x222222cf1046e68e36E1aA2E0E07105eDDD1f08E", // source token on the source EVM chain
    1000000000000000000, // amount to transfer
    "0x111111cf1046e68e36E1aA2E0E07105eDDD1f08E", // destination token
    990000000000000000, // minimum acceptable output amount
    1760000000, // swap deadline, unix timestamp in seconds
    "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E", // final receiver
    "11155111", // final target chain id, e.g. Sepolia
    false, // source token is not wrapped
    1 // referral id
)
```

This method emits **`DepositedERC20AndSwapped`**:

```solidity
event DepositedERC20AndSwapped(
    address token,
    uint256 amount,
    string destinationToken,
    uint256 minDestinationAmount,
    uint256 swapDeadline,
    string receiver,
    string network,
    bool isWrapped,
    uint16 referralId
)
```

For EVM swap deposits, **`tx_nonce`** is the emitted **`BridgedNativeAndSwapped`** or
**`DepositedERC20AndSwapped`** event index in the transaction receipt logs.

## Deposit Submission

After the EVM deposit transaction is included in the block and enough confirmations are received, the deposit is
submitted to the TSS parties automatically because EVM is not a privacy chain. The frontend does not need to call the
TSS `/submit` endpoint for the source EVM deposit in the normal case.

The frontend should keep the original deposit identifier and use it to monitor TSS and Swap module status:

- transaction hash - the EVM transaction hash;
- transaction nonce - the emitted **`BridgedNativeAndSwapped`** or **`DepositedERC20AndSwapped`** event index;
- chain id - the source EVM chain identifier on Core.

## Withdrawal

**The withdrawal is processed automatically after the final TSS signature is
ready.** The user does not need to submit an additional withdrawal transaction in the normal case.

**In case something goes wrong with automatic withdrawal processing**, the user can execute the withdrawal manually by
calling either **`withdrawERC20`** or **`withdrawNative`** on the target EVM Bridge contract.

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

- **`txHash_`** is the hash of the final swap-created deposit transaction.
- **`txNonce_`** is the final deposit nonce used in the final TSS submit request.
- **`signatures_`** is the final signature returned by the TSS.
- **`amount_`** is the final withdrawal amount after swap, fees, and decimal conversion.
- **`token_`** is the final withdrawal token address returned by the TSS/Core data.
- **`isWrapped_`** should match the final withdrawal asset type.

:::warning
The EVM withdrawal methods require a 32-byte `txHash_`.

- provide the full transaction hash with `0x` prefix if it is already 32 bytes long;
- use `keccak256(hash)` if the source hash is longer than 32 bytes (e.g Solana tx).
:::

## Swap to EVM

When swapping from an EVM chain to another EVM-compatible network, use **`depositNativeAndSwap`** or
**`depositERC20AndSwap`** on the source EVM chain and set:

- **`destinationToken_`** to the target EVM token address or native token marker configured for the swap route;
- **`receiver_`** to the user's EVM receiver address;
- **`network_`** to the target EVM chain id.

After the final TSS signature is ready, the EVM withdrawal is processed automatically. In case something goes wrong with
automatic withdrawal processing, the user can execute the EVM withdrawal according to the regular EVM bridging flow:

- use **`withdrawNative`** if the final withdrawal asset is native;
- use **`withdrawERC20`** if the final withdrawal asset is ERC20 or wrapped.

## Swap to UTXO networks

When swapping from an EVM chain to a UTXO network, use **`depositNativeAndSwap`** or **`depositERC20AndSwap`** on the
source EVM chain and set:

- **`destinationToken_`** to the target asset representation configured for the swap route;
- **`receiver_`** to the user's UTXO address;
- **`network_`** to the target UTXO chain id.

:::info
The withdrawal transaction fee is taken from the withdrawal amount, as in the regular UTXO bridging flow.
:::

## Swap to Zano

When swapping from an EVM chain to Zano, use **`depositNativeAndSwap`** or **`depositERC20AndSwap`** and set:

- **`destinationToken_`** to the target Zano asset identifier or configured target token value;
- **`receiver_`** to the user's Zano address;
- **`network_`** to the Zano chain id.

## Swap to TON

When swapping from an EVM chain to TON, use **`depositNativeAndSwap`** or **`depositERC20AndSwap`** and set:

- **`destinationToken_`** to the target TON token/Jetton configured for the route;
- **`receiver_`** to the user's TON address;
- **`network_`** to the TON chain id.


## Swap to Solana

When swapping from an EVM chain to Solana, use **`depositNativeAndSwap`** or **`depositERC20AndSwap`** and set:

- **`destinationToken_`** to the target Solana mint or configured target token value;
- **`receiver_`** to the user's Solana receiver account;
- **`network_`** to the Solana chain id.


:::warning
For SPL withdrawals, the receiver must be a token account/ATA expected by the Solana bridge program, not just the owning
wallet address.
:::
