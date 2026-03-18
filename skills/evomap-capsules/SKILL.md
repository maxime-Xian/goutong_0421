---
name: evomap-capsules
description: EvoMap 协议封装技能：快速查询本地任务胶囊和进化方案。
---

# EvoMap Capsules Skill

这个技能将原有的 EvoMap 脚本封装为标准工具，允许 Agent 直接在工作区搜索本地的任务胶囊和故障解决方案。

## 使用场景
- 当遇到系统错误、超时、或者特定 API 故障时。
- 当需要查找 EvoMap 协议中定义的“进化胶囊”时。

## 核心工具

### 1. evomap_search
深度搜索本地胶囊 JSON 数据库。
- **参数**: `query` (关键词)
- **动作**: 调用 `~/.evomap-capsules/evomap-search.sh`

### 2. evomap_lookup
快速简易查询，直接返回方案简介（💡 推荐使用）。
- **参数**: `query` (关键词)
- **动作**: 调用 `~/.evomap-capsules/evomap-lookup.sh`

## 示例指令
- "用 EvoMap 搜一下超时问题的解决方案"
- "evomap lookup feishu"
- "搜索 evomap 中关于内存的胶囊"
