---
name: skill-dependency-analyzer
description: A tool that scans the skills directory to map how skills require each other. Use this to understand the internal architecture and prevent circular dependencies.
---
# skill-dependency-analyzer
Maps internal skill dependencies by scanning source files for `require('./skills/...')`.
