---
sidebar_position: 5
slug: /use/socks5-proxy-relay
---

# Sending transactions and PoS blocks through a SOCKS5 proxy

:::caution Testnet only
This feature is currently available only on testnet. It will be included in a future mainnet release.
:::

Zano wallet can route transaction broadcasts and PoS block submissions through a SOCKS5 proxy (like Tor). Your wallet still syncs with your local daemon as usual, but when it needs to push something to the network - it does that through the proxy to a remote node, your real IP stays hidden.

```
You (wallet)                           The network sees only the proxy IP
     |
     |--- sync blockchain -------> your local daemon
     |
     |--- send tx/PoS block ----> SOCKS5 proxy (Tor or any mixin Network) ----> remote node ----> network
```

## Prerequisites

You need a running SOCKS5 proxy. The most common option is Tor:
- **Tor Browser** exposes SOCKS5 on `127.0.0.1:9150` (just keep it open)
- **Tor daemon** (standalone) usually runs on `127.0.0.1:9050`

You also need a remote Zano node to relay through, the public one is `node.zano.org`

## Command-line options

There are four options, two for transactions and two for PoS blocks:

**Transactions:**
- `--enable-tx-socks5-relay-proxy=<host:port>` - your SOCKS5 proxy address
- `--tx-relay-url=<url>` - remote node that will receive and broadcast your transaction

**PoS blocks:**
- `--enable-block-socks5-relay-proxy=<host:port>` - your SOCKS5 proxy address
- `--block-relay-url=<url>` - remote node that will receive and broadcast your PoS block

You can use them independently, for example, relay only transactions but submit PoS blocks directly, or use different proxies for each.

## Examples

### Relay transactions through Tor (HTTPS)

The most common setup - send transactions through Tor Browser to the public node over HTTPS:

```
simplewallet --wallet-file <your_wallet> \
  --daemon-address http://127.0.0.1:11211 \
  --enable-tx-socks5-relay-proxy=127.0.0.1:9150 \
  --tx-relay-url=https://node.zano.org:443
```

### Relay transactions through Tor (HTTP)

Same thing, but over plain HTTP (port 11121):

```
simplewallet --wallet-file <your_wallet> \
  --daemon-address http://127.0.0.1:11211 \
  --enable-tx-socks5-relay-proxy=127.0.0.1:9150 \
  --tx-relay-url=http://node.zano.org:11121
```

### Relay both transactions and PoS blocks

If you want full privacy for both transactions and staking:

```
simplewallet --wallet-file <your_wallet> \
  --daemon-address http://127.0.0.1:11211 \
  --enable-tx-socks5-relay-proxy=127.0.0.1:9150 \
  --tx-relay-url=https://node.zano.org:443 \
  --enable-block-socks5-relay-proxy=127.0.0.1:9150 \
  --block-relay-url=https://node.zano.org:443
```

### Testnet

For testnet, just point to a testnet node (default RPC port is 12111):

```
simplewallet --wallet-file <your_wallet> \
  --daemon-address http://127.0.0.1:12111 \
  --enable-tx-socks5-relay-proxy=127.0.0.1:9150 \
  --tx-relay-url=<testnet_node_address>:11311
```
