// Read-only checks for the ZEL docs and illustrative Compose examples.
// Run with --built after npm run build to validate published routes.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { TextEncoder } = require("node:util");
const yaml = require("js-yaml");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const file = path.posix.join(dir, entry.name);
    if (entry.name.startsWith("_") || file.includes("/tutorial/mainnet")) continue;
    if (entry.isDirectory()) walk(file);
    else if (/\.mdx?$/.test(file)) files.push(file);
  }
}
walk("docs/build/zel");
let yamlCount = 0;
let composeCount = 0;
let shellCount = 0;
const checkedShellPages = new Set([
  "tutorial/testnet/setup", "tutorial/testnet/become-validator",
  "tutorial/localstart/info", "tutorial/tss/prerequisites/core-account",
  "tutorial/tss/run/keygen", "tutorial/tss/prerequisites/db",
  "tutorial/tss/visor/run-native", "tutorial/tss/visor/run-docker",
].map(page => "docs/build/zel/" + page + ".md"));
for (const file of files) {
  const source = read(file);
  if (/^draft: true$/m.test(source)) continue;
  assert(!source.includes("Zano-Execution-Layerano-Execution-Layer"), file + ": malformed image namespace");
  assert(!/DAEMON_NAME[= ]+["']?ZEL Core/.test(source), file + ": wrong daemon filename");
  assert(!/set -[a-z]*x[a-z]*(?:\s|$)/m.test(source), file + ": shell tracing in operator documentation");
  assert(!/UNSAFE_SKIP_BACKUP[= ]+["']?true/.test(source), file + ": backups disabled");
  for (const block of source.matchAll(/^\x60\x60\x60[^\n]*\n([\s\S]*?)^\x60\x60\x60/gm)) {
    assert(!/priv_validator_state\.json/.test(block[1]) ||
      !/(?:\b(?:echo|printf|tee|rm|truncate)\b|["']height["']\s*:)/.test(block[1]),
      file + ": possible validator signing-state reset");
  }
  for (const block of source.matchAll(/^\x60\x60\x60(?:bash|sh)\n([\s\S]*?)^\x60\x60\x60/gm)) {
    for (const line of block[1].split("\n")) {
      if (/^tss-svc (?:helpers generate (?:cosmos-account|preparams)|service run keygen)\b/.test(line)) {
        assert(/(?:--output|-o)\s+vault(?:\s|$)/.test(line), file + ": private material must use explicit Vault output");
      }
    }
    if (checkedShellPages.has(file)) {
      execFileSync("bash", ["-n"], { input: block[1], stdio: ["pipe", "pipe", "pipe"] });
      shellCount++;
    }
  }
  const fences = source.matchAll(/^```(?:yaml|yml|docker-compose)[^\n]*\n([\s\S]*?)^```/gm);
  for (const match of fences) {
    yamlCount++;
    const data = yaml.load(match[1], { filename: file });
    if (!data || !data.services) continue;
    composeCount++;
    for (const [name, service] of Object.entries(data.services)) {
      const deps = Array.isArray(service.depends_on) ? service.depends_on : Object.keys(service.depends_on || {});
      for (const dep of deps) assert(dep in data.services, file + ": undefined dependency " + dep);
      if (service.image && !service.image.includes("${")) {
        const repository = service.image.split("@")[0].split(":")[0];
        assert.equal(repository, repository.toLowerCase(), file + ": uppercase image repository");
      }
      assert(!service.volumes || Array.isArray(service.volumes), file + ": service volumes must be a list");
      assert(name.length > 0);
    }
  }
}
execFileSync(process.execPath, [path.join(__dirname, "check-zel-examples.cjs")], { stdio: "inherit" });

const required = [
  "overview", "status-and-access", "build/quickstart", "build/solidity",
  "core-concepts/asset-model", "core-concepts/privacy-boundary",
  "evm-and-contracts/overview", "evm-and-contracts/contract-registry",
  "bridge-and-swaps/overview", "architecture/overview", "operate/overview", "defi/overview", "tutorial/tss/overview",
];
for (const page of required) assert(fs.existsSync(path.join(root, "docs/build/zel", page + ".md")), "Missing " + page);
assert(read("docs/build/zel/status-and-access.md").includes("| EVM chain ID | `9350` (`0x2486`) | `935` (`0x3A7`) |"));
assert(read("docs/build/zel/status-and-access.md").includes("| Short name | `tzel` | `zel` |"));
assert.match(read("docusaurus.config.js"), /"build\/zel\/tutorial\/mainnet\/\*\*"/);
assert.match(read("src/components/ZelNetworkDropdown/index.js"), /aria-disabled/);

const evmReference = read("docs/build/zel/evm-and-contracts/overview.md");
const solidityGuide = read("docs/build/zel/build/solidity.md");
assert(evmReference.includes("/docs/build/zel/build/solidity"), "Overview must link to developer compatibility guidance");
assert(!/Current testnet behavior|Release identity|empty version|PUSH0|MCOPY|TSTORE|web3_sha3/.test(evmReference), "Diagnostic detail returned to overview");
assert(solidityGuide.includes('evmVersion: "london"'), "Explicit compiler target missing");
assert(solidityGuide.includes("unsupported bytecode"), "Compiler compatibility caveat missing");
assert(solidityGuide.includes("web3_sha3") && solidityGuide.includes("Keccak-256"), "Client hashing workaround missing");
assert(!/0[.]34[.]29|1[.]10[.]26|empty.*commit/.test(read("docs/build/zel/architecture/core/core.md")), "Build snapshot returned to Core introduction");
for (const page of ["tutorial/testnet/setup", "operate/overview", "tutorial/tss/visor/launch-scripts"]) {
  const content = read("docs/build/zel/" + page + ".md");
  assert(/:::note[^\n]*TBA/.test(content), "Operator template needs a Docusaurus TBA notice: " + page);
}
const registry = read("docs/build/zel/evm-and-contracts/contract-registry.md");
for (const address of [
  "0x89d5aa702960FD0aE868e21a26f1F419e29431ef",
  "0x34d83c9Dcf9E59D16c63fC25f2C9d59c6006F1A3",
  "0x9d56a6741bfBc2f49BaE8a69aF4955DBcd09DB14",
  "0xe536266770CB94d67855131AC5c0820A468c5A91",
  "0x509945dCDda4DCc056935fFeb5b4c30B723b966e",
  "0xac6d9cc15746248f120985568B79d8AD27ad4062",
  "0xa8837A67c88e4C74D903952C8275A831Bf52eb15",
]) assert(registry.includes(address), "Inspected deployment missing: " + address);
assert(registry.includes("Not verified") && registry.includes("Wrapped Zel / wZel"), "Wrapper caveats missing");
for (const page of ["status-and-access", "build/quickstart"]) {
  const content = read("docs/build/zel/" + page + ".md");
  assert(content.includes("https://faucet.testnet.zano.org"), "Existing faucet missing");
  assert(!content.includes("public faucet has not yet been published"), "Incorrect faucet claim returned");
}
assert(!read("docs/build/zel/tutorial/tss/overview.md").includes("Publication and third-party support"), "Public docs decision regressed");
assert(!read("docs/build/zel/tutorial/tss/visor/launch-scripts.md").includes("github.com/Zano-Execution-Layer/launch-scripts"), "Nonexistent installer link returned");

const memoDoc = read("docs/build/zel/bridge-and-swaps/zano-to-zel.md");
assert(!read("docs/build/zel/architecture/signer/tss.md").includes("### Performing deposit"), "Duplicate deposit reference returned");
assert(!read("docs/build/zel/bridge-and-swaps/zano-to-zel.md").includes("selected when the transaction contains multiple service entries"), "Stale Zano nonce definition");
assert(!read("docs/build/zel/bridge-and-swaps/api-and-status.md").includes("<log, output, or service-entry index>"), "Stale canonical operation example");
const memoCode = memoDoc.match(/^```js\n([\s\S]*?)^```/m)[1];
const encoded = vm.runInNewContext(memoCode + '\nencodeZanoBridgeMemo("recipient", "9350", 0)', { TextEncoder }, { timeout: 1000 });
assert.match(encoded, /^[0-9a-f]+$/);
assert.deepEqual(JSON.parse(Buffer.from(encoded, "hex").toString("utf8")), {
  dst_add: "recipient", dst_net_id: "9350", referral_id: 0, uniform_padding: "    ",
});

const sidebar = require("../sidebarsZel");
const redirects = require("../zelRedirects");
const navigation = [];
let maxDepth = 0;
function inspectSidebar(item, depth = 1) {
  maxDepth = Math.max(maxDepth, depth);
  if (item.type === "doc") navigation.push(item.id);
  if (item.link?.type === "doc") navigation.push(item.link.id);
  if (item.type === "category") for (const child of item.items) inspectSidebar(child, depth + 1);
}
inspectSidebar(sidebar);
const published = files.filter(file => !/^draft: true$/m.test(read(file)));
const expectedIds = published.map(file => file.replace(/^docs\//, "").replace(/\.mdx?$/, ""));
assert.equal(navigation.length, new Set(navigation).size, "Duplicate navigation entries");
assert.deepEqual([...navigation].sort(), expectedIds.sort(), "Published docs and sidebar must match");
assert(maxDepth <= 4, "ZEL sidebar grew deeper than four levels");
const advanced = sidebar.items.find(item => item.label === "Operate").items.find(item => item.label === "Advanced operations");
assert.equal(advanced.collapsed, true, "Advanced operations must stay collapsed");
for (const page of ["bridge-and-swaps/api-and-status", "bridge-and-swaps/operation-lifecycle"]) {
  assert(!/awaiting_source|confirming_source|manual_review/.test(read("docs/build/zel/" + page + ".md")), "Provisional enum model returned");
}
for (const file of published) assert(!read(file).includes("Will be implemented soon."), "Empty placeholder published: " + file);

if (process.argv.includes("--built")) {
  function checkHtml(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) checkHtml(file);
      else if (entry.name.endsWith(".html")) {
        const relative = path.relative(root, file).split(path.sep).join("/");
        assert(!relative.includes("/zel/tutorial/mainnet/"), "Mainnet HTML was generated: " + relative);
        assert(!relative.includes("/_legacy/"), "Legacy HTML was generated: " + relative);
      }
    }
  }
  checkHtml(path.join(root, "build"));
  const sitemap = read("build/sitemap.xml");
  assert(!sitemap.includes("/zel/tutorial/mainnet"), "Mainnet tutorial leaked into sitemap");
  assert(!sitemap.includes("/_legacy/"), "Legacy reference leaked into sitemap");
  for (const page of required) {
    assert(sitemap.includes("/docs/build/zel/" + page + "<"), "Missing built route " + page);
  }
  for (const [from, to] of Object.entries(redirects)) {
    assert(!sitemap.includes("/docs/build/zel/" + from + "<"), "Merged/draft page leaked into sitemap: " + from);
    assert(sitemap.includes("/docs/build/zel/" + to + "<"), "Redirect destination absent: " + to);
    for (const old of [from, "testnet/" + from]) {
      const html = read("build/docs/build/zel/" + old + "/index.html");
      assert(html.includes("/docs/build/zel/" + to), "Wrong redirect target: " + old);
    }
  }
  for (const id of navigation) {
    const route = id === "build/zel/architecture/core/core" ? "/docs/build/zel/architecture/core/" : "/docs/" + id;
    assert(sitemap.includes(route + "<"), "Sidebar route absent: " + id);
  }
  const tokenomics = read("build/docs/build/zel/architecture/core/tokenomics/index.html");
  assert(!tokenomics.includes("1B"), "Legacy supply claim leaked into tokenomics page");
  assert(!tokenomics.includes("20%"), "Legacy reward claim leaked into tokenomics page");
}
console.log("ZEL docs checks passed: " + published.length + " published markdown files, " + yamlCount + " YAML blocks, " + composeCount + " Compose examples, " + shellCount + " shell blocks syntax-checked.");
