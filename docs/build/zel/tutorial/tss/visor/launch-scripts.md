---
sidebar position: 5
---

# Launch scripts

To run Visor, TSS, ZEL Core and other services together, the [launch scripts repository](https://github.com/Zano-Execution-Layer/launch-scripts) can be used.

It provides a set of scripts to run the stack in Docker containers, with a commands to launch everything together. 
The repo also includes a sample configurations for all required services, which can be used as a reference for your own setup.
Launch script allows to set up the local environment, configure required parameters and run the stack with a single command.

It also provides commands to stop the stack and clean up resources when they are no longer needed.

To run the stack in a docker environment, use the following command:

```bash
./run-docker.sh
```

To clean up the environment, use the following command:

```bash
./clean-all-docker.sh
```