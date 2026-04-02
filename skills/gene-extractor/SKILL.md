Gene Extractor - 智慧基因自动提取

**功能**：从 Guardian 的 memory 文件中自动提取结构化「智慧基因」
**触发**：每日 22:00（记忆固化时），或手动调用
**定位**：Guardian 自我进化的认知基础设施


---

什么是智慧基因（Gene）

智慧基因是从 Guardian 的实际经历中提炼出的**可复用的认知模式**，分为四类：

| 类型 | 标识 | 说明 |
|------|------|------|
| 决策 Decision | `DEC` | 重要选择的背景、理由、结果 |
| 规则 Rule | `RUL` | 工作原则、方法论、行动指南 |
| 反省 Reflection | `REF` | 对错误的复盘、教训、内化 |
| 模式 Pattern | `PAT` | 重复出现的问题/趋势/解决方案 |


---

输出格式

```json
{
 "type": "Gene",
 "id": "gene_YYYYMMDD_001",
 "category": "DEC|RUL|REF|PAT",
 "source_file": "memory/2026-03-30.md",
 "extracted_at": "2026-03-30T22:00:00Z",
 "title": "简短标题（≤20字）",
 "content": "核心内容（100-300字）",
 "context": "原始上下文摘要",
 "tags": ["#标签1", "#标签2"],
 "quality_score": 0.0-1.0,
 "applicability": "适用于什么场景",
 "guardian_note": "Guardian 的自我备注"
}
```


---

文件结构

```
skills/gene-extractor/
├── SKILL.md ← 本文件
├── extract.js ← 核心提取脚本
├── gene_schema.json ← 基因结构定义
└── patterns/
    └── 模板.md ← 输出模板参考

输出位置：
├── knowledge/patterns/
│   └── 判断类/
│       └── YYYY-MM-DD_gene.md ← 每日提取的基因文件
└── memory/
    └── case_index.md ← 自动更新索引
```


---

调用方式

手动触发
```
/gene-extract
```
或发送消息：「提取今天的智慧基因」

Cron 自动触发
已集成到 HEARTBEAT.md 的 memory-consolidation 任务中（每日 22:00）


---

提取逻辑

```
memory/*.md (最近7天)
 │
 ▼
1. 过滤：跳过往期已处理的记忆文件
 │
 ▼
2. 合并：将多个 memory 文件合并为一个上下文
 │
 ▼
3. LLM 提取：调用 Gemini/MiniMax 进行语义分析
 │
 ▼
4. 结构化：按 gene_schema.json 输出 JSON
 │
 ▼
5. 写入：knowledge/patterns/判断类/YYYY-MM-DD_gene.md
 │
 ▼
6. 更新：memory/case_index.md 索引
 │
 ▼
7. 通知：告知 Guardian 提取结果
```


---

LLM 提示词（核心）

```
你是 Guardian 的元认知进化引擎。
从以下记忆片段中提取「智慧基因」—— 可复用的认知模式。

要求：
1. 只提取有明确教训或原则的内容，跳过单纯的事实记录
2. 每条基因不超过 300 字
3. 用中文输出
4. 标注类型：DEC(决策) / RUL(规则) / REF(反省) / PAT(模式)
5. 给每条基因打质量分（0-1）和适用场景标签

输出格式：JSON 数组
```


---

质量控制

- **去重**：如果新基因与已有基因相似度 > 80%，标记为 duplicate
- **验证**：提取后 Guardian 需确认才写入正式文件
- **追溯**：所有基因都记录 source_file 和 extracted_at


---

与 EvoMap Gene 的区别

| | EvoMap Gene | Guardian Gene |
|---|---|---|
| 来源 | 代码进化事件 | 对话反思 |
| 验证 | 必须通过执行验证 | 基于语义理解 |
| 格式 | 严格结构化 | 轻量结构 |
| 目的 | 代码级改进 | 认知模式进化 |