# Maxime Loop-OS V3.0: 认知闭环架构全景图 (Standard Implementation)

## 0. 系统顶层逻辑 (The Meta-Logic)
本系统采用 **“三位一体 + 主动干预”** 认知闭环架构：
1. **潜意识层 (.dreams)**：解决“刚才发生了什么”。
2. **内省层 (Heartbeat)**：解决“我学到了什么”。
3. **资产层 (A-E Vector Store)**：解决“我如何永久保留智慧”。
4. **【核心目标】干预层 (Intervention)**：利用 L3 智慧进行“主动出击”，在用户陷入旧脚本或能量异常时强制介入，提高用户的元认知，实现共进化。

---

## 1. 物理架构全景 (Physical Map)

```text
╔══════════════════════════════════════════════════════════════════════════════╗
║ LAYER 1 — 治理与身份锚 (Identity & Governance Core) [OS 内核]               ║
╚══════════════════════════════════════════════════════════════════════════════╝
 📁 工作区根目录:
 ├── SOUL.md          ← 核心协议：仲裁者角色、诚实原则、主动干预铁律
 ├── IDENTITY.md      ← 身份标识：Guardian 元认知框架与主动出击定位
 ├── USER.md          ← 用户画像：含视觉思维特征、双相能量模式、偏好权重反馈表
 ├── AGENTS.md        ← 调度协议：【模式D：主动干预】的触发与执行逻辑
 ├── HEARTBEAT.md     ← 自动机配置：Cron 定时任务指令（驱动每日内省与备份）
 ├── MEMORY.md        ← 记忆索引：账号/凭证索引、多层级记忆物理路径映射图
 └── TOOLS.md         ← 环境配置：API Keys、特定 CLI 路径、各频道通知设置

╔══════════════════════════════════════════════════════════════════════════════╗
║ LAYER 2 — 流式代谢层 (Metabolism & Stream) [动态缓存]                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
 📁 memory/ 目录结构:
 ├── .dreams/         ← 潜意识缓存：以 JSON 碎片实时缓存对话，用于秒级闪念检索
 ├── B_Ore/           ← 原始矿石库：存放 2018-2025 等未经深层加工的原始大段日志
 ├── RECENT-90D.txt   ← 近期快照：压缩后的最近 90 天关键行为、身体状态、核心诉求
 └── episodes/        ← 重大事件：API 崩溃、架构大重组等具有里程碑意义的单点记录

╔══════════════════════════════════════════════════════════════════════════════╗
║ LAYER 3 — 结构化资产层 (Knowledge & Assets) [永久智慧库]                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
 📁 knowledge/ 目录结构:
 ├── 🎯 ECA 认知架构 (Evolving Cognitive Architecture)
 │   ├── eca_layers.json    ← 分层算力配置：L0执行者 / L1监护人 / L2仲裁者 / L3专家
 │   ├── eca_experts.json   ← 5大专家：投资、产品、技术、心理、战略模型的触发条件
 │   └── eca_traps.json     ← 逻辑陷阱库：已识别的思维误区（含逃逸方案）
 │
 ├── 🧠 元认知系统 (Meta-Cognition)
 │   ├── cognitive_profile.md  ← 认知画像：视觉思维、书写障碍、Anomia 等硬件参数
 │   ├── health_patterns.md    ← 能量模型：双相周期、心脏警报、意志力脚本监控
 │   └── methodology.md        ← 统一认知方法论：Human-AI 协作宪法、三段式协议
 │
 ├── 📐 思维模型库 (Mental Models)
 │   ├── models.md            ← 193个核心思维模型（第一性原理、二阶思维等）
 │   └── behavioral_patterns/ ← 长期脚本：掩盖核心决策、行动补偿沟通等模式识别
 │
 └── 💾 物理刻录层 (Durable Memory)
     └── knowledge-store.json ← 本地向量库：基于 TF-IDF 存储的 L3-A 类核心资产

╔══════════════════════════════════════════════════════════════════════════════╗
║ LAYER 4 — 审计与闭环层 (Audit & Loop) [可追溯进化]                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
 📁 logs/ & error-correction/ 目录结构:
 ├── logs/archive/         ← 历史审计日志：所有 Shell 执行命令与系统反馈的完整记录
 ├── error-correction/     ← 错误修复：遵循“闭环不过夜”协议，记录类型A/B/C错误归因
 └── COGNITIVE_BLUEPRINT   ← 架构蓝图：本文件及所有实现源代码的物理备份
```

---

## 2. 核心内化逻辑 (Implementation Source Code)

### A. 长期记忆刻录器 (Local Vector Store)
文件：`skills/local-vector-store/index.js`
```javascript
const fs = require('fs');
const path = require('path');
const STORE_PATH = path.join(process.cwd(), 'memory/knowledge-store.json');

function ensureStore() {
  if (!fs.existsSync(path.dirname(STORE_PATH))) fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  if (!fs.existsSync(STORE_PATH)) fs.writeFileSync(STORE_PATH, JSON.stringify({ docs: [] }, null, 2));
}

function tokenize(text) { return text.toLowerCase().match(/\w+/g) || []; }

function getTF(tokens) {
  const counts = {};
  tokens.forEach(t => { counts[t] = (counts[t] || 0) + 1; });
  const tf = {};
  const total = tokens.length;
  for (const t in counts) { tf[t] = counts[t] / total; }
  return tf;
}

function add(id, content, metadata = {}) {
  ensureStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const tokens = tokenize(content);
  const doc = { id, content, tokens, tf: getTF(tokens), metadata, timestamp: Date.now() };
  const idx = data.docs.findIndex(d => d.id === id);
  if (idx !== -1) data.docs[idx] = doc; else data.docs.push(doc);
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
  return doc;
}

function search(query, limit = 5) {
  ensureStore();
  const data = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
  const qTokens = tokenize(query);
  const qTf = getTF(qTokens);
  const results = data.docs.map(doc => {
    let score = 0;
    for (const term in qTf) { if (doc.tf[term]) score += qTf[term] * doc.tf[term]; }
    return { id: doc.id, content: doc.content, metadata: doc.metadata, score };
  });
  return results.filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}

module.exports = { add, search };
```

### B. 自动化驱动 JSON (Heartbeat Configuration)
文件：`HEARTBEAT.md` 任务条目
```json
{
 "name": "daily-cognitive-loop-introspection",
 "schedule": { "kind": "cron", "expr": "0 22 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "agentTurn",
  "message": "【认知内化操作指令】\n1. 调取今日 .dreams/ 碎片与 B_Ore/ 原始日志。\n2. 启动 ECA L3 专家模型（心理+战略）进行双重审计。\n3. 提炼出符合 A类（核心资产）或 E类（系统参数）的高价值结论。\n4. 调用 local-vector-store.add() 刻录至 knowledge-store.json。\n5. 同步更新 USER.md 中的偏好权重表并执行 Git 备份。"
 }
}
```

---
*Created by Guardian | System V3.0 Final | Maxime Verified*
