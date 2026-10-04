---
name: hire
description: Add a new AI employee to the AI Command Center. Ask the owner three questions, check the roster for overlap, then build the desk, agent, roster line, clock and tool list with acc new-desk. Use when the owner types /hire or asks for a new team member or role.
---

# /hire

Runs in the owner's session only (`acc new-desk` refuses on a shift).

1. Ask the three questions, one message, short:
   1. **The job.** What should they do, in one sentence, and what does "done well" look like?
   2. **The clock.** When should they work on their own? ("weekdays 9am", "Mondays 8am", "only when asked")
   3. **The fence.** What may they read or draft, and what must wait for a yes? (Sending, posting, spending and deleting always wait.)
2. Read `company/roster.md`. If an existing employee could do this with a new playbook, say so and offer that instead.
3. Suggest a short, lowercase, friendly name that isn't taken and confirm it.
4. Build the desk:
   ```
   python3 scripts/acc new-desk <name> --title "<Role title>" \
     --one-liner "<one sentence>" \
     --owns "<responsibility>" --owns "<responsibility>" \
     --clock "<m h dom mon dow>|<what to do on that shift>"
   ```
   Leave out `--clock` for "only when asked". Times are server time.
5. Rewrite `team/<name>/ROLE.md` from the answers (keep the "How you work" section), and file a first playbook for the main job with `python3 scripts/acc playbook <name> --title "..." --body "..."`.
6. If they need read or draft tools (for example Gmail search, Drive read), list them, commented out, in `team/<name>/tools.txt` and tell the owner to enable them after watching a supervised run.
7. Tell the owner to run `python3 scripts/acc clocks install` if a clock was added, and offer a first supervised run: `scripts/wake.sh <name> "Introduce yourself and describe your first shift."`.
