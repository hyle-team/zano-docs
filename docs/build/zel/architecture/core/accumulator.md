---
sidebar_position: 3
---

# Accumulator module

The accumulator module manages configured balances and distributions. Its implementation does not define the current ZEL token supply, allocation, or reward policy. See [assets and reward configuration](./tokenomics.md).

:::note Module reference
The distribution requirements below describe the inherited module design. They are not a confirmed allocation schedule for ZANO or the planned staking asset. The team must map them to the active release before publishing economic claims.
:::

![Accumulator](/img/scheme_2.png)

---

## Token distribution requirements

- All tokens should be issued to the accumulator module account in the genesis block;

- Module should be configured to split all tokens into three treasures:
    - community (admin) treasury;
    - NFT shard treasury;
    - validator treasury;

- Validator treasury will be used to cover validators' rewards with linear distribution during 48 months (configurable)
  according to the voting power;

- NFT shard treasury will be used by the NFT module and implies the locking tokens till some data in the non-fungible
  token can be staked;

- Admin treasury will have the self-inner distribution partially configured in the genesis block. This distribution
  implies the following distribution flows:
    - Tokens will be split into the launch and cliff parts;
    - Launch part of tokens should be transferred to the admin’s accounts in the genesis block;
    - Cliff parts of tokens will have different unlock periods (period after the distribution starts);
    - Cliff parts can optionally follow the linear distribution during the fixed period (by default - it should be the
      immediate transfer to the receiver);
    - Cliff parts receiver accounts can be optionally configured later
      with the System master admin;

:::note
_Linear distribution_ or _linear unlocking_ during a certain fixed period involves dividing the entire amount into
several equal parts and being able to transfer (or receive) these parts each time at the same interval.
:::

---

## EndBlock

The `EndBlocker` function handles the vesting process for administrators (admins) by updating their vesting state at the
end of each block. This ensures that admins receive their allocated rewards based on the vesting schedule. Locked tokens
are stored on accumulator pull address.

### EndBlocker flow

The `EndBlocker` function updates the vesting state for each admin, distributing the rewards to their accounts based on
the vesting schedule.

1. **Retrieve Admins**: The function retrieves all admins.
2. **Check Vesting Period**: It checks if the current block time is greater than or equal to the last vesting time plus
   the vesting period.
3. **Check Vesting Counter**: It ensures that the vesting counter has not reached the maximum number of vesting periods.
4. **Distribute Rewards**: If both conditions are met, it distributes the reward to the admin's account.
5. **Increment Counter**: It increments the vesting counter and updates the last vesting time.

The `EndBlocker` function is crucial for maintaining the correct vesting state for admins, ensuring that they receive
the amount that has vested over time according to the specified schedule.

---

## Query Client

### Admins

This query returns list of admins

#### CLI

```shell
noaccumulator admins --flags
```

Example:

```shell
zel-cored query noaccumulator admins
```

Example Output:

```yaml
admins: [ "zel103n4cmjt2je8nqcxg9y9desyhy6m57u5nlve4m" ]
pagination:
  next_key: null
  total: "0"
```

#### HTTP

This query returns list of admins

```
cosmos/cosmos-sdk/accumulator/admins
```

Example:

```http request
http://localhost:1317/cosmos/cosmos-sdk/accumulator/admins
```

Example Output

```json
{
  "admins": [
    "zel103n4cmjt2je8nqcxg9y9desyhy6m57u5nlve4m"
  ],
  "pagination": {
    "next_key": null,
    "total": "0"
  }
}
```

---

## Messages

### AddAdmin

This message is used to add a new admin to the `accumulator` module.

```protobuf
message MsgAddAdmin {
  string creator = 1;
  string address = 2;
  cosmos.base.v1beta1.Coin reward_per_period = 3 [(gogoproto.nullable) = false];
  int64 vesting_periods_count = 4;
  string denom = 5;
  int64 vesting_period = 6;
}

message MsgAddAdminResponse {}
```

:::warning
Note, that only module admin can add new admins.
:::


