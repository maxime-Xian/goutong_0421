---
name: eca-calibration-monitor
description: ECA v2.2 — Monitor FP/FN, cognitive ROI, and drift. Recommend safe updates.
user-invocable: true
metadata: {"openclaw":{"emoji":"📈","requires":{"config":["eca.enabled"]}}}
---

## Purpose
Prevent “faster but worse”. Track quality drift and guide threshold/rule updates.

## Output contract (strict)
- metrics_snapshot:
- issues: []
- recommendations: [{type:"threshold|rule|weight|decay", change, rationale, risk}]
- rollback_triggers: []
