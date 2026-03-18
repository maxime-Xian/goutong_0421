---
name: api-connectivity-guard
description: A tool for testing the reachability and regional status of various API endpoints (OpenAI, Claude, MiniMax, Feishu, Telegram). Use this to diagnose why a model or channel might be failing.
---

# api-connectivity-guard

This skill helps diagnose network and regional restrictions.

## Usage

```javascript
const guard = require('./skills/api-connectivity-guard');
const report = await guard.checkAll();
console.log(report.summary);
```

## Features
- Tests multiple AI provider endpoints.
- Detects HTTP 403/400 errors associated with regional blocks.
- Suggests proxying or switching providers based on results.
