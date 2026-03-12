# Gateway Addresses (GW) in Zano

## 1. What are Gateway Addresses?

A Gateway Address (GW) is a new type of address in the Zano blockchain that will be introduced starting with Hard Fork 6. Unlike classic addresses, which operate under the UTXO model, GW addresses use an **account-based model**, meaning that the balance is stored directly on the blockchain rather than being represented as a set of separate UTXOs.

GW addresses are designed to simplify integration with external systems such as cross-chain bridges, DEXs, exchanges, and payment gateways. They follow an approach that is more familiar to these services and provide a simple API that is, in some respects, closer to those used by more traditional blockchain platforms such as Bitcoin and Ethereum. This makes it easier for such services to use established custody frameworks, including MPC, and helps make the integration process more transparent and reliable.

In addition, because GW addresses use an **account-based model**, they avoid the issues related to UTXO fragmentation and distribution that are common in traditional UTXO-based blockchains.

## 2. Structure

Gateway Addresses are entities that must first be registered on the blockchain before they can be used. A GW address can only be registered through a standard Zano wallet by calling the Wallet RPC API(see doc below). Once a GW address is registered, it is assigned an ID, which is effectively its public view key, and presented to user as a string starting from gwZ... (regular) or gwiZ...(integrated). After that, coins can be sent to this GW address. 

Each Gateway Address is associated with two private keys controlled by its owner: a **view key** and a **spend key(owner key)**. In the simplest case, the view key and the spend key may be the same.

In a more advanced setup, a GW address may use different view and spend keys. Importantly, the spend key can be replaced by the owner of the GW address.

### Keys associated with GW address

Each GW address is associated with **two** public keys: a **view key** and a **spend key**.

The **view key** is used exclusively to derive a shared secret between the sender and the recipient, and to encrypt additional information attached to the transaction, such as comments or a `payment_id`, using that secret. Once a view key has been associated with a GW address, it cannot be changed.

The **spend key** acts as a master key that controls all operations related to a GW address, including spending funds and assigning a new owner by replacing the spend key. From a security perspective, this is the most critical key, as it ultimately controls all funds associated with the address.

To make integration with Zano convenient for a wide range of services, we implemented support for several signature types that are widely used across the blockchain industry. Below is a description of these signature types, along with the names of the corresponding API fields in the Wallet RPC API [register_gateway_address](https://docs.zano.org/docs/build/rpc-api/wallet-rpc-api/register_gateway_address):

- `opt_owner_ecdsa_pub_key` - **ECDSA over secp256k1**. This signature type is widely used in blockchain projects such as Ethereum, Bitcoin, and others.
- `opt_owner_eddsa_pub_key` - **Ed25519** (also referred to as EdDSA). This is the variant used in Solana.
- `opt_owner_custom_schnorr_pub_key` - **Zano custom Schnorr signature**, also based on Ed25519.

**opt_owner_ecdsa_pub_key(ECDSA)** and **opt_owner_eddsa_pub_key(Ed25519)** were implemented primarily because these standards are widely supported across the blockchain industry and because there is extensive tooling available for building MPC solutions with these key types.

**opt_owner_custom_schnorr_pub_key(Zano custom Schnorr signature)** is an internal algorithm native to the Zano codebase and integrated into Zano’s core transaction protocols. It has similarities to the scheme used in Solana and relies on the same elliptic curve, but for historical reasons it differs in several implementation details, including the hash function used in the Schnorr algorithm.

Note: View key (`view_pub_key`) can be only **Zano custom Schnorr signature**, as it involved in internal protocol machinery. Only spend key could be assigned as **ECDSA**/**EDDSA***

| Name in API | Curve | Public key | Signature | Use case |
|---|---|---|---|---|
| `opt_owner_ecdsa_pub_key` | secp256k1 | 33 bytes (compressed) | 64 bytes <br>(r \|\| s) | **ECDSA over secp256k1**. This signature type is widely used in blockchain projects such as Ethereum, Bitcoin, and others. |
| `opt_owner_eddsa_pub_key` | Ed25519 | 32 bytes | 64 bytes <br>(R \|\| s) |  **Ed25519** (also referred to as EdDSA). This is the variant used in Solana. |
| `opt_owner_custom_schnorr_pub_key` | Ed25519  | 32 bytes | 64 bytes <br>(c \|\| y) | **Zano custom Schnorr signature**, also based on Ed25519. | 

All three types use the compact signature format (64 bytes, without the recovery byte `v`). The signature is transmitted as a hex string (128 characters).

### Privacy

When a transaction is sent to or from a GW address, some confidentiality is intentionally sacrificed for the parts of the transaction that directly involve the GW address, whether as the sender or the recipient:

- **Amounts** transferred to or from a GW address are stored in an open form. Anyone can see how much was sent or received by the GW address, while the counterparty remains hidden through commitments and stealth addresses.
- The **GW address itself** is visible in each input or output associated with it, whereas regular addresses remain hidden.
- The **Payment ID** always remains **encrypted** using key derivation from the view key. Decryption requires the `view_secret_key`.

This design makes GW addresses suitable for use cases such as bridges, exchanges, and similar services, where a certain level of transparency is acceptable or required.

---

## 3. Creating a GW address

Registration of a GW address is done via **wallet RPC** (`register_gateway_address`), a Zano wallet with sufficient balance is required.

### Prerequisites
#### **IMPORTANT**: You must use **YOUR OWN NODE**, as the `view key` will be transferred there.
- Running and synced Zano daemon (`zanod`) on a network with hard fork 6+
- A wallet with RPC server enabled [(HOWTO)](https://docs.zano.org/docs/build/exchange-guidelines/starting-the-daemon-and-the-wallet-application-as-rpc-server)
- Balance of at least **~100.01 ZANO** (100 ZANO - Registration fee + Default fee)

### Steps

#### Step 1: Key generation

Generate two key pairs:

1. **View keys** (`view_pub_key`, `view_secret_key`) - the GW address identifier. `view_pub_key` will become the address (`gwZ...`), and `view_secret_key` will be needed later to decrypt payment ID in transaction history
2. **Owner keys** (`owner_pub_key`, `owner_secret_key`) - the owners key for signing transactions. 
   

**Note on view key generating: L and main subgroup**

The GW address view key is a point on the Ed25519 curve. The Ed25519 curve has order `8 * L`, where `L` is the order of the prime-order subgroup:

[Wiki Curve25519 L magic number](https://en.wikipedia.org/wiki/Curve25519)
```
L = 2^252 + 27742317777372353535851937790883648493 
```

If the secret scalar is chosen arbitrarily (without the restriction `< L`), the resulting point may contain a **torsion component** — a small multiplier of order 2, 4, or 8. Such points lie outside the main subgroup and create a vulnerability: two different scalars can generate the same point (address collision).

During registration, Zano Core verifies that `view_pub_key` belongs to the main L-subgroup (no torsion). Therefore, when generating a view key, you need to:

1. Select a random scalar `s` in the range `[1, L-1]`
2. Compute the public key as `s * G` 

This ensures that the public key resides in the main subgroup and that the registration will pass validation.

**ECDSA low-S normalisation**

[EIP-2 explaining link](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2.md)

For ECDSA signatures (secp256k1), Zano requires that the value of `s` be in the "lower half" (`s <= n/2`, where `n` is the order of the secp256k1 curve). This is a standard requirement (EIP-2) that prevents signature malleability. Our `ethers.js` v6 library automatically normalizes `s` when calling `signingKey.sign()`, so no additional action is required.

**nodejs - keygen example**

```javascript
// gen Ed25519 view keys (valid scalar < L, main-subgroup public key)
const ED25519_L = (1n << 252n) + 27742317777372353535851937790883648493n;

function randomScalarLtL() {
  while (true) {
    const b = ethers.randomBytes(32);
    const x = BigInt('0x' + Buffer.from(b).toString('hex'));
    const s = x % ED25519_L;
    if (s !== 0n) return s;
  }
}

function scalarToLe32Hex(s) {
  const out = Buffer.alloc(32, 0);
  let x = s;
  for (let i = 0; i < 32; i++) {
    out[i] = Number(x & 0xffn);
    x >>= 8n;
  }
  return out.toString('hex');
}

const scalar = randomScalarLtL();
const viewSecretKey = scalarToLe32Hex(scalar);
const viewPubKey = Buffer.from(ed.Point.BASE.multiply(scalar).toBytes()).toString('hex');

console.log('View public key (GW address ID):', viewPubKey);
console.log('View secret key (save securely!!):', viewSecretKey);

// gen Ethereum owner keys for tx sign
const ownerWallet = ethers.Wallet.createRandom();
const ownerEthPubKey = ethers.SigningKey.computePublicKey(ownerWallet.privateKey, true).substring(2); // remove '0x', 33 bytes hex

console.log('Owner ETH public key:', ownerEthPubKey);
console.log('Owner ETH private key (save securely!):', ownerWallet.privateKey);
```

#### Step 2: Call register_gateway_address

```
User                  Wallet RPC            Blockchain
     |                     |                    |
     | 1. Generate keys    |                    |
     |    view + owner     |                    |
     |                     |                    |
     | register_gateway_   |                    |
     | address ----------> |                    |
     |                     | TX (fee=100 ZANO)  |
     |                     | -----------------> |
     |                     |                    | Validation:
     |                     |                    | - fee >= 100 ZANO
     |                     |                    | - no torsion
     |                     |                    | - address not taken
     |                     |                    |
     | gwZ..., tx_id  <--- |                    |
     |                     |                    |
```

**Request** (wallet JSON-RPC):

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "register_gateway_address",
  "params": {
    "view_pub_key": "4dbaa579daf3c4a91e6be2efde9568975f7b506b50d18bbefd6f03132b2ef180",
    "descriptor_info": {
      "opt_owner_ecdsa_pub_key": "0375d5e222b50cb55ede0a70ebb398ebc9e5d5e74ea0cbce860d4a38301877f4f7",
      "meta_info": "Example GW address for documentation"
    }
  }
}
```

Instead of `opt_owner_ecdsa_pub_key` you can specify:
- `opt_owner_custom_schnorr_pub_key` - for Schnorr key (64 hex)
- `opt_owner_eddsa_pub_key` - for EdDSA key (64 hex)

Exactly **one** owner key type must be specified.

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "address": "gwZ5sqxb53vdd7RjUoPoSWeELimisUGprEX3P8fhcQwc8Dw6xpnSgfC1v",
    "address_id": "4dbaa579daf3c4a91e6be2efde9568975f7b506b50d18bbefd6f03132b2ef180",
    "status": "OK",
    "tx_id": "3a0af1fc8dd142234e0ee300ccd930964d1a17ff9bab51cf610818db0e82fc4a"
  }
}
```

After the transaction is confirmed in a block, the GW address is registered **permanently**.

**Node.js - registration and verification:**

```javascript
async function registerGatewayAddress(viewPubKey, ownerEthPubKey) {
  const regResult = await callWalletRpc('register_gateway_address', {
    view_pub_key: viewPubKey,
    descriptor_info: {
      opt_owner_ecdsa_pub_key: ownerEthPubKey,
      meta_info: 'Example GW address for documentation',
    },
  });

  console.log('Registered GW address:', regResult.address);
  console.log('Transaction ID:', regResult.tx_id);

  console.log('Waiting for confirmation...');
  await sleep(20000);

  const info = await callDaemonRpc('gateway_get_address_info', {
    gateway_address: regResult.address,
  });

  console.log('GW address info:', JSON.stringify(info, null, 2));
  console.log('Balances:', info.balances);
  console.log('View pub key:', info.gateway_view_pub_key);

  return regResult.address;
}
```

#### Step 3: Verify registration

Use daemon RPC `gateway_get_address_info`:

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "gateway_get_address_info",
  "params": {
    "gateway_address": "gwZ5sqxb53vdd7RjUoPoSWeELimisUGprEX3P8fhcQwc8Dw6xpnSgfC1v"
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "status": "OK",
    "descriptor_info": {
      "opt_owner_ecdsa_pub_key": "0375d5e222b50cb55ede0a70ebb398ebc9e5d5e74ea0cbce860d4a38301877f4f7",
      "meta_info": "Example GW address for documentation"
    },
    "balances": [],
    "gateway_view_pub_key": "4dbaa579daf3c4a91e6be2efde9568975f7b506b50d18bbefd6f03132b2ef180",
    "payment_id": ""
  }
}
```

Balances are still empty - the address was just created

---

## 4. Sending funds from a GW address (two-step API)

Sending funds from a GW address is done via **daemon RPC** (!not wallet RPC!) in three stages: creating an unsigned transaction, signing, and broadcasting to the network.

This approach allows signing transactions **outside the daemon** - for example, in MetaMask (for Ethereum keys), on a cold wallet, or in any external system.

### General flow

```
External service            Daemon (zanod)            Blockchain
      |                           |                       |
      |  gateway_create_          |                       |
      |  transfer --------------> |                       |
      |    origin_gateway_id      | Checks balance        |
      |    destinations, fee      | Builds unsigned TX    |
      |                           |                       |
      |  tx_hash_to_sign     <--- |                       |
      |  tx_blob                  |                       |
      |                           |                       |
      |  +--------------------+   |                       |
      |  | Signs               |  |                       |
      |  | tx_hash_to_sign     |  |                       |
      |  | with owner_key      |  |                       |
      |  | (offline/MetaMask)  |  |                       |
      |  +--------------------+   |                       |
      |                           |                       |
      |  gateway_sign_            |                       |
      |  transfer --------------> |                       |
      |    tx_blob + signature    | Inserts signature     |
      |                           |                       |
      |  signed_tx_blob      <--- |                       |
      |                           |                       |
      |  sendrawtransaction ----> | --------------------> |
      |                           |        Into block     |
```

### Step 1: Create transaction - `gateway_create_transfer`

**Request** (daemon JSON-RPC):

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "gateway_create_transfer",
  "params": {
    "origin_gateway_id": "4dbaa579daf3c4a91e6be2efde9568975f7b506b50d18bbefd6f03132b2ef180",
    "destinations": [
      {
        "amount": 1000000000000,
        "address": "ZxCBjKr7pukfAKj5uiR2kbYPAu56F4rxVVH6m6m4Uk6f5zusV6xPKhW1LStNDiibPjjNWXUYKSmUScphZjZHfzpX32JyFYyBv",
        "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a"
      }
    ],
    "fee": 100000000,
    "comment": "Payment for services"
  }
}
```

Destinations can be both regular addresses (`Z...`) and other GW addresses (`gwZ...`).

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "status": "OK",
    "tx_hash_to_sign": "20e922b32dfe9b8b6bc6004e40f4198c9e966d5e228cd4830656ba967f8a205c",
    "tx_blob": "040141004dbaa579daf3c4a91e6be2efde9568975f7b506b50d18bbefd6f03132b2ef18074c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b626880988be49903000516787ebe13ed53f6e5225ef5c481024b7f331a42fefa6d859c785521116659150a1700000b0217ce0b0264e42700e40b5402000000023f00f2085ea66732a56db0771aefcaa9c9fcb7828bcf4275d45579c5921d13516df041eacba1733953ed9dd2d2672d20c866076477c32e061536deb1245cb2804137e64ba3acd47465143f7e568afc2c1c3add2b9ffc13520feec9cb8ee734dbd3a574c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b6268d2ff9f07847d62ebc7202bc521e74f94003f007e5ad2eab4fb7f4a0b19177b593043e30640993e7c844397767c8a22e91521bb97c2d275ee1760109f93d2021cfebffd73aa1e0da75a3cbd737910de3fbe92fb4bbb7523374f82711e894d357b82283f5df7963769d77a80572c0612b0be151374c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b6268e359da40dc207efd55f19663586410d00006000143004600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000032e002f07b6039875cc562b68a034d3acd220672f7213dce03a425deba13c9a01759d65b1c4e06210da36d87f7c6a81c46cd43ec869018e0b2497f6adf79f06aaad6a3080793811d4059534b25449addbcaa1ac642cb9086dbf060d0a8cd685d05532ef23c7e85c9eac2533d21571249799722f491f4318c1426b2ee61cb9575e824302bb95a145a2cb71a682fb652d431f8f17dd66e0036decc89a17784a5d84f4000e36580e5e0bd1bca7d3d4575c2ecec56afdb85ab06986bb35613262fd12e8080482d68d09e8e9b43779f6f9913977935ce00dc2b47e8121ab24d17cf8999992b0c2075effe6cd4b0ad21ac3a310a94cc5b481373c05960cb1ae134d75f8184005e45fc1134f2bd4de031826856e494d4d06e4b2d3164e98b752b4f559df5169b986378c0fd4ddbada717875a15097773974fec4a8419dcdad4fdceb7d6fa5ad71072f36a5888dedc29c3beabcc0784c1035cde704d14d799ee794558b1bfb839537a6663da725062aaa83bee9896eceffaf1236799bb59c7b9bc98c4c20414f254fd151438a6f4208e02bfa6050414dfb1df3c2e41d1173ee9c1da2b60e1fbf84519bad7690be9d01c927da4aa3ee59a7b292caafba860fe1687c344994e80f6b18f5853acfac90be73993e4658de57d6e15b242c8774816433e3a13c1e385bb649efe87e18a75624bd47b25e8414a6b7c2a2deea6988576d8ddeae0be1f689bfe7679f77afe745cf1d819b0d18783aef1122fa1a22917b95a0495b965aad389907aaf96dd1744f4ad5d615e5f46c0853ac8f5a43d404e576db9112eb10182a55f8047b96f8bdb3d0c7b04a2fcef6faa4b732b74d142158bbaba42f32a4216e22a60f33a99867067d22fae284cbefd0e77116ab5274d6fd904725cb23736c4a6d020102932a7296485c475d663f3da145150687fd97f229cb875b0723fad6e9ff545cf90dfa73f05cfb4b90a784d3baea4314a9fc99bb0be5e1eb9bf14341fcb3178a5102fdf319fbafb71264060a697b4b312111ebe4eee25afb2c6c3e12bdda4ed7ea0e433d03150eae875856e1ccba6d70d804747b22b7961bd2a332364919d0d5380002e2f5cac81634c1d768b2a61bb39fda2016fb0bdb75dec9277baa70d4ade8b9069eb890a3c331fd1e45f16fb76adaeaa090a8aa3af3691c0a4c6127ae4213dd0ac55f3f8d223f7f7ee7151e12d4ba8367b2c2bc299b5d30fa8056e7a95c1eb40c30e72c83b96c57d3c13f804e58c20571ef9c934860cbf66746a780e9dfa2444f0221bb69bc9c2099d3672bb30d95b4d1299c57d1b1ad077ea53b9887fc401cf70ab29cdb7bd636d417506749ab6aaae4d00395d8aaa4d5d82ec596c60d850db10e"
  }
}
```

The daemon checks:
- The GW address exists in the blockchain
- Sufficient funds for each asset_id (including fee in native coin)

### Step 2: Sign transaction - `gateway_sign_transfer`

Take `tx_hash_to_sign` from the response and sign it with **your owner_secret_key** (the one whose public key was specified during registration). The signature can be generated in any external system.

**Request** (daemon JSON-RPC):

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "gateway_sign_transfer",
  "params": {
    "tx_blob": "040141004dbaa579daf3c4a91e6be2efde9568975f7b506b50d18bbefd6f03132b2ef18074c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b626880988be49903000516787ebe13ed53f6e5225ef5c481024b7f331a42fefa6d859c785521116659150a1700000b0217ce0b0264e42700e40b5402000000023f00f2085ea66732a56db0771aefcaa9c9fcb7828bcf4275d45579c5921d13516df041eacba1733953ed9dd2d2672d20c866076477c32e061536deb1245cb2804137e64ba3acd47465143f7e568afc2c1c3add2b9ffc13520feec9cb8ee734dbd3a574c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b6268d2ff9f07847d62ebc7202bc521e74f94003f007e5ad2eab4fb7f4a0b19177b593043e30640993e7c844397767c8a22e91521bb97c2d275ee1760109f93d2021cfebffd73aa1e0da75a3cbd737910de3fbe92fb4bbb7523374f82711e894d357b82283f5df7963769d77a80572c0612b0be151374c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b6268e359da40dc207efd55f19663586410d00006000143004600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000032e002f07b6039875cc562b68a034d3acd220672f7213dce03a425deba13c9a01759d65b1c4e06210da36d87f7c6a81c46cd43ec869018e0b2497f6adf79f06aaad6a3080793811d4059534b25449addbcaa1ac642cb9086dbf060d0a8cd685d05532ef23c7e85c9eac2533d21571249799722f491f4318c1426b2ee61cb9575e824302bb95a145a2cb71a682fb652d431f8f17dd66e0036decc89a17784a5d84f4000e36580e5e0bd1bca7d3d4575c2ecec56afdb85ab06986bb35613262fd12e8080482d68d09e8e9b43779f6f9913977935ce00dc2b47e8121ab24d17cf8999992b0c2075effe6cd4b0ad21ac3a310a94cc5b481373c05960cb1ae134d75f8184005e45fc1134f2bd4de031826856e494d4d06e4b2d3164e98b752b4f559df5169b986378c0fd4ddbada717875a15097773974fec4a8419dcdad4fdceb7d6fa5ad71072f36a5888dedc29c3beabcc0784c1035cde704d14d799ee794558b1bfb839537a6663da725062aaa83bee9896eceffaf1236799bb59c7b9bc98c4c20414f254fd151438a6f4208e02bfa6050414dfb1df3c2e41d1173ee9c1da2b60e1fbf84519bad7690be9d01c927da4aa3ee59a7b292caafba860fe1687c344994e80f6b18f5853acfac90be73993e4658de57d6e15b242c8774816433e3a13c1e385bb649efe87e18a75624bd47b25e8414a6b7c2a2deea6988576d8ddeae0be1f689bfe7679f77afe745cf1d819b0d18783aef1122fa1a22917b95a0495b965aad389907aaf96dd1744f4ad5d615e5f46c0853ac8f5a43d404e576db9112eb10182a55f8047b96f8bdb3d0c7b04a2fcef6faa4b732b74d142158bbaba42f32a4216e22a60f33a99867067d22fae284cbefd0e77116ab5274d6fd904725cb23736c4a6d020102932a7296485c475d663f3da145150687fd97f229cb875b0723fad6e9ff545cf90dfa73f05cfb4b90a784d3baea4314a9fc99bb0be5e1eb9bf14341fcb3178a5102fdf319fbafb71264060a697b4b312111ebe4eee25afb2c6c3e12bdda4ed7ea0e433d03150eae875856e1ccba6d70d804747b22b7961bd2a332364919d0d5380002e2f5cac81634c1d768b2a61bb39fda2016fb0bdb75dec9277baa70d4ade8b9069eb890a3c331fd1e45f16fb76adaeaa090a8aa3af3691c0a4c6127ae4213dd0ac55f3f8d223f7f7ee7151e12d4ba8367b2c2bc299b5d30fa8056e7a95c1eb40c30e72c83b96c57d3c13f804e58c20571ef9c934860cbf66746a780e9dfa2444f0221bb69bc9c2099d3672bb30d95b4d1299c57d1b1ad077ea53b9887fc401cf70ab29cdb7bd636d417506749ab6aaae4d00395d8aaa4d5d82ec596c60d850db10e",
    "tx_hash_to_sign": "20e922b32dfe9b8b6bc6004e40f4198c9e966d5e228cd4830656ba967f8a205c",
    "opt_ecdsa_signature": "c2b347b83da0a79637b74ad4b504030033b771ac8cb1f610757f82e88d112b1032ef615efb2cf3f2e70c15de9c63208ca80c1cea70f12785648c98a5ca3c7b40"
  }
}
```

Instead of `opt_ecdsa_signature` use:
- `opt_custom_schnorr_signature` - if owner key is Schnorr
- `opt_eddsa_signature` - if owner key is EdDSA

Exactly **one** signature must be specified.

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "status": "OK",
    "signed_tx_blob": "040141004dbaa579daf3c4a91e6be2efde9568975f7b506b50d18bbefd6f03132b2ef18074c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b626880988be49903000516787ebe13ed53f6e5225ef5c481024b7f331a42fefa6d859c785521116659150a1700000b0217ce0b0264e42700e40b5402000000023f00f2085ea66732a56db0771aefcaa9c9fcb7828bcf4275d45579c5921d13516df041eacba1733953ed9dd2d2672d20c866076477c32e061536deb1245cb2804137e64ba3acd47465143f7e568afc2c1c3add2b9ffc13520feec9cb8ee734dbd3a574c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b6268d2ff9f07847d62ebc7202bc521e74f94003f007e5ad2eab4fb7f4a0b19177b593043e30640993e7c844397767c8a22e91521bb97c2d275ee1760109f93d2021cfebffd73aa1e0da75a3cbd737910de3fbe92fb4bbb7523374f82711e894d357b82283f5df7963769d77a80572c0612b0be151374c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b6268e359da40dc207efd55f19663586410d0000600014300471cd5b4827d23f04b86a4adeb3733b414cae32221d82b6be30479f056030ae37c2d23ef2f4ad34c55f1a9e1c299a71ad6db414cd41d9e9202d0f3644acf6224f1032e002f07b6039875cc562b68a034d3acd220672f7213dce03a425deba13c9a01759d65b1c4e06210da36d87f7c6a81c46cd43ec869018e0b2497f6adf79f06aaad6a3080793811d4059534b25449addbcaa1ac642cb9086dbf060d0a8cd685d05532ef23c7e85c9eac2533d21571249799722f491f4318c1426b2ee61cb9575e824302bb95a145a2cb71a682fb652d431f8f17dd66e0036decc89a17784a5d84f4000e36580e5e0bd1bca7d3d4575c2ecec56afdb85ab06986bb35613262fd12e8080482d68d09e8e9b43779f6f9913977935ce00dc2b47e8121ab24d17cf8999992b0c2075effe6cd4b0ad21ac3a310a94cc5b481373c05960cb1ae134d75f8184005e45fc1134f2bd4de031826856e494d4d06e4b2d3164e98b752b4f559df5169b986378c0fd4ddbada717875a15097773974fec4a8419dcdad4fdceb7d6fa5ad71072f36a5888dedc29c3beabcc0784c1035cde704d14d799ee794558b1bfb839537a6663da725062aaa83bee9896eceffaf1236799bb59c7b9bc98c4c20414f254fd151438a6f4208e02bfa6050414dfb1df3c2e41d1173ee9c1da2b60e1fbf84519bad7690be9d01c927da4aa3ee59a7b292caafba860fe1687c344994e80f6b18f5853acfac90be73993e4658de57d6e15b242c8774816433e3a13c1e385bb649efe87e18a75624bd47b25e8414a6b7c2a2deea6988576d8ddeae0be1f689bfe7679f77afe745cf1d819b0d18783aef1122fa1a22917b95a0495b965aad389907aaf96dd1744f4ad5d615e5f46c0853ac8f5a43d404e576db9112eb10182a55f8047b96f8bdb3d0c7b04a2fcef6faa4b732b74d142158bbaba42f32a4216e22a60f33a99867067d22fae284cbefd0e77116ab5274d6fd904725cb23736c4a6d020102932a7296485c475d663f3da145150687fd97f229cb875b0723fad6e9ff545cf90dfa73f05cfb4b90a784d3baea4314a9fc99bb0be5e1eb9bf14341fcb3178a5102fdf319fbafb71264060a697b4b312111ebe4eee25afb2c6c3e12bdda4ed7ea0e433d03150eae875856e1ccba6d70d804747b22b7961bd2a332364919d0d5380002e2f5cac81634c1d768b2a61bb39fda2016fb0bdb75dec9277baa70d4ade8b9069eb890a3c331fd1e45f16fb76adaeaa090a8aa3af3691c0a4c6127ae4213dd0ac55f3f8d223f7f7ee7151e12d4ba8367b2c2bc299b5d30fa8056e7a95c1eb40c30e72c83b96c57d3c13f804e58c20571ef9c934860cbf66746a780e9dfa2444f0221bb69bc9c2099d3672bb30d95b4d1299c57d1b1ad077ea53b9887fc401cf70ab29cdb7bd636d417506749ab6aaae4d00395d8aaa4d5d82ec596c60d850db10e"
  }
}
```

### Step 3: Broadcast transaction - `sendrawtransaction`

**Request** (daemon JSON-RPC):

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "sendrawtransaction",
  "params": {
    "tx_as_hex": "040141004dbaa579daf3c4a91e6be2efde9568975f7b506b50d18bbefd6f03132b2ef18074c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b626880988be49903000416bc24fb10b82024e49ab7182aa306f598fe1a25115709ac52bf8a5937823478f81700000b02414b2700e40b5402000000013f006a09e2c8d78239f6ee24e03e2fdeb1833d7db2a1054443c32437354507e77c9f6b112168f194242ec0272040f9ca3be77b1819dc979c0ed4f811806f9f41fffa070ba81bb0696493b30b622c72db50916ca84ed92cd31a24d9e12ec929e5717e74c32d3eaafafc623bf483e858d42e8bf4ec7df064ada2e34934469cff6b62689694946034ed290c47fae35d7304c3cc000600014300473daee84aaa98d68c198d46b21d5c394c588909c06c68810c8cf49fbefa39eaaa0e8ad7b7da716c05806050459a7bef091406067c354f204a7f6e29572f8e756e032e002f0612fb23e26ee199be79821647fd5860b41a9fabfc5a10103832434b4f825ebd5735fc6801bac7aefa358989fe2085312e2d887bcdc8b4dc9d3fd98d8e8456cc7d5d2f1358e94b48ca2b77013a223532752f9e386d6fe2043bb9d1e8dc360f93c2b3a4c15b81caf3a5b3e9ce8a577dc2e621a645b83598ef1010011e13188a68805316fbeb7c5e02b98be11015395d612cee39947cffe6f1d9341da8c115c84ea80b338686aff8a82615e3676aab91a080cfed08375977aa1240aef82e6e2ccc5c06f9210c53cd37401b3321831b136f5301b1f8ef6f69f79d65c881707e7c47443371c3d6c7ee39a60453231d7e2fc0d3a9d8d88fee40a6672ba34a778116ecc29e10c7fedeada99c269503be5190411116a24d2b7a7180f52612b0e709d392c41139ef11e8b9c7fc13dfdb5628e6a7fcd10ab8a8627f076677d45a1d13e8083b05033b18ce459226204109f3f7dce14bba9f27bec1eac584e4a56507c610e8c3f41454609875c220c371722a842dd80e41d1c22a3e472fed2d423f7cd4034a0197ce0f76002f3d04d05bc9497cb8fb5d00a5e3ef78929816d7af102dbaeee6c991b7d1266dd552c78e796815d1d407537faf43cde87798d0374468f71585631e21cd13a9044b1ad60a2d91e185060fd54209f56fa8a022479e753db6fbeaaf060f99b2c8a1725c3f15124ad5711d715081772743b2236551f1954abd531ec2680534f5ccedd31840f29335b296c33e3c11b17474cf38d0f25ef9e130c3cd1817048e8702e785d3260ed095540720c27a1c6a89ce7d57d0ca5f2a2c033fb89e8d0f012693d2098d08c8b455cff771e39e0b1830e01ed35a4e2e34b842e8a34b4c434d010adaf2839eac45d825365919929013e46580a1ee64d73031acc97028b5d77b0e01d4edbe066ed6930681795d723844550a6f0f2fe258ea3dbd266919db5e874e05e08b0f31d849080490600a1de353635bce5f5ded2bae416bc9aea947eac0470a30359fe209a2aa58760b8641285f1a5942a5c8a1aea3f101bdf719295920a4cd0be7629baf5dbc850da978b46bbd21a9663093bee79b4fe96cb0548670560eb00db9f703f1a03937940bc14ff98cd3cad479d6ad18b613374183e9d21d6cc10703"
  }
}
```

After confirmation in a block, the GW address balance will be updated.

**Node.js - full send flow (create + sign + broadcast):**

```javascript
async function sendFromGateway(gatewayAddressId, recipientAddress, amount, ownerWallet) {
  const createResult = await callDaemonRpc('gateway_create_transfer', {
    origin_gateway_id: gatewayAddressId,
    destinations: [
      { amount: amount - 1, address: recipientAddress },
      { amount: 1, address: recipientAddress }
    ],
    fee: 10000000000,
    comment: 'Payment from GW address',
  });

  console.log('TX hash to sign:', createResult.tx_hash_to_sign);

  // sign with ETH private key
  const bytesToSign = ethers.getBytes('0x' + createResult.tx_hash_to_sign);
  const signature = ownerWallet.signingKey.sign(bytesToSign);
  const ethSignature = signature.r.slice(2) + signature.s.slice(2);

  console.log('ETH signature (r||s):', ethSignature);

  const signResult = await callDaemonRpc('gateway_sign_transfer', {
    tx_blob: createResult.tx_blob,
    tx_hash_to_sign: createResult.tx_hash_to_sign,
    opt_ecdsa_signature: ethSignature,
  });

  console.log('Transaction signed successfully');

  const sendResult = await callDaemonRpc('sendrawtransaction', {
    tx_as_hex: signResult.signed_tx_blob,
  });

  console.log('Transaction broadcasted:', sendResult.status);
  return createResult.tx_hash_to_sign;
}
```

### Sending TO a GW address

To send funds **to** a GW address, use the regular wallet RPC `transfer` - just specify `gwZ...` as the destination address:

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "transfer",
  "params": {
    "destinations": [
      {
        "amount": 2000000000000,
        "address": "gwZ5sqxb53vdd7RjUoPoSWeELimisUGprEX3P8fhcQwc8Dw6xpnSgfC1v"
      }
    ],
    "fee": 100000000
  }
}
```

**Node.js - sending to a GW address:**

```javascript
async function sendToGateway(gwAddress, amount) {
  const result = await callWalletRpc('transfer', {
    destinations: [
      {
        amount: amount,
        address: gwAddress,
      },
    ],
    fee: 100000000,
  });

  console.log('Sent to GW address, tx_id:', result.tx_hash);
  return result.tx_hash;
}
```

---

## 5. Retrieving transaction history

Transaction history for a GW address is queried via **daemon RPC** using the `gateway_get_address_history` method.

### IMPORTANT: you need your own daemon

The `gateway_view_secret_key` parameter is passed to the daemon to decrypt payment IDs and attachments (comments). **If you use a public daemon**, this key will be exposed to its operator. For full security, **run your own node**.

```
+------------------------------------------------------+
|            gateway_get_address_history               |
|                                                      |
|  With view_secret_key:       Without view_secret_key:|
|  +----------------------+   +--------------------+   |
|  | Payment ID: 1dfe5a88 |   | Payment ID: ???    |   |
|  | ZANO: +1.0           |   | ZANO: +1.0         |   |
|  | Comment: "payment"   |   | Comment: ???       |   |
|  +----------------------+   +--------------------+   |
|                                                      |
|  Decrypted                    Encrypted              |
+------------------------------------------------------+
```

### Request

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "gateway_get_address_history",
  "params": {
    "gateway_address": "gwZ5sqxb53vdd7RjUoPoSWeELimisUGprEX3P8fhcQwc8Dw6xpnSgfC1v",
    "gateway_view_secret_key": "f74bb56a...view secret key (64 hex, optional)",
    "offset": 0,
    "count": 50
  }
}
```

Parameters:
- `gateway_address` - address `gwZ...` or `gwiZ...`
- `gateway_view_secret_key` - secret view key (optional; without it payment_id won't be decrypted)
- `offset` - pagination offset (starting from 0)
- `count` - number of transactions (maximum 200 per request)

### Response

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "status": "OK",
    "total_transactions": 2,
    "transactions": [
      {
        "tx_hash": "a85942c54afa26bb19ff77201d770d88956975e5c1c9ab72733ed17334122d6a",
        "height": 36322,
        "subtransfers_by_pid": [
          {
            "payment_id": "",
            "subtransfers": [
              {
                "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
                "is_income": true,
                "amount": 2000000000000
              }
            ]
          }
        ]
      },
      {
        "tx_hash": "20e922b32dfe9b8b6bc6004e40f4198c9e966d5e228cd4830656ba967f8a205c",
        "height": 36323,
        "subtransfers_by_pid": [
          {
            "payment_id": "",
            "subtransfers": [
              {
                "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
                "is_income": false,
                "amount": 1010000000000
              }
            ]
          }
        ],
        "comment": "Test transfer from GW"
      }
    ],
    "balances": [
      {
        "asset_id": "d6329b5b1f7c0805b5c345f4957554002a2f557845f64d7645dae0e051a6498a",
        "amount": 990000000000
      }
    ]
  }
}
```

Transactions are grouped by `payment_id`, and within each group - by `asset_id`. The `balances` field contains the current balances of the GW address at the time of the request.

**Node.js - fetching history:**

```javascript
async function getGatewayHistory(gwAddress, viewSecretKey, offset = 0, count = 50) {
  const result = await callDaemonRpc('gateway_get_address_history', {
    gateway_address: gwAddress,
    gateway_view_secret_key: viewSecretKey,  // pass to decrypt payment IDs
    offset: offset,
    count: count,
  });

  console.log('Total transactions:', result.total_transactions);
  console.log('Current balances:', JSON.stringify(result.balances, null, 2));

  for (const tx of result.transactions) {
    console.log(`\nTX: ${tx.tx_hash} (block ${tx.height})`);
    if (tx.comment) console.log(`  Comment: ${tx.comment}`);

    for (const pidGroup of tx.subtransfers_by_pid) {
      console.log(`  Payment ID: ${pidGroup.payment_id || '(none)'}`);
      for (const sub of pidGroup.subtransfers) {
        console.log(`    Asset ${sub.asset_id}: ${sub.is_income ? '+' : '-'}${sub.amount}`);
      }
    }
  }

  return result;
}
```

### How it works internally

1. The blockchain maintains an index: for each GW address, a list of related transaction hashes is stored
2. When a transaction is added to a block, all `txin_gateway` and `tx_out_gateway` referencing this GW address are automatically indexed
3. When history is requested, the daemon retrieves transactions by index and for each one determines:
   - Incoming or outgoing transaction (by the presence of `txin_gateway` / `tx_out_gateway`)
   - Decrypts payment ID (if `view_secret_key` is provided)
   - Calculates balance changes per payment_id and asset_id

---

## 6. Integrated GW addresses (payment_id)

GW addresses support **integrated addresses** with embedded payment IDs, similar to regular Zano addresses.

- Integrated GW addresses start with `gwiZ...`
- Payment ID: 8 bytes (16 hex characters)
- Created via daemon RPC `get_integrated_address`:

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "get_integrated_address",
  "params": {
    "regular_address": "gwZ5sqxb53vdd7RjUoPoSWeELimisUGprEX3P8fhcQwc8Dw6xpnSgfC1v",
    "payment_id": "1dfe5a88ff9effb3"
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "integrated_address": "gwiZ92c1bNYdd7RjUoPoSWeELimisUGprEX3P8fhcQwc8Dw6xpk6AP3Pv4KbyNZJdF3y",
    "payment_id": "1dfe5a88ff9effb3"
  }
}
```

When sending funds to a `gwiZ...` address, the payment ID is automatically encrypted and included in the transaction. To decrypt it when retrieving history, the `view_secret_key` is needed.

**Node.js - creating an integrated address:**

```javascript
async function createIntegratedAddress(gwAddress, paymentId) {
  const result = await callDaemonRpc('get_integrated_address', {
    regular_address: gwAddress,
    payment_id: paymentId,
  });

  console.log('Integrated address:', result.integrated_address);
  console.log('Payment ID:', result.payment_id);
  return result.integrated_address;
}
```

---

## 7. Complete node.js example (end-to-end)

Below is a complete script that demonstrates the entire GW address lifecycle: key generation, registration, funding, transferring from GW, and reading history.

**Prerequisites:**
- `zanod` running and synced (port 11211)
- `simplewallet` running with RPC enabled (`--rpc-bind-port=11112`)
- Wallet has at least ~110 ZANO for registration fee + test transfers

```javascript
// npm i axios ethers @noble/ed25519
const axios = require('axios');
const { ethers } = require('ethers');
const ed = require('@noble/ed25519');

const WALLET_RPC_URL = 'http://127.0.0.1:11112/json_rpc';
const DAEMON_RPC_URL = 'http://127.0.0.1:11211/json_rpc';

const DEFAULT_FEE = 10_000_000_000;

// ed25519 subgroup order L
const ED25519_L = (1n << 252n) + 27742317777372353535851937790883648493n;

async function callWalletRpc(method, params = {}) {
  const response = await axios.post(WALLET_RPC_URL, {
    jsonrpc: '2.0', id: 0, method, params,
  });
  if (response.data.error) {
    throw new Error(`Wallet RPC [${method}]: ${JSON.stringify(response.data.error)}`);
  }
  return response.data.result;
}

async function callDaemonRpc(method, params = {}) {
  const response = await axios.post(DAEMON_RPC_URL, {
    jsonrpc: '2.0', id: 0, method, params,
  });
  if (response.data.error) {
    throw new Error(`Daemon RPC [${method}]: ${JSON.stringify(response.data.error)}`);
  }
  return response.data.result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function assertOk(result, methodName) {
  if (result.status && result.status !== 'OK') {
    throw new Error(`${methodName} returned status: ${result.status}`);
  }
}

async function waitForNextBlock(timeoutMs = 1800000) {
  const startInfo = await callDaemonRpc('getinfo');
  const startHeight = startInfo.height;
  console.log(`  current height: ${startHeight}, waiting for next block...`);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await sleep(5000);
    const info = await callDaemonRpc('getinfo');
    if (info.height > startHeight) {
      console.log(`  new height: ${info.height}`);
      return info.height;
    }
  }
  throw new Error(`Timeout waiting for next block (stuck at height ${startHeight})`);
}

function randomScalarLtL() {
  while (true) {
    const b = ethers.randomBytes(32);
    const x = BigInt('0x' + Buffer.from(b).toString('hex'));
    const s = x % ED25519_L;
    if (s !== 0n) return s;
  }
}

function scalarToLe32Hex(s) {
  const out = Buffer.alloc(32, 0);
  let x = s;
  for (let i = 0; i < 32; i++) {
    out[i] = Number(x & 0xffn);
    x >>= 8n;
  }
  return out.toString('hex');
}

function makeValidGwViewKeypair() {
  const scalar = randomScalarLtL();
  const viewSecretKey = scalarToLe32Hex(scalar);
  const viewPubKey = Buffer.from(ed.Point.BASE.multiply(scalar).toBytes()).toString('hex');
  return { viewSecretKey, viewPubKey };
}

async function main() {
  try {
    console.log('=== Key Generation ===');

    const { viewSecretKey, viewPubKey } = makeValidGwViewKeypair();
    const ownerWallet = ethers.Wallet.createRandom();
    const ownerEthPubKey = ethers.SigningKey.computePublicKey(ownerWallet.privateKey, true).substring(2);

    console.log('View public key:', viewPubKey);
    console.log('View secret key:', viewSecretKey);
    console.log('Owner ETH private key:', ownerWallet.privateKey);
    console.log('Owner ETH public key:', ownerEthPubKey);

    console.log('\n=== Registration (fee 100 ZANO) ===');

    const regResult = await callWalletRpc('register_gateway_address', {
      view_pub_key: viewPubKey,
      descriptor_info: {
        opt_owner_ecdsa_pub_key: ownerEthPubKey,
        meta_info: 'Example GW address for documentation',
      },
    });

    const gwAddress = regResult.address;
    const gwAddressId = regResult.address_id;
    console.log('GW address:', gwAddress);
    console.log('Address ID:', gwAddressId);
    console.log('Registration TX:', regResult.tx_id);

    console.log('\nWaiting for block confirmation...');
    await waitForNextBlock();

    const addressInfo = await callDaemonRpc('gateway_get_address_info', {
      gateway_address: gwAddress,
    });
    assertOk(addressInfo, 'gateway_get_address_info');
    console.log('Registration confirmed!');
    console.log('Descriptor:', JSON.stringify(addressInfo.descriptor_info, null, 2));
    console.log('Balances:', JSON.stringify(addressInfo.balances));

    console.log('\n=== Sending 2 ZANO to GW address ===');

    const sendToResult = await callWalletRpc('transfer', {
      destinations: [{ amount: 2_000_000_000_000, address: gwAddress }],
      fee: DEFAULT_FEE,
    });
    console.log('Sent to GW, tx_hash:', sendToResult.tx_hash);

    console.log('Waiting for block confirmation...');
    await waitForNextBlock();

    const updatedInfo = await callDaemonRpc('gateway_get_address_info', {
      gateway_address: gwAddress,
    });
    assertOk(updatedInfo, 'gateway_get_address_info');
    console.log('GW balances after funding:', JSON.stringify(updatedInfo.balances, null, 2));

    console.log('\n=== Sending 1 ZANO from GW address ===');

    const walletInfo = await callWalletRpc('getaddress');
    const recipientAddress = walletInfo.address;
    console.log('Recipient (own wallet):', recipientAddress);

    const totalAmount = 1_000_000_000_000;
    const createResult = await callDaemonRpc('gateway_create_transfer', {
      origin_gateway_id: gwAddressId,
      destinations: [
        { amount: totalAmount - 1, address: recipientAddress },
        { amount: 1, address: recipientAddress },
      ],
      fee: DEFAULT_FEE,
      comment: 'Test transfer from GW',
    });
    assertOk(createResult, 'gateway_create_transfer');
    console.log('TX hash to sign:', createResult.tx_hash_to_sign);

    // sign with ETH private key (ECDSA secp256k1, low-s normalized)
    const bytesToSign = ethers.getBytes('0x' + createResult.tx_hash_to_sign);
    const sig = ownerWallet.signingKey.sign(bytesToSign);
    const ethSignature = sig.r.slice(2) + sig.s.slice(2); // r||s, 128 hex = 64 bytes
    console.log('Signature (128 hex):', ethSignature);

    const signResult = await callDaemonRpc('gateway_sign_transfer', {
      tx_blob: createResult.tx_blob,
      tx_hash_to_sign: createResult.tx_hash_to_sign,
      opt_ecdsa_signature: ethSignature,
    });
    assertOk(signResult, 'gateway_sign_transfer');
    console.log('Transaction signed, blob length:', signResult.signed_tx_blob.length);

    const broadcastResult = await callDaemonRpc('sendrawtransaction', {
      tx_as_hex: signResult.signed_tx_blob,
    });
    if (broadcastResult.status !== 'OK') {
      throw new Error(`Broadcast failed: ${broadcastResult.status}`);
    }
    console.log('Broadcast OK!');

    console.log('Waiting for block confirmation...');
    await waitForNextBlock();

    console.log('\n=== Creating integrated GW address ===');

    const integratedResult = await callDaemonRpc('get_integrated_address', {
      regular_address: gwAddress,
      payment_id: '1dfe5a88ff9effb3',
    });
    console.log('Integrated address:', integratedResult.integrated_address);
    console.log('Payment ID:', integratedResult.payment_id);

    console.log('\n=== Fetching transaction history ===');

    const history = await callDaemonRpc('gateway_get_address_history', {
      gateway_address: gwAddress,
      gateway_view_secret_key: viewSecretKey,
      offset: 0,
      count: 50,
    });

    console.log('Total transactions:', history.total_transactions);
    console.log('Current balances:', JSON.stringify(history.balances, null, 2));

    for (const tx of history.transactions) {
      console.log(`\nTX: ${tx.tx_hash} (block ${tx.height})`);
      if (tx.comment) console.log(`  Comment: ${tx.comment}`);
      for (const pidGroup of tx.subtransfers_by_pid) {
        console.log(`  Payment ID: ${pidGroup.payment_id || '(none)'}`);
        for (const sub of pidGroup.subtransfers) {
          console.log(`    Asset ${sub.asset_id}: ${sub.is_income ? '+' : '-'}${sub.amount}`);
        }
      }
    }

    console.log('\nDone!');
  } catch (error) {
    console.error('\nERROR:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

main();
```

---

### Comparison table

| Feature | Regular address (UTXO) | GW address |
|---|---|---|
| Address prefix | `Z...` (regular), `iZ...` (integrated) | `gwZ...` (regular), `gwiZ...` (integrated) |
| Key structure | Key pair: spend_key + view_key | Single public key |
| Balance model | UTXO - hidden outputs scattered across blocks | Account - balance stored on-chain |
| Amount privacy | Hidden (Zarcanum confidential transactions) | Open - amounts are visible in the blockchain |
| Ring signatures | Yes (decoy-set for sender anonymity) | No |
| Payment ID | Encrypted | Encrypted via view key |
| Owner signatures | Schnorr (Zano) | Schnorr / EdDSA / Ethereum |
| Multi-asset | Yes (each asset - separate UTXOs) | Yes (one address stores balances for all assets) |




## API quick reference

| Method | RPC type | Description |
|---|---|---|
| `register_gateway_address` | Wallet RPC | Register a new GW address (fee: 100 ZANO) |
| `gateway_get_address_info` | Daemon RPC | Get information and balances of a GW address |
| `gateway_create_transfer` | Daemon RPC | Create an unsigned transaction from a GW address |
| `gateway_sign_transfer` | Daemon RPC | Sign a transaction with owner key |
| `sendrawtransaction` | Daemon RPC | Broadcast a signed transaction to the network |
| `gateway_get_address_history` | Daemon RPC | Get GW address transaction history (requires view key for decryption) |
| `get_integrated_address` | Daemon RPC | Create an integrated `gwiZ...` address with payment ID |
| `transfer` | Wallet RPC | Send funds TO a GW address (standard method) |
