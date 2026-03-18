---
name: system-janitor
description: A tool that manages workspace health by cleaning up old log files and temporary data. Use this periodically to prevent disk bloat and keep the environment organized.
---

# system-janitor

This skill helps maintain a clean workspace by rotating logs and removing stale files.

## Usage

```javascript
const janitor = require('./skills/system-janitor');
const result = janitor.cleanupLogs({ maxAgeDays: 7 });
console.log(result.summary);
```

## Features
- Scans `logs/` directory for old files.
- Removes files exceeding the specified age limit.
- Reports the number of files removed and space reclaimed.
