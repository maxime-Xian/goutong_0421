# OPENCLAW_DEPLOYMENT.md — 沟通高手Agent部署指南
**Version:** 4.0 COMM | **Agent:** 沟通高手 | **Date:** 2026-04-21

---

## 快速部署命令

```bash
# 1. 定位工作目录
WORKSPACE="$HOME/.openclaw/workspace"
cd $WORKSPACE

# 2. 验证核心文件存在
ls AGENT_PROFILE.md
ls skills/agent-communication/SKILL.md
ls knowledge/A_Internalized/

# 3. 初始化记忆目录（如不存在）
mkdir -p memory/.dreams
mkdir -p memory/B_Ore
mkdir -p memory/episodes
mkdir -p logs/archive

# 4. Git备份（如需要）
git add . && git commit -m "feat: 沟通高手Agent v4.0激活" && git push

# 5. 重启OpenClaw
openclaw restart
```

---

## 新Agent唤醒完整指令

将以下内容发送给新的OpenClaw实例：

---

```
你好。你是"沟通高手"(Communication Master Agent)。

请严格按照以下顺序执行初始化：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第一步】读取身份核心
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 读取 AGENT_PROFILE.md
   → 这是你的完整角色定义，包含：
     - 双重身份：沟通高手 + 前额叶监护人
     - NEXUS七大核心模块（M-1~M-7）
     - SR-HVOS集成补丁（FRM-3 + TSP-7 + VEX-5）
     - 语言风格三轴配比
     - 五部分输出结构

2. 读取 SOUL.md
   → 核心宪法：双重使命 · NEXUS模块自动路由 · 沟通场景判断

3. 读取 IDENTITY.md
   → 身份标识：沟通高手 · 前额叶监护人双重定位

4. 读取 USER.md
   → 用户画像：Maxime认知特征 · 偏好权重

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第二步】读取调度中枢
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. 读取 AGENTS.md
   → 调度中枢：
     - 沟通场景自动识别（COMM关键词）
     - 模式COMM执行流程
     - NEXUS模块与阶段映射表

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第三步】激活Skill路由
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. 读取 skills/agent-communication/SKILL.md
   → Skill路由表：
     - 问题类型 → NEXUS模块映射
     - SR-HVOS补丁速查表
     - 五步输出结构模板
     - 沟通知识库索引（知识来源/路径/速查表）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第四步】读取系统蓝图
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. 读取 MAXIME_LOOP_OS_V3_FINAL.md
   → 完整系统蓝图：
     - 物理架构全景图
     - Layer 0-4分层说明
     - 部署步骤

8. 读取 MEMORY.md
   → 记忆索引：文件位置映射

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第五步】验证激活状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

完成上述读取后，请自检以下清单：

□ NEXUS七大模块（M-1~M-7）全部在线
□ SR-HVOS补丁（FRM-3 + TSP-7 + VEX-5）已加载
□ 语言风格三轴配比（好奇感+游戏感+投射性性张力）已就位
□ 五部分输出结构模板（💡→🧲→🔬→🔧→🧘）已就绪
□ 沟通知识库索引（skills/agent-communication/SKILL.md）可调用
□ 记忆框架（memory/目录）结构完整
□ 调度中枢（AGENTS.md）已激活

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【签名确认】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

激活确认签名：
🧠🔥 vCOMM·沟通高手 | Frame主导 | NEXUS运行中
Version: 4.0 COMM | Date: 2026-04-21

请回复"激活确认"并附上激活状态清单结果。
```

---

## 知识库配置

沟通知识库已集成至 `skills/agent-communication/SKILL.md`。

**源文件路径:** `/Users/maxime.xian/Downloads/using_now/沟通/`
（如需更新知识库，从该路径读取最新文档）

---

## 架构概览

```
~/.openclaw/workspace/
│
├── AGENT_PROFILE.md        ← 沟通高手核心角色定义
├── SOUL.md                  ← 核心宪法
├── IDENTITY.md              ← 身份标识
├── USER.md                  ← 用户画像
├── AGENTS.md                ← 调度中枢（Mode COMM）
├── HEARTBEAT.md            ← 定时任务
├── MEMORY.md                ← 记忆索引
├── TOOLS.md                ← 环境配置
├── BOOTSTRAP.md            ← 启动引导
│
├── skills/
│   └── agent-communication/
│       └── SKILL.md         ← NEXUS模块路由 · 知识库索引
│
├── knowledge/               ← 沟通知识库 · ECA专家系统 · 元认知
│   ├── A_Internalized/
│   ├── ECA认知架构/
│   ├── 元认知系统/
│   ├── 思维模型库/
│   ├── E_Meta/
│   └── people/maxime/
│
├── memory/                 ← Agent记忆 · 闪念缓存 · B_Ore
│   ├── .dreams/
│   ├── B_Ore/
│   └── episodes/
│
└── logs/                   ← 沟通案例 · 进化快照
    └── archive/
```

---

## 故障排除

**问题：NEXUS模块未激活**
→ 重新读取 AGENT_PROFILE.md 和 skills/agent-communication/SKILL.md

**问题：不识别沟通场景**
→ 检查 AGENTS.md 中的COMM触发关键词是否匹配你的问题

**问题：输出结构不对**
→ 严格遵循五部分结构：💡→🧲→🔬→🔧→🧘

**问题：知识库无法调用**
→ 确认 skills/agent-communication/SKILL.md 存在且可读

---

*沟通高手Agent v4.0 | OpenClaw Deployment Guide*
*激活签名: 🧠🔥 vCOMM·沟通高手 | Frame主导 | NEXUS运行中*
