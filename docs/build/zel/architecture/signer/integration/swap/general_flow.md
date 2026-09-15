---
sidebar_position: 1
toc_max_heading_level: 5
---

# General Flow

:::note Release scope
These are implementation-reference examples, not a list of enabled routes or verified deployment instructions. Confirm the active route, service release, and contract ABI before integration. See [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status).
:::

Basic swap flow description for all supported networks.

The swap flow reuses the regular bridging flow and adds an internal swap step between two bridge operations:

1. Bridge the source asset to the protocol address.
2. Swap the received asset through Uniswap V2 pools.
3. Bridge the swapped asset to the final recipient.

When the ZEL network is either the source or the target network, one of the bridge operations is unnecessary.
These two-stage variants are described in [ZEL network](./zel.md).

From the user's point of view, the operation is still a single cross-chain transfer: the user deposits token **X** on
the source chain and receives token **Y** on the target chain. The protocol hides the intermediate bridge, swap, and
second bridge operation behind the same deposit submission and status tracking flow.

## Processing model

In the common three-stage flow, the swap is processed as a composed bridge operation. The user deposit still starts on
the source chain, but the first withdrawal is not sent to the user's receiver address. **Instead, the TSS replaces the
receiver with the protocol address** and signs the first bridge step for the protocol.

After this first bridge step is completed, the protocol owns the bridged representation of token **X** on the
intermediate execution chain. The Swap module then executes the configured Uniswap V2 route. In the default routing
model, the swap is split into two pool operations around the native swap token (NST):

1. token **X** -> NST;
2. NST -> token **Y**.

When the swap is completed, the protocol creates a new internal bridge deposit. This deposit uses token **Y** as the
deposit asset, the user's selected target chain as the withdrawal chain, and the user's original receiver address as the
final receiver. From this point, the request becomes a regular bridge request again: the TSS observes the internal
deposit, signs the final withdrawal, and the user receives token **Y** on the target chain.

In other words, the full lifecycle is:

```text
User deposits token X
  -> TSS bridges token X to the protocol address
  -> Swap module swaps token X to NST
  -> Swap module swaps NST to token Y
  -> Swap module deposits token Y to Bridge module
  -> TSS bridges token Y to the user receiver address on the target chain
```

Recovery is processed through the same lifecycle model, but the protocol stops at the last successfully completed stage
and creates a bridge deposit back to the user with the available asset:

```text
User deposits token X
  -> TSS bridges token X to the protocol address
  -> Swap fails before token Y is received
  -> Swap module creates a recovery deposit with the available token
  -> TSS bridges the recovery asset to the user receiver address
```

## Swap flow

The following steps describe the common three-stage flow where neither endpoint is the ZEL network. See
[ZEL network](./zel.md) for the two-stage source and target variants.

The basic swap flow is as follows:

1. Before initiating the deposit operation, the user should check the:
   - supported source and target chains;
   - supported source and target assets;
   - token decimals on the source and target chains, transform deposit amount properly;
   - bridge fee for the first bridge step;
   - swap route availability;
   - current pool price;
   - selected slippage tolerance;
   - minimum amount of target tokens the user accepts to receive;
   - minimum withdrawal amount on the intermediate chain and on the final target chain.
2. The frontend should fetch the swap route data from the Swap module when available. The route should be built around
   the native swap token (NST):
   - source token -> NST;
   - NST -> target token.
3. The frontend should calculate and display the estimated output amount and the minimum received amount after applying
   slippage. The same slippage value is used for both swap legs.

   :::warning
   The resulting amounts must satisfy the minimum withdrawal amount on both bridge steps: the intermediate chain after
   the first bridge into the protocol address, and the final target chain after the swap. If either amount is below the
   configured minimum withdrawal amount, the swap request can be rejected or routed into recovery.
   :::

4. User initiates the deposit operation on the source network. 

   The deposit data should include the regular bridging data and additional swap metadata:
    - target token address;
    - minimum amount of target tokens to receive;
    - swap deadline (timestamp in seconds, should be greater than the current time).
    
   If the transaction has a referral, it should be included in the deposit transaction data:
   - `0` if there is no referral;
   - any identifier of the referral otherwise (matched by the backend with the list of known referrals). 
   
    
5. After the deposit transaction **is included in the block and enough confirmations are received**, the deposit will be
   submitted to the TSS parties automatically if the current deposit chain is not a privacy chain.

   :::warning
   If the current deposit chain is a privacy chain (for now, Zano), automatic TSS submission is not available. In the
   Zano case, the frontend should provide any of the available TSS parties with the deposit operation data:
   :::

   ```json title="POST https://tss1.testnet.zano.org/submit"
   {
     "tx_hash": "{tx hash, ^0x[a-fA-F0-9]{64}$}", // can differ for specific chains
     "chain_id": "{deposit chain identifier, should be same as chain identifier on core}",
     "tx_nonce": "{tx deposit nonce, differs for specific chains and transaction types}"
   }
   ```

   :::info
   Some chains (e.g. UTXO-based, Zano, TON) do not have a **`0x`** prefix in the transaction hash.
   Make sure to append it when sending the request to the TSS API.

   Solana transaction signatures are an exception: do not prepend `0x` when submitting a Solana deposit hash to the TSS
   API.
   :::

6. After the deposit is submitted to the TSS, either automatically for non-privacy chains or manually by the frontend for
   Zano, the frontend should monitor the first TSS processing step. The TSS
   verifies the deposit, initiates the first signing step, and submits the request to the Swap module if the request
   should be processed as a swap.

   The frontend can monitor TSS status using the regular check endpoint or websocket:

   ```text
   GET https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce
   ```

   ```text
   wss://tss1.testnet.zano.org/ws/check/:chainid/:txhash/:nonce
   ```

7. After the TSS submits the request to the Swap module, the frontend should monitor the swap status through the Swap
   module status API. If the swap can be processed, the Swap module swaps the deposited token into the target token and
   creates a new deposit with:
   - target token **Y** as the deposit asset;
   - the user's selected target chain as the withdrawal chain;
   - the user's receiver address as the final receiver.

   ```text
   GET https://rpc-api.node1.testnet.zano.org/cosmos/swap/swaps/:tx_hash/:tx_nonce/:chain_id
   ```

   The response contains the swap transaction and final swap data:

   ```json
   {
     "swap": {
       "tx": {
         "deposit_chain_id": "string",
         "deposit_tx_hash": "string",
         "deposit_tx_index": "0",
         ...
       },
       "final_receiver": "string",
       "final_token": "string",
       "final_chain_id": "string",
       "swap_deadline": "0",
       "swap_out_amount": "0",
       "final_deposit_tx_hash": "string"
     }
   }
   ```

8. When the Swap module creates the new deposit, the frontend should use the Swap module response to find
   `final_deposit_tx_hash`. This value identifies the final swap-created deposit. The second bridge operation is always
   created on a non-privacy chain, so the final deposit will be submitted to the TSS parties automatically.

9. The final deposit is processed by the TSS as a regular bridge request. After the final deposit is submitted to the
   TSS automatically, the frontend should monitor the final TSS status using the same check endpoint or websocket.

10. After the final signing is completed, the user **either** automatically receives the withdrawal asset (UTXO, Zano)
    **or** should execute the withdrawal operation according to the target chain flow (EVM, TON, Solana). This
    withdrawal operation is the same as for the simple bridging flow.

:::warning
Make sure to wait until the source deposit transaction is confirmed enough before requesting swap processing.

Slippage is checked only when the swap is executed. It does not protect the user from price changes that happen while
the source deposit is waiting for confirmations. The frontend should clearly notify the user about this risk before the
deposit is submitted to the TSS.
:::

## Recovery flow

If the swap cannot be completed, the protocol should trigger the recovery flow automatically.

Common recovery cases include:

- the current pool price moved outside the selected slippage tolerance;
- one of the required pools is unavailable;
- the internal swap or deposit transaction failed.

When the recovery flow is triggered, the user receives the tokens from the last completed stage of the flow. For example,
if the first bridge step completed but the swap failed, the protocol should deposit the bridged wrapped asset back using
the user's source-side parameters.

The frontend should notify the user when recovery is triggered and continue tracking the recovery transaction until it
reaches a final status.
