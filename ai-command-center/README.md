# AI Command Center

A small team of AI employees that runs on your own server with Claude Code. They share one company folder, one notebook and one board. You steer them from Claude (on your phone via Remote Control) and watch the board in Notion.

It's built cautiously:

- **Shifts read and draft. They never send.** Scheduled shifts run in Claude Code's `dontAsk` mode with a short allowlist. Anything not on it is refused without asking.
- **A fence on every tool call.** `scripts/fence.py` refuses sending, posting, spending credits, changing the live store, deleting, writing outside the employee's own desk, and anything in your main vault.
- **You approve and carry out.** Finished work lands on the board as a review card. You say yes in `/review` (or set the card to `approved` in Notion), and the action runs in your own session, with one more confirmation.
- **Its own user and folder.** It installs to `/srv/ai-command-center` as the `acc` user, away from your vault (`/srv/brain`), and refuses to install inside it.
- **Inbox access starts off.** Gmail, Calendar and Drive tools are commented out in each `team/<name>/tools.txt` until you've watched a few supervised shifts.

## The team

| Employee | Job | Clock (server time) |
|---|---|---|
| **Quill** | Inbox & Workspace: triage, reply drafts, calendar prep, loose ends | weekdays 09:00, 16:30 |
| **Nova** | Content & Social: morning trend brief, post drafts | daily 07:00; Mon/Wed/Fri 14:00 |
| **Atlas** | Proposals: proposals, follow-ups, pipeline | weekdays 10:00 |
| **Harper** | Hiring & Team: hire proposals, playbooks, weekly team check | Mondays 08:00 |

Add more with `/hire`.

## How it fits together

```
company/            about-you.md, brand-voice.md, roster.md   (everyone reads these)
shared/memory/      rules for everyone: brand rules, platform policies, locked tools
team/<name>/        a desk each: ROLE.md, notes.md, playbooks/, inbox/, work/,
                    clock.tsv (when), fence.json (where it may write),
                    tools.txt (extra read/draft tools on shift)
board/cards/        the board, one markdown file per card; mirrored to Notion
.claude/agents/     one subagent per employee (for handoffs inside a session)
.claude/skills/     /review and /hire
scripts/acc         the one control script (board, notes, hiring, clocks, Notion)
scripts/wake.sh     runs one shift for one employee
scripts/fence.py    the fence hook
```

Cron runs each employee's shifts, a Notion sync every 10 minutes, a digest at 07:45 (`board/DIGEST.md`), and a nightly git snapshot.

## Install on your server

On the server, as a user with sudo:

```bash
git clone https://github.com/naam-dev/ai-marketing-skills.git ~/ai-marketing-skills
sudo bash ~/ai-marketing-skills/ai-command-center/scripts/setup-server.sh
```

The installer:
- creates the `acc` user and `/srv/ai-command-center`
- checks the `acc` user can't write your vault
- finds Claude Code (or offers to install it for `acc`)
- offers to copy your existing Claude login
- starts git history and installs the clocks
- runs a health check, then prints the next steps

Options: `--target`, `--user`, `--vault`, `--no-cron`, `--update` (refreshes scripts and skills only, never your team or board), `--yes`.

Then:

1. **Fill in** `company/about-you.md` and `company/brand-voice.md`.
2. **Open Claude once as the team**: `sudo -u acc -i bash -c 'cd /srv/ai-command-center && claude'`. Accept "trust this folder" (shifts refuse to start until you do, because trusting is what loads the fence), `/login` if asked, and check `/mcp`.
3. **Run a supervised shift**: `sudo -u acc /srv/ai-command-center/scripts/wake.sh quill "Introduce yourself."` and read `logs/quill/<today>.log`.
4. **Notion (optional)**:
   - Create an internal integration at notion.so/my-integrations and put its secret in `.env` as `NOTION_TOKEN=...`.
   - Make a page called "AI Command Center", share it with the integration, then run `scripts/acc notion setup --parent '<page link>'`.
5. **Run it from your phone**: in a `tmux` session as `acc`, `cd /srv/ai-command-center && claude remote-control`. Then open the session in the Claude app.

`scripts/acc doctor` checks the whole install at any time.

## Day to day

In Claude (in the command center, or via Remote Control):

- "What's everyone on?" → the board
- `/review` → yes / no / edit on each waiting card; approved actions run here
- "Get Atlas to draft a proposal for the lead Quill found" → handoff
- "Nova, fewer LinkedIn posts, more short video ideas" → goes in Nova's notes
- "From now on, never mention pricing in public posts" → offered for `shared/memory/`
- `/hire` → three questions, new desk

In Notion:

- Watch the board.
- Set a review card's Status to `approved` to approve it, or to `todo` to send it back.
- Add a page with an Owner to give that employee a new card.

Turning on more access (after you trust a shift's output): uncomment the tool names in `team/<name>/tools.txt`. Use read and draft tools only. Sending stays in `/review` whatever you list.

## Tests

```bash
python3 -m unittest discover -s ai-command-center/tests -v
```

These cover the board rules, hiring, the fence (shift vs owner, desk paths, vault, shell allowlist) and Notion sync against a local fake Notion API.
