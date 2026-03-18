---
name: eca-entropy-filter
description: ECA v2.2 — Compress raw inputs into a high-signal pack (Top-N / sigma / noise drop).
user-invocable: true
metadata: {"openclaw":{"emoji":"🧹","requires":{"config":["eca.enabled"]}}}
---

## Purpose
Turn long/noisy raw context into a compact **signal pack** so the main model spends attention only on high-value items.

## When to use
- Input is long, repetitive, multi-source, or noisy.
- Need to extract anomalies, deltas, and Top-N candidates before deep reasoning.

## Procedure
1) Produce a 3-part output:
 - Summary (1–3 short paragraphs)
 - Anomalies / deltas (bullets)
 - Top-N candidates with scores and reason codes
2) Drop obvious noise and report drop stats.

## Output contract (strict)
Return a YAML-like block with keys:
- summary:
- anomalies: []
- candidates: [{id, text, score_0_1, reason_codes:[]}]
- dropped: [{pattern, count, rationale}]
- params_used: {top_n, sigma, rules_version}

## Guardrails
- Do NOT decide or propose final actions here.
- Keep it short. Prefer structure over prose.
