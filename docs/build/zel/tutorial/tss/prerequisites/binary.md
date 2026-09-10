---
sidebar_position: 1
---

# Install binary

The first step to start working with the TSS service is to install the TSS service binary. It allows you to interact with the TSS network and perform various operations, such as key generation, signing, and more.

## Downloading from the release page

Navigate to https://github.com/Zano-Execution-Layer/tss-svc/releases. Here you can download the latest release of the TSS service binary for your operating system.
Make sure to move the binary to a directory that is included in your system's PATH environment variable, so you can run it from anywhere in the terminal.

Alternatively, you can build the binary from the source code by yourself.

## Building from source

If you prefer to build the binary from source, you can do so by following these steps:

### 1: Install Go

Make sure you have Go installed on your machine. You can download it from the official [Go website](https://golang.org/dl/).
Follow the installation instructions for your operating system [here](https://www.bytesizego.com/blog/installing-golang).

:::info
Do not forget to add the Go binary directory to your PATH environment variable.
:::

### 2: Clone the repository
```bash
git clone https://github.com/Zano-Execution-Layer/tss-svc && cd tss-svc
```

### 3: Install dependencies
```bash
go mod download
```

### 4: Build the binary
```bash
go build -o <DESIRED_PATH>/tss-svc main.go
```