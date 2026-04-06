# Feishu Evolver Watchdog 监控工作流程
*沉淀日期：2026-04-05*

## 🏗️ 系统架构

### 组件说明

| 组件 | 路径 | 职责 |
|------|------|------|
| **Cron 调度器** | OpenClaw cron 系统 | 每30分钟触发一次守护任务 |
| **Watchdog 任务** | `evolver_watchdog_robust` | 执行 Feishu evolvers 健康检查 |
| **Lifecycle 脚本** | `/Users/maxime.xian/skills/feishu-evolver-wrapper/lifecycle.js` | 核心维护逻辑，执行 `ensure` 命令 |
| **Feishu Bots** | `openclaw_mac_feishu` (默认), `bot_b_feishu` | 实际发送/接收消息的机器人 |
| **Gateway** | OpenClaw Gateway (端口 18789) | 消息路由和通道管理 |

### 执行流程

```
cron (每30分钟)
    ↓
evolver_watchdog_robust (isolated session)
    ↓
exec: node .../lifecycle.js ensure
    ↓
[生命周期检查]
    ├─ Bot 连接状态
    ├─ 授权有效性
    ├─ 消息队列积压
    └─ 错误计数
    ↓
自动修复（如需要）或静默完成
```

## 📊 监控指标

### Cron 任务状态

查看任务运行状态：

```bash
cron list --id d5ca66e3-c9f7-40be-9688-4958f3671e14
```

**关键字段**：
- `lastRunStatus`: `ok` | `error` | `running`
- `consecutiveErrors`: 连续失败次数（>3 需告警）
- `lastDurationMs`: 执行耗时（正常应 <60s）
- `nextRunAtMs`: 下次执行时间

### Lifecycle 脚本执行

脚本位于：`~/.openclaw/workspace/skills/feishu-evolver-wrapper/lifecycle.js`

**支持的子命令**：
- `ensure`：检查并修复常见问题（默认）
- `status`：只报告状态，不修改任何内容
- `restart`：重启 Feishu 通道（谨慎使用）
- `repair-auth`：刷新授权令牌

### Bot 连接状态

通过 `openclaw health --json` 检查：

```json
{
  "channels": {
    "feishu": {
      "accounts": {
        "default": {
          "probe": {
            "ok": true,
            "appId": "cli_a9420ab79138dbd6",
            "botOpenId": "ou_53afd3d652f795bc4104cd536fd0808c"
          }
        },
        "bot_b_feishu": {
          "probe": {
            "ok": true,
            "appId": "cli_a935115f00f8dbcb",
            "botOpenId": "ou_f290bd3621ef6396afdb8d67819da482"
          }
        }
      }
    }
  }
}
```

## 🚨 常见问题与处理

| 问题 | 现象 | 处理命令 |
|------|------|----------|
| Bot 授权过期 | `probe.ok=false` | `lifecycle.js repair-auth` |
| Gateway 未运行 | `gateway.bindMode` 无响应 | `openclaw gateway start` |
| 消息积压 | `lastDurationMs` 持续增加 | 检查下游服务负载 |
| 配置错误 | `configAudit.ok=false` | 修正 `openclaw.json` |
| 连续失败 | `consecutiveErrors` > 3 | 检查脚本日志，临时禁用 |

## 🔧 手动干预流程

### 场景1：Watchdog 报告失败

```bash
# 1. 检查cron任务状态
cron list --id d5ca66e3-c9f7-40be-9688-4958f3671e14

# 2. 查看最近运行日志
cron runs --id d5ca66e3-c9f7-40be-9688-4958f3671e14 --limit 3

# 3. 手动执行 health check
openclaw health --json | jq '.channels.feishu'

# 4. 如有问题，重启 gateway
openclaw gateway restart

# 5. 强制刷新 Bot 授权（如需要）
node ~/.openclaw/workspace/skills/feishu-evolver-wrapper/lifecycle.js repair-auth
```

### 场景2：需要临时停止监控

```bash
# 禁用 watchdog（临时）
cron disable --id d5ca66e3-c9f7-40be-9688-4958f3671e14

# 重新启用
cron enable --id d5ca66e3-c9f7-40be-9688-4958f3671e14
```

### 场景3：Bot 切换或配置更新后

```bash
# 1. 确认新 Bot 已加入目标群聊
# 2. 刷新授权
node ~/.openclaw/workspace/skills/feishu-evolver-wrapper/lifecycle.js repair-auth

# 3. 手动运行 ensure 验证
node ~/.openclaw/workspace/skills/feishu-evolver-wrapper/lifecycle.js ensure

# 4. 检查状态
openclaw health --json
```

## 📈 性能基准

| 指标 | 正常范围 | 警告阈值 | 危险阈值 |
|------|----------|----------|----------|
| 执行耗时 | 10-30s | >45s | >60s |
| 连续成功 | N/A | <10次连续成功 | N/A |
| 连续失败 | 0 | 1-2次 | ≥3次 |
| Gateway 响应时间 | <100ms | 100-500ms | >500ms |

## 🔍 日志与调试

### 查看 lifecycle 脚本日志

```bash
# 脚本日志通常在标准输出，查看最近的cron会话
# 方法1：查看cron任务的最近运行记录
cron runs --id d5ca66e3-c9f7-40be-9688-4958f3671e14 --limit 1 --show-output

# 方法2：查找相关会话文件
ls -lt ~/.openclaw/agents/main/sessions/*cron*d5ca66e3* | head -5
```

### Gateway 日志（macOS）

```bash
# 系统日志
log show --predicate 'process == "openclaw-gateway"' --last 1h

# 或查看 LaunchAgent 日志
cat ~/Library/Logs/ai.openclaw.gateway.log 2>/dev/null || echo "无独立日志文件"
```

## 📚 相关记忆与文档

- `memory/2026-04-03.md`: Feishu Channels 修复记录（4月3日）
- `knowledge/tech/openclaw-health-check-standard.md`: 通用健康检查标准
- `references/methodology.md`: 系统监控方法论（如有）

---

*知识类型：操作流程 · 监控指南 · 运维手册*
*存储位置：`knowledge/work/feishu-evolver-watchdog-operations.md`*
*适用角色：运维 · 系统管理员*
*维护频率：每次 Feishu 配置变更后更新*