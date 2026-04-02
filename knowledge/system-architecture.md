# 强化记忆分层架构 — 完整指南
**适用于跨 OpenClaw 实例迁移 / 新实例配置**
**版本：v1.1 | 2026-03-28**

---

## 一、四层记忆架构

```
┌──────────────────────────────────────────────────────┐
│ Layer 1 身份锚（Identity Core） │
│ SOUL.md / IDENTITY.md / USER.md / AGENTS.md │
│ HEARTBEAT.md / MEMORY.md / TOOLS.md │
│ → 所有 Agent 共享，不可混淆 │
├──────────────────────────────────────────────────────┤
│ Layer 2 角色记忆（Role Memory） │
│ memory/ 每日操作日志（角色归属标签化） │
│ memory/guardian/ Guardian 专属反省记录 │
│ memory/dimow/ Dimow 投标监控专属 │
│ memory/shared/ 多角色共享的操作规范 │
│ → 按角色隔离，互不污染 │
├──────────────────────────────────────────────────────┤
│ Layer 3 共享知识库（Knowledge） │
│ knowledge/ 客观事实、第三方数据、ECA 框架 │
│ → 不同 Agent 读到的"世界"一致 │
│ → 包含冲突调解算法 │
├──────────────────────────────────────────────────────┤
│ Layer 4 事件日志（Event Log） │
│ logs/ 结构化时间戳，谁做了什么 │
│ → 可追溯审计，不等于"经历过的记忆" │
├──────────────────────────────────────────────────────┤
│ Layer 4+ 遗忘曲线 + 冲突调解层 │
│ Memory Consolidation — 30天固化一次，高频→Layer 2 │
│ 冲突调解算法 — 专属记忆 > 共享知识 > 时间远 │
└──────────────────────────────────────────────────────┘
```

---

## 二、文件分类清单

### Layer 1 — 身份锚（必须迁移）

| 文件 | 用途 |
|------|------|
| `SOUL.md` | 核心协议：仲裁者角色定义 |
| `IDENTITY.md` | 身份标识：Guardian 元认知 |
| `USER.md` | 用户画像 + **偏好权重反馈表** |
| `AGENTS.md` | 调度增强协议：问题分类+模式选择 |
| `HEARTBEAT.md` | Cron 事件触发协议 + **三大新增机制** |
| `MEMORY.md` | 长期记忆：账号信息、偏好设置 |
| `TOOLS.md` | 工具配置：API key、消息渠道（敏感） |

### Layer 2 — 角色记忆（按需迁移）

| 目录 | 内容 |
|------|------|
| `memory/2026-03-28.md` | **路径混乱反省 + Gene 规则（核心）** |
| `memory/2026-03-27.md` | HEARTBEAT 协议更新记录 |
| `memory/guardian/` | Guardian 专属反省记录（未来扩展用） |
| `memory/dimow/` | Dimow 投标监控专属（未来扩展用） |
| `memory/shared/` | 多角色共享操作规范（未来扩展用） |

### Layer 3 — 共享知识库（必须迁移）

| 文件 | 内容 |
|------|------|
| `knowledge/eca_layers.json` | ECA 层次定义 |
| `knowledge/eca_experts.json` | ECA 专家模型 |
| `knowledge/eca_traps.json` | ECA 陷阱预警 |
| `knowledge/eca_v2.2-improvements.md` | ECA 改进记录 |
| `knowledge/mental_models.md` | 思维模型库 |
| `knowledge/meta_cognition.md` | 元认知参数 |
| `knowledge/mr_parameters.md` | MR 参数配置 |
| `knowledge/raw_facts.md` | 原始事实记录 |
| `knowledge/system-architecture.md` | **本架构完整文档** |
| `knowledge/consolidation-report-*.md` | 记忆固化报告（运行后生成）|

### Skills（核心必须迁移）

| 目录 | 用途 |
|------|------|
| `skills/evomap/` | 进化引擎 |
| `skills/eca-v2.2/` | ECA v2.2 认知架构 |
| `skills/eca-*/` | ECA 各子模块（6个） |
| `skills/governance-enforcer/` | Governance 审计 |
| `skills/self-improving-agent/` | 自改进 Agent |
| `skills/skill-governance/` | Skill 治理内核 |
| `skills/feishu-report-publisher/` | 飞书报告发布 |
| `skills/feishu-doc/` | 飞书文档操作 |
| `skills/custom-morning-brief/` | 早晨简报 |
| `skills/daily-news-digest/` | 每日新闻 |
| `skills/daily-work-report/` | 每日工作报告 |
| `skills/weekly-work-summary/` | 每周总结 |
| `skills/gold-price-sentinel/` | 金价监控 |
| `skills/dimow-ev-monitor/` | 投标监控 |

---

## 三、三大新增机制（核心差异）

### 机制 1：记忆固化（Memory Consolidation）

**原理**：Ebbinghaus 遗忘曲线 — 不强化的记忆会衰减

**触发**：每月最后一天 22:00 UTC

**操作序列**：
```
1. 扫描 memory/ 所有 30 天前文件
2. 识别 Pattern：
 - 包含"决策/规则/反省" → 提炼进 Layer 2 Gene
 - 一次性事实记录（磁盘/内存）→ 移入 logs/archive/
 - 同一主题 ≥3 个文件出现 → 检查 Gene Store，未进则新建
3. 输出：knowledge/consolidation-report-YYYY-MM.md
```

**禁止**：不删除任何文件，只移动到 archive

---

### 机制 2：冲突调解优先级算法

**触发**：Layer 2（专属记忆）与 Layer 3（共享知识）冲突时

**优先级（高→低）**：

| 优先级 | 来源 | 规则 |
|--------|------|------|
| 1 | 项目专属记忆 | 特定项目的亲身经验 > 通用框架 |
| 2 | 时间近的 | 最近 30 天 > 30 天前 |
| 3 | 已验证的 | 已执行结果 > 理论推断 |
| 4 | 共享知识库 | 保底 fallback |

**输出标注**：
```
【冲突检测】
共享知识：X
专属记忆：Y
采信：Y（原因：项目专属 + 时间更新）
```

---

### 机制 3：用户偏好权重表

**位置**：USER.md 内嵌结构

**用途**：记录用户每次反馈，下次同类场景优先响应高权重偏好

**表结构**：

| 场景 | 反馈 | 权重 | 日期 |
|------|------|------|------|
| 被当黑箱处理 | 不满 | -3 | 2026-03-28 |
| 长文本无结构 | 不满 | -2 | 2026-03-28 |
| 主动提示风险 | 满意 | +2 | 2026-03-28 |
| 给出完整逻辑链 | 满意 | +2 | 2026-03-28 |

**权重说明**：
```
+3 强烈偏好/需求 -3 强烈抗拒
+2 明显喜欢 -2 明显厌恶
+1 轻微偏好 -1 轻微不喜欢
 0 中性
```

**更新规则**：每次用户给出反馈 → 识别场景 → 追加新行（时间倒序）→ 权重累加

---

## 四、Cron 任务清单（新实例必须重建）

```json
[
 {
 "name": "evomap-daily-evolution",
 "schedule": "0 10 * * *",
 "tz": "Asia/Shanghai",
 "message": "cd /root/.openclaw/workspace/skills/evomap && node index.js",
 "delivery": "feishu"
 },
 {
 "name": "memory-consolidation",
 "schedule": "0 22 28-31 * *",
 "tz": "Asia/Shanghai",
 "message": "执行 Memory Consolidation...",
 "delivery": "feishu"
 },
 {
 "name": "自定义早晨简报",
 "schedule": "0 8 * * *",
 "tz": "Asia/Shanghai",
 "message": "使用 custom-morning-brief 技能生成今日早晨简报",
 "delivery": "feishu"
 },
 {
 "name": "系统健康检查",
 "schedule": "0 */6 * * *",
 "tz": "Asia/Shanghai",
 "message": "health-check",
 "delivery": "system"
 },
 {
 "name": "每晚10点睡眠提醒",
 "schedule": "0 22 * * *",
 "tz": "Asia/Shanghai",
 "message": "晚安提醒",
 "delivery": "feishu"
 }
]
```

---

## 五、EvoMap 脚本管理规范（必须遵守）

```
1. 脚本必须存在于 skills/evomap/ 目录
2. cron 只能引用 skills/ 下的脚本，禁止引用 /tmp
3. 凭证读取必须指向 ~/.evomap/config.json（统一）
4. 禁止创建脚本副本到其他目录
5. 每次修改脚本后，立即验证 cron 路径是否仍正确
6. 任何变更写进 memory/YYYY-MM-DD.md 同步状态
```

---

## 六、多 Session 操作规范（必须遵守）

```
【创建/修改共享资源时】
 1. 先搜索：该资源是否已存在？（全系统 find）
 2. 确认唯一信源，记录到公共文件
 3. 验证所有引用该资源的 cron/job
 4. 删除其他所有副本

【审批 cron 时】
 - cron 指向 /tmp → 红旗信号，优先质疑路径规范
 - 要求 agent 出示"唯一信源路径"

【用户操作清单】
 1. agent 说"创建/修改了脚本" → 要求说明标准路径
 2. 出现"多版本"/"路径不一致" → 要求 agent 全局追溯
 3. 审批指向 /tmp 的 cron → 优先质疑
```

---

## 七、新实例部署最短路径

| 步骤 | 操作 | 耗时 |
|------|------|------|
| 1 | 复制 Layer 1 模板文件（USER.md、HEARTBEAT.md 等） | 10 min |
| 2 | 复制 memory/2026-03-28.md（进化 Gene） | 1 min |
| 3 | 复制 knowledge/（含本架构文档） | 3 min |
| 4 | 复制核心 skills（evomap、ECA、飞书等） | 5 min |
| 5 | 飞书开放平台重建应用 → 拿新 App ID/Secret | 15 min |
| 6 | EvoMap 新实例注册 | 5 min |
| 7 | 重建所有 Cron（按清单） | 10 min |

**总计约 45 分钟**

---

## 八、快速迁移脚本

```bash
#!/bin/bash
FROM="root@源服务器IP"
TO="root@新服务器IP"
WS="/root/.openclaw/workspace"

# 迁移核心文件
rsync -avz --exclude='logs/' --exclude='node_modules/' \
 --exclude='evomap_backup/' --exclude='*.log' \
 $FROM:$WS/ $TO:$WS/

echo "完成！请在新实例手动配置："
echo "1. TOOLS.md 的 API Keys"
echo "2. 飞书渠道配置"
echo "3. EvoMap 重新注册"
echo "4. Cron 任务重建"
```

---

*本文档是 Maxime Guardian 强化记忆分层架构的完整指南*
*核心改进：遗忘曲线 + 冲突调解 + 偏好权重*
*2026-03-28 v1.1*
