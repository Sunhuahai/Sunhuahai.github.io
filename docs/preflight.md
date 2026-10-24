# Huahai Atlas preflight — 2026-10-24

- SSH alias checked with `ssh -G tencent`; successful key-based connection, passwordless sudo available.
- Ubuntu 24.04.5 LTS x86_64; 2 vCPU; RAM 1.9 GiB, available 1.2 GiB; Swap 1.9 GiB, 115 MiB used. Root disk 50 GiB, 35 GiB free.
- Tencent metadata region `ap-beijing` (mainland China); public IP 49.233.91.122.
- Existing Caddy 2.11.7 serves /usr/share/caddy on :80; admin 127.0.0.1:2019. Existing files/configuration must remain unchanged.
- SSH :22; no other application listeners. Docker/Compose absent; Node 22.23.4 present. UFW inactive; nftables ruleset empty. Cloud firewall rules cannot be inventoried without Tencent account access.
- Server resolver: apex has no requested address record, www/status NXDOMAIN. ICP evidence and identity wording approval unavailable. Public launch blocked; private loopback preview only.
- Planned additions: /srv/huahaiatlas (new), separate Caddy process on 127.0.0.1:18080/18081 with admin disabled, Docker/Compose packages (simulation: four new packages, none removed), official Kuma v2 on loopback 3001 with project-scoped data.
- Existing Caddy service/configuration and :80 behavior will not be edited or restarted. No firewall/DNS changes.
- Rollback: disable/remove only huahaiatlas-owned units/containers; release symlink switch to prior version. Keep all data and backups. Container software need not be uninstalled.
- Backups: timestamped static/configuration archives plus consistent SQLite backup or stopped-service volume snapshot, daily project timer, off-server copy to this local workspace; restore rehearsal in isolated path.
