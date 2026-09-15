---
sidebar_position: 3
toc_max_heading_level: 5
---

# UTXO networks

:::note Release scope
These are implementation-reference examples, not a list of enabled routes or verified deployment instructions. Confirm the active route, service release, and contract ABI before integration. See [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status).
:::
Bridging from UTXO networks (Bitcoin, Bitcoin Cash) is supported only for the native tokens (BTC, BCH respectively).

## Deposit
To initiate a transfer from the UTXO-network (Bitcoin, Bitcoin Cash), the user should construct a transaction aligning with the next requirements:
- firstly, deposit transaction should contain the output pointed to the TSS network account address (P2PKH).
  The amount of the output will be tracked as the deposit amount and should not be below the dust threshold (at least 1000 sats, can be possibly changed in the future);
- secondly, the transaction should contain the memo with the required information about transfer parameters (destination address, chain id etc.) to be processed by the TSS network.
  It should be included as the next output after the deposit one using the OP_RETURN script. The format of the memo will be described below.
- optionally, the transaction can contain additional outputs for the change purposes. They do not affect the bridging process.

An example transaction can be found [here](https://bchexplorer.cash/tx/f78e72f8c8f26801c3e8198af8be17bdd84aeb45aea9f5590007fb2b453d0f0c)

---

### Transaction memo

The transaction memo contains the following information:
- destination chain id;
- receiver address on the destination chain;
- referral id (0 if there is no referral).

:::warning
The memo on the UTXO networks is limited to 80 bytes only.
There are exceptions for some destinations chains where raw address can exceed this limit (for example, Zano).
Therefore, in such cases, the address should be compressed (for example, base58-decoded for Zano) to fit into the limit.
:::

The structure of the memo is as follows:
<span style={{color: "violet"}}>**[len(chain-id)]**</span><span style={{color: "green"}}>**[chain-id]**</span><span style={{color: "blue"}}>**[referral-id]**</span><span style={{color: "yellow"}}>**[addr-encoding-byte]**</span><span style={{color: "red"}}>**[addr-bytes]**</span>
where:
- **len(chain-id)** is a single byte that stands for the length of the next field - **chain-id**;
- **chain-id** is the byte array that stands for the identifier of the destination chain (for example, `11155111` for Sepolia), UTF-8 encoded;
- **referral-id** is a two-byte unsigned integer in big-endian format that stands for the referral identifier (0 if there is no referral);
- **addr-encoding-byte** is a single byte that stands for the encoding of the next field - **addr-bytes**. See the table below for supported encodings;
- **addr-bytes** is the byte array that stands for the receiver address on the destination chain, decoded according to the specified encoding.

| Address encoding byte | Encoding type     | Networks supported | Description                                                               |
|:---------------------:|-------------------|:------------------:|:--------------------------------------------------------------------------|
|        `0x01`         | UTF-8             |         -          | Default encoding, bytes will be converted to string using UTF-8 encoding. |
|        `0x02`         | Hex (with 0x)     |         -          | Address should be represented as hex string, prepended with `0x` prefix.  |
|        `0x03`         | Hex with checksum |        EVM         | Same as previous, but address contains checksum                           |
|        `0x04`         | Base58            |    Zano, Solana    | Address should be represented as base58 string                            |
|        `0x05`         | Base64            |        TON         | Address should be represented as base64 string.                           |
|        `0x06`         | Base64url         |        TON         | Address should be represented as base64url string.                        |

Transaction memo example:
- Data:
  - Destination address: <span style={{color: "red"}}>0xbeefD475A76Ec312502ba7B566a9B4CEA91ab030</span>
  - Chain id: <span style={{color: "green"}}>123</span>
  - Referral id: <span style={{color: "blue"}}>123</span>
- Raw memo bytes (not including Bitcoin OP_RETURN opcode and pushdata opcode):
**[ <span style={{color: "violet"}}>3 </span><span style={{color: "green"}}> 49 50 51 </span><span style={{color: "blue"}}>0 123 </span><span style={{color: "yellow"}}>3 </span><span style={{color: "red"}}>190 239 212 117 167 110 195 18 80 43 167 181 102 169 180 206 169 26 176 48 </span> ]**

:::info
UTXO to UTXO networks bridging is not supported (cannot bridge Bitcoin to Bitcoin Cash and vice versa), therefore no rules for the transaction memo are defined for such cases.
:::

---

After the transaction is broadcast, the user should provide the TSS network with the deposit operation data:
- transaction hash — the hash of the transaction that contains the deposit operation, **prepended with the `0x` prefix** (if not present);
- transaction nonce — the number of the output that contains the deposit amount (The transaction memo can be found by checking the next output);
- source chain id — the identifier of the source chain where the deposit operation was executed.

## Withdrawal
TSS network will automatically send the withdrawal transaction to the UTXO network after the signing is completed. The user does not need to submit any additional transactions.
However, the commission for the withdrawal transaction will be taken from the withdrawal amount.

## Bridging to EVM

- Firstly, you have to submit the transaction to the UTXO network (Bitcoin, Bitcoin Cash) that aligns with the requirements mentioned above.
  Example of the transaction memo for EVM bridging:
  - Data:
    - Destination address: <span style={{color: "red"}}>0xbeefD475A76Ec312502ba7B566a9B4CEA91ab030</span>
    - Chain id: <span style={{color: "green"}}>123</span>
    - Referral id: <span style={{color: "blue"}}>123</span>
  - Memo: **[ <span style={{color: "violet"}}>3 </span><span style={{color: "green"}}> 49 50 51 </span><span style={{color: "blue"}}>0 123 </span><span style={{color: "yellow"}}>3 </span><span style={{color: "red"}}>190 239 212 117 167 110 195 18 80 43 167 181 102 169 180 206 169 26 176 48 </span> ]**
  - use `0x03` as the address encoding byte to specify that the raw bytes address is hex with checksum;
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
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6", // DO NOT FORGET TO PREPEND 0x
    "chain_id": "1", // EXAMPLE UTXO chain id
    "tx_nonce": 0 // the index of the output that contains the deposit amount
  }
  ```
  For BTC to EVM bridging the **tx_nonce** identifies the index of the output that contains the deposit amount (
  the deposit information should be placed in the next output with index **tx_nonce**+1). Other UTXOs will not be
  indexed by the bridge.
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. The
  response will contain the information with the signature to be used on the EVM
  smart contract to unlock your wBTC. Response example:
  ```json
    {
    "depositIdentifier": {
        "txHash": "0x227097add7e057f157724dd6ef5f4e233705d1ae3da077e2ed8089dbf12ae9bf",
        "txNonce": 2,
        "chainId": "<source-chain-id>"
    },
    "transferData": {
        "sender": "0xbeefD475A76Ec312502ba7B566a9B4CEA91ab030",
        "receiver": "mv4hoLKtj8HDbGdvZhtayDattLNQG654c6",
        "depositAmount": "34450000000000",
        "withdrawalAmount": "3445",
        "depositAsset": "0xee2a430a8d6f8d9ae6585193303ba5293299b53d",
        "withdrawalAsset": "0x0000000000000000000000000000000000000000",
        "isWrappedAsset": false,
        "depositBlock": "17197568",
        "signature": "0xe23fbdde700619c79d0a76ff1ac5631fc8f201bc63a04c06b6a842fe98e950ad7f5a4e3b9d6e6c8f3c6d3e2e4f5a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d1b"
    },
    "withdrawalStatus": "WITHDRAWAL_STATUS_PROCESSED",
    "withdrawalIdentifier": {
        "txHash": "0xe23fbdde700619c79d0a76ff1ac5631fc8f201bc63a04c06b6a842fe98e950ad",
        "chainId": "1"
    }
  }
  ```
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
    - **txNonce_** field stands for the number of deposit output (same as has been specified during the _/submit_ method
      call)
    - **signatures** field stands for the signature requested from backend
    - **amount** stands for the amount of tokens to withdraw (make sure to specify the withdrawal amount, without commission)
    - **token** stands for the wBTC address (`withdrawalAsset` field from the response above)
    - **isWrapped_** should be *true*.

## Bridging to Zano
- Firstly, you have to submit the transaction to the UTXO network (Bitcoin, Bitcoin Cash) that aligns with the requirements mentioned above.
- Example of the transaction memo for ZANO bridging:

  - Data:
    - Destination address: <span style={{color: "red"}}>ZxCQtdbr6YPHEWr5Yucy2wTT87yKPwBMHGfJg8RVXg2m3bCDzgWjtbxR7TtGPgDxhWNrauwyPAKEyDdknkBG3Rit1Do9rXG1q</span>
    - Chain id: <span style={{color: "green"}}>2</span>
    - Referral id: <span style={{color: "blue"}}>3</span>
  - Memo: **[ <span style={{color: "violet"}}>1 </span><span style={{color: "green"}}> 50 </span><span style={{color: "blue"}}>0 3 </span><span style={{color: "yellow"}}>4 </span><span style={{color: "red"}}>169 227 199 169 10 32 136 169 99 226 243 242 152 74 174 144 233 187 229 219 54 82 139 111 194 19 87 242 111 77 149 242 250 244 21 255 141 92 174 176 204 178 52 49 116 143 50 45 82 12 218 61 69 211 128 6 165 30 15 10 180 201 154 241 59 60 161 158 232 146 140 </span> ]**
  - use `0x04` as the address encoding byte to specify that the raw bytes address is hex with checksum;

- Example UTXO --> Zano transaction can be observed [here](https://bchexplorer.cash/tx/f78e72f8c8f26801c3e8198af8be17bdd84aeb45aea9f5590007fb2b453d0f0c)
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
    "tx_hash": "0x8746c185266a81c240adf7293e656063a11ca1e43d3f81eb2a69a6a622e737d6", // DO NOT FORGET TO PREPEND 0x
    "chain_id": "1", // EXAMPLE UTXO chain id
    "tx_nonce": 0 // the index of the output that contains the deposit amount
  }
  ```
  For BTC to Zano bridging the **tx_nonce** identifies the index of the output that contains the deposit amount (
  the deposit information should be placed in the next output with index **tx_nonce**+1). Other UTXOs will not be
  indexed by the bridge.
- You can request signing status using https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. After
  the response status becomes processed you will receive your tokens.

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is EVM-compatible).
Zano withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
:::

## Bridging to Ton

In general, the flow is the same as for bridging to EVM-compatible chains.

Example of the transaction memo for TON bridging:

- Data:
  - Destination address (base64url-encoded): <span style={{color: "red"}}>EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF</span>
  - Chain id: <span style={{color: "green"}}>45</span>
  - Referral id: <span style={{color: "blue"}}>0</span>
- Memo: **[ <span style={{color: "violet"}}>2 </span><span style={{color: "green"}}> 52 53 </span><span style={{color: "blue"}}>0 0 </span><span style={{color: "yellow"}}>6 </span><span style={{color: "red"}}>17 0 202 110 50 28 124 206 158 206 223 10 140 162 73 46 200 89 36 148 170 95 181 206 3 135 223 249 110 246 175 152 42 62 177 197 </span> ]**
- **use either `0x05` or `0x06` depending on whether TON address is base64 or base64url encoded.**

To make withdrawal on the destination chain, follow the instructions in the [TON withdrawal guide](./ton.md#withdrawal).

## Bridging to Solana

In general, the flow is the same as for bridging to EVM-compatible chains.

Example of the transaction memo for Solana bridging:

- Data:
  - Destination address: <span style={{color: "red"}}>14grJpemFaf88c8tiVb77W7TYg2W3ir6pfkKz3YjhhZ5</span>
  - Chain id: <span style={{color: "green"}}>101</span>
  - Referral id: <span style={{color: "blue"}}>65500</span>
- Memo: **[ <span style={{color: "violet"}}>3 </span><span style={{color: "green"}}> 49 48 49 </span><span style={{color: "blue"}}>255 220 </span><span style={{color: "yellow"}}>4 </span><span style={{color: "red"}}>0 241 205 21 98 197 161 141 68 210 12 55 236 235 224 165 76 164 157 119 100 117 217 202 44 199 84 239 142 185 1 36 </span> ]**
- use `0x04` as the address encoding byte to specify that the raw bytes address is base58 encoded.

To withdraw the tokens on the Solana see the [Solana withdrawal guide](./solana.md#withdrawal).
