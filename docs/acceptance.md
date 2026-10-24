# 私有部署验收 — 2026-10-24

状态：已部署，可通过 SSH 隧道使用。ICP备案已提交，尚无通过凭据；域名无可用 A 记录，公网 HTTPS 未启用。

## 网站

- 基于 as-folio 2.0.1 / Astro 6.4.8，保留 MIT 许可证与上游 Git 历史。只读 upstream，无个人远端或公开仓库。
- 上游原始基线构建通过；改造后 check 为 0 errors、0 warnings（上游 ESLint 配置有一条弃用 hint）。静态构建通过，10 个 HTML 页面。
- 7 项论文门禁测试通过：初始允许列表、作者篡改、额外条目、重复、非 published 状态、无效证据、PDF 再分发标记。
- 本地静态验收：3 篇论文，3 个项目详情，全部本地资源存在；没有模板假数据、邮箱、私网地址、CV/PDF 或被排除研究。
- 独立本地临时测试验证 KaTeX、目录、代码高亮、draft 不生成路由；测试文件已移除。发现空目录旧缓存问题后，构建明确清理 .astro 及 node_modules/.astro。最终产物已确认博客为空且没有测试稿。
- Safari 实测远端主页、浅色/深色、390×844 响应式布局、手机菜单、年份筛选及 BibTeX 复制。修复长文本溢出后复测。临时启用的 Safari 开发者功能已恢复原设置。
- 三篇 DOI 对应官方 PubMed/出版商记录；没有擅自提供版权 PDF。资料来源见 assets.md。

## 监控与隔离

- 官方 ghcr.io/louislam/uptime-kuma 2.5.7，v2 slim，amd64 manifest 固定为 sha256:a8698e0664a36bcedba4efa5ed745c5b2aaa6488d2d8e866b5f054c8b19ad84b。Mac 从官方 GHCR 下载逐层 SHA-256 校验后经 SSH 导入，未用第三方镜像。
- SQLite 数据 `/srv/huahaiatlas/monitoring/data`；容器健康，restart unless-stopped。主站 HTTP 探测 60 秒间隔，当前 status=1、HTTP 正常。
- 原 Caddy 服务未重启，配置哈希一致。新增回环 Caddy 的 systemd 服务已启用；Kuma 真实监听 127.0.0.1:3001，静态/状态入口 127.0.0.1:18080/18081。
- 状态安全入口根路径跳到 /status/atlas，GET 状态页和指定状态 API 可用。/dashboard、/login、/setup、/metrics、管理 API、Socket.IO、编辑路由及路径穿越样例 404；POST 拒绝。未登录管理 API 返回拒绝。
- 公开 JSON 只有站点名称、状态和历史，不包含 localhost、服务器 IP、监控 URL、用户名、端口、密码或 token。
- Safari 实际渲染隔离状态页“所有服务运行正常”，仅 Huahai Atlas Website 一项，无登录/后台入口。
- Mac 外部应用层探测：SSH 收到真实 banner；3001/18080/18081 未取得 HTTP 响应。该网络环境 TCP connect 本身对任意端口可能先返回成功，故不以此断言开放；结合服务器实际监听与匿名 HTTP 隔离结果判断。
- 告警渠道为空，未发送任何消息。公网 HTTPS 与证书到期探测待 DNS/备案/正式上线后切换；同机监控不提供整机宕机独立告警。

## 备份和恢复

- 日备份 timer 已启用：服务器 CST 04:15 加最多 10 分钟随机延时。通过短暂停止本项目 Kuma 获得一致性快照，主站继续提供服务。
- 首次备份已复制到 Mac 工作目录外层 backups/，SHA-256 一致。备份权限 600，未进入 Git。
- 备份恢复到全新隔离目录：SQLite integrity_check=ok，监控数量=1，current 对应静态版本存在。
- 使用恢复数据启动临时 Kuma 回环实例，实际取得正确状态页与监控配置；测试实例随后停止并移除，恢复目录留存。
- 正式 Kuma 以固定 digest 重建容器后，原监控 ID 和状态页仍存在。

## 实测资源

恢复演练结束后：Kuma CPU 0.52%，RAM 109.2 MiB / 512 MiB 限额；整机 RAM 使用 918 MiB，available 1.0 GiB；Swap 使用 126 MiB / 1.9 GiB；系统盘剩余 34 GiB / 50 GiB。容器层约 922 MiB（包含下载暂存），项目约 194 MiB（含官方镜像导入包）。无长期 Node 主站运行时。

这是一时点采样，不代表长期负载或可用率承诺。未执行整机重启；自动启动配置已检查，容器重建及备份重启已实测。

## 尚待用户

ICP备案审核通过及真实备案号；DNS 配置；中英文身份文案公开确认；选择告警渠道与安全录入凭据。云侧防火墙控制台当前无权限，未变更；公开前仍需检查 80/443。
