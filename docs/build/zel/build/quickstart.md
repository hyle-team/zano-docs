---
sidebar_position: 1
title: Developer quickstart
---

# Developer quickstart

:::caution Testnet only
Build and deploy against ZEL testnet chain ID `9350`. Mainnet chain ID `935` is reserved, but mainnet is not live.
:::

:::note Test funds
The existing [Zano testnet faucet](https://faucet.testnet.zano.org) serves Zano L1. ZEL ZANO will be added to the same faucet. Until that addition is available, arrange ZEL test funds with the team; L1 coins are not automatically gas in your EVM wallet.
:::

ZEL exposes an EVM-compatible JSON-RPC interface and uses ZANO as its native gas asset. Standard Solidity tooling can target the public testnet endpoints below.

## Prerequisites

- An EVM wallet or development key containing test funds only.
- Testnet ZANO for gas.
- Node.js and a Solidity toolchain such as Hardhat or Foundry.
- The current [network access details](/docs/build/zel/status-and-access).

## Wallet and toolchain settings

| Setting | Value |
| --- | --- |
| Network name | ZEL Testnet |
| EVM JSON-RPC | `https://eth-rpc.node1.testnet.zano.org` |
| EVM WebSocket | `wss://eth-ws.node1.testnet.zano.org` |
| Chain ID | `9350` (`0x2486`) |
| Native currency symbol | `ZANO` |
| Explorer | `https://explorer.testnet.zano.org` |

## Connect a JSON-RPC client

With ethers v6:

```js
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider(
  process.env.ZEL_TESTNET_RPC_URL ??
    "https://eth-rpc.node1.testnet.zano.org",
  9350,
);

const network = await provider.getNetwork();
if (network.chainId !== 9350n) {
  throw new Error(`Unexpected chain ID: ${network.chainId}`);
}
```

Check the endpoint before deploying:

```bash
curl https://eth-rpc.node1.testnet.zano.org \
  -H "content-type: application/json" \
  --data '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

The expected testnet result is `0x2486`, which is decimal `9350`.

## Configure a toolchain

Use the following stable identifiers in your network configuration:

```js
export default {
  networks: {
    zelTestnet: {
      url: process.env.ZEL_TESTNET_RPC_URL,
      chainId: 9350,
      accounts: [process.env.ZEL_TESTNET_PRIVATE_KEY],
    },
  },
};
```

Keep RPC URLs and keys in environment variables. Never commit a private key, even for testnet; habits and configuration are frequently copied into production projects.

## Deploy and verify

1. Compile for the EVM version supported by the current testnet release.
2. Estimate gas and confirm your account has enough test funds.
3. Deploy with chain ID `9350` explicitly selected.
4. Record the compiler, optimizer, source commit, constructor arguments, deployment transaction, and contract address.
5. Verify the runtime bytecode and publish source in the current explorer when verification is supported.

Do not publish a contract address without the network and deployment version. Testnet redeployments can make an old address look valid while referring to unrelated state.

Next: [network access](/docs/build/zel/status-and-access).
