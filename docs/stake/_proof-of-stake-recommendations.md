# Staking Recommendations

In this article we describe our recommendations for configuring secure Zano staking.

---

## Hardware Requirements

Although the daemon and wallet can run on relatively modest configurations, we strongly recommend using computers that meet at least the minimum requirements listed below. Running Zano on a weaker system will increase latency as network load grows and reduce staking efficiency. In some peak‑load situations, lack of resources may cause the operating system to forcibly terminate the daemon—for example, on Unix‑like systems with little RAM the kernel’s OOM killer may stop the most resource‑hungry process (Zano).

**Requirements**

* **CPU:** modern CPU with 4 + cores  
* **Disk:** SSD, 200 GB + free space  
* **RAM:** 32 GB +

---

## Staking Options

You can stake in one of two ways:

### 1. Using the Zano Desktop Application

Simply download the application from the official Zano website, launch it, open your wallet and set the **“Staking”** checkbox to **On**. Keep in mind that enabling staking inside the wallet does not mean staking continues if the application is closed, or the computer is turned off or put to sleep. Staking produces blocks (and revenue) only while the computer is powered on, the application is running, and the internet connection is stable. Pay special attention to your system’s **Energy Saving** settings—we have often seen staking performance complaints trace back to logs showing that the computer regularly entered sleep.

### 2. Using the CLI Versions (`zanod` + `simplewallet`)

This approach can be used both on a home computer and on a dedicated server at a hosting provider. In the simplest case you just start `zanod` in one terminal, wait for it to synchronise, and then in another terminal start `simplewallet`, giving it the path to your wallet file and the parameters that put it into staking mode. A minimal example looks like this:

```bash
# Start the daemon
zanod

# Start the wallet in staking mode
simplewallet --wallet-file=wallet_file.zan --rpc-bind-port=12345 --deaf --do-pos-mining
```

---

## IP Safety

As a staker, your node will generate blocks and broadcast them to the network. From the frequency of new blocks coming from your IP address, an observer can estimate how much money is being staked in the wallet(s) on that node (especially if you are connected to the internet via a public IP address). To anonymise your IP you can use several approaches:

* **Traditional VPN services.** You hide your real IP address, but because the VPN exit IP will relay your blocks in exactly the same way, an observer can still infer the amount of coins staked that are associated with that exit IP.  
* **Restricting the node to trusted peers only.** You can configure your node so that it connects only to a set of peers that you choose and trust. As an example, below we show how to configure the node to connect only to the Zano network’s seed nodes (servers maintained by the core team):

```bash
zanod --hide-my-port --use-only-priority-nodes \
      --add-priority-node="95.217.43.225:11121" \
      --add-priority-node="94.130.137.230:11121" \
      --add-priority-node="95.217.42.247:11121" \
      --add-priority-node="94.130.160.115:11121" \
      --add-priority-node="195.201.107.230:11121" \
      --add-priority-node="95.217.46.49:11121" \
      --add-priority-node="159.69.76.144:11121" \
      --add-priority-node="144.76.183.143:11121"
```

**Explanation of the flags**

* `--hide-my-port` – do not announce your node in the protocol.  
* `--use-only-priority-nodes` – instructs the network layer to connect only to peers specified with `--add-priority-node`.  
* `--add-priority-node` – adds a host to the priority‑node list.

When configured this way, to an external observer it will look as if all blocks are evenly distributed among the listed nodes. We are not urging users to use these particular servers; toy can setup your own exit nodes or configure to nodes of someone you trust; it should be a conscious choice. The parameters described work for both the daemon (`zanod`) and the Zano Desktop application.

---

## General Security Issues

* **Use a firewall** to protect your machine, especially if you are running a server with a public IP address. We recommend blocking all incoming connections and allowing SSH access only from the few IP addresses you use.  
* **Do not store the wallet on hosts where mining software is installed.** We have encountered several cases where miners contained malware and keyloggers that stole users’ wallet files and passwords. Ideally, if you have significant assets staking, set aside a **dedicated machine** with no other software installed.  
* **Always watch for critical network updates;** do not miss important upgrades, especially those related to hard forks. We have created a dedicated Telegram channel that publishes only such critical updates: **@zano_critical**.

---

*End of guide.*
