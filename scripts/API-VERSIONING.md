# RPC API versioning — release runbook

The RPC reference (`/docs/build/rpc-api`) is a versioned Docusaurus instance
(pluginId `api`). `api-reference/` is the Mainnet **current** version;
snapshots live in `api_versioned_docs/`. The dropdown order below "current" is
`api_versions.json` and it is user-facing: **testnet first, then archives
newest-first**. `scripts/api_version.py` maintains all of this; don't hand-edit
what it owns.

Our generation is authoritative. The team build machine may still commit into
`docs/build/rpc-api/` (excluded from the site, staging only); after a rollover
its commit must be a no-op against `api-reference/` — if it differs, diff it,
identify the generating build, and keep whichever is the newer release,
saying so in the commit message.

## Refresh the testnet version (whenever a new testnet build is deployed)

    python3 scripts/api_version.py testnet \
      --zanod ~/zano/testnet/zano/build/src/zanod \
      --simplewallet ~/zano/testnet/zano/build/src/simplewallet \
      --label "Testnet (2.2.1.XXX)"

## Release rollover (HF6 and every release after)

1. `python3 scripts/api_version.py archive --name 2.2.1`   ← preserves current mainnet first; refuses on dirty tree
2. `python3 scripts/api_version.py rollover --zanod <release zanod> --simplewallet <release simplewallet> --label "Mainnet (2.3.0.XXX)"`
3. `python3 scripts/api_version.py check`
4. `npm run build` — must be green; spot-check the dropdown, banners, and a few method pages
5. Review `git diff` — the delta must match the release's expected API changes; update the changelog page
6. Commit (signed), PR, merge

## Build-machine integration

The release build script's old doc section (rm + `--generate-rpc-autodoc` into
`docs/build/rpc-api/` + commit) no longer works and must be replaced with
`scripts/build-machine-docs.sh` (drop-in; same variables: `$daemon_path`,
`$wallet_path`, `$version_str`, `$testnet`). What changes in behavior:

- testnet builds update the **Testnet** snapshot instead of overwriting mainnet
- mainnet builds roll the current version forward; crossing a release line
  (e.g. 2.2.1 → 2.3.0) auto-archives the old release first
- invariants are checked before committing; a no-change regen exits cleanly
  instead of failing on an empty commit
- requires python3 on the build machine (stdlib only)
- only release-line builds update docs: the script skips unless `BRANCH_NAME`
  is release/master/main (this Jenkins setup sets `build_prefix=$BRANCH_NAME`
  on every build, so build_prefix cannot be used to tell builds apart)
- mainnet vs testnet is detected from the binary's own version string, and no
  variables need exporting from the calling script
- `DRY_RUN=1` generates and validates without touching git

## Invariants `check` enforces (also safe in CI)

- four hand-written intro pages present in the working dir
- every listed version has its docs dir + sidebars json
- `api_versions.json` order: testnet first, archives descending
- the "current" config label matches the version stamp inside the generated pages
- no vestigial `_category_.json` at the instance root

## Notes

- The version dropdown renders only on `/docs/build/rpc-api/**`
  (`src/components/ApiVersionDropdown`) — the rest of the site is unversioned.
- Never fix typos in generated pages here; they live in the C++ `DOC_DSCR`
  strings upstream (hyle-team/zano) and regeneration clobbers page edits.
- Archived versions keep Docusaurus defaults: label = name, path = name,
  automatic "unmaintained" banner.
