---
sidebar_position: 3
title: Zano to ZEL
---

# Bridge from Zano to ZEL

:::warning Privacy boundary
Zano source transactions follow Zano privacy rules, but destination balances, addresses, and activity on ZEL are public.
:::

The Zano adapter has distinct paths for Confidential Asset burns and gateway deposits. Do not use the asset-burn flow for native ZANO.

:::note Release-specific transaction envelope
This reference describes memo encoding and the testnet adapter's deposit selection. The team must still provide the approved wallet request, gateway or observer address, service-entry envelope, and a decoded test transaction for each route. Do not submit funds using an incomplete example.
:::

## Select the deposit path

- **Confidential Asset burn:** use the approved `burn_asset` wallet request for a supported asset, including the route's observer address and service metadata. The testnet adapter selects this wallet path when the operation nonce is zero.
- **Gateway deposit:** use the approved gateway-transfer flow and address. The testnet adapter uses a positive operation nonce to select a gateway-history entry, then verifies its transaction hash. Obtain that identifier through the release's supported indexing flow; do not guess it or replace it with a service-entry index.

The operation nonce and the memo's position are different concepts. The inspected testnet adapter reads the memo from the first service entry in either path.

For the overall sequence, see [end-to-end bridge flow](/docs/build/zel/bridge-and-swaps/end-to-end-flow).

## Encode the memo body as hex

The TSS parser hex-decodes the service-entry body and then parses JSON. Base64 is not accepted for this body.

```js
function encodeZanoBridgeMemo(destinationAddress, destinationChainId, referralId = 0) {
  const memo = {
    dst_add: destinationAddress,
    dst_net_id: String(destinationChainId),
    referral_id: referralId,
    uniform_padding: "    ",
  };
  const bytes = new TextEncoder().encode(JSON.stringify(memo));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
```

Use the route's destination identifier, which must be confirmed independently of the wallet's EVM chain ID. Put this hex body in the first service entry of the approved transaction envelope. The helper does not construct that envelope or submit a transaction.

## Submit and track the operation

After the source operation has the required confirmations, submit its transaction hash, source-chain identifier, and canonical operation nonce through the [TSS API](/docs/build/zel/bridge-and-swaps/api-and-status). Use the field types required by the deployed API schema.

Keep the original deposit identifier if an API request fails. Retrying status tracking does not require burning or transferring the source asset again.

## Finalize on ZEL

Follow the route's finalization procedure. If an EVM transaction is required, use the returned token address, amount, representation flag, and authorization with the verified deployment ABI. Do not hardcode `isWrapped` to false.

Verify the ZEL receipt, recipient, asset, and amount. A completed source deposit does not prove the destination transfer succeeded. See [bridge contracts](/docs/build/zel/evm-and-contracts/bridge-contracts) and [operation recovery](/docs/build/zel/bridge-and-swaps/operation-lifecycle).
