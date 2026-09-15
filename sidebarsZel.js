// Keep public navigation task-oriented without changing established document URLs.
const doc = (id, label) => ({type: "doc", id: "build/zel/" + id, ...(label ? {label} : {})});
const category = (label, items, link) => ({
  type: "category", label, collapsible: true, collapsed: true, items,
  ...(link ? {link: {type: "doc", id: "build/zel/" + link}} : {}),
});
const adapter = "architecture/signer/integration/";
const tss = "tutorial/tss/";

module.exports = category("Zano Execution Layer", [
  doc("status-and-access"),
  category("Concepts", [
    doc("core-concepts/zano-and-zel"), doc("core-concepts/asset-model"),
    doc("core-concepts/privacy-boundary"), doc("core-concepts/network-security"),
  ]),
  category("Build applications", [
    doc("build/quickstart"), doc("evm-and-contracts/overview"), doc("build/solidity"),
    doc("evm-and-contracts/contract-registry"), doc("evm-and-contracts/bridge-contracts"),
    doc("evm-and-contracts/events-and-indexing"), doc("defi/overview"),
  ]),
  category("Bridge and swaps", [
    doc("bridge-and-swaps/end-to-end-flow"), doc("bridge-and-swaps/zano-to-zel"),
    doc("bridge-and-swaps/zel-to-zano"), doc("bridge-and-swaps/api-and-status"),
    doc("bridge-and-swaps/operation-lifecycle"),
    doc(adapter + "swap/general_flow", "Cross-chain swaps"),
    doc(adapter + "swap/zel", "ZEL swap integration"),
    category("Chain adapters", [
      doc(adapter + "bridging/evm", "EVM bridge"), doc(adapter + "bridging/btc", "UTXO bridge"),
      doc(adapter + "bridging/solana", "Solana bridge"), doc(adapter + "bridging/ton", "TON bridge"),
      doc(adapter + "swap/evm", "EVM swaps"), doc(adapter + "swap/btc", "UTXO swaps"),
    ]),
  ], "bridge-and-swaps/overview"),
  category("Architecture", [
    category("Core modules", [
      doc("architecture/core/tokenomics"), doc("architecture/core/accumulator"),
      doc("architecture/core/nft"), doc("architecture/core/bridge"), doc("architecture/core/multisig"),
    ], "architecture/core/core"),
    doc("architecture/signer/tss", "Threshold signer"),
  ], "architecture/overview"),
  category("Operate", [
    doc("tutorial/testnet/setup"), doc("tutorial/localstart/info"),
    doc("tutorial/testnet/become-validator"),
    category("Advanced operations", [
      doc(tss + "prerequisites/binary", "Install TSS"),
      doc(tss + "prerequisites/secrets", "Vault prerequisites"),
      doc(tss + "prerequisites/db", "Database"),
      doc(tss + "prerequisites/core-account", "Core account"),
      doc(tss + "configuration/config", "TSS configuration"),
      doc(tss + "configuration/tls-certs", "TLS certificates"),
      doc(tss + "configuration/secrets", "Vault configuration"),
      doc(tss + "run/keygen", "Key generation"),
      doc(tss + "run/sign/prerequisites", "Signing prerequisites"),
      doc(tss + "run/sign/setup", "Bridge administrator setup"),
      doc(tss + "run/sign/sign-mode", "Signing mode"),
      doc(tss + "run/sign/docker", "Signer in Docker"),
      doc(tss + "run/reshare", "Key rotation"),
      doc(tss + "visor/intro", "Visor overview"),
      doc(tss + "visor/configuration", "Visor configuration"),
      doc(tss + "visor/run-native", "Visor on Linux"),
      doc(tss + "visor/run-docker", "Visor in Docker"),
      doc(tss + "visor/launch-scripts", "Launch package"),
    ], tss + "overview"),
  ], "operate/overview"),
  category("Reference", [doc("reference/glossary"), doc("reference/repositories")]),
], "overview");
