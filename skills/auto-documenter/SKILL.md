---
name: auto-documenter
description: A tool that scans the `skills/` directory and generates a consolidated `SKILLS_OVERVIEW.md` file. Use this to maintain an up-to-date catalog of all installed agent skills.
---

# auto-documenter

This skill helps maintain documentation for all installed skills.

## Usage

```javascript
const documenter = require('./skills/auto-documenter');
documenter.updateOverview();
```

## Features
- Scans all subdirectories in `skills/`.
- Extracts names and descriptions from `SKILL.md` files.
- Generates a formatted Markdown table.
