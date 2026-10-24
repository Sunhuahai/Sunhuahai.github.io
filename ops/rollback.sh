#!/bin/bash
set -euo pipefail
base=/srv/huahaiatlas
cd "$base"
target=${1:-$(readlink previous)}
[[ "$target" =~ ^releases/[A-Za-z0-9._-]+$ ]] || { echo 'Expected releases/<release-id>'; exit 1; }
test -f "$target/index.html"
old=$(readlink current)
ln -s "$target" current.next
mv -Tf current.next current
ln -s "$old" previous.next
mv -Tf previous.next previous
curl -fsS http://127.0.0.1:18080/ >/dev/null
printf 'Active: %s\n' "$target"
