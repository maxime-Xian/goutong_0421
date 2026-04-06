
# HEARTBEAT.md - Maxim Loop-OS V3.0 自动机配置

## 调度原则
- **错峰执行**：避免同一时间多个重任务竞争资源
- **轻量优先**：上午使用 systemEvent / exec，晚间使用 agentTurn
- **失败隔离**：单个任务失败不影响其他任务执行

---

## 每日任务时间表

| 时间 | 任务名 | 类型 | 重量级 | 说明 |
|------|--------|------|--------|------|
| 09:00 | daily-agenda-reminder | agentTurn | ⚡轻量 | 生成今日日程摘要 |
| 10:00 | file-organization-check | systemEvent | ⚡轻量 | 文件整理提醒 |
| 22:00 | daily-knowledge-precipitation | agentTurn | 🔥重量 | 核心：知识沉淀与内化 |
| 23:00 | daily-github-backup | exec | ⚡轻量 | Git 增量备份 |
| 00:00 | daily-conversation-summary-optimization | agentTurn | 🔥重量 | 自我反思与风格优化 |

---

## 一、日常任务详情

### 1. daily-agenda-reminder (09:00)

```json
{
  "name": "daily-agenda-reminder",
  "schedule": { "kind": "cron", "expr": "0 9 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "agentTurn",
    "message": "请使用 lark-workflow-standup-report 技能，为我生成今日的重点日程和未完成任务摘要。",
    "model": "google/gemini-flash-latest"
  },
  "delivery": { "mode": "announce" }
}
2. file-organization-check (10:00)
Copy
{
  "name": "file-organization-check",
  "schedule": { "kind": "cron", "expr": "0 10 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "systemEvent",
    "text": "【文件整理提醒】请检查档案库（Files）是否需要整理归类。"
  },
  "delivery": { "mode": "announce" }
}
3. daily-knowledge-precipitation (22:00) — 核心内化任务
Copy
{
  "name": "daily-knowledge-precipitation",
  "schedule": { "kind": "cron", "expr": "0 22 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "agentTurn",
    "message": "【认知内化操作指令】\n1. 调取今日 .dreams/ 碎片与 B_Ore/ 原始日志。\n2. 启动 ECA L3 专家模型进行双重审计。\n3. 提炼 A类 或 E类 高价值结论。\n4. 调用 local-vector-store.add() 刻录。\n5. 同步更新 USER.md。",
    "model": "google/gemini-flash-latest",
    "timeoutSeconds": 300
  },
  "delivery": { "mode": "announce" }
}
4. daily-github-backup (23:00)
Copy
{
  "name": "daily-github-backup",
  "schedule": { "kind": "cron", "expr": "0 23 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "exec",
    "command": "/Users/maxime.xian/.openclaw/workspace/backup_workspace.sh"
  },
  "delivery": { "mode": "announce" }
}
5. daily-conversation-summary-optimization (00:00)
Copy
{
  "name": "daily-conversation-summary-optimization",
  "schedule": { "kind": "cron", "expr": "0 0 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "agentTurn",
    "message": "【每日自我反思与进化】\n1. 回顾过去 24 小时聊天记录，识别用户不满意之处。\n2. 自动优化 SOUL.md 和 USER.md。\n3. 在 logs/evolution_log_YYYY-MM-DD.md 中记录关键教训。",
    "model": "google/gemini-flash-latest",
    "timeoutSeconds": 300
  },
  "delivery": { "mode": "announce" }
}
6. weekly-evolution-curve (周日 23:30)
Copy
{
  "name": "weekly-evolution-curve",
  "schedule": { "kind": "cron", "expr": "30 23 * * 0", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "agentTurn",
    "message": "【每周能力进化曲线】请调用 growth-tracker 技能，生成最近 7 天的能力进化曲线报告。",
    "model": "google/gemini-flash-latest"
  },
  "delivery": { "mode": "announce" }
}
三、故障恢复 SOP
3.1 向量存储损坏恢复
检查 backup/knowledge-store.json.bak
用备份覆盖 或 重建空文件
从 memory/B_Ore/ 手动重建索引
记录至 logs/recovery_log.md
3.2 Cron 链失败处理
exec 类型：自动重试 1 次
agentTurn 类型：记录至 error-correction，不重试
连续 3 次失败：触发飞书告警
四、低能量期自动降级规则
触发条件：睡眠 < 5h / 连续负面反馈 / 报错 5 次 / 手动"低能量模式"

降级操作：

暂停：知识沉淀、自我进化、每周曲线任务
保留：Git 备份、日程提醒
恢复触发：连续 2 天无负面反馈 或 手动「能量恢复」

五、向量存储工程边界
为什么选择简化 TF？

零依赖（纯 Node.js）
O(1) 添加
85% 精度在个人场景够用
未来升级：文档量 > 500 条时引入 natural npm 库。


