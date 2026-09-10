---
sidebar_position: 1
toc_max_heading_level: 5
---

# API

- [Link](https://github.com/dl-tokene/bridge-evm-contracts/blob/d67aee0e107971de2ca8ecfa07c4c3f70ebc5e96/contracts/bridge/Bridge.sol)
  to the EVM smart contracts (with corresponding version).
- TSS [API Doc](https://tss1.testnet.zano.org/api)
- Core [API Doc](https://rpc-api.node1.testnet.zano.org/)

In general, there are two main data sources which can provide the client-side bridge application with all required
information:

- Blockchain
- Bridge backend (TSS).

While the blockchain is responsible for storing the bridge configuration and timestamping performed withdrawals, the
backend is
responsible for signing withdrawals after the deposit verification.

:::info
Basically, bridge can support all transfers between Bitcoin, Bitcoin Cash, Solana, TON, EVM-compatible chains and ZANO (but with Bitcoin/BTCCash you can
only transfer native token that will be converted into the wrapped on target chains).
:::

## Useful API methods

### Networks

**URL**: https://rpc-api.node1.testnet.zano.org/cosmos/bridge/chains

Response entity example (response contains a list of such entities):

```json
{
  "id": "string",
  "type": "string (enum)",
  "bridge_address": "string",
  "operator": "string",
  "confirmations": 0,
  "name": "string"
}
```

- The **id** field is a unique identifier of the network.
- The **type** field can be one of: *ZANO*, *BTC*, *EVM*, **TON**, *SOLANA*.
- The **bridge_address** field stands for the contract address (deposit address) of this network.
- The **operator** is an address of the contract admin.
- The **confirmations** field indicates the number of blocks to wait before considering a deposit valid.
- Finally, the **name** field is a name of network.

### Tokens

**URL**: https://rpc-api.node1.testnet.zano.org/cosmos/bridge/tokens

Response entity example (response contains a list of such entities):

```json
{
  "id": "string",
  "metadata": {
    "name": "string",
    "symbol": "string",
    "uri": "string",
    "dex_name": "string"
  },
  "info": [
    {
      "address": "string",
      "decimals": "string",
      "chain_id": "string",
      "token_id": "string",
      "is_wrapped": true,
      "min_withdrawal_amount": "string" // bigInt as string
    }
  ],
  "commission_rate": "string"
}
```

- The **info** field contains the list of supported tokens and their networks (basically, this fields define the token
  pairs across the chains).
- The **commission_rate** field display the commission in percents, that will be taken from final withdrawal amount for processing the deposit.


### Token info

**URL**: https://rpc-api.node1.testnet.zano.org/cosmos/bridge/token-info/:chainid/:tokenaddress

This method returns the information about the token on specific chain. It is useful to get the identifier of the token
and find the appropriate token info on the target chain.

Response entity example:

```json
{
  "info": {
    "address": "string",
    "decimals": "string", //int
    "chain_id": "string",
    "token_id": "1",
    "is_wrapped": bool,
    "min_withdrawal_amount": "string" // bigInt as string
  }
}
```

### Referrals

**URL**: https://rpc-api.node1.testnet.zano.org/cosmos/bridge/referrals

This method returns a list of referrals registered in the system. 

Response entity example (response contains a list of such entities):

```json
{
  "id": 1,
  "withdrawal_address": "string",
  "commission_rate": "string" // a float in decimal representation in string format, e.g. "0.1" for 10%
}
```

You can also get information about the referral by its ID. This method is useful when you need to check whether a referral exists.

**URL**: https://rpc-api.node1.testnet.zano.org/cosmos/bridge/referrals/:referral_id

The response entity is the same as in the previous method.


### Referrals Rewards
**URL**: https://rpc-api.node1.testnet.zano.org/cosmos/bridge/referrals/rewards/:referral_id

This method returns a list of rewards for a specific referral, broken down by tokens.

Response entity example (response contains a list of such entities):

```json
{
  "referral_id": 0,
  "token_id": "string",
  "to_claim": "string",
  "total_claimed_amount": "string"
}
```

Also you can obtain the total rewards for a specific referral by token. 

**URL**: https://rpc-api.node1.testnet.zano.org/cosmos/bridge/referrals/rewards/:referral_id/:token_id
The response entity is the same as in the previous method.


Learn more about core API [here](https://github.com/Zano-Execution-Layer/zel-core/blob/main/x/bridge/README.md)
## Websocket

To fetch the information about withdrawal status, you can either call https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce
or connect to a websocket. 

The websocket URL
is [wss://tss1.testnet.zano.org/ws/check/:chainid/:txhash/:nonce](wss://tss1.testnet.zano.org/ws/check/:chainid/:txhash/:nonce).

The TSS service will submit responses in the same structure as in default _/check_ method for each status change.
The final status of the withdrawal processing is one of **WITHDRAWAL_STATUS_PROCESSED** or **WITHDRAWAL_STATUS_FAILED**.
