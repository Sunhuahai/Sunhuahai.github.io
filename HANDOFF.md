# Huahai Atlas — Hermes 交接说明

学术主页 **Huahai Atlas / 华海图鉴**。给在 omarchy 本机运行的 Hermes Agent 用。

## 这是什么

- 模板：as-folio **2.0.1**，**Astro 6**，要求 **Node ≥ 24**（omarchy 上实测 Node **v26**）。
- 包管理：仓库自带 Yarn Berry：`node .yarn/releases/yarn-4.13.0.cjs …`
- 用途：Huahai（孙华海）的公开学术主页；内容需他本人授权。

## 源码位置与分支

```bash
cd /home/venti/Projects/huahai-atlas   # 工作副本，用户 venti
# 旁路 bare 仓库（origin）：
#   /home/venti/Projects/huahai-atlas.git
```

| 名称 | 作用 |
|------|------|
| 本地分支 `github-pages` | **当前工作分支 / 真相来源** |
| `origin` → `huahai-atlas.git` | 本机 bare，多 agent 同步用 |
| `github` → `Sunhuahai/Sunhuahai.github.io.git` | GitHub Pages 源仓库 |

日常对齐：

```bash
git checkout github-pages
git status -sb          # 应为 github-pages...origin/github-pages
git push origin github-pages
git push github github-pages:main   # 快进即可，禁止 force
```

### 仍存在、未删除的旧引用（勿当主线）

- 本地分支 `huahai-atlas`；`origin/huahai-atlas`、`origin/main`（bare 旧指针）
- `github/github-pages`、`github/legacy-static`（旧静态博客备份，`legacy-static` ≈ 旧 sunhuahai.github.io）
- 当前 **没有** 名为 `upstream` 的 remote

## 如何部署（现行）

1. 在 `github-pages` 上改内容 → `check` / `build` / `test`
2. `git push origin github-pages`
3. `git push github github-pages:main`（**不要 force**）
4. GitHub Actions：`.github/workflows/deploy-pages.yml` → GitHub Pages
5. 自定义域名：`public/CNAME` = `huahaiatlas.com`；HTTPS 已在仓库 Pages 设置里强制开启
6. **站点 URL 写死在** `src/config/site.ts` 的 `url` **和** `astro.config.mjs`（workflow 里的 `ASTRO_SITE` 目前不起作用）

## 本地命令

```bash
cd /home/venti/Projects/huahai-atlas
export YARN_ENABLE_SCRIPTS=0   # sharp 等预编译拉取失败时使用；平时也可先加
node .yarn/releases/yarn-4.13.0.cjs install --immutable
node .yarn/releases/yarn-4.13.0.cjs check
node .yarn/releases/yarn-4.13.0.cjs build
node .yarn/releases/yarn-4.13.0.cjs test
```

`build` 会跑 `scripts/validate-publications.ts`（期刊白名单 + `conferences.yml`），再 Astro build + Pagefind。

## 内容地图

| 路径 | 内容 |
|------|------|
| `src/config/site.ts` | 站名、简介、导航、文案标签 |
| `src/content/about/` | 关于页中/英 |
| `src/content/posts/` | 博客（`draft: true` 不发布） |
| `src/content/projects/` | 项目页（须绑白名单论文 key） |
| `src/data/papers.bib` + `publication-proof.yml` | 期刊「文章」 |
| `policy/published.bib` + `publication-proof.yml` | 冻结白名单基线 |
| `src/data/conferences.yml` | 「会议」口头/海报/会议论文 |
| `PUBLICATION_POLICY.md` | 发表政策 |
| `public/` | 图标、CNAME、`icons-credits.txt` |
| `docs/icons-credits.md` | 篆文「青」字形来源（Commons PD） |
| `docs/change-log.md` | 变更记录（含站点与服务器） |
| `docs/handoff-drafts/` | **未入库**调研草稿（SPIE 等） |

导航「科研」→ `/publications/`：栏目 `#articles`（期刊）与 `#conferences`（会议；空则整段隐藏）。

## 发表政策（摘要）

- **文章**：仅允许 `policy/` 白名单中的已正式发表期刊论文；禁止把接收稿/摘要/口头/海报当论文；禁止站内 PDF、电话与清华邮箱；仅允许已批准的 iCloud 邮箱（须混淆写入 HTML）及已确认的公开社交链接。
- **会议**：仅 `conferences.yml`；类型 `oral` \| `poster` \| `proceedings`；必须 HTTPS 官方链接；禁止 PDF 链接；**须 Huahai 授权**后才能增改。
- 不编造个人经历或论文信息；文案与上线先给 Huahai 看。

## DNS（huahaiatlas.com）

- 托管：**DNSPod**（`potato.dnspod.net` / `hot.dnspod.net`）
- `@`：GitHub Pages A/AAAA 各 **2** 条（免费套餐负载均衡条数上限；官方建议 4 条，缺备用节点）
- `www` → CNAME `sunhuahai.github.io`
- **omarchy 已有 DNSPod 凭据**：`~/.hermes/.env` 的 `TENCENTCLOUD_SECRET_ID` / `TENCENTCLOUD_SECRET_KEY`（权限 600）。走腾讯云 `dnspod` API（版本 `2021-03-23`，TC3-HMAC-SHA256 签名），可只读查询（`DescribeDomainList` / `DescribeRecordList`），也可增删改记录。
- **任何 DNS 变更仍需 Huahai 授权**，动手前须讲清「改哪条、改成什么、影响什么」。密钥内容不得打印、不得写入本仓库或任何提交。

## GitHub 推送认证（omarchy / venti）

推送 **可以在 omarchy 本机完成**，不依赖 Cursor box：

- `gh`（mise）已登录账号 **Sunhuahai**（keyring；scopes 含 `repo` `workflow`）
- git：`credential.https://github.com.helper` → `gh auth git-credential`
- 另有 `http.https://github.com.proxy` = `http://127.0.0.1:7897`（本机代理）。若代理未开，HTTPS 推送可能失败，需先恢复代理或改网络。

```bash
gh auth status
git push github github-pages:main
```

## 遗留 / 旧栈

- 腾讯云预览机 `49.233.91.122`，目录 `/srv/huahaiatlas`：**仍在跑、未关**；关站须 Huahai 点头。
- `ops/deploy.sh`：**已废弃**（不再走 Tencent 构建部署）。
- GitHub 分支 `legacy-static`：旧静态博客备份。
- 不在服务器上构建或跑开发服务器（旧规矩）；现在主构建在 Actions / 本机 yarn。

## 硬性规则

1. **不要**自动升级依赖。
2. **不要**放版权 PDF、电话、清华邮箱等私人信息；联系方式仅限 Huahai 批准的 iCloud 邮箱（混淆显示）与已确认公开社交账号。
3. **不要**编造履历或论文；论文/会议只按白名单与授权添加。
4. 文案改动与 **deploy 前**告知 Huahai 要发什么。
5. 变更写入 `docs/change-log.md`。
6. **永远不要打印 secrets/**（若存在只列文件名）；不要从 cookie 造 token。

## 待办（给 Hermes / Huahai）

- [ ] SPIE 2024 proceedings `10.1117/12.3027548` 已调研，**未入库**（见 `docs/handoff-drafts/`）
- [ ] CSS-MAR 中文期刊文章已看到线索，**未入库**
- [ ] 腾讯预览站是否下线：**未定**
- [ ] DNSPod 是否升级套餐以补齐 4×A/AAAA：**未定**

## 快捷检查

```bash
curl -sI https://huahaiatlas.com/ | head -5
curl -s https://huahaiatlas.com/publications/ | rg -o '科研|文章|会议|口头报告|DiffuCoCT' | sort -u
gh run list -R Sunhuahai/Sunhuahai.github.io --branch main --limit 3
```
