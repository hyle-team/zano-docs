// Regression checks for the final ZEL documentation review.
// Executes only pure encoding helpers; never starts services or submits transactions.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createHash, webcrypto } = require("node:crypto");
const yaml = require("js-yaml");
const { transformSync } = require("@babel/core");
const root = path.resolve(__dirname, "..");
const defaultRead = file => fs.readFileSync(path.join(root, "docs/build/zel", file + ".md"), "utf8");
const blocks = (source, language) => Array.from(source.matchAll(
  new RegExp("^ *\\x60\\x60\\x60" + language + "[^\\n]*\\n([\\s\\S]*?)^ *\\x60\\x60\\x60", "gm")
), match => match[1]);
const stripTags = text => text.replace(/<[^>]+>/g, "");
const hash = bytes => createHash("sha256").update(bytes).digest();

async function checkExamples(read = defaultRead) {
  // The default Visor launch forwards binary_params without appending config_path.
  for (const page of ["configuration", "run-native", "run-docker"]) {
    const doc = read("tutorial/tss/visor/" + page);
    assert.match(doc, /:::note Operator package TBA/);
    assert(!/service migrate down/.test(doc), page + ": rollback returned to setup");
    assert(!/build\/docker-compose\.yaml|make docker-up/.test(doc), page + ": unsafe upstream Compose recipe returned");
    assert(!/postgres(?:ql)?:\/\/[^ \n]+:[^ \n]+@/.test(doc), page + ": embedded database credentials");
    const config = blocks(doc, "yaml").map(text => yaml.load(text)).find(data => data?.tss);
    assert(config, page + ": TSS configuration example missing");
    const { binary_path, binary_params, config_path, certificates_path } = config.tss;
    assert(path.posix.isAbsolute(binary_path) && binary_path.endsWith("/tss"));
    assert.equal(binary_params, "service run sign --config " + config_path);
    assert(path.posix.isAbsolute(config_path) && config_path.endsWith("/configs/tss.yaml"));
    assert.equal(certificates_path, path.posix.join(path.posix.dirname(config_path), "certs"));
    if (config.listeners) {
      for (const addr of Object.values(config.listeners)) assert(addr.startsWith("127.0.0.1:"));
    }
    if (page === "run-docker") {
      assert.equal(binary_path, "/binary/tss");
      assert(!/\s-p\s+\d|--publish\b/.test(doc), "Host networking must not imply Docker port isolation");
      assert(doc.includes("127.0.0.1:5435"));
    }
  }
  const db = yaml.load(blocks(read("tutorial/tss/prerequisites/db"), "yml")[0]);
  assert.deepEqual(db.services.db.ports, ["127.0.0.1:" + "\${POSTGRES_PORT:?Set a loopback port}:5432"]);
  for (const key of ["POSTGRES_DB", "POSTGRES_USER", "POSTGRES_PASSWORD"])
    assert(db.services.db.environment[key].startsWith("\${" + key + ":?"), key + ": required value missing");
  assert("db-data" in db.volumes, "Database storage must persist under its Compose project");
  assert(!db.services.db.container_name, "Fixed container name prevents separate instances");
  assert(read("tutorial/tss/prerequisites/db").includes("--project-name visor-db"));

  // Rebuild both BTC memos from the stated values, then compare the published bytes.
  const btc = read("architecture/signer/integration/swap/btc");
  const integer = value => {
    let hex = BigInt(value).toString(16);
    if (hex.length % 2) hex = "0" + hex;
    return Buffer.from(hex, "hex");
  };
  const prefixed = bytes => Buffer.concat([Buffer.from([bytes.length]), bytes]);
  const value = (section, label) => {
    const line = section.split("\n").find(line => line.startsWith("- " + label + ":"));
    assert(line, "Missing BTC input " + label);
    return stripTags(line).match(/\x60([^\x60]+)\x60/)[1];
  };
  const memo = (section, chunks) => {
    const referral = Buffer.alloc(2);
    referral.writeUInt16BE(Number(value(section, "Referral id")));
    return Buffer.concat([
      Buffer.from([255, 3, chunks, 1]),
      prefixed(Buffer.from(value(section, "Destination chain id"), "utf8")),
      referral,
      Buffer.from([3]), prefixed(Buffer.from(value(section, "Destination address").slice(2), "hex")),
      Buffer.from([3]), prefixed(Buffer.from(value(section, "Destination token").slice(2), "hex")),
      prefixed(integer(value(section, "Minimum destination amount"))),
      prefixed(integer(value(section, "Swap deadline"))),
    ]);
  };
  const simple = btc.split("### Example: BTC to EVM token")[1].split("### Example: chunked BTC memo")[0];
  const fields = simple.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/)[1];
  const shownBytes = Array.from(stripTags(fields).matchAll(/\[([^\]]+)\]/g))
    .flatMap(match => match[1] === "chunks-count" ? [0] : match[1].split(/\s+/).map(Number));
  assert.deepEqual(Buffer.from(shownBytes), memo(simple, 0), "BTC simple memo differs from its stated inputs");
  const chunked = btc.split("### Example: chunked BTC memo")[1].split("## Deposit Submission")[0];
  const full = memo(chunked, 1);
  assert.equal(full.length, 102);
  const publishedHex = label => {
    const line = chunked.split(label + "\n")[1]?.split("\n")[0];
    assert(line, "Missing BTC script " + label);
    const hex = stripTags(line);
    assert.match(hex, /^[a-f0-9]+$/);
    return Buffer.from(hex, "hex");
  };
  const payload = full.subarray(0, 80);
  const paddedChunk = Buffer.alloc(32);
  full.subarray(80).copy(paddedChunk);
  assert.deepEqual(publishedHex("output 1: OP_RETURN memo output payload"), payload);
  assert.deepEqual(publishedHex("output 1: full OP_RETURN scriptPubKey"),
    Buffer.concat([Buffer.from([0x6a, 0x4c, 0x50]), payload]), "80 bytes require OP_PUSHDATA1");
  assert.deepEqual(publishedHex("output 2: P2WSH memo chunk payload"), paddedChunk);
  assert.deepEqual(publishedHex("output 2: full P2WSH scriptPubKey"),
    Buffer.concat([Buffer.from([0, 32]), paddedChunk]));
  assert.match(chunked, />4c<\/span>\s+OP_PUSHDATA1/);

  // Transpile and execute the actual Solana documentation helper and its call sites.
  // These structural fixtures provide only the BN/PublicKey byte conversion methods.
  const solana = read("architecture/signer/integration/bridging/solana");
  const helper = blocks(solana, "typescript").find(code => code.includes("export async function genUid"));
  assert(helper, "Solana helper block missing");
  const js = transformSync(helper.replace(/^export /gm, ""), {
    filename: "solana-example.ts", babelrc: false, configFile: false,
    plugins: [require.resolve("@babel/plugin-transform-typescript")],
  }).code;
  const littleEndian = value => {
    const bytes = Buffer.alloc(8);
    bytes.writeBigUInt64LE(BigInt(value));
    return bytes;
  };
  const bn = value => ({ toArrayLike: (type, endian, size) => {
    assert.equal(type, Buffer); assert.equal(endian, "le"); assert.equal(size, 8);
    return littleEndian(value);
  } });
  for (const withMint of [false, true]) {
    const receiverBytes = Buffer.alloc(32, 1), mintBytes = Buffer.alloc(32, 2);
    const result = await vm.runInNewContext("(async () => {" + js + "\nreturn {uid, digest};})()", {
      Buffer, crypto: webcrypto, depositTxHash: "example-solana-deposit",
      depositTxNonce: bn(7), bridgeId: "example-bridge", amount: bn(1000),
      receiver: { toBuffer: () => receiverBytes },
      mint: withMint ? { toBuffer: () => mintBytes } : undefined,
    }, { timeout: 1000 });
    const uid = hash(Buffer.concat([Buffer.from("example-solana-deposit"), littleEndian(7)]));
    const digest = hash(Buffer.concat([
      Buffer.from("withdraw"), Buffer.from("example-bridge"), littleEndian(1000),
      uid, receiverBytes, ...(withMint ? [mintBytes] : []),
    ]));
    assert(Buffer.isBuffer(result.uid) && Buffer.isBuffer(result.digest), "Await both Solana helper calls");
    assert.deepEqual(result.uid, uid);
    assert.deepEqual(result.digest, digest);
    assert.equal(Array.from(result.digest).length, 32);
  }

  // Argument and response shapes checked against zel-core b642ae48 and its SDK v0.46.41-rc3.
  const nft = read("architecture/core/nft").split("### Owner\n")[1].split("\n---")[0];
  assert(nft.includes("zel-cored query nft owner <owner-address> [flags]"));
  assert(!/query nft owners/.test(nft));
  assert(nft.includes("/cosmos/nft/owners/{owner}/nfts"));
  assert.match(nft, /https:\/\/rpc-api\.node1\.testnet\.zano\.org\/cosmos\/nft\/owners\/zel1[a-z0-9]+\/nfts/);
  for (const language of ["yaml", "json"]) {
    const response = yaml.load(blocks(nft, language)[0]);
    assert(Array.isArray(response.nft));
    assert(response.pagination);
  }
  const multisig = read("architecture/core/multisig");
  assert(!/\bsimd\b|\btx tx\b/.test(multisig));
  for (const [command, count] of [["create", 3], ["update", 4]]) {
    const args = multisig.match(new RegExp("^zel-cored tx multisig groups " + command + " (.+)$", "m"))[1].trim().split(/\s+/);
    assert.equal(args.length, count, "Wrong multisig " + command + " argument count");
    assert.match(args[count - 2], /,/);
    assert.match(args[count - 1], /^\d+$/);
    if (command === "update") assert.equal(args[1], "<group-address>");
  }
  const transaction = read("architecture/core/bridge").split("#### QueryTransactionById")[1].split("___")[0];
  const args = transaction.match(/^zel-cored query bridge transaction (.+)$/m)[1].split(/\s+/);
  assert.equal(args.length, 3);
  assert.match(args[0], /^\d+$/); assert.match(args[1], /^0x[0-9a-f]{64}$/); assert.match(args[2], /^\d+$/);
  const response = yaml.load(blocks(transaction, "")[1]);
  assert(response.transaction && !Array.isArray(response.transaction));
  assert(!response.transactions);
  assert.equal(String(response.transaction.deposit_chain_id), args[0]);
  assert.equal(response.transaction.deposit_tx_hash, args[1]);
  assert.equal(String(response.transaction.deposit_tx_index), args[2]);
  const evmZano = read("architecture/signer/integration/bridging/evm").split("## Bridging to Zano")[1].split("\n## ")[0];
  const submissions = blocks(evmZano, "json").map(code => JSON.parse(code));
  assert.equal(submissions.length, 2);
  for (const submit of submissions) {
    assert.equal(submit.chain_id, "80002", "Submission must identify the Amoy source, not Zano");
    assert(Number.isInteger(submit.tx_nonce));
  }
  assert(!evmZano.includes("same as ZANO chain identifier"));
  assert.equal((evmZano.match(/"2", \/\/ EXAMPLE Zano chain id as a withdrawal destination/g) || []).length, 2);
}

module.exports = checkExamples;
if (require.main === module) checkExamples().then(
  () => console.log("ZEL example regressions passed: operator safety, BTC bytes, Solana async helpers, CLI/HTTP shapes, and source chain IDs."),
  error => { console.error(error); process.exitCode = 1; },
);
