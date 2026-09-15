---
sidebar_position: 7
toc_max_heading_level: 5
---

# ZEL network

:::note Release scope
These are implementation-reference examples, not a list of enabled routes or verified deployment instructions. Confirm the active route, service release, and contract ABI before integration. See [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status).
:::

The regular swap flow has three stages: bridge the source asset to the ZEL network, swap it, and bridge the
destination asset to the target network. When the ZEL network is the source or target network, the assets are
already on the chain where the swap is executed. The corresponding bridge stage and TSS iteration are therefore
skipped.

## Deposit from the ZEL network

When the source asset is already on the ZEL network, the user should call **`swapAndRoute`** on the Swapper
contract instead of calling **`depositNativeAndSwap`** or **`depositERC20AndSwap`** on the Bridge contract.

```solidity
function swapAndRoute(
    SwapParams calldata swapParams_,
    DepositParams calldata destinationDepositParams_
) external
```

The Swapper contract transfers the source token from the user, executes the swap, and deposits the resulting asset into
the Bridge contract for routing to the target network. Confirm this behavior against the Swapper implementation and ABI recorded in the
[contract registry](/docs/build/zel/evm-and-contracts/contract-registry) for the active release.

The resulting two-stage flow is:

```text
User calls swapAndRoute on the ZEL network
  -> Swapper exchanges token X for token Y
  -> Swapper deposits token Y into the Bridge contract
  -> TSS bridges token Y to the user on the target network
```

There is no initial Bridge deposit or first TSS iteration because token **X** is already on the ZEL network.
After deposit, TSS automaticly starts the bridging flow.


## Withdrawal to the ZEL network

When the target network is the ZEL network, the flow starts normally on the source chain. The user creates the
swap-aware deposit using the method or transaction format required by that source network. The first TSS iteration then
withdraws the source asset to the protocol address on the ZEL network and submits it for swapping.

After the swap, the Swapper recognizes that **`destinationDepositParams_.network`** is the current network and transfers
the destination asset directly to **`destinationDepositParams_.receiver`**.

The resulting two-stage flow is:

```text
User deposits token X on the source network
  -> TSS withdraws token X to the protocol address on the ZEL network
  -> Swapper exchanges token X for token Y
  -> Swapper transfers token Y directly to the user on the ZEL network
```

The Swapper does not create a second Bridge deposit, so there is no second TSS iteration. 

:::warning
The final receiver must be a valid address on the ZEL network. Because the destination is local, the Swapper
parses this value as an EVM address before transferring the swapped tokens.
:::
