## Cron Job Configuration Best Practices (Agent Reflection)

### 5 Critical Pitfalls:
- **Pitfall 1: Ambiguous Payload**
  ❌ --message "运行AI资讯推送"
  ✅ --message "cd /root/.openclaw/workspace && bash script.sh"
  Reason: Isolated sessions do not understand vague instructions.
- **Pitfall 2: Insufficient Isolation in Testing**
  ❌ openclaw cron run <task_id> (Actual execution)
  ✅ bash script.sh --test (Test mode)
  Reason: Direct testing will actually send messages, and users will receive erroneous content.
- **Pitfall 3: Timezone Not Specified**
  ❌ --cron "0 9 * * *" (Defaults to UTC)
  ✅ --cron "0 9 * * *" --tz "Asia/Shanghai"
  Reason: Without a specified timezone, timings will be incorrect.
- **Pitfall 4: Lack of Verification**
  ❌ Create task and forget about it
  ✅ openclaw cron list to confirm status and timing
  Reason: Configuration might be wrong; verification is necessary.
- **Pitfall 5: Skipping Manual Testing**
  ❌ Directly set up a scheduled task and wait for results
  ✅ bash script.sh manual run to confirm normal operation
  Reason: Manual testing has low cost; scheduled failure means waiting 24 hours.

### 3 Iron Rules:
1.  **Payload must be explicit** - No vague instructions.
2.  **Testing must be isolated** - Use `--test` mode.
3.  **Always test manually first** - Verify before scheduling.