# OpenClaw 认知闭环架构协议 (Cognitive Loop Blueprint)

## 1. 核心架构原理 (The Principle)

本架构通过 **“三位一体”** 存储逻辑，解决 AI 智能体“记不住”、“记不准”和“上下文爆炸”的问题：

1.  **第一级：闪念 (Flash Recall - `.dreams`)**
    *   **角色**：非结构化缓存。
    *   **逻辑**：在对话过程中，后台自动将原始对话片段向量化，存入 `.dreams`。它确保智能体能快速检索“刚才提过什么”。
2.  **第二级：内省 (Introspection - `HEARTBEAT.md`)**
    *   **角色**：逻辑加工厂。
    *   **逻辑**：每日定时（Cron）触发。它翻看第一级的“闪念”碎片，识别教训、用户偏好和核心事实，并提炼成 Markdown 格式。
3.  **第三级：永存 (Long-term Store - `local-vector-store`)**
    *   **角色**：持久化知识库。
    *   **逻辑**：心跳任务将提炼后的 Markdown 知识，调用向量库接口 (`add`) 存入 `knowledge-store.json`。它确保高价值信息永不随对话历史丢失。

---

## 2. 核心组件代码 (The Code)

### A. 本地向量库 (Local Vector Store)
文件路径：`skills/local-vector-store/index.js`
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
  for (const t in counts) { tf[t] = counts[t] / tokens.length; }
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

### B. 自动化心跳任务配置 (Heartbeat Task)
文件路径：`HEARTBEAT.md` (新增内化环节)
```json
{
 "name": "daily-knowledge-precipitation-plus",
 "schedule": { "kind": "cron", "expr": "0 22 * * *", "tz": "Asia/Shanghai" },
 "payload": {
  "kind": "agentTurn",
  "message": "【认知闭环内化任务】\n1. 检索今日 .dreams/short-term-recall.json 中的核心碎片。\n2. 识别并提炼高价值知识（规则、偏好、事实）。\n3. [关键步骤] 调用 local-vector-store.add(id, content) 将提炼出的 Markdown 结论存入持久化知识库。\n4. 存储路径：/Users/maxime.xian/.openclaw/workspace/memory/knowledge-store.json。",
  "model": "google/gemini-flash-latest"
 }
}
```

---

## 3. 部署指南 (Deployment Guide for New OpenClaw)

1.  **环境准备**：确保工作区有 `memory/` 目录。
2.  **安装向量库**：将上面的 `index.js` 代码放入 `skills/local-vector-store/` 文件夹。
3.  **配置心跳**：将 `daily-knowledge-precipitation-plus` 任务添加到 `HEARTBEAT.md` 中。
4.  **初始化**：运行一次 `local-vector-store` 的测试函数，确保 `knowledge-store.json` 生成。
5.  **开启自学模式**：给新 Agent 的 `SOUL.md` 增加指令：“在回答问题前，优先使用 `local-vector-store.search()` 检索持久化知识库。”

---
*Created by Maxime's Cognitive Loop Protocol (2026-04-06)*
