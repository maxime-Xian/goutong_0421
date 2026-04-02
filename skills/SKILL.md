---
name: eca-trap-promoter
description: ECA v2.2 — Promote high-confidence traps into entropy-layer block/ignore rules (candidate only).
user-invocable: true
metadata: {"openclaw":{"emoji":"⛔","requires":{"config":["eca.enabled"]}}}
---

## Purpose
Turn repeated high-confidence traps into **candidate** pre-filter rules for the entropy layer.

## Output contract (strict)
- candidate_rules: [{rule_id, pattern, action: "drop|deprioritize|force_deep_reason", rationale, scope}]
- not_promoted: [{trap_id, reason}]
- safety_notes:
