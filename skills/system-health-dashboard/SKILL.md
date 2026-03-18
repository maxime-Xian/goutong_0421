---
name: system-health-dashboard
description: A tool that generates a comprehensive health report by aggregating data from other diagnostic skills (resource-profiler, api-connectivity-guard, auto-documenter). Use this to get a complete status overview of the agent's environment.
---

# system-health-dashboard

This skill provides a high-level overview of the entire system state.

## Usage

```javascript
const dashboard = require('./skills/system-health-dashboard');
const report = await dashboard.generateReport();
console.log(report);
```

## Features
- Aggregates system resource metrics.
- Checks API connectivity status.
- Includes the skills overview.
