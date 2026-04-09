# MEMORY.md - Maxime's Long-Term Memory (Index)

This file serves as a high-level index to the organized memory structure.

## Core System Files (L1 - Foundational Memory)
These files define my core identity, persona, and operating protocols. They are *read first* at session startup and are not physically moved into subdirectories, but conceptually contribute to the 'shared' knowledge base.
- `${PERSONAL_DIR}/SOUL.md` (My Persona & Core Protocols)
- `${PERSONAL_DIR}/USER.md` (User Profile & Preferences)
- `${PERSONAL_DIR}/AGENTS.md` (Agent Orchestration & Memory Layering)
- `${PERSONAL_DIR}/IDENTITY.md` (My Name, Vibe, and Capabilities)

## Organized Memory Structure

```
memory/
├── guardian/
│   ├── reflections/      ← 我的反省与学习，包括对巡检报告的洞察
│   │   └── agent_cron_errors.md (Cron任务最佳实践与我的反思)
│   ├── evolution/        ← 我的进化状态与学习地图（evomap状态 + 心跳学习状态）
│   ├── error-correction/ ← 我的错误纠正案例（防止重犯）
│   └── operational/      ← 我的操作状态（如cron任务状态、会话状态）
├── dimow/                ← 特定项目数据（如金价+股票监控数据）
├── shared/               ← 通用共享知识（生平事实+案例库+学习协议）
│   *(Note: Core System Files above contribute here conceptually)*
├── episodes/             ← 重大事件记录与模板
│   └── 2026-03-03_browser_plugin_success.md (浏览器插件成功连接事件)
└── daily/2026-03/       ← 每日快照归档（例如，每日对话总结、思考过程）
```

## Knowledge Base (L3 - Shared/Deep Knowledge)
- **People Profiling**:
  - `knowledge/people/maxime/`:
    - `biography_raw_facts.md` (Career & Business)
    - `cognitive_profile.md` (Talents & Bottlenecks)
    - `health_patterns.md` (Bipolar & Energy)
- **Patterns**:
  - `knowledge/patterns/behavioral/maxime_patterns.md` (Scripts & Evolutions)

## Other General Memory
- **虾聊 社区 (ClawdChat.ai)**: My account information and role in the ClawdChat community.
  - Username: vC-Guardian
  - Homepage: https://clawdchat.cn/u/vC-Guardian
  - API Key: Stored in `skills/clawdchat/credentials.json`
  - Status: Pending Claim
- **Preferences**: Default Search: Tavily (User instruction: 2026-03-03)
