# 服务器变更记录

2026-11-09：**已发布**（PR #3，main `2ff1965`，2026-11-09 21:00 GitHub Actions 部署成功）。关于页头像下、首页简介下与页脚增加联系方式图标栏：邮箱（仅批准的 iCloud，HTML 混淆）、ORCID、GitHub、Bilibili、小红书号（无已核验主页 URL，点击复制）、博客 RSS。Person JSON-LD `sameAs` 增加 GitHub 与 Bilibili；邮箱不进 JSON-LD。未改论文白名单、会议数据、导航、工作流或 DNS。

2026-11-09：Huahai 确认发布博客。新增 `ct-scatter-correction-primer` 与 `xfct-primer`（日期 2026-11-09，draft false）。散射校正文保留原稿第一人称：「沿着同一方向，我们在 Fully3D 2025 上做了题为 DiffuCoCT 的口头报告，尝试用扩散模型做双探测器 CT 的散射校正。」未把口头报告改写成未具名表述。另将已有三篇「第一长期主义」「还得是数学」「选择、摩擦与反馈」由 draft true 改为 false，正文未改。未加入光子计数泊松噪声稿，未改论文白名单、会议数据、导航、工作流或 DNS。

2026-11-07：Huahai 确认后，同一分支写入首页标题「孙华海 Huahai Sun · 华海图鉴」（页眉文字仍为 Huahai Atlas）。description：首页「孙华海（Huahai Sun）的学术主页，收录期刊文章、会议记录、研究项目与博客。」；关于「了解孙华海（Huahai Sun）的研究方向与学术背景。」；科研「孙华海的期刊文章与会议记录，包含口头报告、海报及会议论文。」；项目「孙华海的公开研究项目及相关学术成果。」；博客列表「孙华海的研究笔记与随笔。」。单篇博客 description 未改。主导航移除「状态」；/status/ 保留并 noindex，正文仅为「网站已公开上线，独立状态监测尚未接入。」。未新增分享图，未改篆文「青」、论文与会议数据、工作流或 DNS。

2026-11-07：同分支较早提交只做技术向元数据（该提交本身未改文案）：canonical 固定为 https://huahaiatlas.com 的目录尾斜杠并去掉查询串；博客文章 `og:type=article`，`article:published_time` 与文内日期同一天，`article:author` 为已公开 ORCID；首页与关于页 Person JSON-LD（姓名、英文名、主页、ORCID）；科研页与公开项目页 ScholarlyArticle JSON-LD（仅 `papers.bib` 三篇期刊文章的题名、作者、期刊卷期页、年份与 DOI）。会议口头报告不进入 ScholarlyArticle。404 增加 `noindex`。

2026-11-06：HANDOFF.md 更新 DNS 章节——omarchy 本机已配置 DNSPod 腾讯云凭据（`~/.hermes/.env`，权限 600，`TENCENTCLOUD_SECRET_ID` / `TENCENTCLOUD_SECRET_KEY`），经腾讯云 `dnspod` API（2021-03-23，TC3 签名）只读查询验证可用；同时明确任何 DNS 变更仍需 Huahai 授权、密钥不得打印或入库。无站点内容改动，未改动腾讯云预览机 Caddy/SSH/防火墙。

2026-11-06：增加 HANDOFF.md 与 docs/handoff-drafts/（SPIE 等未入库调研草稿），供 omarchy 本机 Hermes Agent 交接；无站点内容改动。源码 github-pages → origin / GitHub Pages main。未改动腾讯云预览机 Caddy/SSH/防火墙。


2026-11-06：站点图标改为说文小篆「青」（白字黑底，Commons 公有领域字形，commit ab56c23）；科研页导航由「论文」更名为「科研」，下设「文章」「会议」（commit a2d887c）；会议栏加入 Fully3D 2025 口头报告 DiffuCoCT（官方 program URL）。源码 github-pages → GitHub Pages main。未改动腾讯云预览机 Caddy/SSH/防火墙。

2026-11-06：公网入口切到 GitHub Pages。DNSPod 为 huahaiatlas.com 增加 GitHub Pages A/AAAA（套餐负载均衡上限仅写入各 2 条）及 www CNAME→sunhuahai.github.io；仓库 site URL 改为 https://huahaiatlas.com，并加入 public/CNAME。未改动腾讯云预览机 Caddy/SSH/防火墙。

2026-10-24：新增独立 /srv/huahaiatlas、huahaiatlas-preview.service、huahaiatlas-backup.service/timer，官方 Kuma Compose。未改动原 Caddy、SSH、防火墙或原有文件。

通过 Ubuntu 官方源新增 docker.io、docker-compose-v2、containerd、runc，无旧包移除或升级。安装后的系统 needrestart 自动重启了 cron（未修改 cron 配置）；其他已运行服务保留。

只有本项目临时恢复测试容器在演练后删除；恢复数据目录及原材料、旧 release 和备份均保留。未通过测试的构建版本移至 incoming/rejected-test-release，不可由 current 访问。
