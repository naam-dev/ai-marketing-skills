# Phase 2 Runbook — Insight Agent Feeds the Content Agent

Weeks 3–4 of the [Content & Marketing Agent Blueprint](./content-marketing-agents-blueprint.md) (§8). Prerequisite: Phase 1 exit criteria met ([Phase 1 Runbook](./phase-1-content-agent-runbook.md)). The change this phase makes is simple and strict: **the Content Agent stops working from your topic picks and only works from Weekly Insight Briefs.** Step 1 of the Phase 1 loop stops being your job; `brief_id` in `content-log.jsonl` stops being `null`.

**Exit criteria:** 2 consecutive Weekly Insight Briefs delivered · 100% of new content traceable to a brief (`brief_id` set on every log line).

---

## Setup (once, ~1–2 hours)

The Insight Agent is a **weekly Claude Code session** (Mondays) that runs four collectors and synthesizes one brief. Configure whichever collectors you have credentials for — start with two, add the rest later. Each skill's `.env.example` / README lists its keys.

| Collector | Skill / script | Needs |
|---|---|---|
| Keyword gaps | `seo-ops/content_attack_brief.py` | `AHREFS_TOKEN`, `YOUR_DOMAIN` |
| Rising topics | `seo-ops/trend_scout.py` | `CONTENT_VERTICALS`, optionally `BRAVE_API_KEY` |
| Outlier formats | `yt-competitive-analysis/analyze.py` | YouTube API key + competitor channel handles |
| Voice of customer | `revenue-intelligence/gong_insight_pipeline.py` | Gong access, or just `--dir ./transcripts/` with exported call transcripts |
| Performance readout | `revenue-intelligence/revenue_attribution.py` + `memory/content-log.jsonl` | CRM/analytics export (or the log alone, week 1) |

**No credentials for a collector yet?** Run it as a manual research prompt in the same session (e.g. "scan these 3 competitor blogs/channels for outliers this month") and mark its evidence as `manual` in the brief. A thinner brief beats a skipped week — the contract and cadence are what Phase 2 is proving.

---

## The Monday loop (~1 session)

### Step 1 — Run the collectors

```bash
python seo-ops/content_attack_brief.py                       # keyword gaps vs competitors
python seo-ops/trend_scout.py                                # rising topics in your verticals
python3 yt-competitive-analysis/analyze.py $YT_KEY --channels @comp1,@comp2 --days 30 --output json
python revenue-intelligence/gong_insight_pipeline.py --dir ./transcripts/ --content-topics
```

### Step 2 — Performance readout (the feedback loop)

Read `memory/content-log.jsonl` and last week's published pieces:

- Which pieces over/under-performed their channel baseline? Any format or angle pattern?
- If attribution data exists: `python revenue-intelligence/revenue_attribution.py --report` — which content touched pipeline?
- Cross-check `memory/winning-patterns.md` / `losing-patterns.md`: does last week's data confirm, contradict, or add a pattern? Write the update (in Phase 2, the Insight session may propose pattern entries; you approve them as part of brief review).

### Step 3 — Synthesize the brief

Prompt pattern for the session:

> Read `memory/icp.yaml`, `memory/winning-patterns.md`, `memory/losing-patterns.md`, and the collector outputs above. Write `memory/insight-briefs/<YYYY-Wnn>.yaml` following `memory/insight-briefs/TEMPLATE.yaml`. Rank max 10 opportunities. Every opportunity needs: evidence (cite which collector), a format recommendation (cite the outlier data), and an intent level. Include any proposed `icp_updates` with evidence — do not edit `memory/icp.yaml` directly.

Synthesis rules (what makes a brief good, not just complete):

- **Ranked by intent × evidence, not volume.** A 200-search/mo keyword your last three sales calls asked about beats a 5k-search/mo generic term.
- **Every opportunity is drafteable as written.** If the Content Agent would need to ask a follow-up question, the opportunity isn't done.
- **VoC section is verbatim quotes only**, and they also get merged into `memory/voc-quotes.yaml` (from Phase 2, the Quote Miner owns that file's writes).
- **`performance_learnings` must contain at least one entry with an `action`.** A brief that never changes Content/Marketing behavior is a report, not a brief.

### Step 4 — Human review (the Phase 2 gate)

Two things are gated, per blueprint §2:

1. **`icp_updates`** — any proposed ICP change: you approve, then apply to `memory/icp.yaml` (bump `version`, append `evidence`). Later, `sales-pipeline/icp_learning_analyzer.py` generates these proposals from win/loss data.
2. **The brief's top 3** — a 5-minute sanity read: would you spend a week of content on these? Reorder or strike, don't rewrite.

Commit the brief. It's now the Content Agent's only valid input.

---

## Changes to the Phase 1 loop

| Phase 1 loop step | Phase 2 change |
|---|---|
| Step 1: you pick the topic | **Deleted.** Content Agent takes the top unworked opportunity from the current week's brief |
| Step 2: draft prompt | Add: "Read `memory/insight-briefs/<current-week>.yaml`; use its `format_recommendation` and `voc_language` for this opportunity" |
| Step 7: log | `brief_id` is now **required** — pieces without one don't ship |
| Friday review | Add one question: how many of this week's published pieces came from brief opportunities? (Target: all) |

---

## Weekly review additions (Fridays)

1. **Brief hit rate:** opportunities published vs. listed. Persistently <50% → the brief is over-generating; cut to 5 opportunities.
2. **Brief-to-performance:** are brief-sourced pieces outperforming your Phase 1 manual picks? (This is the number that justifies the Insight Agent existing. Give it 2–3 weeks of data.)
3. **Exit check:** 2 consecutive briefs shipped ✓ · every new `content-log.jsonl` line has a `brief_id` ✓ → start Phase 3 (Marketing Agent, `growth-engine` experiments with pre-committed kill thresholds).
