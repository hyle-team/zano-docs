---
sidebar_position: 3
toc_max_heading_level: 5
---

# UTXO networks

:::note Release scope
These are implementation-reference examples, not a list of enabled routes or verified deployment instructions. Confirm the active route, service release, and contract ABI before integration. See [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status).
:::

Swap flow from UTXO networks (Bitcoin, Bitcoin Cash). UTXO source deposits are supported only for native source assets
(BTC, BCH respectively).

## Deposit

To initiate a swap from the UTXO-network (Bitcoin, Bitcoin Cash), the user should construct a transaction aligning with
the next requirements:

- firstly, deposit transaction should contain the output pointed to the TSS network account address.
  The amount of the output will be tracked as the deposit amount and should not be below the dust threshold (at least
  1000 sats, can be possibly changed in the future);
- secondly, the transaction should contain the memo with the required information about swap parameters (destination
  address, destination chain id, destination token, minimum destination amount, swap deadline, etc.) to be processed by
  the TSS network.
  It should be included as the next output after the deposit one using the OP_RETURN script. The format of the memo will
  be described below;
- thirdly, if the swap memo does not fit into the first OP_RETURN output, the transaction should contain the memo chunk
  outputs immediately after the memo output. The number of such outputs is stored in the memo header;
- optionally, the transaction can contain additional outputs for the change purposes. They do not affect the swap
  process.

The deposit output amount is tracked as the source deposit amount. The deposit output index is used as **`tx_nonce`**.
The memo is read from the next output: **`tx_nonce + 1`**.

:::warning
Only the deposit output identified by **`tx_nonce`** is indexed by the bridge. The memo output must be placed immediately
after that output. If memo chunk outputs are used, they must be placed immediately after the memo output.
:::

:::info
The effective memo size depends on the source UTXO network and relay policy:

- Classic Bitcoin `OP_RETURN` relay policy is limited to **80 bytes**.
- Bitcoin Cash `OP_RETURN` relay policy allows up to **223 bytes**.
- Bitcoin Core v30 changes may allow larger `OP_RETURN` payloads on Bitcoin. If a large Bitcoin `OP_RETURN` transaction
  is mined or otherwise available to the bridge, the bridge can process the full v3 memo without chunk outputs.
  However, not all Bitcoin nodes may relay such large `OP_RETURN` transactions, so frontends should still be ready to
  use memo chunks for broad network compatibility.
:::

## Transaction memo

UTXO swap deposits use the v3 memo format.

The memo starts with a common v3 header:

<span style={{color: "violet"}}>**[magic]**</span><span style={{color: "green"}}>**[version]**</span><span style={{color: "blue"}}>**[chunks-count]**</span><span style={{color: "yellow"}}>**[is-swap]**</span>

where:

- **magic** is a single byte equal to `0xFF`;
- **version** is a single byte equal to `0x03`;
- **chunks-count** is a single byte that defines how many following outputs contain extra memo bytes;
- **is-swap** is a single byte:
  - `0x00` for regular bridge memo;
  - `0x01` for swap memo.

For regular bridge deposits, the body of the memo continues with the default v2 memo.

For swap deposits, the body continues with:

<span style={{color: "violet"}}>**[len(chain-id)]**</span><span style={{color: "green"}}>**[chain-id]**</span><span style={{color: "blue"}}>**[referral-id]**</span><span style={{color: "yellow"}}>**[addr-encoding-byte]**</span><span style={{color: "red"}}>**[len(dst-addr)]**</span><span style={{color: "red"}}>**[dst-addr]**</span><span style={{color: "orange"}}>**[token-encoding-byte]**</span><span style={{color: "orange"}}>**[len(dst-token)]**</span><span style={{color: "orange"}}>**[dst-token]**</span><span style={{color: "cyan"}}>**[len(min-dst-amount)]**</span><span style={{color: "cyan"}}>**[min-dst-amount]**</span><span style={{color: "pink"}}>**[len(swap-deadline)]**</span><span style={{color: "pink"}}>**[swap-deadline]**</span>

where:

- **len(chain-id)** is a single byte length of **chain-id**;
- **chain-id** is the UTF-8 encoded final target chain identifier;
- **referral-id** is a two-byte unsigned integer in big-endian format;
- **addr-encoding-byte** defines how **dst-addr** should be decoded;
- **len(dst-addr)** is a single byte length of **dst-addr**;
- **dst-addr** is the final receiver address bytes;
- **token-encoding-byte** defines how **dst-token** should be decoded;
- **len(dst-token)** is a single byte length of **dst-token**;
- **dst-token** is the token the user wants to receive after the swap;
- **len(min-dst-amount)** is a single byte length of **min-dst-amount**;
- **min-dst-amount** is the minimum acceptable output amount in big-endian format;
- **len(swap-deadline)** is a single byte length of **swap-deadline**;
- **swap-deadline** is a Unix timestamp in seconds, encoded in big-endian format.

:::warning
All length-prefixed fields must be non-empty.
:::

### Encodings

The address and destination token fields use the same encoding byte table.

| Encoding byte | Encoding type     | Networks supported | Description                                                               |
|:-------------:|-------------------|:------------------:|:--------------------------------------------------------------------------|
|    `0x01`     | UTF-8             |         -          | Bytes will be converted to string using UTF-8 encoding.                   |
|    `0x02`     | Hex (with `0x`)   |         -          | Address/token should be represented as hex string with `0x` prefix.       |
|    `0x03`     | Hex with checksum |        EVM         | Same as previous, but address contains checksum.                          |
|    `0x04`     | Base58            |    Zano, Solana    | Address should be represented as base58 string.                           |
|    `0x05`     | Base64            |        TON         | Address should be represented as base64 string.                           |
|    `0x06`     | Base64url         |        TON         | Address should be represented as base64url string.                        |
|    `0x07`     | Hex without `0x`   |        Zano        | Address/token should be represented as hex string without `0x` prefix.    |

### Memo chunking

If the full v3 memo does not fit into the first memo output, the memo can be split into several outputs.

- The first memo output is an `OP_RETURN` output and contains the v3 header plus the first memo bytes.
- **chunks-count** stores the number of following chunk outputs.
- Each following chunk output stores the next raw memo bytes.
- For Bitcoin, chunk outputs are encoded as P2WSH outputs and each chunk stores up to 32 bytes.
- For Bitcoin Cash, chunk outputs are encoded as P2PKH outputs and each chunk stores up to 20 bytes.

:::warning
Chunk outputs must immediately follow the `OP_RETURN` memo output. The TSS reconstructs the memo by reading
`chunks-count` outputs after the memo output and appending their payloads in order.
:::

### Example: BTC to EVM token

Illustrative data only: use a future deadline for a real swap.

Example data:

- Destination chain id: <span style={{color: "green"}}>`123`</span>
- Referral id: <span style={{color: "blue"}}>`123`</span>
- Destination address: <span style={{color: "red"}}>`0xbeefD475A76Ec312502ba7B566a9B4CEA91ab030`</span>
- Destination token: <span style={{color: "orange"}}>`0x0000000000000000000000000000000000000000`</span>
- Minimum destination amount: <span style={{color: "cyan"}}>`100000000000`</span>
- Swap deadline: <span style={{color: "pink"}}>`1760000000`</span>

Memo fields:

<pre><code>
<span style={{color: "#BCCBD5"}}>[0xFF] [0x03] [chunks-count] [0x01]</span>
<span style={{color: "green"}}>[3] [49 50 51]</span>
<span style={{color: "blue"}}>[0 123]</span>
<span style={{color: "red"}}>[0x03] [20] [190 239 212 117 167 110 195 18 80 43 167 181 102 169 180 206 169 26 176 48]</span>
<span style={{color: "orange"}}>[0x03] [20] [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]</span>
<span style={{color: "cyan"}}>[5] [23 72 118 232 0]</span>
<span style={{color: "pink"}}>[4] [104 231 120 0]</span>
</code></pre>

`chunks-count` should be set to `0` if the whole memo fits into the `OP_RETURN` output. Otherwise, it should be set to
the number of following chunk outputs.

### Example: chunked BTC memo

If the memo is larger than the Bitcoin `OP_RETURN` payload limit, the first output after the deposit still contains the
`OP_RETURN` memo header and first memo bytes, but **`chunks-count`** must be set to the number of following chunk
outputs.

Example data:

- Destination chain id: <span style={{color: "green"}}>`1111111111111111111111111111111111111111`</span> (40 bytes)
- Referral id: <span style={{color: "blue"}}>`123`</span>
- Destination address: <span style={{color: "red"}}>`0xbeefD475A76Ec312502ba7B566a9B4CEA91ab030`</span>
- Destination token: <span style={{color: "orange"}}>`0x0000000000000000000000000000000000000000`</span>
- Minimum destination amount: <span style={{color: "cyan"}}>`100000000000`</span>
- Swap deadline: <span style={{color: "pink"}}>`1760000000`</span>

The full memo is 102 bytes, so for classic Bitcoin it is split into one 80-byte `OP_RETURN` payload and one 32-byte
P2WSH chunk. The chunk count byte is therefore set to `0x01`.

:::warning
Chunk payloads must satisfy the script payload size. If the last chunk is shorter than the required payload size, pad it
with `0x00` bytes. Bitcoin P2WSH chunks are padded to 32 bytes, and Bitcoin Cash P2PKH chunks are padded to 20 bytes.
:::

The same colors are used for the encoded bytes below. The gray bytes are script opcodes or zero padding.

<pre><code>
output 0: deposit output to the TSS address

output 1: OP_RETURN memo output payload
<span style={{color: "#BCCBD5"}}>ff030101</span><span style={{color: "green"}}>2831313131313131313131313131313131313131313131313131313131313131313131313131313131</span><span style={{color: "blue"}}>007b</span><span style={{color: "red"}}>0314beefd475a76ec312502ba7b566a9b4cea91ab030</span><span style={{color: "orange"}}>0314000000000000000000</span>

output 1: full OP_RETURN scriptPubKey
<span style={{color: "#BCCBD5"}}>6a4c50</span><span style={{color: "#BCCBD5"}}>ff030101</span><span style={{color: "green"}}>2831313131313131313131313131313131313131313131313131313131313131313131313131313131</span><span style={{color: "blue"}}>007b</span><span style={{color: "red"}}>0314beefd475a76ec312502ba7b566a9b4cea91ab030</span><span style={{color: "orange"}}>0314000000000000000000</span>

output 1: script opcode layout
<span style={{color: "#BCCBD5"}}>6a</span>   OP_RETURN
<span style={{color: "#BCCBD5"}}>4c</span>   OP_PUSHDATA1
<span style={{color: "#BCCBD5"}}>50</span>   payload length: 80 bytes
...  80-byte memo payload

output 2: P2WSH memo chunk payload
<span style={{color: "orange"}}>0000000000000000000000</span><span style={{color: "cyan"}}>05174876e800</span><span style={{color: "pink"}}>0468e77800</span><span style={{color: "#8A91A3"}}>00000000000000000000</span>

output 2: full P2WSH scriptPubKey
<span style={{color: "#BCCBD5"}}>0020</span><span style={{color: "orange"}}>0000000000000000000000</span><span style={{color: "cyan"}}>05174876e800</span><span style={{color: "pink"}}>0468e77800</span><span style={{color: "#8A91A3"}}>00000000000000000000</span>

output 2: script opcode layout
<span style={{color: "#BCCBD5"}}>00</span>   OP_0
<span style={{color: "#BCCBD5"}}>20</span>   push 32 bytes
...  32-byte memo chunk payload
</code></pre>

The final chunk contains the remaining memo bytes followed by `0x00` padding bytes to fill the 32-byte P2WSH payload:

```text
remaining memo bytes: 000000000000000000000005174876e8000468e77800
padding bytes:        00000000000000000000
```

For Bitcoin Cash the idea is the same, but chunk outputs are P2PKH and each chunk carries up to 20 memo bytes.


## Deposit Submission

After the UTXO deposit transaction is included in the block and enough confirmations are received, the deposit is
submitted to the TSS parties automatically because UTXO chains are not privacy chains. The frontend does not need to call
the TSS `/submit` endpoint in the normal case.

The frontend should keep the original deposit identifier and use it to monitor TSS and Swap module status:

- transaction hash - the UTXO transaction hash, prepended with `0x` when used with TSS APIs if not already present;
- transaction nonce - the output index containing the deposit amount;
- chain id - the source UTXO chain identifier on Core.

## Withdrawal

The final withdrawal is processed the same way as a simple bridging withdrawal on the final target chain.

## Swap to EVM

When swapping from a UTXO chain to an EVM-compatible network, construct a v3 swap memo and set:

- **chain-id** to the target EVM chain id;
- **dst-addr** to the user's EVM receiver address;
- **addr-encoding-byte** to `0x03`;
- **dst-token** to the target EVM token address or native token marker configured for the swap route;
- **token-encoding-byte** to `0x03` for EVM token addresses;
- **min-dst-amount** to the minimum acceptable target token amount;
- **swap-deadline** to the selected swap deadline.

## Swap to UTXO networks

When swapping from a UTXO chain to another UTXO network, construct a v3 swap memo and set:

- **chain-id** to the target UTXO chain id;
- **dst-addr** to the user's target UTXO address;
- **addr-encoding-byte** to `0x01`;
- **dst-token** to the target asset representation configured for the swap route;
- **token-encoding-byte** to `0x03` for native token addresses;
- **min-dst-amount** to the minimum acceptable target asset amount;
- **swap-deadline** to the selected swap deadline.

:::info
The withdrawal transaction fee is taken from the withdrawal amount, as in the regular UTXO bridging flow.
:::

## Swap to Zano

When swapping from a UTXO chain to Zano, construct a v3 swap memo and set:

- **chain-id** to the Zano chain id;
- **dst-addr** to the user's Zano address;
- **addr-encoding-byte** to `0x04`;
- **dst-token** to the target Zano asset identifier;
- **token-encoding-byte** to `0x07` for a Zano asset identifier encoded as hex without `0x`;
- **min-dst-amount** to the minimum acceptable target asset amount;
- **swap-deadline** to the selected swap deadline.

## Swap to TON

When swapping from a UTXO chain to TON, construct a v3 swap memo and set:

- **chain-id** to the TON chain id;
- **dst-addr** to the user's TON address;
- **addr-encoding-byte** to `0x05` or `0x06`, depending on whether the TON address is base64 or base64url encoded;
- **dst-token** to the target TON token/Jetton configured for the route;
- **token-encoding-byte** to `0x01`; 
- **min-dst-amount** to the minimum acceptable target amount;
- **swap-deadline** to the selected swap deadline.

## Swap to Solana

When swapping from a UTXO chain to Solana, construct a v3 swap memo and set:

- **chain-id** to the Solana chain id;
- **dst-addr** to the user's Solana receiver account;
- **addr-encoding-byte** to `0x04`;
- **dst-token** to the target Solana mint or configured target token value;
- **min-dst-amount** to the minimum acceptable target amount;
- **token-encoding-byte** to `0x01`;
- **swap-deadline** to the selected swap deadline.

:::warning
For SPL withdrawals, the receiver must be a token account/ATA expected by the Solana bridge program, not just the owning
wallet address.
:::
