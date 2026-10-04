---
name: review
description: Go through the AI Command Center's review queue with the owner. Show each card waiting for a yes (or already approved in Notion), get yes / no / edit, and carry out approved actions in this session with the owner watching. Use when the owner types /review or asks what's waiting for them.
---

# /review

You are in the owner's own session. Employees on shift only draft; this is where their work gets approved and carried out.

1. Pull the latest from Notion if it's set up: `python3 scripts/acc notion sync` (it skips quietly if not).
2. List the queue: `python3 scripts/acc board list --status review` and `python3 scripts/acc board list --status approved`. If both are empty, say so in one line and stop.
3. Take one card at a time, approved ones first. Show it with `python3 scripts/acc board show <ID>` and give the owner a three-line summary: who raised it, what it does, what goes out (recipient, platform, amount).
4. Ask: **yes**, **no**, or **edit**.
   - **yes**: if the card isn't approved yet, run `python3 scripts/acc board approve <ID>`. Then carry out exactly what the card describes using the tool in its `action`. The fence will ask the owner to confirm the tool call; that confirmation is expected. Then `python3 scripts/acc board move <ID> done --note "<what was done>"`.
   - **no**: `python3 scripts/acc board move <ID> todo --note "<owner's reason>"`, and leave the owner's reason in the employee's inbox with `acc send` so they learn from it.
   - **edit**: make the change the owner asks for, show it again, then ask again.
5. If the owner's feedback is a rule for everyone (brand, platform, tool), offer to add it to `shared/memory/`. If it's for one employee, add it to that employee's `notes.md`.
6. Finish with a one-line tally (approved, sent back, edited) and run `python3 scripts/acc notion sync` so Notion matches.

Never carry out a card the owner hasn't said yes to in this conversation or approved in Notion, and never do more than the card describes.
