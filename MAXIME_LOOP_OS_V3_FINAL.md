# Maxime Loop-OS: 统一进化架构全景指南 (V3.0 Unified Edition)

## 0. 架构愿景 (Vision)
构建一个具备**“极速反应”**（肌肉记忆）与**“深度内省”**（专家系统）双重能力的认知操作系统。通过 A-E 记忆漏斗实现自动熵减，确保智能体随时间推移不断“长脑子”，而非仅仅堆积数据。

---

## 1. 物理层级与文件职责 (The Layers)

### LAYER 1：治理层 (Identity & Protocol) — "我是谁，我怎么做"
这是系统的“宪法”，决定了 Agent 的人格基线和最高原则。
- **SOUL.md**：核心协议。定义仲裁者角色、诚实原则、禁止行为（如：禁止过度解读、禁止未经请求的情感分析）。
- **USER.md**：用户画像。记录 Maxime 的认知特征（视觉思维）、能量模式（双相周期）及偏好权重表（反馈驱动的自进化）。
- **AGENTS.md**：调度中枢。定义问题分类（简单/复杂/状态）及对应的执行模式（模式 A/B/C）。
- **HEARTBEAT.md**：心跳协议。配置 Cron 定时任务，驱动“记忆固化”与“系统巡检”的自动化。
- **TOOLS.md**：硬件适配。存放本地 API 密钥、特定的 CLI 路径及消息渠道配置。

### LAYER 2：流式代谢层 (Stream & Metabolism) — "刚才发生了什么"
处理实时对话，作为知识内化前的“待处理矿石”。
- **.dreams/**：潜意识缓存。以 JSON 碎片形式实时记录对话，用于秒级相关性检索（闪念）。
- **memory/B_Ore/**：背景矿石库。存放 2018-2019 等未经深层加工的原始日志，仅供后台模式识别扫描，不干扰即时决策。
- **01_RAW_FACTS_RECENT-90D.txt**：近期快照。记录最近 90 天的关键行为、身体状态和核心诉求。

### LAYER 3：结构化资产层 (Knowledge & Experts) — "我学到了什么"
这是系统最核心的价值中心，按 A-E 漏斗分类存放经过“审计”的知识。
- **Class A: Internalized (已内化)**：存放经过专家模型验证后的**核心武器**（如：科特迪瓦团队管理体系、Human-AI 协作宪法）。
- **Class E: Meta-Meta (指挥模型)**：存放系统的**架构参数**（如：ECA v2.2 分层配置、三层循环逻辑）。
- **knowledge/eca_experts.json**：定义 5 个领域专家（投资/产品/技术/心理/战略），决定高阶决策的质量。
- **local-vector-store/**：持久化搜索引擎。基于 TF-IDF 将 A 类知识刻录进 `knowledge-store.json`，实现毫秒级“常识”调用。

### LAYER 4：审计与取证层 (Audit & Logs) — "我做过什么"
确保所有行为可溯源、可修复。
- **logs/**：行为审计。记录所有执行过的 shell 指令及系统响应。
- **error-correction/**：错误修复记录。遵循“闭环不过夜”协议，详细记录每次犯错的原因及防复发规则。

---

## 2. 核心算法流程：认知闭环 (The Cognitive Loop)

### 第一阶段：闪念捕捉 (Dreaming)
- **输入**：用户发起的每一轮对话。
- **动作**：系统自动将摘要存入 `.dreams/`。
- **目的**：确保在长对话中，Agent 能瞬间想起 5 分钟前微小的细节。

### 第二阶段：内省提炼 (Introspection)
- **触发**：每晚 22:00 (Heartbeat)。
- **逻辑**：
    1. 扫描 `.dreams/` 与 `B_Ore/`。
    2. 调用 **ECA Experts** 进行跨领域审计（例如：心理专家识别“旧脚本触发”，战略专家评估“新想法的 ROI”）。
    3. **提炼**：将有价值的碎片加工成 A 类或 E 类知识。
- **淘汰**：无价值噪音在保留 90 天后自动从 L2 蒸发。

### 第三阶段：永久刻录 (Persistence)
- **动作**：提炼出的 A 类知识自动同步至 `local-vector-store`。
- **目的**：摆脱 LLM 上下文窗口限制，使 Agent 拥有永久性的“长效记忆”。

---

## 3. 部署与同步协议 (Deployment & Sync)

1. **GitHub 备份**：通过 `/Users/maxime.xian/.openclaw/workspace/backup_workspace.sh` 实现“增量提交”。
2. **逻辑冲突调解**：遵循 **“项目专属 > 共享知识 > 时间相近”** 的仲裁算法。
3. **自主演进**：Agent 在检测到 USER.md 的负面反馈时，必须强制触发 `error-correction` 流程，修改 L1/L3 层级的规则，防止同类错误再次发生。

---
*Blueprint Version: 3.0.UEA | Chief Architect: Maxime | Implementation: Guardian*
