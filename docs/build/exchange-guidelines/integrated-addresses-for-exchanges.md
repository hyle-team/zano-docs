# Integrated addresses for exchanges

### Starting the daemon and the wallet application as RPC server

Unlike Bitcoin, CryptoNote family coins have different, more effective approach on how to handle user deposits.

An exchange generates only one address for receiving coins and all users send coins to that address. To distinguish different deposits from different users the exchange generates random identifier (called **payment ID**) for each one and a user attaches this payment ID to his transaction while sending. Upon receiving, the exchange can extract payment ID and thus identify the user.<br/>
In original CryptoNote there were two separate things: exchange deposit address (the same for all users) and payment ID (unique for each user). Later, for user convenience and to avoid missing payment ID we combined them together into one thing, called an **integrated address**. So nowadays modern exchanges usually give to a user an integrated address for depositing instead of pair of standard deposit address and a payment ID.

Since ver. 2.2 a payment ID is 8 bytes (legacy sizes were up to 128 bytes and per-transaction). Before HF6 a transaction could carry only one payment ID and an integrated address had to be the sole destination; after HF6 activation a single transaction may carry multiple payments; see the [HF6 migration guide](https://docs.zano.org/docs/build/exchange-guidelines/HF6-migration-guide) for details.

For more information on how to handle integrated addresses, please refer to RPCs [make_integrated_address](https://docs.zano.org/docs/build/rpc-api/wallet-rpc-api/make_integrated_address) and [split_integrated_address](https://docs.zano.org/docs/build/rpc-api/wallet-rpc-api/split_integrated_address) below.