# OpenClaw 模型管理与切换指南
*沉淀日期：2026-04-05*

## 📋 模型配置概览

### 当前 runtime 配置

查看当前使用的模型：

```bash
# 方法1：查看 OpenClaw 配置
cat ~/.openclaw/openclaw.json | jq '.model'

# 方法2：使用 status 命令（如支持）
openclaw status | grep -i model

# 方法3：从会话元数据查看（自动注入）
# 在任意会话中，系统会自动显示：
# Runtime: ... | model=<current-model> | default_model=<default>
```

### 配置文件位置

```bash
# 主配置文件
~/.openclaw/openclaw.json

# 环境变量覆盖（可选）
~/.openclaw/.env
```

---

## 🔄 模型切换方法

### 方法1：临时切换（当前会话）

在对话开始时指定模型：

```
/model stepfun/step-3.5-flash:free
```

或在新会话中通过 URL 参数：

```
openclaw chat --model "google/gemini-2.5-flash"
```

### 方法2：永久更改默认模型

编辑 `~/.openclaw/openclaw.json`：

```json
{
  "model": "stepfun/step-3.5-flash:free",
  "default_model": "stepfun/step-3.5-flash:free",
  "models": {
    "fallbackOrder": [
      "stepfun/step-3.5-flash:free",
      "google/gemini-2.0-flash",
      "openai/gpt-4o-mini"
    ]
  }
}
```

然后重启 Gateway：

```bash
openclaw gateway restart
```

### 方法3：环境变量覆盖（最高优先级）

在 `~/.openclaw/.env` 中添加：

```bash
OPENCLAW_MODEL=stepfun/step-3.5-flash:free
OPENCLAW_DEFAULT_MODEL=stepfun/step-3.5-flash:free
```

---

## 📊 常见模型可用性状态

| 模型标识 | 提供商 | 状态（2026-04-05） | 适用场景 |
|----------|--------|-------------------|----------|
| `stepfun/step-3.5-flash:free` | StepFun | ✅ 稳定 | 通用任务 |
| `zai/glm-5` | ZAI (智谱) | ⚠️ 限流中 | 中文任务 |
| `google/gemini-2.5-flash` | Google | ⚠️ 切换错误 | 分析任务 |
| `minimax-portal/MiniMax-M2.5` | MiniMax | ❌ 未找到 | 对话任务 |
| `moonshot/kimi-k2.5` | Moonshot | ⚠️ 切换错误 | 推理任务 |
| `openrouter/anthropic/claude-*` | OpenRouter | ❌ 权限问题 | 高级任务 |

---

## ⚠️ 错误诊断速查

### 错误：`LiveSessionModelSwitchError`

**含义**：会话期间模型被切换或不可用

**原因**：
- 模型在会话中被变更
- 模型提供商临时不可用
- fallback 链全部失败

**解决**：
1. 检查模型配置 spelling
2. 验证提供商 API 密钥有效
3. 临时切换到已知可用模型
4. 重启会话（清除模型缓存）

```bash
# 查看错误详情
openclaw gateway status --json | jq '.rpc'

# 切换模型重试
openclaw chat --model stepfun/step-3.5-flash:free
```

---

### 错误：`model_not_found`

**含义**：提供商不识别该模型名称

**原因**：
- 模型名称拼写错误
- 模型已下架或重命名
- 提供商 API 版本不兼容

**解决**：
1. 核对模型名称（大小写敏感）
2. 查阅提供商最新文档
3. 使用已验证的模型别名

```bash
# 验证模型列表（示例）
# StepFun: 查看 free 模型列表
curl -H "Authorization: Bearer $OPENCLAW_API_KEY" \
  https://api.stepfun.com/models

# OpenRouter: 查看可用模型
openrouter models list
```

---

### 错误：`rate_limit` / `429`

**含义**：API 调用频率或额度达到上限

**原因**：
- 免费额度用尽
- 达到了每分钟调用限制
- 多任务并发超限

**解决**：
1. 检查配额使用情况
2. 降低调用频率（增加延迟）
3. 切换到其他可用模型
4. 升级账户或等待配额重置

```bash
# StepFun 配额检查（示例）
curl -H "Authorization: Bearer $OPENCLAW_API_KEY" \
  https://api.stepfun.com/dashboard/billing/overview
```

---

## 🛠️ 模型降级策略配置

### 在 openclaw.json 中定义 fallback 链

```json
{
  "model": "stepfun/step-3.5-flash:free",
  "models": {
    "fallbackOrder": [
      {
        "id": "stepfun/step-3.5-flash:free",
        "priority": 1,
        "timeoutMs": 30000
      },
      {
        "id": "google/gemini-2.0-flash",
        "priority": 2,
        "timeoutMs": 30000
      },
      {
        "id": "local-ollama/llama3.2:3b",
        "priority": 3,
        "timeoutMs": 60000
      }
    ]
  }
}
```

**fallback 逻辑**：
1. 尝试 `priority: 1`
2. 失败 → 等待2秒 → 尝试 `priority: 2`
3. 失败 → 等待5秒 → 尝试 `priority: 3`
4. 全部失败 → 触发错误回调

---

## 🔍 监控模型健康度

### 自动健康检查脚本

```bash
#!/bin/bash
# check-models.sh

models=(
    "stepfun/step-3.5-flash:free"
    "google/gemini-2.0-flash"
)

for model in "${models[@]}"; do
    echo "Testing $model..."
    start=$(date +%s)
    response=$(echo "ping" | openclaw chat --model "$model" --max-tokens 5 2>/dev/null)
    status=$?
    end=$(date +%s)
    
    if [ $status -eq 0 ]; then
        echo "✅ $model - OK (${end-start}s)"
    else
        echo "❌ $model - FAILED"
    fi
done
```

### 集成到 cron 健康检查

在 `daily-security-audit` 或自定义 cron 中调用：

```
cron add --name "model-health-check" \
  --expr "0 */6 * * *" \
  --message "运行模型健康检查脚本" \
  --command "/path/to/check-models.sh"
```

---

## 📚 模型选择决策矩阵

| 任务类型 | 推荐模型 | 理由 | 备选 |
|----------|----------|------|------|
| 快速问答、简短对话 | `stepfun/step-3.5-flash:free` | 速度快，免费 | `openai/gpt-4o-mini` |
| 深度分析、长文本 | `google/gemini-2.5-flash` | 上下文窗口大 | `anthropic/claude-sonnet-4` |
| 中文对话、本地化 | `zai/glm-5`（配额充足时）| 中文优化 | `moonshot/kimi-k2.5` |
| 代码生成、技术任务 | `openai/gpt-4o` | 代码能力强 | `anthropic/claude-opus-4` |
| 低成本批量处理 | 本地 Ollama 模型 | 无网络成本 | - |
| 紧急关键任务 | 配置2个以上fallback | 避免单点故障 | - |

---

## ⚙️ 本地模型备用（Ollama）

### 安装与配置

```bash
# 1. 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. 拉取模型（选择1-2个）
ollama pull llama3.2:3b
ollama pull gemma2:9b

# 3. 启动服务（保持常驻）
ollama serve

# 4. 设置 keep-alive（避免冷启动）
export OLLAMA_KEEP_ALIVE=-1
```

### 配置为 fallback

在 `openclaw.json` 中添加：

```json
{
  "models": {
    "local": {
      "provider": "ollama",
      "baseUrl": "http://localhost:11434",
      "models": ["llama3.2:3b", "gemma2:9b"]
    },
    "fallbackOrder": [
      "stepfun/step-3.5-flash:free",
      "local-ollama/llama3.2:3b"
    ]
  }
}
```

---

## 🔄 模型切换历史记录

**重要变更追踪**：

| 日期 | 变更 | 原因 | 结果 |
|------|------|------|------|
| 2026-04-04 | 从 `glm-4.7-flashx` 切换至 `glm-5` | 用户询问模型版本 | 配置更新 |
| 2026-04-05 | 当前为 `stepfun/step-3.5-flash:free` | 多任务失败后回滚 | 稳定运行 |

**切换检查清单**：
- [ ] 验证新模型 API 可达性
- [ ] 测试关键任务（健康检查、定时任务）
- [ ] 监控24小时错误率
- [ ] 更新文档和用户通知

---

## 🚨 应急预案

### 场景：所有外部模型不可用

1. **立即切换到本地模型**
   ```bash
   export OPENCLAW_MODEL=local-ollama/llama3.2:3b
   ```

2. **暂停非关键任务**
   ```bash
   cron disable --id daily-knowledge-precipitation
   cron disable --id daily-conversation-summary-optimization
   ```

3. **保持核心功能**
   - 健康检查（使用本地模型）
   - 安全审计（使用本地模型）
   - 手动交互（用户可指定模型）

4. **恢复外部服务**
   - 检查提供商状态页
   - 验证 API 密钥
   - 等待配额重置

---

## 📈 最佳实践

1. **never single point of failure**：
   关键任务至少配置2个 fallback 模型（1个云端 + 1个本地）

2. **测试 before production**：
   新模型上线前，先在隔离会话测试所有 cron 任务

3. **监控与告警**：
   - 模型错误率 >5% →  Telegram 告警
   - 连续3次 fallback → 记录事件
   - 每日模型健康报告（集成到 security-audit）

4. **文档同步**：
   每次模型变更后，更新本文件和相关 cron 任务配置

---

*知识类型：配置管理 · 故障恢复 · 系统运维*
*存储位置：`knowledge/work/openclaw-model-management.md`*
*维护频率：每次模型配置变更后更新*
*相关技能：`skill-vetter`（模型验证）*