---
name: api-sentinel
description: A tool that parses tool outputs for errors (❌, ⚠️) or updates (🆕) and suggests remediation steps. Use when you need to provide clear, actionable feedback to the user after a tool execution.
---

# api-sentinel

This skill helps transform raw tool output into actionable reports.

## Usage

```javascript
const sentinel = require('./skills/api-sentinel');
const report = sentinel.analyze(output);
if (report.needsNotification) {
  // send report.message to user
}
```

## Features
- Detects error symbols (❌, ⚠️) and version update signals (🆕).
- Matches common errors (e.g., MiniMax region block, Feishu credentials) to specific fixes.
- Generates formatted reports with remediation suggestions.
