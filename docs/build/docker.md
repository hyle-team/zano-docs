---
sidebar_position: 3
description: Official Zano full-node Docker image (zanoproject/zano-full-node). How to run a Zano node in Docker, publish the P2P port, and secure the RPC endpoint.
keywords: [zano, docker, zano docker, zano full node, remote node, zanod, run a zano node, zanoproject/zano-full-node]
---

# Running a Zano Node with Docker

This is the **official Zano full-node Docker image**, built and published by the Zano team. If you want to run a Zano node in a container, this is the image to use.

**Docker Hub:** https://hub.docker.com/r/zanoproject/zano-full-node

The image runs `zanod` (the Zano daemon) as a mainnet full node and also ships `simplewallet`. Binaries are statically built.

## Quick start

```
docker run --restart=always \
  -v /var/data/zano-data:/home/zano/.Zano \
  -p 0.0.0.0:11121:11121 \
  -p 127.0.0.1:11211:11211 \
  --name=zanod -dit zanoproject/zano-full-node
```

Before the first run, create the host data directory and make it writable by the container's non-root `zano` user (uid `1000`):

```
sudo mkdir -p /var/data/zano-data
sudo chown -R 1000:1000 /var/data/zano-data
```

The blockchain lives in the mounted volume (`/home/zano/.Zano`), so it persists across restarts and image upgrades.

### Ports

| Port  | Purpose | Recommended exposure |
|-------|---------|----------------------|
| 11121 | P2P     | Keep reachable from the Internet; inbound peers help your node stay well-connected. |
| 11211 | RPC     | **Keep private.** In the example above it is published only to `127.0.0.1` on the host. |

## Managing the container

- Attach to the daemon console: `docker attach zanod`
- Detach and leave it running: `Ctrl+P`, then `Ctrl+Q`
- Stop: `docker stop zanod`

## Securing the RPC port

:::danger Do not expose the RPC port (11211) to the Internet
:::

The image starts the daemon with `--rpc-bind-ip=0.0.0.0`, so it listens on all interfaces **inside the container**. That is required for Docker port publishing to work, but it does **not** make the RPC safe to expose. Protecting it is your responsibility. Choose one of:

- **Bind to loopback (as in the quick start):** publish RPC only to the host with `-p 127.0.0.1:11211:11211`, then use it locally. Do **not** use `-p 11211:11211` (which binds `0.0.0.0`) or `--network host` unless you intend to expose it.
- **Firewall:** block inbound traffic to port `11211` from the Internet at the host firewall or cloud security-group level.
- **Reverse proxy (if RPC must be reachable remotely):** put nginx (or similar) in front of the endpoint and terminate TLS there, adding authentication and/or IP allow-listing. Never publish the raw RPC port directly.

## Building your own image

The image is built from the [Dockerfile](https://github.com/hyle-team/zano/blob/master/utils/docker/zano-full-node/Dockerfile) in the main repo. You can build a specific branch or tag and override library versions via build args:

```
docker build \
  --build-arg BRANCH=release \
  -f utils/docker/zano-full-node/Dockerfile .
```

Available build args: `BRANCH`, `CMAKE_VERSION_DOT` / `CMAKE_HASH`, `BOOST_VERSION` / `BOOST_VERSION_DOT` / `BOOST_HASH`, and `OPENSSL_VERSION_DOT` / `OPENSSL_HASH`.
