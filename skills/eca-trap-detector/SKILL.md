---
name: eca-trap-detector
description: ECA v2.2 — Trap Modules (Warn): detect likely failure-path similarity and output avoidance guidance.
user-invocable: true
metadata: {"openclaw":{"emoji":"🕳️","requires":{"config":["eca.enabled"]}}}
---

## Purpose
Detect "trap patterns" (negative experience) and warn early to avoid repeated errors.

## Trap record schema
Each trap should have:
- context: Trigger condition
- trap_path: Failure path description
- failure_signal: Symptoms
- cost: Actual loss
- escape: Recovery path
- recurrence_risk: high|med|low
- false_alarm_cost: high|med|low
- drift_scope: Applicable environment

## Decision rule
Trigger warn if:
- similarity is high AND
- expected_avoidance_value > false_alarm_cost

## Output contract (strict)
- trap_hits: [{trap_id, similarity_0_1, why_matched, suggested_detour, urgency}]
- suppression: [{trap_id, reason}]
- notes:
