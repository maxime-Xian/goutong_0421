## Daily Evolution Summary Report (Cron Job)

```json
{
 "name": "daily-evolution-summary",
 "schedule": { "kind": "cron", "expr": "0 22 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "agentTurn",
  "message": "请先运行 Gene Extractor 模块，提取今日智慧基因：`node ~/.openclaw/workspace/skills/gene-extractor/extract.js`。

然后根据今日的聊天记录 (sessions_history(sessionKey="user:ou_7a641115c7e34065b030957e21fd80d5", limit=200)) 和 memory/YYYY-MM-DD.md (将 YYYY-MM-DD 替换为今天的日期)，生成每日进化总结报告。报告格式如下：

📅 YYYY-MM-DD 每日进化总结
## 今日完成事项
| 类别 | 内容 |
|---|---|
| 早晨简报 | ... |
| 架构更新 | ... |
| 自我批判 | ... |
## 关键教训（来自用户反馈）
问题 N — ...
- 教训：...
## 马克西姆思维盲区分析
🕳️ 误区 N：...
🧠 思维模型应用
📈 元认知提升

请将报告发送到飞书。请注意，今天的日期是 2026-03-30。",
  "model": "google/gemini-2.5-flash"
 },
 "delivery": { "mode": "announce" }
}
```

## Monthly Memory Consolidation (Cron Job)

```json
{
 "name": "memory-consolidation",
 "schedule": { "kind": "cron", "expr": "0 6 28-31 * *", "tz": "Asia/Shanghai"" },
 "payload": {
  "kind": "exec",
  "command": "cd skills/evomap && node index.js"
 },
 "delivery": { "mode": "announce" }
}
```

## Daily Agenda Reminder (Cron Job)

```json
{
 "name": "daily-agenda-reminder",
 "schedule": { "kind": "cron", "expr": "0 9 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "agentTurn",
  "message": "请使用 lark-workflow-standup-report 技能，为我生成今日的重点日程和未完成任务摘要。",
  "model": "google/gemini-2.5-flash"
 },
 "delivery": { "mode": "announce" }
}
```

## Daily Conversation Summary and Style Optimization (Cron Job)

```json
{
 "name": "daily-conversation-summary-optimization",
 "schedule": { "kind": "cron", "expr": "0 22 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "agentTurn",
  "message": "【每日自我反思与进化】请启动自我反思任务：\n1.  **回顾**：翻看过去 24 小时的聊天记录 (sessions_history(sessionKey="user:ou_7a641115c7e34065b030957e21fd80d5", limit=200))，识别用户 Max X 有哪些不满意的地方（根据 USER.md 中的偏好权重表，重点关注负面反馈）。\n2.  **优化**：\n    *   根据识别到的不满意之处，自动优化我的灵魂档案 (SOUL.md) 和用户画像 (USER.md) 中的相关偏好权重或行为准则。\n    *   反思并优化我的回复风格，以确保 Max X 感到更舒服。\n3.  **日志**：在 `/Users/maxime.xian/.openclaw/workspace/logs/evolution_log_YYYY-MM-DD.md` 中记录今天学到的关键教训和进行的优化，并告诉我今天的进化内容。\n请将 YYYY-MM-DD 替换为今天的日期。",
  "model": "google/gemini-2.5-flash"
 },
 "delivery": { "mode": "announce" }
}
```

## Daily File Organization Check (Cron Job)

```json
{
 "name": "file-organization-check",
 "schedule": { "kind": "cron", "expr": "0 11 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "systemEvent",
  "text": "【文件整理提醒】请检查档案库（Files）是否需要整理归类。如果需要自动整理，请告知我具体的整理规则（例如，哪些文件类型归到哪里）。"
 },
 "delivery": { "mode": "announce" }
}
```

## Daily Knowledge Precipitation (Cron Job)

```json
{
 "name": "daily-knowledge-precipitation",
 "schedule": { "kind": "cron", "expr": "0 22 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "agentTurn",
  "message": "【每日知识沉淀任务】请启动知识沉淀流程：\n1.  **收集信息**：获取过去 24 小时的聊天记录 (sessions_history)，以及当天生成的关键日志文件（如 `/Users/maxime.xian/.openclaw/workspace/logs/evolution_log_YYYY-MM-DD.md`）。\n2.  **提取沉淀**：从收集到的信息中，识别并提炼出：\n    *   重要的行业知识或技术细节。\n    *   可复用的操作流程或工作经验。\n    *   值得记录的经验教训或决策反思。\n3.  **智能归档**：根据内容类型，判断最合适的 `knowledge/` 子目录（`tech/`、`work/`、`lessons/pitfalls/`、`patterns/` 等），将整理好的笔记以 Markdown 格式存入（文件名格式：`YYYY-MM-DD-topic.md`）。\n4.  **汇报总结**：简要汇报今天沉淀了哪些知识，以及存储在哪个位置。",
  "model": "google/gemini-2.5-flash"
 },
 "delivery": { "mode": "announce" }
}
```

## Daily Quantitative Report (Cron Job)

```json
{
 "name": "daily-quantitative-report",
 "schedule": { "kind": "cron", "expr": "0 23 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "agentTurn",
  "message": "【每日量化汇报】请调用 `growth-tracker` 技能，生成当天的量化日报。报告需包含：任务完成率、学习成果、剩余上下文空间。",
  "model": "google/gemini-2.5-flash"
 },
 "delivery": { "mode": "announce" }
}
```

## Weekly Capability Evolution Curve (Cron Job)

```json
{
 "name": "weekly-evolution-curve",
 "schedule": { "kind": "cron", "expr": "30 23 * * 0", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "agentTurn",
  "message": "【每周能力进化曲线】请调用 `growth-tracker` 技能，生成一份最近 7 天的能力进化曲线报告。",
  "model": "google/gemini-2.5-flash"
 },
 "delivery": { "mode": "announce" }
}
```

## Daily GitHub Backup (Cron Job)

```json
{
 "name": "daily-github-backup",
 "schedule": { "kind": "cron", "expr": "30 22 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "exec",
  "command": "/Users/maxime.xian/.openclaw/workspace/backup_workspace.sh"
 },
 "delivery": { "mode": "announce" }
}
```