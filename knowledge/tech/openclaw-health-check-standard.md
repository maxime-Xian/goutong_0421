# OpenClaw Gateway 健康监控与诊断
*沉淀日期：2026-04-05*

## 📋 监控指标与健康状态

### 1. Gateway 核心健康检查

使用 `openclaw gateway status --json` 获取完整状态报告：

```bash
openclaw gateway status --json
```

**关键检查点**：
- `service.loaded`: LaunchAgent 是否已加载
- `gateway.bindMode`: 绑定模式（loopback vs public）
- `gateway.bindHost`: 绑定的主机地址
- `port.status`: 端口监听状态
- `rpc.ok`: RPC 连接是否正常
- `health.healthy`: 整体健康状态
- `configAudit.ok`: 配置审计是否通过

### 2. 通道（Channel）健康检查

使用 `openclaw health --json` 检查各渠道状态：

```bash
openclaw health --json
```

**Telegram 特殊处理**：
- `probe.ok=false` + `error: "This operation was aborted"` 通常是探针超时（默认10s），不等同于服务中断
- 在隔离会话中，`missing scope: operator.read` 错误可能是权限限制，而非实际故障

**Feishu 状态确认**：
- `probe.ok=true` 且包含 `appId` 和 `botOpenId` 表示 Bot 连接正常
- 即使 `running=false`，只要 probe 成功，Bot 仍可正常工作

## 🚨 故障判定规则（避免误报）

仅当满足以下条件时，才判定为**实际故障**：

✅ **网关故障**：
- Gateway service 未运行
- 端口未监听
- `rpc.ok=false`
- `health.healthy=false` 且 `configAudit.ok=false`

✅ **通道故障**：
- Telegram/Feishu `configured=false`
- Probe 失败持续超过15秒（非单次超时）
- 实际消息发送失败（非探针失败）

❌ **不视为故障的情况**（正常/可忽略）：
- 隔离会话中的权限警告（`missing scope: operator.read`）
- Telegram probe 的单次超时（10s abort）
- 通道 `running=false` 但 `probe.ok=true`
- 临时网络波动导致探针失败（可重试）

## 🔧 自动修复策略

### 网关重启（如需）

```bash
# 停止网关
openclaw gateway stop

# 启动网关
openclaw gateway start

# 或重启（如果已运行）
openclaw gateway restart
```

### 配置验证

```bash
# 检查配置文件
openclaw config validate

# 查看具体配置
cat ~/.openclaw/openclaw.json | jq '.channels'
```

## 📊 监控最佳实践

1. **分层监控**：
   - L1: Gateway 基础服务（必须）
   - L2: 通道探针（重要）
   - L3: 实际消息发送（验证功能）

2. **阈值设置**：
   - 连续3次探针失败才告警
   - 消息发送失败率 >5% 需要介入

3. **日志定位**：
   - Gateway 日志：`~/Library/Logs/OpenClaw/` (macOS)
   - 会话日志：`~/.openclaw/agents/*/sessions/`
   - cron 任务状态：`cron list`

## 🔍 相关记忆引用

- `memory/2026-04-03.md`: Feishu 配置修复记录
- `memory/guardian/evolution/my_evolution_roadmap.md`: 监控能力进化目标
- `knowledge/tech/openclaw-health-check-standard.md`: 健康检查标准流程（本文件）

---

*知识类型：技术实现 · 操作流程 · 故障诊断*
*存储位置：`knowledge/tech/openclaw-health-check-standard.md`*
*适用场景：系统监控 · 运维 · 问题排查*