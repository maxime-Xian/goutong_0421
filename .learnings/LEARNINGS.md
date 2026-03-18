## [LRN-20250813-001] correction

**Logged**: 2025-08-13T14:30:00+08:00
**Priority**: medium
**Status**: pending
**Area**: config

### Summary
不要默认加载 maxime-persona skill，应在检测到特定触发条件时才加载

### Details
- **问题**: 每次会话开始时自动加载 maxime-persona skill，消耗大量 token
- **用户反馈**: "请你不要一开始就加载maxime-persona,太耗费token了"
- **正确做法**: 
  - 默认保持轻量，不自动加载 persona
  - 仅在检测到特定触发词（如情绪、决策困难、长期规划等）时才加载
  - 简单任务直接执行，无需加载额外上下文

### Suggested Action
1. 更新 AGENTS.md 或 session 启动行为，默认不加载 persona
2. 仅在需要时（咨询型指令、触发词检测）才读取 maxime-persona skill
3. 考虑将 L0 核心协议提取为精简版，用于轻量级会话

### Metadata
- Source: user_feedback
- Related Files: skills/maxime-persona/SKILL.md
- Tags: token_optimization, persona, lazy_loading

---
