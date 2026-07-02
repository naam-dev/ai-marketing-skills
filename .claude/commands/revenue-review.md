---
description: "Spin up a mesh revenue-intelligence swarm (revenue-mesh peers: revenue, finance, pricing, pipeline, team converge by consensus)."
argument-hint: <revenue question>
---

Launch a **mesh revenue swarm** to answer: **$ARGUMENTS**

Runtime: Ruflo meta-harness (see `CLAUDE.md`). Steps:

1. `swarm_init` with `topology: "mesh"`, coordinator `revenue-mesh`.
2. `revenue-mesh` frames the question and publishes it to `marketing/revenue`.
3. `agent_spawn` the peers and fan out — each investigates its lens and writes findings to
   `marketing/revenue`:
   - `revenue-analyst` → attribution + call insights
   - `finance-analyst` → cost / ROI / scenario math
   - `pricing-strategist` → packaging + realized price
   - `pipeline-router` → pipeline coverage + ICP fit
   - `team-auditor` → rep / process performance
4. Peers cross-read and challenge each other's findings; a claim survives only if no other
   lens contradicts it.
5. `revenue-mesh` synthesizes the surviving findings into one answer with confidence and the
   single highest-leverage action. Ties break toward the lens with hard data (finance).
6. Flag any growth "winner" that did **not** move `marketing/revenue`.

Store aggregates only — no customer-level records in shared memory. If the answer implies a
campaign, hand a costed recommendation to `/launch-campaign`.
