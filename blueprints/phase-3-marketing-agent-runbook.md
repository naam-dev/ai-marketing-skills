# Phase 3 Runbook — Marketing Agent Closes the Loop

Weeks 5–6 of the [Content & Marketing Agent Blueprint](./content-marketing-agents-blueprint.md) (§8). Prerequisites: Phase 1–2 exit criteria met ([Phase 1](./phase-1-content-agent-runbook.md) · [Phase 2](./phase-2-insight-agent-runbook.md)). The change this phase makes: **content stops being posted and starts being launched as experiments.** Every distribution push gets a hypothesis, a metric, and a pre-committed kill threshold — and what wins or dies flows back into `memory/` so the Content Agent improves without anyone touching a prompt.

**Exit criteria:** 4 experiments completed with statistical readouts · ≥1 winner scaled · kill log non-empty (yes, you must kill something — a phase with zero kills means thresholds are too soft).

---

## Setup (once, ~1 hour)

### 1. Write your kill/scale policy — before the first experiment

Pre-committing thresholds is the whole point (blueprint §6): killing is autonomous, scaling past a cap is human-gated. Add this block to the top of `memory/experiment-log.jsonl`'s companion policy — create `memory/experiment-policy.md`:

```markdown
# Experiment Policy (owner: human)
- Min sample before any decision: [e.g. 1,000 impressions or 72h, whichever first]
- KILL (autonomous): variant [X]% below control / cohort mean at min sample, or spend > $[cap] with no conversion
- SCALE (autonomous up to cap): winner at ≥95% confidence → increase budget/frequency ≤[20]%/day
- SCALE (human-gated): any increase beyond [20]%/day or $[amount]/day total
- Max concurrent experiments: [e.g. 3] — more than this and nothing reaches significance
```

Fill in the brackets once, honestly, and don't renegotiate mid-experiment.

### 2. Tools

- **Experiment lifecycle:** `growth-engine/experiment-engine.py` (`create` → `log` → `score`; `score` runs the statistics — bootstrap CIs, Mann-Whitney U — and auto-promotes winners; `playbook` accumulates proven practices; `suggest` proposes next tests from gaps).
- **Drift watch:** `growth-engine/pacing-alert.py` — run daily (cron or the Friday session) to catch experiments going sideways between readouts.
- **Landing page feedback:** `conversion-ops/cro_audit.py --url <destination>` — audit where the traffic lands before spending on it.
- **Intent routing (optional this phase):** `sales-pipeline/trigger_prospector.py` + `rb2b_instantly_router.py` to route high-intent engagers/visitors toward outbound.

---

## The per-experiment loop

### Step 1 — Design (from the brief, not from vibes)

Each week, take the top published piece(s) and frame distribution as a hypothesis. Sources for what to test: the current Insight Brief's `performance_learnings`, `memory/winning-patterns.md` (exploit), or `experiment-engine.py suggest` (explore).

```bash
python3 growth-engine/experiment-engine.py create --agent marketing \
  --hypothesis "Contrarian hook outperforms how-to hook for [segment] on LinkedIn" \
  --variable "hook" --variants '["contrarian", "how-to"]' \
  --metric "engagement_rate" --cycle-hours 24
```

Rules:
- **One variable per experiment.** Two changed variables = zero learnings.
- **The metric must be loggable and the hypothesis falsifiable.** "Increase brand awareness" is neither.
- **Before paid spend:** run `cro_audit.py` on the destination page. Don't buy traffic to a page that audits below threshold — fix the page first (that's a free win).

### Step 2 — Launch variants

Publish/schedule the variants (channel-native, same slot/timing where possible so the variable stays isolated). Log data points as they come in:

```bash
python3 growth-engine/experiment-engine.py log --agent marketing --experiment-id EXP-001 \
  --variant "contrarian" --metrics '{"impressions": 4500, "clicks": 120, "replies": 8}'
```

### Step 3 — Readout, kill, scale

At min sample (per your policy):

```bash
python3 growth-engine/experiment-engine.py score --agent marketing --experiment-id EXP-001
```

- **Loser →** kill per policy, no discussion. Append the entry to `memory/experiment-log.jsonl` (`decision: kill`, include `spend_saved` if paid) and, if a pattern is emerging (2+ similar kills), write it to `memory/losing-patterns.md` with the experiment ids as evidence.
- **Winner →** scale within the autonomous cap. Beyond the cap → it goes to you (this is the Phase 3 human gate — approve/reject with one line of reasoning in the log entry).
- **Inconclusive at max duration →** log it as such and move on. An inconclusive result that saves you from re-testing the same thing is still a result.

### Step 4 — Write memory (the flywheel step)

Every scored experiment produces exactly one of: a `winning-patterns.md` entry, a `losing-patterns.md` entry, or an `experiment-log.jsonl` line marked inconclusive. From now on the **Marketing Agent owns writes** to both pattern files (per `memory/README.md`) — your QA notes from Phase 1 stay, but new entries must cite experiment ids.

This is where the compounding you were promised happens: within 2–3 weeks the Content Agent should be drafting with hooks/formats that have experiment evidence behind them, and its first-round panel scores should tick up. If they don't, patterns are being written too vaguely to act on — rewrite them as rules, not observations.

---

## Weekly cadence

| Day | Action |
|---|---|
| Mon | Insight Brief lands (Phase 2) → pick this week's experiments from it (respect max-concurrent) |
| Daily | `pacing-alert.py` — intervene only if something is bleeding past policy |
| Fri | `score` anything at min sample → kill/scale → write memory → `autogrowth-weekly-scorecard.py --output` for the week's rollup |

The Friday scorecard is the Phase 3 stand-in for the daily report — it's what the Phase 4 orchestrator will automate.

## Friday review additions

1. **Experiment velocity:** on pace for 4 completed by end of week 6?
2. **Kill discipline:** anything kept alive past its threshold? Why? (There is no good answer — tighten.)
3. **Flywheel check:** are new content drafts citing experiment-backed patterns? First-round panel scores trending up?
4. **Exit check:** 4 readouts ✓ · ≥1 scaled winner ✓ · ≥1 kill logged ✓ → start Phase 4 (orchestrator + daily report + approval queue — the point where your only job becomes approvals).
