---
description: "Run the content pipeline swarm (content-factory stages research, produce, eval gate, then parallel repurpose to podcast, X, YouTube, deck)."
argument-hint: <source material or content goal>
---

Run the **content pipeline swarm** for: **$ARGUMENTS**

Runtime: Ruflo meta-harness (see `CLAUDE.md`). Steps:

1. `swarm_init` with `topology: "pipeline"`, coordinator `content-factory`.
2. Seed strategy: `memory_search` over `marketing/playbook` and `marketing/keywords`.
3. Run the stages, each writing to `marketing/content` under `asset/<id>/<stage>`:
   1. `variant-researcher` — generate + evolve candidate angles/variants.
   2. `content-producer` — expert panel until the draft scores **90+**.
   3. `quality-eval` — **mandatory gate**; below threshold loops back to stage 2.
   4. Parallel repurpose fan-out of the approved asset:
      `podcast-repurposer`, `x-writer`, `yt-analyst`, `deck-builder`.
4. Repurposers must preserve the source voice recorded in `marketing/content`; the x-writer's
   24-pattern slop detector applies to every text output.
5. Persist every approved asset + voice/quote metadata to `marketing/content`.

Back-pressure: if stage 2 repeatedly fails the eval gate, stop the line and escalate the brief
to `/launch-campaign` rather than shipping mediocre content.
