---
description: Spin up a hierarchical marketing campaign swarm (campaign-queen delegates to growth, content, seo, outbound, pipeline, cro).
argument-hint: <campaign goal>
---

Launch a **hierarchical campaign swarm** for the goal: **$ARGUMENTS**

Runtime: Ruflo meta-harness (see `CLAUDE.md`). Steps:

1. `swarm_init` with `topology: "hierarchical"`, coordinator `campaign-queen`.
2. Have `campaign-queen` read the ground truth from shared memory before planning:
   `memory_search` over `marketing/playbook`, `marketing/icp`, and `marketing/experiments`.
3. Decompose the goal into channel workstreams and `agent_spawn` the workers it needs from:
   `growth-experimenter`, `content-producer`, `seo-strategist`, `outbound-operator`,
   `pipeline-router`, `cro-specialist`. Spawn only what the goal requires.
4. Run independent workstreams in parallel; sequence dependent ones (e.g. seo → content).
5. Reconcile worker outputs into one campaign plan: owners, sequence, success metrics.
6. Persist consequential decisions to `marketing/playbook` so the next campaign inherits them.

Enforce the house rules in `CLAUDE.md`: playbook-first, winners need `p<0.05` + ≥15% lift,
no PII into memory, respect model routing. If ROI is contested, hand off to `/revenue-review`.
