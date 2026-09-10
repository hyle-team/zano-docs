---
sidebar_position: 3
---

# Start the service in sign mode

Finally, the TSS service is ready to start signing transactions.

## Running the service in signing mode
To run the TSS service in signing mode, simply execute the following command:
```bash
tss-svc service run sign
```

After the service is started, the signing sessions begin to process incoming deposits once the session start time is reached.

## Re-connecting to the running parties
In case when some error occurs and the local party was disconnected from the running parties,
simply re-run the service in signing mode with the `--sync` flag:
```bash
tss-svc service run sign --sync
```

It will allow synchronizing the signing sessions` data with the running parties and continue processing deposits.