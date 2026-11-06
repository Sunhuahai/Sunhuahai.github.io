# 公网托管（GitHub Pages）

- 源码：omarchy `/home/venti/Projects/huahai-atlas`，分支 `github-pages`（box 同步副本：`/workspace/huahai-atlas/site`）
- 发布：推送到 `Sunhuahai/Sunhuahai.github.io` 的 `main`，由 `.github/workflows/deploy-pages.yml` 构建并部署
- 旧静态内容备份分支：`legacy-static`
- 自定义域名与 DNS 暂不改动；`ops/deploy.sh` 仅用于腾讯云预览机，公网站点请走 GitHub Actions

---

# 部署与公开上线门槛

服务器项目目录 `/srv/huahaiatlas`。本地构建产物通过 scp 上传，releases 保存版本，current 原子切换，previous 指向上次版本。只部署 dist，不上传源码或 materials。

新服务 `huahaiatlas-preview.service` 以现有低权限 caddy 用户运行，管理 API 关闭，监听 127.0.0.1:18080/18081。原 `/etc/caddy/Caddyfile`、caddy.service 和 80 端口不改动。

Kuma 官方 GHCR v2 slim 镜像不包含浏览器测试依赖，满足 HTTP 探测；SQLite 持久化于 monitoring/data。为避免引入 Docker 桥接/转发端口，采用 host 网络，并显式设置 `UPTIME_KUMA_HOST=127.0.0.1`，真实监听验收须始终是回环 3001。此选择同时允许探测回环静态站。不得去掉 HOST 环境变量。

## 更新

在项目根目录执行 `bash ops/deploy.sh`。脚本先 check/build/test，任何一步失败不会上传；上传后原子切换 release。

不要在服务器构建 Astro 或运行开发服务器。不自动更新应用或依赖，避免未经测试漂移。Kuma 镜像固定 digest 后，升级需显式拉取新版本、备份、检查官方迁移说明、替换 digest 并重测。

## DNS（备案通过后）

| 主机记录 | 类型 | 值 | TTL |
|---|---|---|---|
| @ | A | 49.233.91.122 | 600 |
| www | A | 49.233.91.122 | 600 |
| status | A | 49.233.91.122 | 600 |

不添加未知 IPv6 的 AAAA，不改无关记录。尚无 DNS 账户授权，未修改解析。

## 正式上线时才执行

1. 核验 ICP 审批号与腾讯云接入备案，用户确认中英文身份文案；在页脚加入真实备案号与官方查询链接。无邮箱也可以上线。
2. 检查 A/AAAA/CAA 和公网 80/443 云防火墙；当前无云侧账号权限，未变更防火墙。
3. 修改 statusPublic 并移除私有 robots 禁止抓取规则，加入 sitemap。重新测试、构建、部署。
4. `ops/Caddyfile.public.pending` 是未启用的配置草稿。原 Caddy 当前服务必须先备份，再经用户批准影响该服务的变更；validate 通过后 graceful reload。由 Caddy 自动申请 HTTPS。
5. 实测 apex HTTPS 证书链、HTTP→HTTPS、www→apex 301、外部移动访问，以及状态域名的 GET/POST、WebSocket 与后台路径隔离。
6. 将 Kuma 主站监控目标改为 https://huahaiatlas.com/；启用证书到期探测，状态页 domain mapping 仅在验证路由后添加。
7. 选择并授权告警渠道与测试通知。没有凭据时保持空配置，不发送消息。按适用要求完成公安联网备案。

权威依据：[腾讯云轻量服务器 ICP 备案](https://cloud.tencent.com/document/product/1207/45756)。当前服务只通过 SSH 隧道提供预览。
