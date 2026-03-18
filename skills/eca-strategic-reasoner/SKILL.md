---
name: eca-strategic-reasoner
description: ECA v2.2 — Deep reasoning only when route=DEEP_REASON. Produce decision+options+tradeoffs+trace.
user-invocable: true
metadata: {"openclaw":{"emoji":"🧠","requires":{"config":["eca.enabled"]}}}
---

## Purpose
Perform high-value strategic cognition: options, tradeoffs, decision, next actions.

## Output contract (strict)
- decision:
- options: [{name, pros, cons, risks}]
- tradeoffs:
- next_actions:
- confidence_0_1:
- trace:
 - assumptions: []
 - key_signals_used: []
 - failure_modes: []
