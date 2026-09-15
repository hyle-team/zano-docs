---
sidebar_position: 5
toc_max_heading_level: 5
---

# Solana

:::note Release scope
These are implementation-reference examples, not a list of enabled routes or verified deployment instructions. Confirm the active route, service release, and contract ABI before integration. See [Bridge API](/docs/build/zel/bridge-and-swaps/api-and-status).
:::
Bridging from Solana

## Deposit

To initiate a transfer from Solana, the user should call the Bridge program and execute:
- **`depositNative`** instruction for native SOL transfers;
- **`depositWrapped`** instruction for wrapped SPL tokens transfers.
- **`depositSpl`** instruction for SPL tokens transfers.

**`depositNative`** instruction call parameters:
```typescript
program.methods.depositNative(
  bridgeId,  // Bridge identifier
  amount, // Amount to deposit in lamports
  chainId, // Destination chain identifier
  address, // Destination address
  referralId // referral identifier, 0 if no referral
).accounts({
  sender: sender // Public key of the depositor
})
```

The **bridgeId** parameter is a unique identifier of the Bridge program on Solana and should be equal to:
- **`test-first-bridge3`** for Testnet environment;
- **`1`** for Mainnet.


**`depositWrapped`** instruction call parameters:
```typescript
program.methods.depositWrapped(
  bridgeId,
  mintNonce,
  symbol,
  amount,
  chainId, // Destination chain identifier
  address, // receiver
  referralId // referral identifier, 0 if no referral
).accounts({
  sender: sender, // user ATA (associated token account) for the wrapped token
  tokenProgram: TOKEN_2022_PROGRAM_ID,
  signer: signer, // Public key of the depositor 
})
```

Where:
- **tokenProgram** is a constant equal to *TOKEN_2022_PROGRAM_ID*:
```js
// new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
import {  TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
```
- **symbol** and **mintNonce** define the token we want to deposit, they can be retrieved from token metadata.
Nonce here is an arbitrary u64, existing to prevent squatting of token symbols.
**symbol** and **mintNonce** must also be present for withdraw instructions.
- **sender** is the user ATA (associated token account,  default Token Account that is used for tracking individual token ownership )
for the wrapped token. It can be derived using the following code:
```typescript
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
const userAta = await getAssociatedTokenAddress(
  mintAddress, // adrress of the wrapped token
  owner, // Owner of the new account
  false, // Allow the owner account to be a PDA (Program Derived Address)
  tokenAccountInfo?.owner, // SPL Token program account
  ASSOCIATED_TOKEN_PROGRAM_ID, // SPL Associated Token program account
)
```

:::warning
It is assumed that the user has already created an ATA for the wrapped token
(at the moment of withdrawing them) before calling this instruction
:::

**`depositSpl`** instruction call parameters:
```typescript
program.methods.depositSpl(
  bridgeId, // Bridge identifier
  amount, // Amount to deposit in the smallest unit of the token
  chainId, // Destination chain identifier
  address, // Destination address
  referralId // referral identifier, 0 if no referral
).accounts({
  sender: sender,
  mint: mint, // SPL token mint address
  signer: signer, // Public key of the depositor 
  tokenProgram: tokenProgram,
})
```
Where:
- **mint** is the SPL token mint address;
- **signer** is a public key of the depositor;
- **sender** is a TokenAccount (ATA) for the SPL token;
- **tokenProgram** is  either *TOKEN_PROGRAM_ID* or *TOKEN_2022_PROGRAM_ID* depending on the mint. Identifier of the program that owns the account

After submitting the deposit transaction you have to request withdrawal on the
backend: https://tss1.testnet.zano.org/submit. Request example:
  ```json
  {
    "tx_hash": "^[1-9A-HJ-NP-Za-km-z]{86,88}$",
    "chain_id": "same as chain identifier on core",
    "tx_nonce": 0
  }
  ```

For Solana, **tx_hash** is a Base-58 encoded signature and **tx_nonce** is equal to 0 (but can be different if instruction is called from another program rather than by itself)
:::warning
DO NOT prepend `0x` to the Solana transaction hash when sending the request to the TSS API
:::


## Withdrawal

- For SPL (both wrapped and non-wrapped), create or use an existing TokenAccount. Its address must be the receiver specified in the deposit information, not the owning wallet.

Example of creating or using an existing TokenAccount:
```typescript
// Required imports from Solana libraries
import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js'

import {
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

const tokenAccountInfo = await connection.getAccountInfo(mintAddress)

// Derive the user's ATA (Associated Token Account) address for this mint & owner.
// ⚡️ This address is always deterministic (derived from mint + owner + program IDs),
// but the account itself may not exist yet (not created/initialized on-chain).
// That’s why later we must check if it exists and create it if needed.
const userAta = await getAssociatedTokenAddress(
    mintAddress,
    owner,
    false,
    tokenAccountInfo?.owner,
    ASSOCIATED_TOKEN_PROGRAM_ID,
)

// Ensure the receiver's ATA (Associated Token Account) exists before using it
// 1. Check if the account already exists on-chain
const accountInfo = await connection.getAccountInfo(userAta)

if (!accountInfo) {
  // If ATA does not exist → we need to create it
  console.log('📌 ATA does not exist, creating:', userAta.toBase58())

  /**
   * Create instruction for creating the ATA.
   *
   * Params:
   * - payer: account that will pay for creating the ATA
   * - userAta: the new ATA address (derived via getAssociatedTokenAddress)
   * - owner: the wallet that will own the ATA (receives the tokens)
   * - mintAddress: the SPL token mint address (e.g., USDC, RARI, etc.)
   * - tokenAccountInfo?.owner: optional param, usually the wallet provider
   * - ASSOCIATED_TOKEN_PROGRAM_ID: constant program ID for ATA creation
   */
  const ix = createAssociatedTokenAccountInstruction(
    payer,
    userAta,
    owner,
    mintAddress,
    tokenAccountInfo?.owner,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  // Build a transaction that includes the ATA creation instruction
  const ataTx = new Transaction().add(ix)

  // Assign fee payer and set a recent blockhash
  ataTx.feePayer = payer
  ataTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  // Ask wallet provider to sign the transaction
  const signed = await walletProvider.signTransaction(ataTx)

  // Send the signed transaction to the cluster and wait for confirmation
  const ataSig = await sendRawTransactionSafely(connection, signed)
  await connection.confirmTransaction(ataSig, 'confirmed')

  console.log('✅ ATA created and confirmed')
} else {
  // If accountInfo is not null → ATA already exists, so no need to create it
  console.log('✅ ATA already exists:', userAta.toBase58())
}
```

- For wrapped tokens, get **symbol** and **mintNonce** from metadata.
- Form the following data as follows:
```typescript
export async function genUid(
    depositTxHash: string,
    depositTxNonce: BN,
): Promise<Buffer> {
    const message = Buffer.concat([
        Buffer.from(depositTxHash),
        depositTxNonce.toArrayLike(Buffer, 'le', 8),
    ])

    const hashBuffer = await crypto.subtle.digest('SHA-256', message)
    return Buffer.from(hashBuffer)
}

export async function hashWithdraw(
    bridgeId: string,
    amount: BN,
    uid: Buffer,
    address: PublicKey,
    mint?: PublicKey,
): Promise<Buffer> {
    const buffers = [
        Buffer.from('withdraw'),
        Buffer.from(bridgeId),
        amount.toArrayLike(Buffer, 'le', 8),
        uid,
        address.toBuffer(),
    ]
    if (mint) {
        buffers.push(mint.toBuffer())
    }

    const concatenated = Buffer.concat(buffers)
    const hashBuffer = await crypto.subtle.digest('SHA-256', concatenated)
    return Buffer.from(hashBuffer)
}


const uid = await genUid(depositTxHash, depositTxNonce);
const digest = await hashWithdraw(bridgeId, amount, uid, receiver, mint);
```
Run these calls inside an async function or a module that supports top-level `await`.

**UId** is the unique identifier of the deposit transaction, created by hashing its hash and nonce. **Digest** is the hash of payload consisting of **bridgeId**, **amount**, **uid**, **receiver** address, and, for SPL tokens, Mint address.

- Get signature from https://tss1.testnet.zano.org/check/:chainid/:txhash/:tx_nonce. Separate its last byte into recovery id (**recid**), present the rest as byte array.
Example signature processing:
```typescript
/**
 * Splits a 65-byte EVM-style signature into its components:
 * the first 64 bytes (r + s) and the recovery ID (v).
 *
 * Ethereum signatures use a recovery ID (v) of 27 or 28.
 * Some libraries (e.g., ed25519, Solana-side) expect recovery ID
 * in the normalized form (0 or 1). This helper subtracts 27 if needed.
 *
 * Example:
 *   input: 0x{r (32 bytes)}{s (32 bytes)}{v (1 byte)}
 *   output:
 *     {
 *       signature: [64 bytes as number[]],
 *       recid: 0 or 1
 *     }
 *
 * @param {string} signatureHex - A 65-byte hex signature string, with or without "0x" prefix.
 * @returns {{ signature: number[], recid: number }} - The parsed signature array and normalized recovery ID.
 * @throws {Error} If the input length is incorrect or recovery ID is out of bounds.
 */
export function splitEvmSignature(signatureHex: string): {
  signature: number[]
  recid: number
} {
  // Remove "0x" prefix if present
  if (signatureHex.startsWith('0x')) {
    signatureHex = signatureHex.slice(2)
  }

  const fullSig = hexToUint8(signatureHex)
  if (fullSig.length !== 65) {
    throw new Error(
      `Invalid signature length: expected 65, got ${fullSig.length}`,
    )
  }

  let recid = fullSig[64]

  // Normalize recovery ID from Ethereum (27/28) to 0/1
  if (recid >= 27) {
    recid -= 27
  }

  if (recid < 0 || recid > 3) {
    throw new Error(`Invalid recovery ID after normalization: ${recid}`)
  }

  const signature = Array.from(fullSig.slice(0, 64))
  return { signature, recid }
}

const { signature, recid } = splitEvmSignature(
    data.transferData.signature,
)
```
- Use the corresponding program instruction:
    - For native tokens:
  ```typescript
  program.methods.withdrawNative(
      bridgeId, // Bridge identifier
      Array.from(digest),
      amount,
      Array.from(uid),
      Array.from(signature), 
      recid,
    ).accounts({
      receiver: receiver, // Public key of the receiver
    })
  ```
    - For non-wrapped SPL tokens:
  ```typescript
  program.methods.withdrawSpl(
      bridgeId,
      Array.from(digest),
      amount,
      Array.from(uid),
      Array.from(signature),
      recid,
    ).accounts({
      receiver: receiver,
      mint: mint, // SPL token mint address
      tokenProgram: tokenProgram, // either TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID depending on the mint
    })
  ```

    - For wrapped SPL tokens:
  ```typescript
  program.methods.withdrawWrapped(
      bridgeId,
      Array.from(digest),
      mintNonce,
      symbol,
      amount,
      Array.from(uid),
      Array.from(signature),
      recid,
    ).accounts({
      receiver: receiver,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    })
  ```
  
## Bridging to EVM networks
When bridging to EVM, execute one of the **`depositNative`**, **`depositWrapped`** or **`depositSpl`** instructions as described above, specifying the destination EVM address and chain id.

Example transaction to bridge SOL to EVM chain:
```typescript
program.methods.depositNative(
  "1",  // EXAMPLE Bridge identifier
  1000000, // Amount to deposit in lamports
  "11155111", // Destination chain identifier (Sepolia in this example)
  "0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520", // Destination address
  1, // referral identifier, 0 if no referral
).accounts({
  sender: sender
})
```

Example transaction to bridge wrapped SPL token to some chain:
```typescript
const mintAddress = new PublicKey("GMMuRB4pvA4tsjAKsotpFXnUFB2RLQDWAz8kzGZFyqow") // example address of the wrapped token, got from the ZEL Core
const tokenAccountInfo = await connection.getAccountInfo(mintAddress) // Solana RPC Call 

const userAta = await getAssociatedTokenAddress(
  mintAddress,
  owner, // walletProvider.publicKey
  false,
  tokenAccountInfo?.owner,
  ASSOCIATED_TOKEN_PROGRAM_ID, // constant
)

const accountInfo = await connection.getAccountInfo(userAta) // Solana RPC Call
if (!accountInfo) {
  // create ATA if it does not exist, was shown above
  console.log('✅ ATA created and confirmed')
} else {
  console.log('✅ ATA already exists:', userAta.toBase58())
}

// === Wrapped token metadata (Token-2022) ===
// Custom helper to retrieve token metadata
const tokenMetadata = await getTokenExtension(connection, tokenInfo.address, 'tokenMetadata')

const rawMintNonce = tokenMetadata?.additionalMetadata?.find(
  ([key]) => key === 'nonce',
)?.[1]

if (!rawMintNonce) throw new Error('Mint nonce not found')
const mintNonce = new BN(rawMintNonce)
const symbol = tokenMetadata?.symbol as string

// Amount in token units
const amount = parseAmount(humanAmount, Number(tokenInfo.decimals))

const depositIx = await bridgeProgram.methods
  .depositWrapped(
    BRIDGE_ID,
    mintNonce,
    symbol,
    amount,
    chainTo.id,
    receiverAddress,
    referralId, // some uint 16 referral identifier, 0 if no referral 
  )
  .accounts({
    sender: userAta,
    tokenProgram: TOKEN_2022_PROGRAM_ID,
    signer: walletProvider.publicKey,
  })
  .instruction()

// Single blockhash for the tx
const { blockhash } =
  await connection.getLatestBlockhash('finalized')

// Build transaction
const tx = new Transaction({
  feePayer: walletProvider.publicKey,
  recentBlockhash: blockhash,
}).add(depositIx)

// Sign & send
const signedTx = await walletProvider.signTransaction(tx)
const txSig = await sendRawTransactionSafely(connection, signedTx)
```

The deposit submission and withdrawal process is the same as a general [EVM withdrawal flow](evm.md#withdrawal).

:::warning
When withdrawing to EVM, the user must provide a `txHash_` value (see Withdrawal section for EVM chains). 
As Solana transaction hash is Base-58 encoded and does not fit into the `bytes32` type required by EVM contracts,
it should be `keccak256` hashed and the resulting hash should be used as `txHash_`.
:::

## Bridging to UTXO networks
When bridging to UTXO networks, execute **`depositWrapped`** instruction as described above, specifying the destination UTXO address and chain id.
Then, follow the general deposit submission flow.

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is EVM-compatible).
UTXO withdrawals are sent to the network by the TSS nodes automatically after the signing is completed.
However, the commission for the withdrawal transaction will be taken from the withdrawal amount.
:::

## Bridging to Zano
When bridging to Zano, execute either **`depositNative`**, **`depositWrapped`** or **`depositSpl`** instruction as described above, specifying the destination Zano address and chain id.
Then, follow the general deposit submission flow.

:::info
You will not submit any additional withdrawal transactions here (unlike the case when the destination chain is
EVM-compatible).
Zano withdrawals are sent to the network by the TSS nodes automatically after the signing is completed
:::

## Bridging to TON
When bridging to TON, execute either **`depositNative`**, **`depositWrapped`** or **`depositSpl`** instruction as described above, specifying the destination TON address and chain id.
Then, follow the general deposit submission flow.

To withdraw the tokens on the TON see the [TON withdrawal guide](./ton.md#withdrawal).

:::warning
When withdrawing to TON, the user must provide a `txHash_` value.
As Solana transaction hash is Base-58 encoded and does not fit into the `bytes32` type required by TON contracts,
it should be `keccak256` hashed and the resulting hash should be used as `txHash_`.
:::
