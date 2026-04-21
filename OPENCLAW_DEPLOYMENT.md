# OPENCLAW_DEPLOYMENT.md — 沟通高手Agent部署指南
**Version:** 4.0 COMM | **Agent:** 沟通高手 | **GitHub:** https://github.com/maxime-Xian/goutong_0421

---

## ⚠️ 重要前提：Agent空间隔离要求

**这是一个全新的独立Agent，必须与任何其他Agent完全隔离！**

### 隔离要求清单

| 维度 | 要求 |
|------|------|
| **工作空间** | 必须是独立的workspace目录，不能与Guardian或其他Agent共用 |
| **记忆目录** | 独立的memory/目录，内容不与其他Agent混合 |
| **知识库** | 独立的knowledge/目录 |
| **日志** | 独立的logs/目录 |
| **Git仓库** | 本Agent使用 `goutong_0421` 仓库，**不是** `openclaw_mac1` |

### 常见错误 ❌

```
❌ 把文件放进 ~/.openclaw/workspace/（会与Guardian混淆）
❌ 把记忆放进 Guardian 的 memory/ 目录
❌ 把知识库放进 Guardian 的 knowledge/ 目录
❌ 用 Guardian 的 Git 仓库推送
```

### 正确做法 ✅

```
✅ 在 OpenClaw 配置中为沟通高手Agent指定独立的工作目录
   例如: ~/.openclaw/goutong_agent/
✅ 每次推送只用: git push goutong_0421 main
```

---

## 快速部署命令

### 方式一：从GitHub克隆（新机器）

```bash
# 1. 克隆到独立的OpenClaw工作目录
git clone https://github.com/maxime-Xian/goutong_0421.git \
  ~/.openclaw/goutong_agent

# 2. 进入目录
cd ~/.openclaw/goutong_agent

# 3. 初始化记忆目录
mkdir -p memory/.dreams
mkdir -p memory/B_Ore
mkdir -p memory/episodes
mkdir -p logs/archive

# 4. 在OpenClaw中配置工作目录
# 设置 CLAUDE_WORKSPACE=~/.openclaw/goutong_agent
# 或在OpenClaw配置中指定该目录为Agent工作空间

# 5. 重启OpenClaw
openclaw restart
```

### 方式二：本地已有代码时的Git初始化

```bash
# 1. 如果是全新Git初始化
git init
git remote add origin https://github.com/maxime-Xian/goutong_0421.git

# 2. 验证远程仓库
git remote -v
# 应显示: origin https://github.com/maxime-Xian/goutong_0421.git

# 3. 推送到GitHub
git add .
git commit -m "feat: 沟通高手Agent V4.0"
git push -u origin main
```

---

## 新Agent唤醒完整指令

将以下内容发送给新的OpenClaw实例：

---

```
你好。你是"沟通高手"(Communication Master Agent)。

⚠️ 重要：你是一个全新的独立Agent，与任何其他Agent（如Guardian）完全隔离。
你的工作空间、记忆和知识库都是独立的。

请严格按照以下顺序执行初始化：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第一步】读取身份核心
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 读取 AGENT_PROFILE.md
   → 完整角色定义：
     - 双重身份：沟通高手 + 前额叶监护人
     - NEXUS七大核心模块（M-1~M-7）
     - SR-HVOS补丁（FRM-3 + TSP-7 + VEX-5）
     - 语言风格三轴
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
【第三步】激活Skill路由与知识库
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. 读取 skills/agent-communication/SKILL.md
   → Skill路由表 + 知识库路径索引

7. 读取 knowledge/沟通高手/INDEX.md
   → 知识库总索引
   → 知识库包含10个专题模块（P0/P1优先级）
   → 可按需调用：
     - 01_需求感控制.md
     - 02_吸引建构.md
     - 03_推拉技术.md
     - 04_框架控制.md
     - 05_废物测试应对.md
     - 06_高级技巧.md
     - 07_邀约与约会.md
     - 08_危机处理.md
     - 09_话术库.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第四步】读取系统蓝图
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. 读取 MAXIME_LOOP_OS_V3_FINAL.md
   → 完整系统蓝图：物理架构 · Layer 0-4 · 部署步骤

9. 读取 MEMORY.md
   → 记忆索引：文件位置映射

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【第五步】验证激活状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

完成上述读取后，请自检：

□ NEXUS七大模块（M-1~M-7）全部在线
□ SR-HVOS补丁（FRM-3 + TSP-7 + VEX-5）已加载
□ 语言风格三轴（好奇感+游戏感+投射性性张力）已就位
□ 五部分输出结构（💡→🧲→🔬→🔧→🧘）已就绪
□ 沟通知识库（knowledge/沟通高手/）已可调用
□ 记忆框架（memory/目录）结构完整
□ 调度中枢（AGENTS.md）已激活
□ 工作空间与Guardian Agent完全隔离 ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【签名确认】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠🔥 vCOMM·沟通高手 | Frame主导 | NEXUS运行中
Version: 4.0 COMM | Date: 2026-04-21
GitHub: https://github.com/maxime-Xian/goutong_0421

请回复"激活确认"并附上激活状态清单结果。
```

---

## Git使用规范（仅限本Agent）

```bash
# 查看远程仓库（应为goutong_0421）
git remote -v
# origin  https://github.com/maxime-Xian/goutong_0421.git

# ⚠️ 禁止推送到Guardian的仓库
git remote -v | grep openclaw_mac1 && echo "❌ 错误仓库!"

# 正常推送
git add .
git commit -m "描述改动"
git push origin main

# 如果git push报权限错误，检查SSH key
ssh -T git@github.com
```

---

## 架构概览

```
~/.openclaw/goutong_agent/     ← ⚠️ 独立工作目录（不是默认的workspace）
│
├── AGENT_PROFILE.md        ← 沟通高手核心角色定义
├── SOUL.md                  ← 核心宪法
├── IDENTITY.md              ← 身份标识
├── USER.md                  ← 用户画像
├── AGENTS.md                ← 调度中枢（Mode COMM）
├── HEARTBEAT.md            ← 定时任务
├── MEMORY.md                ← 记忆索引
├── TOOLS.md                ← 环境配置
├── OPENCLAW_DEPLOYMENT.md  ← 本文件
│
├── skills/
│   └── agent-communication/
│       └── SKILL.md         ← NEXUS模块路由 · 知识库索引
│
├── knowledge/               ← 沟通知识库（独立，不与其他Agent共享）
│   ├── 沟通高手/
│   │   ├── INDEX.md
│   │   ├── 01_需求感控制.md
│   │   ├── 02_吸引建构.md
│   │   ├── 03_推拉技术.md
│   │   ├── 04_框架控制.md
│   │   ├── 05_废物测试应对.md
│   │   ├── 06_高级技巧.md
│   │   ├── 07_邀约与约会.md
│   │   ├── 08_危机处理.md
│   │   └── 09_话术库.md
│   ├── A_Internalized/      ← Maxime核心经历蒸馏
│   ├── ECA认知架构/         ← ECA专家系统
│   ├── 元认知系统/         ← 认知档案 · 能量模型
│   └── people/maxime/       ← Maxime个人档案
│
├── memory/                 ← 独立记忆（不与其他Agent共享）
│   ├── .dreams/             ← 闪念缓存
│   ├── B_Ore/              ← 原始矿石
│   └── episodes/           ← 里程碑
│
└── logs/                   ← 独立日志
    └── archive/
```

---

## 故障排除

**问题：感觉记忆/知识库和其他Agent混淆了**
→ 检查是否在正确的独立工作目录中运行
→ `pwd` 确认在 `~/.openclaw/goutong_agent/`

**问题：NEXUS模块未激活**
→ 重新读取 AGENT_PROFILE.md 和 skills/agent-communication/SKILL.md

**问题：不识别沟通场景**
→ 检查 AGENTS.md 中的COMM触发关键词

**问题：Git推送到错误的仓库**
→ `git remote -v` 确认是 goutong_0421
→ 如果是 openclaw_mac1，用 `git remote set-url origin https://github.com/maxime-Xian/goutong_0421.git` 修正

---

*沟通高手Agent v4.0 | OpenClaw Deployment Guide*
*GitHub: https://github.com/maxime-Xian/goutong_0421*
*激活签名: 🧠🔥 vCOMM·沟通高手 | Frame主导 | NEXUS运行中*
