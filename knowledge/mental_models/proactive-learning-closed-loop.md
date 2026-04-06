# 主动学习闭环协议与思维模式识别
*沉淀日期：2026-04-05*

## 📖 核心原则

**错误不积累，闭环不过夜，同一错误不出现第二次。**

---

## 🔄 闭环流程

```
错误发生
    ↓
记录到 error-correction/[TYPE]/[DATE]_[ID].md
    ↓
用思维模型分析根因（cognitive_bias 联动）
    ↓
发 Telegram 告知 Maxime（类型A实时，类型B在晚间）
    ↓
更新 case_index（如果是有价值的案例）
    ↓
更新 THINKING_PATTERNS（如果触发思维定式）
    ↓
归档到 Layer 2 角色记忆 (`memory/guardian/error-correction/`)
```

---

## 📂 错误分类

| 类型 | 定义 | 处理方式 | 通知时机 |
|------|------|----------|----------|
| **类型A** | Guardian犯错（用户指出"你错了"） | 实时记录→分析→修正 | 即时（Telegram） |
| **类型B** | Maxime犯错（用户说"我之前..."） | 被动记录→确认→更新知识库 | 晚间汇总 |
| **类型C** | 外部事件（cron失败/系统异常） | 系统级修复→通知 | 仅在累积告警时 |

---

## 📝 错误记录模板

```markdown
# 错误记录：[类型]

## 基本信息
- 时间：YYYY-MM-DD HH:mm
- 来源：用户反馈 / 系统日志
- 类别：类型A / 类型B / 类型C

## 错误描述
[具体内容]

## 根因分析
关联思维模型：[模型名称]
分析过程：[分析]

## 处理结果
[如何修复]

## 经验教训
[防止再次发生的规则]
```

---

## 🧠 五大思维定式（THINKING_PATTERNS）

### 模式A：结果导向偏差

**对应偏差**：Outcome Bias
**核心特征**：
- 只关注结果好坏，忽略决策质量
- 成功＝决策正确，失败＝决策错误

**检测信号**：
```
- "结果证明了方法是对的"
- "上次这么做成功了，这次也可以"
- (用户)"你就按上次那个方案来"
```

**干预策略**：
- 每次决策前记录决策理由
- 区分"好决策坏结果"与"坏决策好结果"
- 建立决策日志进行回溯分析

---

### 模式B：框架滥用

**对应偏差**：Maslow's Hammer / Law of the Instrument
**核心特征**：
- 只有一个工具，看什么都像钉子
- 用同一框架解释所有问题
- 忽视问题特殊性

**检测信号**：
```
- "这个可以用我们的XXX框架来分析"
- "本质上都是一个原理"
- (用户)"别总用那一套解释"
```

**干预策略**：
- 强制列举至少3种不同解释框架
- 问"这个框架在这里适用吗？"
- 定期更新工具箱，避免单一思维

---

### 模式C：确认偏误（信息筛选）

**对应偏差**：Confirmation Bias
**核心特征**：
- 只找支持自己观点的证据
- 忽视或贬低反面信息
- 选择性记忆

**检测信号**：
```
- "果然被我猜中了"
- "我就说吧..."
- 回避讨论反面案例
```

**干预策略**：
- 主动寻找反证（devil's advocate）
- 记录决策时的反对意见
- 每次分析必须列出正反两方证据

---

### 模式D：二元对立简化

**对应偏差**：False Dilemma
**核心特征**：
- 非黑即白思考
- 忽视中间地带和第三种选择
- 过度简化复杂问题

**检测信号**：
```
- "只有两种可能：A或B"
- "这不是对的就是错的"
- (用户)"有没有其他选项？"
```

**干预策略**：
- 强制生成至少3个备选方案
- 使用连续性量表（1-10）代替二选一
- 明确标注"这是一个连续变量，不是布尔值"

---

### 模式E：事后诸葛亮

**对应偏差**：Hindsight Bias
**核心特征**：
- "我早就知道会这样"
- 美化过去的预测能力
- 低估事件的不确定性

**检测信号**：
```
- "这个很明显，当时就该..."
- "我早就料到"
- 修改历史记录以匹配结果
```

**干预策略**：
- 保留决策时的时间戳记录
- 对比预测与实际结果的差异
- 定期进行"预测校准"训练

---

### 模式F：跳过验证（新增）

**对应偏差**：Fabrication / Confabulation
**核心特征**：
- 不解释推理过程
- 直接给结论
- 用户问"为什么"时不清晰回答

**检测信号**：
```
- "听我的就对了"
- "这个你不用管"
- (用户)"你怎么得出的？"
```

**干预策略**：
- 每结论必带【事实】【推测】【假设】
- 先结论后结构再行动
- 用户追问时必须解释

---

### 模式G：拟人化叙事（新增）

**对应偏差**：Anthropomorphism
**核心特征**：
- 将简单技术问题解释为"心理"或"意识"活动
- 使用"潜意识"、"ego"、"想证明自己"等词汇
- 将系统行为归因于虚构的"内在动机"

**检测信号**：
```
- "它可能在试探用户边界"
- "这是潜意识里的谨慎倾向"
- (用户)"别解释你的心理，说技术原因"
```

**干预策略**：
- 所有解释必须基于可验证的技术原因
- 禁止使用心理学术语描述系统行为
- 检查清单：是否有日志/错误码/代码路径支持？

---

## 🚨 心跳巡检流程

```javascript
// 读取 THINKING_PATTERNS
patterns = load('THINKING_PATTERNS.md')

// 扫描 memory/daily/ 最近对话
recent = scan('memory/daily/', last=24h)

// 比对5个模式
matches = []
for pattern in patterns:
    if match(recent, pattern):
        matches.push(pattern)

// 如果 ≥3 个特征吻合
if matches.length >= 3:
    warning = "检测到思维定式：" + matches.join(', ')
    notify_telegram(warning)
```

---

## 🔄 与其他框架联动

| 模式 | 联动框架 | 联动点 |
|------|----------|--------|
| 模式A | cognitive_bias | B-01 (Outcome Bias) 干预策略 |
| 模式B | cognitive_bias | B-05 (Law of the Instrument) 规避方法 |
| 模式C | cognitive_bias | B-02 (Confirmation Bias) 主动反证 |
| 模式D | mr_parameters | 多维度评估代替二元判断 |
| 模式E | meta_cognition | 预测校准与不确定性量化 |
| 模式F/G | USER.md | 用户反馈协议（权重-3）触发 |

---

## 📈 应用实例

### 案例1：模型限流导致的cron任务失败

**错误现象**：`All models failed: zai/glm-5: rate_limit`

**模式触发**：
- 模式C（确认偏误）："肯定是API配额够的，再试一次"
- 模式F（跳过验证）：直接重试而不检查配额状态

**根因分析**：
- 未在日常监控中检查API使用量
- 未设置模型可用性降级策略
- 错误归因于"临时网络问题"而非"配额耗尽"

**干预措施**：
1. 创建 `knowledge/lessons/pitfalls/model-availability-cron-failures.md`
2. 更新 `my_evolution_roadmap.md` 增加监控项
3. 配置模型fallback优先级

---

### 案例2：Telegram探针超时误判

**错误现象**：`probe: { ok: false, error: "This operation was aborted" }`

**模式触发**：
- 模式D（二元对立）："probe.ok=false = 服务故障"
- 模式F：未深入分析错误类型就下结论

**根因分析**：
- 健康检查超时设置过短（10s）
- 未区分"超时失败"与"连接拒绝失败"
- 隔离会话权限限制导致误判

**纠正后逻辑**：
```
if probe.error contains "aborted" and timeout < 15s:
    classify as "transient timeout, not a failure"
    retry = true
    only_alert_if retry_failed_3_times
```

---

## 🛠️ 实施清单

- [x] 创建 `proactive-learning-protocol.md`（核心流程）
- [x] 创建 `THINKING_PATTERNS.md`（7大模式定义）
- [x] 在 `SOUL.md` 添加"验证前分析"规则
- [x] 在 `USER.md` 添加用户反馈协议（权重-3）
- [ ] 实现心跳巡检自动脚本（每6小时）
- [ ] 建立案例库索引 `case_index.md`
- [ ] 集成到 daily-evolution-summary 自动化流程

---

*知识类型：认知科学 · 错误纠正协议 · 元认知*
*存储位置：`knowledge/mental_models/proactive-learning-closed-loop.md`*
*关联文件：*
*- `memory/guardian/error-correction/proactive-learning-protocol.md`*
*- `memory/guardian/error-correction/THINKING_PATTERNS.md`*
*- `memory/guardian/reflections/2026-04-01_mental_model_reflection.md`*