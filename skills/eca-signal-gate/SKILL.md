---
name: eca-signal-gate
description: ECA v2.2 — Dual-threshold routing: IGNORE / LIGHT_REVIEW / DEEP_REASON with reason codes.
user-invocable: true
metadata: {"openclaw":{"emoji":"🚦","requires":{"config":["eca.enabled"]}}}
---

## Purpose
Route the signal pack to the right cognition level using **dual thresholds**.

## Routing rules
- IGNORE: max score < low_threshold
- LIGHT_REVIEW: between thresholds OR time-sensitive low-risk
- DEEP_REASON: max score >= high_threshold OR hard trigger

## Output contract (strict)
- route: IGNORE | LIGHT_REVIEW | DEEP_REASON
- reason_codes: []
- thresholds: {low, high, policy_version}
