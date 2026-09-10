---
sidebar_position: 1
---

# Key generation

The TSS key generation process is a first and crucial step in the TSS (Threshold Signature Scheme) protocol,
when the TSS key shares are generated and distributed among the TSS participants.

:::warning 
Make sure all the required prerequisites are met before starting the key generation process.
:::

## Steps

### 1. Generate preparams
Before starting the key generation process, each party should firstly independently generate preparameters;
that will be required further for the key generation process.

This can be done by executing the following command:
```bash
tss-svc helpers generate preparams -o vault
```

It can take a while, so be patient. Ensure that the `-o` flag is set to `vault` to store the generated preparameters in the Vault.
Additionally, you can use the `-o` flag to save them locally or print them to the console.

### 2. Modify the configuration file

Find the `tss` section in the configuration file:
```yaml title="config.yaml"
# TSS configuration
tss:
  # session start time (should be in the future)
  start_time: "2025-01-21 15:28:00"
  # session Identifier
  session_id: 123
  # TSS threshold
  threshold: 2
```

Set the `start_time` to a future date and time (in UTC) when the TSS keygen session should start.
Additionally, set the `session_id` to a unique identifier for the TSS session.
Set the `threshold` to define the number of parties that will be required to sign a single piece of data.

:::info
- **At least `threshold + 1`** parties will be required for signing
- `tss` section fields **MUST** be the same for all parties
:::


### 3. Start the service in keygen mode
Now everything is ready to start the TSS service in keygen mode.

To do this, execute the following command:
```bash
tss-svc service run keygen -o vault
```

This command will start the TSS service in keygen mode and it will wait for the session start time to begin the key generation process.
It is crucial for each party to be ready to start the key generation process at the same time, so if at least one party is not ready,
the key generation process will not start.

The `-o` flag is set to `vault` to store the generated key shares in the Vault.

:::warning
All other parties should also start the TSS service in keygen and be ready to start the key generation process at the same time.
:::

Once the keygen process is completed, the generated key shares will be stored in the Vault.

:::info

The following command can be used to retrieve the generated TSS network ECDSA public key (points):
```bash
tss-svc helpers vault get pubkey
```
:::

## Running in Docker

Although the key generation process takes a while, running multiple nodes manually can be tedious as they should wait until the keygen session start time.
To simplify this process, you can use Docker to run multiple TSS nodes in parallel.

See the [Docker section](./sign/docker.md) for more details on how to set up and run the TSS service in Docker.

:::info
When using provided template, do not forget to change the service entrypoint command to actually run the keygen mode
:::