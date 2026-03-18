# Auto-Updater Skill

自动检查并更新所有已安装的 OpenClaw Skills。

## 功能

- 每周自动运行更新检查
- 生成更新报告
- 支持手动触发

## 使用

手动运行更新：
```bash
node skills/auto-updater/scripts/update.mjs
```

## 自动调度

通过 OpenClaw Cron 设置每周运行：
- 默认：每周一上午 9:00
