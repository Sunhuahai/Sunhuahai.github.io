#!/bin/bash
# NOTE: This script deploys to the Tencent Cloud preview host (ssh tencent).
# Public hosting is moving to GitHub Pages (.github/workflows/deploy-pages.yml).
# Keep this script for rollback/history; do not use it for the public site.

set -euo pipefail
cd "$(dirname "$0")/.."
if [ -n "$(git status --porcelain)" ]; then
  echo 'Refusing to deploy: working tree has uncommitted changes or untracked files' >&2
  git status --short >&2
  exit 1
fi
node .yarn/releases/yarn-4.13.0.cjs check
node .yarn/releases/yarn-4.13.0.cjs build
node .yarn/releases/yarn-4.13.0.cjs test
release="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD)"
COPYFILE_DISABLE=1 tar --no-xattrs -C dist -czf "/tmp/atlas-$release.tar.gz" .
scp "/tmp/atlas-$release.tar.gz" "tencent:/srv/huahaiatlas/incoming/$release.tar.gz"
ssh tencent bash -s -- "$release" <<'REMOTE'
set -euo pipefail
base=/srv/huahaiatlas
release=$1
test ! -e "$base/releases/$release"
mkdir "$base/releases/$release"
tar -xzf "$base/incoming/$release.tar.gz" -C "$base/releases/$release"
old=$(readlink "$base/current" || true)
[ -z "$old" ] || { ln -s "$old" "$base/previous.next"; mv -Tf "$base/previous.next" "$base/previous"; }
ln -s "releases/$release" "$base/current.next"
mv -Tf "$base/current.next" "$base/current"
if ! curl -fsS http://127.0.0.1:18080/ >/dev/null; then
  if [ -n "$old" ]; then
    ln -s "$old" "$base/current.rollback"
    mv -Tf "$base/current.rollback" "$base/current"
  fi
  echo 'Health check failed; previous release restored' >&2
  exit 1
fi
printf 'Release active: %s\n' "$release"
REMOTE
