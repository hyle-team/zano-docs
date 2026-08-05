#!/bin/bash
# Drop-in "Writing documentation..." section for the Zano release build script.
# Replaces the old rm/--generate-rpc-autodoc/commit block, which no longer works:
# the RPC reference moved to api-reference/ and is versioned (see API-VERSIONING.md).
#
# Expects (already set by the surrounding build script):
#   $daemon_path   built zanod
#   $wallet_path   built simplewallet
#   $version_str   e.g. "v2.2.1.502[76a791c]" (from zanod --version)
#   $testnet       "true" for testnet builds
#
# Requires: python3 (stdlib only).

set -e

# guard: docs update only for standard release builds — custom builds set
# $build_prefix (the surrounding script prefixes archive names with it)
if [ -n "$build_prefix" ]; then
  echo "build_prefix='$build_prefix' set — skipping docs update (custom build)"
  exit 0
fi

echo "Writing documentation..."

cd /home/user/zano-docs
git reset --hard
git pull -r

# picker label: "v2.2.1.502[abc1234]" -> "2.2.1.502"
version_core=$(echo "$version_str" | sed -e 's/^v//' -e 's/\[.*$//')

if [ "$testnet" == true ]; then
  # testnet builds refresh the Testnet snapshot; mainnet reference is untouched
  python3 scripts/api_version.py testnet \
    --zanod "$daemon_path" --simplewallet "$wallet_path" \
    --label "Testnet (${version_core})"
else
  # mainnet builds roll the current version forward; when the release line
  # changes (e.g. 2.2.1 -> 2.3.0) the old release is auto-archived first
  python3 scripts/api_version.py rollover \
    --zanod "$daemon_path" --simplewallet "$wallet_path" \
    --label "Mainnet (${version_core})"
fi

python3 scripts/api_version.py check

git add -A
if git diff --cached --quiet; then
  echo "Docs unchanged for this build; nothing to commit"
else
  git commit -m "Auto generated doc (${version_core})"
  git push
fi
