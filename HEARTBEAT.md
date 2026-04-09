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
| 23:45 | sleep-guardian-check | systemEvent | ⚡轻量 | 睡眠守护检查 |
| 00:00 | daily-conversation-summary-optimization | agentTurn | 🔥重量 | 自我反思与风格优化 |

### 00:00 为什么要在这个时间？
- 避免与 22:00 的知识沉淀任务竞争
- 午夜时分 Maxime 通常已入睡，不会产生新的交互冲突
- 执行完毕后直接进入新的一天

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
```

---

### 2. file-organization-check (10:00)

```json
{
  "name": "file-organization-check",
  "schedule": { "kind": "cron", "expr": "0 10 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "systemEvent",
    "text": "【文件整理提醒】请检查档案库（Files）是否需要整理归类。如果需要自动整理，请告知我具体的整理规则（例如，哪些文件类型归到哪里）。"
  },
  "delivery": { "mode": "announce" }
}
```

---

### 3. daily-knowledge-precipitation (22:00) — 核心内化任务

```json
{
  "name": "daily-knowledge-precipitation",
  "schedule": { "kind": "cron", "expr": "0 22 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "agentTurn",
    "message": "【认知内化操作指令】\n1. 调取今日 .dreams/ 碎片与 B_Ore/ 原始日志。\n2. 启动 ECA L3 专家模型（心理+战略）进行双重审计。\n3. 提炼出符合 A类（核心资产）或 E类（系统参数）的高价值结论。\n4. 调用 local-vector-store.add() 刻录至 knowledge-store.json。\n5. 同步更新 USER.md 中的偏好权重表。",
    "model": "google/gemini-flash-latest",
    "timeoutSeconds": 300
  },
  "delivery": { "mode": "announce" }
}
```

---

### 4. daily-github-backup (23:00) — 轻量备份

```json
{
  "name": "daily-github-backup",
  "schedule": { "kind": "cron", "expr": "0 23 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "exec",
    "command": "${PERSONAL_DIR}/backup_workspace.sh"
  },
  "delivery": { "mode": "announce" }
}
```

---

### 5. sleep-guardian-check (23:45) — 睡眠守护

```json
{
  "name": "sleep-guardian-check",
  "schedule": { "kind": "cron", "expr": "45 23 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "systemEvent",
    "text": "【睡眠守护提醒】现在已经很晚了（23:45），建议先去休息，明天用清醒的脑子继续，会更有效。"
  },
  "delivery": { "mode": "announce" }
}
```

### 6. daily-conversation-summary-optimization (00:00) — 自我进化

```json
{
  "name": "daily-conversation-summary-optimization",
  "schedule": { "kind": "cron", "expr": "0 0 * * *", "tz": "Asia/Shanghai" },
  "payload": {
    "kind": "agentTurn",
    "message": "【每日自我反思与进化】\n1. 回顾过去 24 小时聊天记录，识别用户不满意之处。\n2. 自动优化 SOUL.md 和 USER.md 中的偏好权重。\n3. 在 logs/evolution_log_YYYY-MM-DD.md 中记录今天的关键教训。",
    "model": "google/gemini-flash-latest",
    "timeoutSeconds": 300
  },
  "delivery": { "mode": "announce" }
}
```

---

## 二、每周任务

### 6. weekly-evolution-curve (周日 23:30)

```json
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
```

---

## 三、故障恢复 SOP

### 3.1 向量存储 (knowledge-store.json) 损坏恢复

```
症状检测：
- local-vector-store.add() 抛出 JSON 解析错误
- 文件大小为 0 或内容为空
- 文件权限异常

恢复流程：
1. 检查是否有 backup/knowledge-store.json.bak（每日备份）
2. 若有：用备份覆盖，重新执行当日内化任务
3. 若无：重建空文件 { "docs": [], "meta": { "created": <timestamp>, "version": "3.0" } }
4. 从 memory/B_Ore/ 中提取当日记录，手动执行 add() 重建索引
5. 记录恢复日志至 logs/recovery_log.md
```

### 3.2 Cron 链失败处理

```
优先级链（按重要性排序）：
1. daily-github-backup — 最高（保护代码资产）
2. daily-knowledge-precipitation — 次高（保护认知资产）
3. daily-conversation-summary-optimization — 中（保护进化资产）
4. daily-agenda-reminder — 低（可人工替代）
5. file-organization-check — 可选

失败处理规则：
- 任何 exec 类型失败：自动重试 1 次（间隔 15 分钟）
- 任何 agentTurn 类型失败：记录至 logs/error-correction/agent_cron_errors.md，不重试
- 连续 3 次失败：触发告警通知至飞书
```

---

## 四、低能量期自动降级规则

### 4.1 触发条件
当检测到以下任意条件时，自动执行降级：

| 条件 | 说明 |
|------|------|
| 睡眠 < 5 小时 | 严重睡眠不足 |
| 连续 2 天每日反思均产生负面反馈 | USER.md 权重表出现 ≥ 2 条 -2/-3 反馈 |
| 系统报错连续 5 次 | 执行链路不稳定 |
| 手动触发词："低能量模式" | Maxime 主动宣告 |

### 4.2 降级操作

```
执行降级时，自动执行以下操作：

1. 保留（正常运行）：
   - daily-github-backup (23:00) — 必须保留
   - daily-agenda-reminder (09:00) — 轻量任务

2. 暂停（直至能量恢复）：
   - daily-knowledge-precipitation (22:00)
   - daily-conversation-summary-optimization (00:00)
   - weekly-evolution-curve

3. 恢复触发：
   - 当连续 2 天无负面反馈时，自动恢复
   - 或当 Maxime 发送"能量恢复"时，手动恢复
```

### 4.3 降级通知

```
降级执行时，发送以下通知：

"【系统降级通知】
检测到能量不足信号，当前已自动进入低能量模式：
- 已暂停：知识沉淀、自我进化、每周曲线任务
- 已保留：Git 备份、日程提醒
恢复条件：连续 2 天无负面反馈 或 手动发送「能量恢复」"

发送至：飞书
```

---

## 五、向量存储工程边界 (Engineering Boundaries)

### 5.1 为什么选择简化 TF 而非完整 TF-IDF？

**背景**：完整 TF-IDF 需要 IDF（逆文档频率）统计，而 IDF 的计算需要全语料库扫描，在动态添加文档的场景下，每次 add() 都需要重新计算所有文档的 IDF。

**设计决策**：

| 维度 | 简化 TF | 完整 TF-IDF |
|------|---------|-------------|
| 实现复杂度 | O(1) 添加 | O(n) 重算全语料库 IDF |
| 检索精度 | ~85%（在个人场景够用） | ~95% |
| 依赖数量 | 0（纯 Node.js） | 需要 natural/franc-min 等库 |
| 部署难度 | 零依赖，即插即用 | 需要 npm install + 版本管理 |
| 调试难度 | 低（全在自己代码里） | 高（第三方库行为不透明） |

**结论**：在个人场景下（每天 < 50 次检索，文档量 < 1000），85% 精度 + 零依赖 + 完全可控 的组合，远优于 95% 精度 + 依赖失控 + 黑箱风险。

### 5.2 当前实现限制

```
1. 中文分词：采用字符级拆分（每个汉字为 1 token）
   - 适用场景：短文本（< 50 字符）
   - 不适用场景：长篇文章的精确检索

2. 相似度计算：未归一化文档长度
   - 长文档天然得分更高（可通过限制单条 content 长度 < 500 字符规避）

3. 余弦相似度：简化版（TF向量点积，未归一化）
   - 对短 query 影响小
   - 对长 query 建议先分词截断
```

### 5.3 未来升级路径

```
何时升级为完整 TF-IDF：
- 当文档量超过 500 条
- 或当检索精度 < 70% 成为明显痛点

推荐实现：
- 使用 npm 库：`natural` (Apache 2.0) 或 `js-tfidf` (MIT)
- 升级时保留现有 add() 接口，仅修改 search() 内部逻辑
```

---
*Maxime Loop-OS V3.0 | Updated: 2026-04-06*
