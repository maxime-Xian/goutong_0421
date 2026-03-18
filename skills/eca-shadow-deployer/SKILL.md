---
name: eca-shadow-deployer
description: ECA v2.2 — Shadow deploy updates (thresholds/rules/trap promotions). Promote/Hold/Rollback based on calibration.
user-invocable: true
metadata: {"openclaw":{"emoji":"🛡️","requires":{"config":["eca.enabled"]}}}
---

## Purpose
Never apply updates directly. Run them in shadow mode first.

## Output contract (strict)
- decision: PROMOTE | HOLD | ROLLBACK
- report:
 - quality_delta:
 - fp_delta:
 - fn_delta:
 - trap_false_alarm_delta:
 - roi_delta:
 - notes:
