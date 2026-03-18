---
name: agent-reach-advisor
description: A specialized tool that analyzes agent-reach output for issues (❌, ⚠️) and new versions (🆕), providing specific upgrade commands and remediation advice. Use this when running agent-reach watch or check tasks.
---

# agent-reach-advisor

This skill provides expert analysis of `agent-reach` tool outputs.

## Usage

```javascript
const advisor = require('./skills/agent-reach-advisor');
const analysis = advisor.analyze(agentReachOutput);
if (analysis.hasUpdates) {
  console.log("Update available! Command: " + analysis.upgradeCommand);
}
```

## Features
- Detects new versions of agent-reach.
- Provides the specific pip upgrade command for the Panniantong repository.
- Parses ❌ and ⚠️ flags to provide human-readable troubleshooting steps.
