# 维护操作

## 内容更新

- 简介与导航：`src/config/site.ts`；关于页正文：`src/content/about-zh.md` / `about-en.md`。待确认的邮箱、GitHub、导师不填。
- 新增正式论文：遵循 PUBLICATION_POLICY.md；首版白名单是严格 3 篇，新增需核验并明确批准扩展。禁止以审稿或仅录用材料扩充。
- 项目：`src/content/projects/<slug>.md`，包含 title/slug/publication_key/category/year/public，必须关联白名单论文。仅使用可公开概述。
- 博客：`src/content/posts/<slug>.md` 或 mdx，frontmatter 如下。正文支持数学公式、Shiki 代码块、目录和标签。draft 为 true 不生成路由；确认可公开后改为 false。

```yaml
---
title: '真实文章标题'
date: 2026-10-24
description: '简述文章内容'
tags: [数学]
draft: true
math: true
toc: true
---
```

每次 `bash ops/deploy.sh` 先清理生成缓存，防止被删除文章残留。不要清理源码或用户原始材料。博客空目录用 .gitkeep 保留。

## 预览、状态与日志

预览隧道见 README。后台 admin 的随机密码保存在服务器 `/srv/huahaiatlas/secrets/kuma-admin.json`（权限 600，ubuntu 私有目录 700），不在 Git 或网页中。可通过可信 SSH 终端自行读取并存入密码管理器，不要粘贴到聊天。登录后可自行修改密码和启用 2FA。

```sh
ssh tencent 'systemctl status huahaiatlas-preview --no-pager'
ssh tencent 'sudo journalctl -u huahaiatlas-preview -n 50 --no-pager'
ssh tencent 'cd /srv/huahaiatlas/monitoring && sudo docker compose ps'
ssh tencent 'cd /srv/huahaiatlas/monitoring && sudo docker compose logs --tail 50'
```

站点访问日志 `/srv/huahaiatlas/logs/access.log`，5 MiB 轮转保留 3 份。容器 JSON 日志同样限制 5 MiB × 3。无 Node 主站常驻进程；Kuma 是必要的 Node 监控服务。

## 备份

```sh
ssh tencent 'sudo /srv/huahaiatlas/ops/backup.sh'
ssh tencent 'systemctl list-timers huahaiatlas-backup.timer --no-pager'
scp 'tencent:/srv/huahaiatlas/backups/atlas-<timestamp>.tar.gz*' /本机私有备份目录/
```

每日服务器时间 04:15 加 0–10 分钟随机延时运行，包含配置、release、Kuma 数据；为 SQLite 一致性会短暂停止本项目 Kuma，再自动启动。备份含密码哈希，不要公开或放进 Git。无自动删除，需每月检查磁盘/保留策略。建议至少一份服务器外备份；本次已复制到工作目录外层私有 backups。

## 静态站回滚

```sh
ssh tencent 'bash /srv/huahaiatlas/ops/rollback.sh'
# 指定旧版：bash .../rollback.sh releases/<release-id>
```

仅切换本项目 current/previous，不重启原 Caddy，不删除 release。

## 恢复演练与灾难恢复

```sh
ssh tencent 'sudo /srv/huahaiatlas/ops/restore-isolated.sh /srv/huahaiatlas/backups/atlas-<timestamp>.tar.gz /srv/huahaiatlas/restore-<new-id>'
```

脚本拒绝已有目标，校验 SQLite integrity_check 和 current 静态站。演练不改实时数据。真正恢复时：先再备份当前状态；停止本项目 Kuma；保留现有 data 为 data-before-restore-时间戳；把演练恢复目录的 monitoring/data 复制到活动位置；按原 uid/gid/权限恢复；同一固定镜像启动；校验 admin/monitor/heartbeat/状态页，再恢复 current。不要跨版本直接回退已迁移数据库，需同时恢复对应镜像和备份。

## 告警状态

未提供接收渠道和凭据，通知配置为空，未发送测试消息。同机 Kuma 无法在整台服务器宕机时自行告警；外部探测/独立保管备份应在用户选择渠道与账户授权后再启用，不擅自创建外部账号。
