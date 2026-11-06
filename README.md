# Huahai Atlas / 华海图鉴

Astro 6 static academic website, adapted from MIT as-folio 2.0.1 at commit 6a30d3e835830233f655820d42cde41d9b61ed2c. See LICENSE and docs/UPSTREAM.md. Original handoff remains untouched in the adjacent private directory.

公网站点由 GitHub Pages 托管（仓库 [Sunhuahai/Sunhuahai.github.io](https://github.com/Sunhuahai/Sunhuahai.github.io)，Actions 构建部署），自定义域名 https://huahaiatlas.com/ （www 指向 apex）。源码工作副本在 omarchy：`/home/venti/Projects/huahai-atlas`（分支 `github-pages`）。旧静态站备份在同仓库 `legacy-static` 分支。腾讯云预览机仍可用，但不再作为公网入口。

## 本地运行

Node >=24。项目已附官方 Yarn 4.13.0，无需全局安装。

```sh
node .yarn/releases/yarn-4.13.0.cjs install --immutable
node .yarn/releases/yarn-4.13.0.cjs check
node .yarn/releases/yarn-4.13.0.cjs build
node .yarn/releases/yarn-4.13.0.cjs test
node .yarn/releases/yarn-4.13.0.cjs preview
```

## 远端预览

```sh
ssh -N -o ExitOnForwardFailure=yes \
  -L 127.0.0.1:18080:127.0.0.1:18080 \
  -L 127.0.0.1:18081:127.0.0.1:18081 \
  -L 127.0.0.1:13001:127.0.0.1:3001 tencent
```

- 主站：http://127.0.0.1:18080/
- 隔离状态页：http://127.0.0.1:18081/status/atlas
- Kuma 管理：http://127.0.0.1:13001/ （需登录）

若提示端口已占用，可能本次会话隧道仍在运行，可直接打开以上地址；也可换本机端口，右侧服务器回环端口保持不变。

源文件只包含选定头像、品牌 SVG、双语公开简介草稿、3 篇白名单论文及对应项目。无原始简历、邮箱、电话、内部数据或论文 PDF。博客允许为空，draft 默认 true 且不生成页面。

维护见 [RUNBOOK.md](RUNBOOK.md)，部署见 [DEPLOY.md](DEPLOY.md)，论文门禁见 [PUBLICATION_POLICY.md](PUBLICATION_POLICY.md)，完整验收见 [docs/acceptance.md](docs/acceptance.md)。
