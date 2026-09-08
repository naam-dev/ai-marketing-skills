# Phase 1 Runbook — Content Agent, Human-Orchestrated

Weeks 1–2 of the [Content & Marketing Agent Blueprint](./content-marketing-agents-blueprint.md) (§8). **You are the Chief of Staff.** No orchestrator, no automation — you run the content pipeline manually via the skills in this repo, and you log everything to `../memory/` from piece one. The point of Phase 1 is not the 10 pieces; it's proving the quality-gate loop and building the memory habit that every later phase depends on.

**Exit criteria:** 10 pieces published at 90+ · revision loop demonstrably working (scores in the log) · all `memory/` files populated.

---

## Day 0 — One-time setup (~1 hour)

1. **Fill in `memory/icp.yaml`.** At least one segment, fully. If you can't name the pains and trigger events, stop and do a closed-won review first — everything downstream targets this file.
2. **Fill in `memory/brand-voice.md`.** Especially "We never" and the 2–3 reference pieces — the expert panel's Brand Voice Match expert scores against this file.
3. **Seed `memory/voc-quotes.yaml` with 10+ verbatim quotes.** Fastest sources: last 5 sales-call transcripts, G2/review pages, support tickets, community threads. Verbatim — don't clean them up.
4. Skim the expert panel skill once: [`content-ops/SKILL.md`](../content-ops/SKILL.md). It's the engine of steps 3–4 below.

---

## The per-piece loop

Run this loop ~1 piece/day. Each step names who does it in Phase 1 and which skill takes over later.

### Step 1 — Pick the topic (you; Insight Agent from Phase 2)

Write a 5-line mini-brief. This is a stand-in for the Insight Brief contract, so use its fields:

```yaml
topic: ""
segment: ""                 # must exist in memory/icp.yaml
format_recommendation: ""   # channel + format, e.g. "linkedin text-post"
evidence: ""                # why this, why now — one line, honest
intent_level: high|mid|low
```

Ways to pick well without Phase 2 tooling: a `seo-ops` Content Attack Brief on one competitor, a `yt-competitive-analysis` outlier scan of your niche, or simply the question your last 3 sales calls all asked.

### Step 2 — Read memory, then draft (Claude Code session)

Prompt pattern:

> Read `memory/brand-voice.md`, `memory/icp.yaml`, `memory/voc-quotes.yaml`, `memory/winning-patterns.md`, `memory/losing-patterns.md`. Then draft [format] on [topic] for [segment]. Use at least 2 verbatim quotes from the quote bank. Avoid every losing pattern.

- For X long-form: use the [`x-longform-post`](../x-longform-post/) skill (it carries its own voice template + humanizer checklist).
- The ≥2 VoC quotes rule is not decorative — it's the blueprint's mechanism (§5) for making agent content sound like it was written by someone who talks to customers.

### Step 3 — Expert panel score ([`content-ops/SKILL.md`](../content-ops/SKILL.md))

Ask Claude Code: *"Expert panel this draft."* The skill auto-assembles 7–10 experts (AI Writing Detector at 1.5x weight is mandatory), picks the rubric from `content-ops/scoring-rubrics/`, and scores.

### Step 4 — Quality gate loop (score ≥ 90 or revise, max 3 rounds)

The skill iterates automatically: score < 90 → top-3 weaknesses → revise → re-score. Your rules as the human:

- **Never override the gate.** If it can't reach 90 in 3 rounds, the piece dies (`status: killed-at-gate` in the log) or the *brief* was wrong — fix the brief, don't pad the score. Anti-pattern #4 (§9): one "just this once" and the gate is decorative.
- Batch-scoring drafts instead? `python content-ops/scripts/content-quality-scorer.py --input drafts.json --verbose` and `content-quality-gate.py` do it headlessly.

### Step 5 — Humanize + your QA (the Phase 1 human gate)

The panel already ran the 24-pattern AI-slop check (`content-ops/experts/humanizer.md`), so your read is judgment, not proofreading:

- Would you personally post this under your name?
- Is every claim true and every number sourced?
- Reject anything that feels off **even at 90+** — and when you do, tell the panel why so it appends a rejection pattern to `content-ops/references/patterns.md` (SKILL.md Step 7). That's the system learning your taste; it's the most leveraged 2 minutes in this runbook.

### Step 6 — Publish and atomize

Publish the pillar. Then: *"Atomize this into channel-native derivatives"* — `content-ops/scripts/content-transform.py` handles atoms → variants; full pillar-to-20+ explosion becomes systematic with [`podcast-ops`](../podcast-ops/) later. In Phase 1 even 3–5 derivatives per pillar is fine; the habit matters more than the count.

### Step 7 — Log it (non-negotiable, 2 minutes)

1. Append one line to `memory/content-log.jsonl` (schema in [`memory/README.md`](../memory/README.md)): id, channel, `panel_score`, `revision_rounds`, `voc_quotes_used`, status.
2. Mark the quotes you used in `voc-quotes.yaml` (`used_in`).
3. 48–72h later, check performance: clear over/under-performer → one entry in `winning-patterns.md` or `losing-patterns.md` **with the metric**.
4. `git commit` the memory changes. The commit history is the audit trail.

---

## Weekly review (Fridays, 20 min)

A manual stand-in for the Phase 4 daily report — same questions, human-sized cadence:

1. Read `content-log.jsonl`: pieces shipped? avg score? are `revision_rounds` falling week-over-week? (They should — that's memory compounding. If not, `brand-voice.md` or the rejection patterns need sharpening.)
2. Any pattern with evidence not yet written to `winning-patterns.md` / `losing-patterns.md`?
3. Quote bank still fresh? Add this week's calls.
4. Check exit criteria:

| Exit criterion | Check |
|---|---|
| 10 pieces published at 90+ | `wc -l memory/content-log.jsonl` + scores |
| Revision loop working | Log shows rounds > 1 with rising scores, and falling rounds over time |
| Memory populated | icp ✓ · brand-voice ✓ · 10+ quotes ✓ · ≥1 winning + ≥1 losing pattern ✓ |

All three green → start [Phase 2](./content-marketing-agents-blueprint.md#8-build-roadmap--ship-one-agent-first): the Insight Agent starts writing `memory/insight-briefs/`, and Step 1 of this loop stops being your job.
