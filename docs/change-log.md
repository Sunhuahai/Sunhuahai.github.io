# 服务器变更记录

2026-11-07：分支 `cursor/seo-share-metadata-7a38`（未合并、未发布，未推 main）。技术向分享与检索元数据：canonical 固定为 https://huahaiatlas.com 的目录尾斜杠并去掉查询串；博客文章 `og:type=article`，`article:published_time` 与文内日期同一天，`article:author` 为已公开 ORCID；首页与关于页 Person JSON-LD（姓名、英文名、主页、ORCID）；科研页与公开项目页 ScholarlyArticle JSON-LD（仅 `papers.bib` 三篇期刊文章的题名、作者、期刊卷期页、年份与 DOI）。会议口头报告不进入 ScholarlyArticle。404 增加 `noindex`。未改首页标题、各页 description、状态页文案与主导航，未换分享图，未改篆文「青」图标，未改论文/会议数据、工作流或 DNS。未部署。

2026-11-06：增加 HANDOFF.md 与 docs/handoff-drafts/（SPIE 等未入库调研草稿），供 omarchy 本机 Hermes Agent 交接；无站点内容改动。源码 github-pages → origin / GitHub Pages main。未改动腾讯云预览机 Caddy/SSH/防火墙。


2026-11-06：站点图标改为说文小篆「青」（白字黑底，Commons 公有领域字形，commit ab56c23）；科研页导航由「论文」更名为「科研」，下设「文章」「会议」（commit a2d887c）；会议栏加入 Fully3D 2025 口头报告 DiffuCoCT（官方 program URL）。源码 github-pages → GitHub Pages main。未改动腾讯云预览机 Caddy/SSH/防火墙。

2026-11-06：公网入口切到 GitHub Pages。DNSPod 为 huahaiatlas.com 增加 GitHub Pages A/AAAA（套餐负载均衡上限仅写入各 2 条）及 www CNAME→sunhuahai.github.io；仓库 site URL 改为 https://huahaiatlas.com，并加入 public/CNAME。未改动腾讯云预览机 Caddy/SSH/防火墙。

2026-10-24：新增独立 /srv/huahaiatlas、huahaiatlas-preview.service、huahaiatlas-backup.service/timer，官方 Kuma Compose。未改动原 Caddy、SSH、防火墙或原有文件。

通过 Ubuntu 官方源新增 docker.io、docker-compose-v2、containerd、runc，无旧包移除或升级。安装后的系统 needrestart 自动重启了 cron（未修改 cron 配置）；其他已运行服务保留。

只有本项目临时恢复测试容器在演练后删除；恢复数据目录及原材料、旧 release 和备份均保留。未通过测试的构建版本移至 incoming/rejected-test-release，不可由 current 访问。
