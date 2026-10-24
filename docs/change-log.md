# 服务器变更记录

2026-10-24：新增独立 /srv/huahaiatlas、huahaiatlas-preview.service、huahaiatlas-backup.service/timer，官方 Kuma Compose。未改动原 Caddy、SSH、防火墙或原有文件。

通过 Ubuntu 官方源新增 docker.io、docker-compose-v2、containerd、runc，无旧包移除或升级。安装后的系统 needrestart 自动重启了 cron（未修改 cron 配置）；其他已运行服务保留。

只有本项目临时恢复测试容器在演练后删除；恢复数据目录及原材料、旧 release 和备份均保留。未通过测试的构建版本移至 incoming/rejected-test-release，不可由 current 访问。
