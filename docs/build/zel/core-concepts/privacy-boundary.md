---
sidebar_position: 3
title: Privacy boundary
---

# Privacy boundary

ZEL does not inherit Zano's transaction privacy. Treat every ZEL action as public.

## What becomes public on ZEL

- Your EVM account address and balance.
- Token balances and approvals.
- Contract calls, calldata, events, and transaction timing.
- Swap inputs, outputs, routes, slippage settings, and liquidity positions.
- Lending collateral, debt, health factor, and liquidation events.
- Validator activity and, when enabled, delegation, governance, and rewards.
- Links created by reusing addresses or moving distinctive amounts across networks.

## What the bridge can reveal

An observer may correlate a Zano-side deposit or withdrawal with ZEL activity using timing, amount, route, and subsequent account behavior. Zano privacy protects the Zano transaction according to Zano's rules; it does not make the destination EVM account or its future activity private.

Withdrawing from ZEL to Zano restores the ability to use Zano's confidential transaction system for later Zano activity. It does not erase the ZEL transaction history.

:::info Privacy decision
Before bridging, decide whether public smart-contract composability is appropriate for the funds and activity involved. Use Zano L1 when confidential balances and transfers are the priority.
:::

## Application guidance

Applications should preview the source network, destination network, addresses, public amount, fees, route, and expected completion state before requesting a signature. They should never label a ZEL operation as private solely because it originated from or will return to Zano.
