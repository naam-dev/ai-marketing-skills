# Running AI Marketing Skills on Ruflo

This repo is wired to run as a **[Ruflo](https://github.com/ruvnet/ruflo) (Claude Flow)
meta-harness** — the marketing skills run as coordinated **agent swarms** with **persistent
shared memory** instead of one skill at a time. This guide gets you from clone to first swarm
in about five minutes.

> Architecture and house rules live in [`CLAUDE.md`](./CLAUDE.md). This file is the how-to.

---

## What you get

- **16 marketing agents** — one per skill category, each bound to that skill's existing scripts.
- **3 swarm topologies** — hierarchical (campaigns), mesh (revenue), pipeline (content).
- **Shared memory** — a persistent `.swarm/memory.db` that lets agents (and future sessions)
  build on each other's work through six namespaces (`marketing/playbook`, `icp`, `experiments`,
  `content`, `revenue`, `keywords`).
- **3 slash commands** — `/launch-campaign`, `/revenue-review`, `/content-factory`.

Nothing here removes standalone use: every skill still runs on its own (see each category's
README). The swarm is for when one skill isn't enough.

---

## 1. Prerequisites

```bash
# Python deps for the underlying skills
pip install numpy scipy

# Node (for the Ruflo CLI / MCP server) — Node 18+
node --version
```

## 2. Install Ruflo + register the MCP server

The repo already ships the MCP registration in [`.mcp.json`](./.mcp.json). If your Claude Code
picks up project `.mcp.json` automatically, you're done. Otherwise register it explicitly:

```bash
# One-time: add the Ruflo MCP server to Claude Code
claude mcp add ruflo -- npx ruflo@latest mcp start
```

This exposes the swarm tools this repo relies on: `swarm_init`, `agent_spawn`, `memory_store`,
`memory_search`, and friends.

## 3. Initialize the harness (idempotent)

The harness files are committed (`.claude/`, `.claude-flow/`, `CLAUDE.md`), so you do **not**
need to re-scaffold. If you want Ruflo to (re)generate its runtime dirs (e.g. `.swarm/`), run:

```bash
npx ruflo@latest init
```

`.swarm/` (the memory DB) is runtime state and is git-ignored — it's created on first run.

---

## 4. Run your first swarm

From Claude Code in this repo:

```
/launch-campaign  "Q3 launch for the new usage-based pricing tier"
/revenue-review   "Why did Q2 net revenue miss forecast by 12%?"
/content-factory  "Turn the June founder podcast into a month of content"
```

Or drive it directly with the MCP tools:

```
swarm_init   { "topology": "hierarchical", "coordinator": "campaign-queen" }
agent_spawn  { "agent": "content-producer" }
agent_spawn  { "agent": "seo-strategist" }
memory_search{ "namespace": "marketing/playbook", "query": "landing page hero" }
```

---

## 5. How the pieces map

| Concept | Where it lives |
|---------|----------------|
| Harness manifest + house rules | [`CLAUDE.md`](./CLAUDE.md) |
| Topologies, agent registry, memory namespaces, model routing | [`.claude-flow/config.json`](./.claude-flow/config.json) |
| Marketing agents (16) | [`.claude/agents/marketing/`](./.claude/agents/marketing/) |
| Coordinators (3) | [`.claude/agents/marketing/coordinators/`](./.claude/agents/marketing/coordinators/) |
| Slash commands (3) | [`.claude/commands/`](./.claude/commands/) |
| MCP server registration | [`.mcp.json`](./.mcp.json) |

### Topology cheat-sheet

| Goal shape | Topology | Command | Coordinator |
|-----------|----------|---------|-------------|
| Launch across channels | hierarchical | `/launch-campaign` | `campaign-queen` |
| Answer a revenue question | mesh | `/revenue-review` | `revenue-mesh` |
| Produce + repurpose content | pipeline | `/content-factory` | `content-factory` |

---

## 6. Shared memory contract

Every agent follows the same three-beat protocol so work compounds instead of repeating:

1. **Read** — `memory_search` the relevant namespace before acting.
2. **Work** — call the skill's scripts.
3. **Write** — `memory_store` the durable result back to the namespace.

| Namespace | Owner agent | Read it before… |
|-----------|-------------|-----------------|
| `marketing/playbook` | growth-experimenter | creating any content or campaign |
| `marketing/icp` | pipeline-router | targeting or outbound |
| `marketing/experiments` | growth-experimenter | proposing a new test |
| `marketing/content` | content-producer | repurposing an asset |
| `marketing/revenue` | revenue-mesh | any pricing/forecast claim |
| `marketing/keywords` | seo-strategist | briefing content |

**Never store raw customer records in shared memory — aggregates and patterns only.** The
pre-commit hook (`security/sanitizer.py`) enforces PII hygiene at the commit boundary.

---

## 7. Cost & model routing

Ruflo routes turns across model tiers (`modelRouting` in the config): coordination and scoring
on Opus, execution on Sonnet, mechanical steps on Haiku. This keeps most turns off the most
expensive tier while preserving quality where it matters (planning and scoring).

---

## 8. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ruflo` MCP tools not available | `claude mcp add ruflo -- npx ruflo@latest mcp start`, then restart Claude Code |
| Agents can't see each other's work | Confirm `.swarm/memory.db` exists (`npx ruflo@latest init`) and namespaces match the config |
| A skill's script errors | The swarm only orchestrates — debug the skill standalone via its category README first |
| PII check fails the commit | `python3 security/sanitizer.py --scan --dir . --recursive` and remove flagged data |

---

*Want this built and managed for you? → [Single Brain](https://singlebrain.com/?utm_source=github&utm_medium=skill_repo&utm_campaign=ai_marketing_skills)*
