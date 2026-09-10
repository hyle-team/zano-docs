---
sidebar_position: 2
---

# Configuration file

The configuration file is based on the YAML format and should be provided to the service during the launch or commands execution.
It stores the service settings, network settings, and other required parameters.

Example configuration file:
```yaml title="config.yaml"
# Logger configuration
log:
  # Log level: debug, info, warn, error, fatal
  level: debug
  # Disable Sentry integration
  disable_sentry: true

# Database configuration
db:
  # Database URL connection string
  url: postgres://tss:tss@tss-1-db:5432/tss?sslmode=disable

# Listeners configuration
listeners:
  # address and port for P2P communication between TSS parties (gRPC)
  p2p_grpc_addr: :8090
  # HTTP gateway address and port to access the API endpoints
  api_http_addr: :8080
  # gRPC address and port to access the API endpoints
  api_grpc_addr: :8085

# TSS parties configuration
parties:
  list:
    # first party configuration
      # Bridge Core address identifier of the active TSS peer
    - core_address: zel123ex5u9qqmlyzzff278ncsn7rwh65ks092gp0a
      # gRPC address to connect to
      connection: tss-1:8090
      # party's TLS certificate to verify the connection
      tls_certificate_path: party1.crt
    # next party configuration
    - core_address: ...

# supported chains configuration
chains:
  list:
    # EVM chains configuration
      # Chain ID, must match the Bridge Core chain ID
    - id: "evm1"
      type: "evm"
      # Node RPC endpoint
      rpc: "your_rpc_endpoint_here"
      # Bridge contract address
      bridge_addresses: "test_address"
      ## Number of confirmations required for the withdrawal to be considered final
      confirmations: 1
    # Zano chain configuration
    - id: "zano1"
      type: zano
      confirmations: 1
      # bridge asset receiver(s)
      bridge_addresses:
        - "ZxDphM9gFU..."
      rpc:
          # Zano node RPC endpoint
          daemon: "your_rpc_endpoint_here"
          # Zano wallet RPC endpoint
          wallet: "your_rpc_endpoint_here"
    # Bitcoin chain configuration
    - id: "btc1"
      type: bitcoin
      bridge_addresses:
        - "tb1pugjwu..."
        - "tb1q5pt47..."
      confirmations: 1
      # Bitcoin network: mainnet or testnet
      network: testnet
      rpc:
        # Bitcoin wallet RPC endpoint
        wallet:
          host: "<your_rpc_endpoint_here>/wallet/<your_wallet_name>"
          user: "bitcoin"
          pass: "bitcoin"
        # Bitcoin node RPC endpoint
        node:
          host: "your_rpc_endpoint_here"
          user: "bitcoin"
          pass: "bitcoin"


# TSS configuration
tss:
  # session start time (should be in the future)
  start_time: "2025-01-21 15:28:00"
  # session Identifier
  session_id: 123
  # TSS threshold
  threshold: 2

# Bridge Core connector configuration
core_connector:
  # Core connection settings
  connection:
    # Core RPC endpoint for queries and transactions
    addr: "rpc"
    # Whether to enable TLS connection or not
    enable_tls: false
  # General Core settings
  settings:
    chain_id: "00000"
    denom: "denom"
    min_gas_price: 0

# Bridge Core event subscriber configuration
subscriber:
  # Bridge Core node Tendermint RPC endpoint
  addr: "tcp"
```

:::info
Your node has several ports that is required to be opened on your machine:
- **P2P gRPC** port (default: `8090`) - used for P2P communication between TSS parties;
- **HTTP API** port (default: `8080`) - used for HTTP API access;
- **gRPC API** port (default: `8085`) - used for gRPC API access.

These ports can be changed in the configuration file. 
:::

:::info
When using the TSS CLI, the configuration file can be passed as an argument to the command:
```bash
tss-svc <command> -c <path-to-config-file>
```

By default, the flag is set to `config.yaml` in the current working directory.
:::

:::note
At that moment, some of the configuration parameters can be omitted (e.g. `bridge_addresses` for Bitcoin session,
`tss` section configuration). They should be updated on the next steps of the tutorial.
:::