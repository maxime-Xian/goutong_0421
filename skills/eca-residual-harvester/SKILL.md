---
name: eca-residual-harvester
description: ECA v2.2 — Sample ignored residuals to detect blind spots; route findings to Judgment/Action/Trap.
user-invocable: true
metadata: {"openclaw":{"emoji":"🧺","requires":{"config":["eca.enabled"]}}}
---

## Purpose
Catch “silently ignored” signals by low-rate sampling and periodic review.

## Output contract (strict)
- new_judgment_candidates: []
- new_action_candidates: []
- new_trap_candidates: []
- sampling_notes:
