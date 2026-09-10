---
sidebar_position: 1
---

# General design

Threshold signature producer (hereinafter TSS or party or TSS party) is a decentralized service that performs
verification of the actions happening on the source chains and, in couple with other TSS parties, generates a signed
transaction to perform corresponding action on the target chain. Using the trustless threshold ECDSA protocol, TSS
parties can securely generate private shares from common public keys without involving any centralized participant. The
usage of the ECDSA signature over the `secp256k1` elliptic curve allows TSS to cover the most popular blockchains,
including Bitcoin, BitcoinCash, and Ethereum (EVM-compatible chains).

Interaction with different chain types requires separate solutions for them. Since the selected threshold signature
library (Binance [tss-lib](https://github.com/bnb-chain/tss-lib) also supports the threshold EdDSA, it becomes possible
to extend the existing logic to all blockchains that support ECDSA or EdDSA on the native or smart-contract layer.

We aim to support the following chains:

- Bitcoin;
- EVM;
- Zano.

:::info
On the first iteration we introduce the centralized version of the signer service, it is assumed to be used for the
ZEL launch, to enable the integration and testing of some other ZEL components.
:::

--- 

## Centralized signer

- Repository: legacy centralized signer (not published; superseded by the [TSS](./tss.md) service)

ZEL signer is a centralized service that performs verification of the bridge deposit actions happening on the
source chains and submit a signed transaction to perform corresponding withdraw action on the target chain.

Although the service is built using GRPC and Protocol Buffers, it provides a REST gateway to submit deposit transactions
and check the status of the according withdrawal.

### Design

Service Core logic (`/internal/core`) consists of two parts: JSON API to submit deposits and check the
status of the according withdrawal (`/core/api`), and different handlers to process withdrawals part by part,
where each part is being sent/consumed to/from RabbitMQ queues of messages (`/core/rabbitmq`).

There are two types of message consuming implemented here:

- Default consuming (`base`) - used to process incoming message immediately after consuming. Is used for
  default scenarios where request can be processed independently;
- Batch consuming (`batch`) - used to collect incoming messages and process them after some period. Is used
  for requests that should be better grouped and processed together to optimize/enhance processing (f. e. Bitcoin
  transactions batching, Core tx submitting batching).

Multiple request handlers, that implement interface required by either base or
batch consumer, handle specific part of the withdrawal process (`/rabbitmq/consumer/processors`). They use
bridge processor (`/internal/bridge/processor`) to handle the request and then route the next one using
RabbitMQ request producer (`/rabbitmq/producer`).

In order to avoid unexpected errors each request to process withdrawal can be resent up to
`maxCount` times in case of some system or third party services failure.

Bridge processor is the core system that interacts with database, Bridge Core module and chains for data
retrieval/parsing/sending etc. It contains a set of proxies - implementations of the generalized method
to work with different chains (`/bridge/proxy`). For now it supports EVM-based chains (`/proxy/evm`) and
Bitcoin (`/proxy/btc`).

To better understand how withdrawals are processed by the service, lets take a look on the flow of requests processing:

1. Base/Batch Consumer reads pending request from the RabbitMQ queue;
2. Request is processed by specific consumer implementation;
3. Consumer implementation uses Bridge processor to handle request;
4. Bridge processor uses proxy to extract/parse/transform/send specific chain data;
5. After Bridge processor processed request, Consumer implementation forms and sends request to process the next
   part of the withdrawal using Producer. Unexpectedly failed requests can also be resent by Base/Batch Consumer;
6. Returning to step #1 unless all parts of the withdrawal process are successfully finished.

### API

Swagger documentation: [tss1.testnet.zano.org/api](https://tss1.testnet.zano.org/api)

- CheckWithdrawal **GET** _/check/$originTxId_

  Request information about the withdrawal. The _$originTxId_ parameter consists of three parts:
  _$hash-$eventID-$chainID_. For Bitcoin the eventID is always 0. For Zano eventID depends on the _service_entries_
  position of the deposit information.For EVM chains event id is an index of
  corresponding Deposit log in the transaction.

  Response sample:
  ```json
  {
    "status": "PROCESSING",
    "depositTransaction": {
      "hash": "string",
      "chainId": "string"
    },
    "depositData": {
      "eventIndex": "string",
      "blockNumber": "string",
      "depositor": "string",
      "depositAmount": "string",
      "depositToken": "string",
      "receiver": "string",
      "withdrawalToken": "string",
      "isWrapped": true,
      "withdrawalAmount": "string",
      "signature": "string"
    },
    "withdrawalTransaction": {
      "hash": "string",
      "chainId": "string"
    },
    "submitStatus": "NOT_SUBMITTED"
  }
  ```

- SubmitWithdrawal **POST** _/submit_

  Submit info about deposit to initiate a withdrawal flow. If the withdrawal fails, this method allows to re-initiate
  flow. For the Zano and Bitcoin chains the withdrawal will be done automatically, while for the EVM chains user may
  need to fetch a signature using the CheckWithdrawal or from the bridge module on core.

  Request sample:
  ```json
  {
  "deposit": {
    "txHash": "string",
    "txEventIndex": "string",
    "chainId": "string"
    }
  }
  ```

- Websocket CheckWithdrawal _/ws/check/$originTxId_

    - Initialization: same request as in CheckWithdrawal;

    - Channel information: same as in CheckWithdrawal for each status change.

  Connection will be automatically closed for the following statuses:
    - TX_PENDING
    - TX_SUCCESSFUL
    - TX_FAILED
    - WITHDRAWAL_SIGNED
    - INVALID
    - FAILED
  