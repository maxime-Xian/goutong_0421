# OpenClaw 认知架构全景图 (Maxime Custom OS)

## 1. 系统核心架构 (System Architecture)

```mermaid
graph TD
    subgraph L1_Foundation [L1: 身份与协议层 - 决定"我是谁"]
        SOUL[SOUL.md: 灵魂协议]
        USER[USER.md: 用户画像与偏好权重]
        AGENTS[AGENTS.md: 调度与冲突算法]
    end

    subgraph L2_ShortTerm [L2: 流式记忆层 - 解决"刚才发生了什么"]
        DREAMS[.dreams/: 语义碎片缓存]
        RECENT_90D[01_RAW_FACTS_RECENT-90D: 近期事实快照]
    end

    subgraph L3_LongTerm [L3: 结构化知识库 - 解决"我学到了什么"]
        direction TB
        ClassA[A类: 已内化事实/模型 - 核心武器库]
        ClassB[B类: 在研矿石 - 待蒸馏的背景事实]
        ClassC[C类: 战略储备 - 未来可能的技术文档]
        ClassD[D类: 工具弹药箱 - 脚本/API/自动化流]
        ClassE[E类: 指挥思维模型 - 认知闭环协议]
    end

    subgraph L4_Audit [L4: 审计与日志层 - 解决"我做过什么"]
        LOGS[logs/: 行为审计日志]
        ERRORS[error-correction/: 错误修复记录]
    end

    %% 数据流向
    UserInteraction((用户输入)) --> AGENTS
    AGENTS --> DREAMS
    DREAMS -- 每晚 22:00 心跳 --> Heartbeat{Heartbeat 内省}
    Heartbeat -- 提炼 --> ClassA
    Heartbeat -- 归档 --> ClassB
    Heartbeat -- 规则生成 --> ClassE
    ClassA & ClassE -- 检索增强 --> AGENTS
```

---

## 2. 存储与检索协议 (A-E 分类模型)

| 物理路径 (Path) | 逻辑分类 (Logic) | 利用方式 (Utilization) |
| :--- | :--- | :--- |
| `knowledge/A_Internalized/` | **A类：已内化** | 实时调用。作为决策的**硬事实依据**（如：Tata案例）。 |
| `knowledge/B_Ore/` | **B类：在研矿石** | 背景比对。用于识别**旧脚本触发**（如：逃避决策模式）。 |
| `knowledge/C_Strategic/` | **C类：战略储备** | 离线索引。当用户提到**新领域**时进行快速激活。 |
| `knowledge/D_Toolbox/` | **D类：工具箱** | 自动化执行。存放**鲁棒性更新脚本**、向量库代码。 |
| `knowledge/E_Meta/` | **E类：指挥中心** | 算法校准。决定 Guardian 的**思考方式**（如：三位一体架构）。 |

---

## 3. 三位一体认知闭环逻辑 (Cognitive Loop)

1.  **闪念 (Flash Recall)**：
    *   **载体**：`.dreams/` (JSON)
    *   **状态**：非结构化。
    *   **作用**：防止对话中途遗忘，保证秒级回溯。

2.  **内省 (Introspection)**：
    *   **载体**：`HEARTBEAT.md` (Cron)
    *   **状态**：逻辑加工。
    *   **作用**：将 L2 (碎片) 转化为 L3 (A/B/E 类知识)。

3.  **永存 (Long-term Store)**：
    *   **载体**：`local-vector-store` (Knowledge-store.json)
    *   **状态**：持久化索引。
    *   **作用**：确保知识随时间增值，不因上下文刷新而丢失。

---

## 4. Guardian 行为约束协议 (Guardian Protocol)

-   **诚实原则**：标注信息来源（L1-L4）。
-   **反黑箱协议**：必须呈现【推理过程】和【错误修复建议】。
-   **逻辑癖好适配**：严禁未经蒸馏的“大文件塞入”，所有输入必须经过 A-E 漏斗。
-   **自卫机制**：若用户处于“状态问题（模式C）”，Guardian 必须强制开启能量保护，阻止重大决策。

---
*Blueprint Version: 2026.04.06.V2 | Designer: Maxime | Architect: Guardian*
