# 模型可用性管理与定时任务失败处理
*沉淀日期：2026-04-05*

## 🎯 问题现象

从 2026-04-04 开始，多个依赖外部AI模型的定时任务出现**系统性失败**：

| 任务名称 | 连续失败 | 主要错误类型 |
|----------|----------|--------------|
| `daily-conversation-summary-optimization` | 1次 | 模型切换错误 + API限流 |
| `daily-evolution-summary` | 9次 | 模型不可用 (model_not_found) |
| `daily-knowledge-precipitation` | 1次 | 模型不可用 (rate_limit) |
| `evolver_daily_cycle_6pm` | 2次 | LiveSessionModelSwitchError |

### 错误代码速查

| 错误信息 | 含义 | 临时对策 |
|----------|------|----------|
| `LiveSessionModelSwitchError` | 模型在会话中被切换或不可用 | 重试或更换模型 |
| `model_not_found` | 提供商不识别该模型名称 | 检查模型配置 spelling |
| `rate_limit` | API调用频率达到配额上限 | 等待冷却或升级配额 |
| `All models failed (N)` | 所有fallback模型都失败 | 系统级模型服务故障 |

## 🔧 诊断流程

### 1. 快速检查当前可用模型

```bash
# 查看OpenClaw配置中的模型设置
cat ~/.openclaw/openclaw.json | grep -A5 '"model"'
```

### 2. 检查模型提供商状态

- **StepFun**: 检查配额和API密钥
- **ZAI (glm-5)**: 确认是否达到每日限流
- **Google Gemini**: 验证服务状态
- **OpenRouter**: 检查账户余额和模型可用性

### 3. 查看cron任务配置

```bash
# 列出所有cron任务
cron list

# 检查特定任务的最近执行状态
cron runs --id <job-id> --limit 5
```

## 🛠️ 解决方案

### 短期应急（立即执行）

1. **降级到稳定模型**：
   在任务配置中将 `model` 字段改为已知可用的模型，例如：
   ```json
   "model": "stepfun/step-3.5-flash:free"
   ```

2. **跳过失败任务（如果非关键）**：
   ```bash
   cron disable --id <problematic-job-id>
   ```

3. **手动触发关键任务**（使用稳定模型）：
   ```bash
   # 在消息中显式指定模型
   /model stepfun/step-3.5-flash:free
   ```

### 中期修复（本周内）

1. **建立模型优先级列表**：
   在 `openclaw.json` 中配置 `models.fallbackOrder`：
   ```json
   {
     "models": {
       "fallbackOrder": [
         "stepfun/step-3.5-flash:free",
         "openai/gpt-4o-mini",
         "google/gemini-2.0-flash"
       ]
     }
   }
   ```

2. **实现任务级模型降级策略**：
   - 核心任务（健康检查、安全审计）：使用本地模型（如 Ollama）
   - 次要任务（总结、提醒）：使用免费API配额
   - 高价值任务（分析、决策）：保留优质模型但设置严格重试

3. **监控模型可用性**：
   添加到每日健康检查：
   ```bash
   # 测试关键模型连通性
   echo "test" | openclaw chat --model stepfun/step-3.5-flash:free --max-tokens 10
   ```

### 长期战略（本月）

1. **部署本地模型备用**：
   - 使用 Ollama 运行 `llama3.2:3b` 或 `gemma2:9b`
   - 配置为fallback，仅在外部API失败时启用

2. **建立模型SLA监控面板**：
   - 成功率、延迟、成本指标
   - 自动告警和故障切换

3. **分散风险**：
   - 不同任务使用不同提供商
   - 避免单点故障影响所有定时任务

## 📝 操作经验总结

### ✅ 正确做法

1. **关键cron任务应使用本地或已验证模型**：
   - 健康检查、安全审计 → 本地模型（Ollama）
   - 总结任务 → 免费额度充足的模型

2. **设置合理的重试策略**：
   ```json
   {
     "retry": {
       "maxAttempts": 3,
       "backoffMs": 5000,
       "onFailure": "disable-24h"
     }
   }
   ```

3. **分离任务与模型配置**：
   - 任务定义中只指定"模型类别"（如 "fast"、"smart"）
   - 统一映射到具体模型，便于批量切换

### ❌ 错误做法（已造成影响）

1. **所有任务依赖同一模型系列**：
   当 `zai/glm-5` 限流时，7个任务同时失败

2. **未设置fallback模型**：
   任务配置中只有单模型，无备用选项

3. **忽略cron错误累积**：
   `daily-evolution-summary` 已连续失败9次才发现问题

## 🎓 关键教训

1. **单点故障风险**：模型服务依赖必须冗余设计
2. **监控滞后**：cron任务失败没有即时告警机制
3. **配置集中化不足**：模型切换需要逐个编辑任务
4. **测试不足**：新模型上线前未进行定时任务压力测试

## 📊 关联技术债与优化项

- [ ] 创建 `model-health-monitor` 独立监控任务
- [ ] 实现 `openclaw cron test-all` 命令批量验证
- [ ] 建立模型提供商状态页面（internal dashboard）
- [ ] 编写 `cron-model-fallback-guide.md` 操作手册
- [ ] 为所有定时任务添加 `--model` 显式声明

---

*知识类型：问题排查 · 系统稳定性 · 运维经验*
*存储位置：`knowledge/lessons/pitfalls/model-availability-cron-failures.md`*
*标签：cron, model, fallback, rate-limit, troubleshooting*