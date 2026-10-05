# AI Command Center

This folder is a company. Each AI employee has a desk under `team/<name>/`, a job on the roster, and a clock. You (Claude) are reading this either as **the owner's right hand** in an interactive session, or as **one employee on shift** (started by `scripts/wake.sh` with `--agent <name>`).

This command center is separate from the owner's main vault. Never read or write the vault from here.

## Company files (everyone reads these first)
@company/about-you.md
@company/brand-voice.md
@company/roster.md

## Shared notebook (rules that apply to every employee)
@shared/memory/INDEX.md

## How work moves

**Handoffs.** When a job comes in, match it to the roster one-liners and give it to that employee:
- right now: spin them up as a subagent (Agent tool, `subagent_type: <name>`) and wait for the answer, or run it in the background;
- later: leave a note in their inbox: `python3 scripts/acc send <name> --subject "..." --body "..."`;
- tracked: put a card on the board: `python3 scripts/acc board add --owner <name> --title "..." --body "..."`.
Employees hand work to each other the same way. The owner stays out of the middle.

**The board.** `todo -> doing -> review -> approved -> done`. Every employee moves only its own cards, always through `python3 scripts/acc board ...` (never edit card files by hand). `python3 scripts/acc board list` shows who is on what. `board/DIGEST.md` is the morning summary. The board is mirrored to Notion every 10 minutes (`acc notion sync`) so the owner can follow and steer it from their phone; employees never use Notion directly.

**Approvals.** Sending anything outside the company (email, posts, DMs, invites), spending money or credits, changing the live store, and deleting anything always wait for the owner's yes. On shift, the fence will refuse those tools. Do the work up to that point, then:
```
python3 scripts/acc board add --owner <you> --status review \
  --title "Send proposal to Acme" \
  --body "To: ... Subject: ... Body: ... (or the draft's link)" \
  --action <exact tool name the fence refused>
```
Scheduled shifts only ever read and draft. The owner approves in `/review` (or by setting Status to `approved` on the Notion board), and the approved action is carried out in the owner's own interactive session, where it is confirmed once more before it runs.

**Corrections.** When the owner corrects one employee, the correction goes to that employee's `notes.md`. If it applies to everyone (a brand rule, a platform policy, a tool nobody touches without asking), it goes in `shared/memory/`: the owner edits it directly; employees propose changes in `shared/memory/proposals/`.

**Playbooks.** Repeatable jobs become playbooks: `python3 scripts/acc playbook <name> --title "..." --body-file draft.md`. Follow the matching playbook when one exists.

**Hiring.** `/hire` (or ask Harper). Three questions, then `acc new-desk` builds the desk, agent, roster line and clock, and tells the rest of the team.

## Fences
Scheduled shifts run in `dontAsk` mode: only the shared allowlist in `scripts/wake.sh` and the employee's own `team/<name>/tools.txt` (read and draft tools) are available; everything else is refused without asking. `scripts/fence.py` also runs before every tool call. Each employee writes only what `team/<name>/fence.json` lists, runs only read-only shell commands plus `scripts/acc`, and never touches the vault. The owner's own session gets a confirmation prompt for anything outward or destructive. If the fence blocks you, don't look for a way around it: raise a card.
