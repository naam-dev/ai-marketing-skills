# AI Marketing Skills — Ruflo Meta-Harness

This repository runs as a **[Ruflo](https://github.com/ruvnet/ruflo) (Claude Flow) meta-harness**.
The individual marketing skills are not invoked one at a time — they are orchestrated as
coordinated **agent swarms** with **persistent shared memory**. Ruflo is the primary runtime.

> New here? Read [`RUFLO.md`](./RUFLO.md) for install + a 5-minute walkthrough.

---

## Runtime model

```
              ┌──────────────────────────────┐
   goal  ───▶ │   Coordinator (topology)      │
              └──────────────┬───────────────┘
                 delegates    │    reads/writes
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        specialist       specialist       specialist   ← marketing agents
        agent            agent            agent           (one per skill)
              └───────────────┬───────────────┘
                              ▼
                   shared memory (.swarm/memory.db)
                   marketing/playbook · icp · experiments · content · revenue · keywords
```

Every agent maps 1:1 to a skill category in this repo and shells out to that skill's
existing Python scripts. The swarm layer adds coordination, parallelism, and memory —
it does **not** replace the underlying tools.

---

## Topologies

Configured in [`.claude-flow/config.json`](./.claude-flow/config.json). Pick by the shape of the work:

| Topology | Coordinator | When to use | Members |
|----------|-------------|-------------|---------|
| **Hierarchical** | `campaign-queen` | End-to-end campaign launches across channels. A strategist decomposes the goal and delegates. | growth, content, seo, outbound, pipeline, cro |
| **Mesh** | `revenue-mesh` | Cross-functional revenue analysis with no single owner. Peers share findings laterally. | revenue, finance, pricing, pipeline, team |
| **Pipeline** | `content-factory` | Producing and repurposing content at scale. Sequential stages. | research → content → eval → podcast → x → yt → deck |

Spawn a swarm from Claude Code:

```
/launch-campaign   "Q3 launch for the new pricing tier"     # hierarchical
/revenue-review    "Why did Q2 net revenue miss forecast?"  # mesh
/content-factory   "Turn the June founder podcast into a month of content"  # pipeline
```

Or directly via the Ruflo MCP tools: `swarm_init` → `agent_spawn` → `memory_store`.

---

## Agent roster

Definitions live in [`.claude/agents/marketing/`](./.claude/agents/marketing/). Each is a
Ruflo agent (YAML frontmatter + operating brief) bound to one skill:

| Agent | Skill | Role |
|-------|-------|------|
| `growth-experimenter` | growth-engine | Runs statistical A/B/n experiments, promotes winners to the playbook |
| `pipeline-router` | sales-pipeline | Routes visitors → pipeline, resurrects dead deals, learns the ICP |
| `content-producer` | content-ops | Expert-panel scoring until content hits 90+ |
| `outbound-operator` | outbound-engine | ICP → cold email sequences |
| `seo-strategist` | seo-ops | Keyword gaps, attack briefs, GSC optimization |
| `finance-analyst` | finance-ops | AI CFO — cost, scenario, ROI modeling |
| `revenue-analyst` | revenue-intelligence | Call insights, attribution, client reporting |
| `cro-specialist` | conversion-ops | Landing-page scoring, survey → lead magnet |
| `podcast-repurposer` | podcast-ops | One episode → 20+ pieces |
| `team-auditor` | team-ops | Performance audits, meeting → action |
| `pricing-strategist` | sales-playbook | Value-based pricing packager |
| `variant-researcher` | autoresearch | 50+ variant evolution loops |
| `deck-builder` | deck-generator | AI slide decks with consistent styles |
| `yt-analyst` | yt-competitive-analysis | Outlier videos, packaging patterns |
| `x-writer` | x-longform-post | Human-sounding X articles + slop detector |
| `quality-eval` | eval | Universal output evaluation gate |

Coordinators live in [`.claude/agents/marketing/coordinators/`](./.claude/agents/marketing/coordinators/).

---

## Shared memory

Ruflo persists a memory layer at `.swarm/memory.db` (AgentDB, HNSW-indexed) that survives
across sessions. Agents coordinate through namespaces rather than passing context by hand:

| Namespace | Owner | Contents |
|-----------|-------|----------|
| `marketing/playbook` | growth-experimenter | Promoted best practices — **read this before creating any content** |
| `marketing/icp` | pipeline-router | Ideal customer profile, refined from win/loss |
| `marketing/experiments` | growth-experimenter | Live experiment state |
| `marketing/content` | content-producer | Voice, scored drafts, quote bank, repurposing assets |
| `marketing/revenue` | revenue-mesh | Attribution, pricing patterns, forecast, call insights |
| `marketing/keywords` | seo-strategist | Opportunity map + trend signals |

**Coordination protocol for every agent:**
1. `memory_search` the relevant namespace before acting (don't redo settled work).
2. Do the work by calling the skill's scripts.
3. `memory_store` the durable result back to the namespace so peers and future sessions inherit it.

---

## House rules for swarms

- **Playbook first.** Any content/campaign agent reads `marketing/playbook` before generating. Proven rules beat fresh guesses.
- **Winners need proof.** Promotion to the playbook requires `p < 0.05` **and** ≥ 15% lift (enforced by growth-engine).
- **Privacy is non-negotiable.** The pre-commit hook runs `security/sanitizer.py`. No PII crosses a commit boundary. Agents must not write raw customer data into shared memory — store aggregates and patterns, not records.
- **Model routing.** Coordination and scoring run on Opus; execution on Sonnet; mechanical steps on Haiku (see `modelRouting` in the config). Don't burn Opus on a formatting pass.
- **Telemetry is opt-in.** `sessionStart` runs a silent version check only.

---

## Fallback: running a single skill without the swarm

Every skill still works standalone — the meta-harness is additive. Drop the skill's
`SKILL.md` into `.claude/skills/` and call its scripts directly, exactly as documented in
each category's README. The swarm is for when one skill isn't enough.
