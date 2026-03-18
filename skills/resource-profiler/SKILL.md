---
name: resource-profiler
description: A tool that reports system resource metrics like memory usage, CPU load, and uptime. Use this when you suspect performance bottlenecks or want to monitor system health.
---

# resource-profiler

This skill provides a quick profile of system resources.

## Usage

```javascript
const profiler = require('./skills/resource-profiler');
const report = profiler.getProfile();
console.log(report.summary);
```

## Features
- Memory usage (total, free, used).
- CPU load average (1m, 5m, 15m).
- System uptime.
- Node.js process memory usage.
