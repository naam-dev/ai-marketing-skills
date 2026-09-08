# Shared Memory

Hot, cross-agent context for the [Content & Marketing Agent Blueprint](../blueprints/content-marketing-agents-blueprint.md) (§7). Agents **read the relevant files before acting** and **write after acting**. Humans can edit anything — a human edit is ground truth.

## Ownership map

Every file has exactly one owning writer. Everyone else reads.

| File | Owner (writes) | Read by | Populated in |
|---|---|---|---|
| `icp.yaml` | Human (Phase 1) → ICP Learner (Phase 2+) | All agents | Phase 1, day 1 |
| `brand-voice.md` | Human, always | Content Agent | Phase 1, day 1 |
| `voc-quotes.yaml` | Human (Phase 1) → Quote Miner (Phase 2+) | Content Agent | Phase 1, ongoing |
| `winning-patterns.md` | Human QA (Phase 1) → Marketing Agent (Phase 3+) | Content Agent | Phase 1, ongoing |
| `losing-patterns.md` | Human QA (Phase 1) → Marketing Agent (Phase 3+) | Content Agent | Phase 1, ongoing |
| `content-log.jsonl` | Content Agent (append-only) | Insight Agent (attribution) | Phase 1, every piece |
| `insight-briefs/` | Insight Agent | Content + Marketing Agents | Phase 2 |
| `experiment-log.jsonl` | Marketing Agent (append-only) | All agents | Phase 3 |

## Rules

1. **Read-before-act.** Every agent prompt starts by reading its relevant files. Memory nobody reads is a diary.
2. **One writer per file.** Cross-agent context flows through these files, never agent-to-agent.
3. **Append-only logs.** `*.jsonl` files are never rewritten, only appended. One JSON object per line.
4. **Commit on write.** Every memory update is a git commit — the history *is* the audit trail.
5. **Losing patterns are as valuable as winning ones.** Log both, every time.

## `content-log.jsonl` schema

One line per published (or killed) piece:

```json
{"id": "2026-07-29-pricing-teardown", "date": "2026-07-29", "brief_id": null, "channel": "linkedin", "format": "text-post", "panel_score": 92, "revision_rounds": 2, "voc_quotes_used": 2, "status": "published", "url": "", "notes": "manual topic pick (phase 1)"}
```

- `brief_id` is `null` in Phase 1 (manual topic picks); from Phase 2 it must reference a file in `insight-briefs/`.
- `status`: `published` | `killed-at-gate` | `killed-at-qa`.

## `experiment-log.jsonl` schema (Phase 3)

```json
{"id": "exp-001", "date": "2026-08-20", "content_id": "2026-07-29-pricing-teardown", "hypothesis": "", "metric": "", "variants": [], "result": "", "decision": "kill|scale|inconclusive", "spend_saved": 0}
```
