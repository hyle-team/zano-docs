#!/bin/bash
# Documentation step for the Zano release build script.
# Replaces the old rm/--generate-rpc-autodoc/commit block: the RPC reference
# moved to api-reference/ and is versioned (see API-VERSIONING.md).
#
# Call it from the build script after the binaries are built:
#     bash /home/user/zano-docs/scripts/build-machine-docs.sh
#
# Everything it needs it derives itself, so no variables have to be exported:
#   * binaries      $daemon_path / $wallet_path if set, else the standard
#                   build output path (override with BUILD_SRC)
#   * version+net   read from the binary itself (`--version`), which is the
#                   source of truth: "Zano v2.2.1.505[...]" -> mainnet,
#                   "Zano_testnet v..." -> testnet snapshot
#   * BRANCH_NAME   docs update only for release-line builds
#
# Env knobs: DOCS_DIR, BUILD_SRC, DRY_RUN=1 (generate + validate, no git writes).
# Requires: python3 (stdlib only).

set -e

DOCS_DIR="${DOCS_DIR:-/home/user/zano-docs}"
BUILD_SRC="${BUILD_SRC:-/home/user/zano-custom-branch/build/release/src}"
ZANOD="${daemon_path:-$BUILD_SRC/zanod}"
SIMPLEWALLET="${wallet_path:-$BUILD_SRC/simplewallet}"

# Only release-line builds feed the published reference. Feature/develop builds
# are skipped: the Mainnet version tracks releases, and develop can diverge from
# the release lineage. An unset BRANCH_NAME (manual run) is allowed.
case "${BRANCH_NAME-release}" in
  release|master|main|"") ;;
  *)
    echo "BRANCH_NAME='$BRANCH_NAME' is not a release branch — skipping docs update"
    exit 0
    ;;
esac

if [ ! -x "$ZANOD" ] || [ ! -x "$SIMPLEWALLET" ]; then
  echo "ERROR: binaries not found ($ZANOD / $SIMPLEWALLET)" >&2
  exit 1
fi

# the binary announces both its version and its network
version_line=$("$ZANOD" --version | awk '/^Zano/ { print; exit }')
version_core=$(echo "$version_line" | awk '{ print $2 }' | sed -e 's/^v//' -e 's/\[.*$//')
if [ -z "$version_core" ]; then
  echo "ERROR: could not parse version from: $version_line" >&2
  exit 1
fi
case "$version_line" in
  Zano_testnet*) network=testnet ;;
  *)             network=mainnet ;;
esac
echo "Writing documentation... ($network, $version_core)"

cd "$DOCS_DIR"
if [ "${DRY_RUN:-}" != "1" ]; then
  git reset --hard
  git pull -r
fi

if [ "$network" = testnet ]; then
  python3 scripts/api_version.py testnet \
    --zanod "$ZANOD" --simplewallet "$SIMPLEWALLET" \
    --label "Testnet (${version_core})"
else
  # rolls the current version forward; crossing a release line
  # (e.g. 2.2.1 -> 2.3.0) auto-archives the outgoing release first
  python3 scripts/api_version.py rollover \
    --zanod "$ZANOD" --simplewallet "$SIMPLEWALLET" \
    --label "Mainnet (${version_core})"
fi

python3 scripts/api_version.py check

if [ "${DRY_RUN:-}" = "1" ]; then
  echo "DRY_RUN=1 — generated and validated, no git writes"
  git --no-pager diff --stat
  exit 0
fi

git add -A
if git diff --cached --quiet; then
  echo "Docs unchanged for this build; nothing to commit"
else
  git commit -m "Auto generated doc (${version_core})"
  git push
fi
