#!/bin/bash
set -euo pipefail
umask 077
base=/srv/huahaiatlas
exec 9>"$base/backups/.lock"
flock -n 9 || exit 1
stamp=$(date -u +%Y%m%dT%H%M%SZ)
cd "$base/monitoring"
docker compose stop kuma
trap 'docker compose start kuma >/dev/null' EXIT
tar -C "$base" -czf "$base/backups/atlas-$stamp.tar.gz.partial" config monitoring ops docs current releases
mv "$base/backups/atlas-$stamp.tar.gz.partial" "$base/backups/atlas-$stamp.tar.gz"
sha256sum "$base/backups/atlas-$stamp.tar.gz" > "$base/backups/atlas-$stamp.tar.gz.sha256"
chown ubuntu:ubuntu "$base/backups/atlas-$stamp.tar.gz" "$base/backups/atlas-$stamp.tar.gz.sha256"
docker compose start kuma
trap - EXIT
# No automatic deletion: review retention and free space regularly.
