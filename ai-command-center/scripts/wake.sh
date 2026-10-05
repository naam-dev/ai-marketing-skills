#!/usr/bin/env bash
# wake.sh: put one employee on the clock for one job, then let them go home.
#
#   scripts/wake.sh quill "Sort the inbox."
#
# Runs Claude Code headless as that employee (.claude/agents/<name>.md), one
# run at a time per employee, logged to logs/<name>/YYYY-MM-DD.log.
#
# Cautious by design: the shift runs in dontAsk mode, so every tool not on the
# allowlist below (plus the employee's own team/<name>/tools.txt) is refused
# outright. On top of that the fence hook (scripts/fence.py) refuses sending,
# publishing, spending, deleting and writing outside the employee's desk.
# Shifts read and draft; you approve and carry out the rest in /review.
set -euo pipefail

ACC_HOME="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
name="${1:-}"
shift || true
task="${*:-Run your scheduled shift.}"

if [[ ! "$name" =~ ^[a-z][a-z0-9-]{1,30}$ ]] || [[ ! -f "$ACC_HOME/.claude/agents/$name.md" ]]; then
  echo "usage: wake.sh <employee> [task]   (employees: $(ls "$ACC_HOME/.claude/agents" 2>/dev/null | sed 's/\.md$//' | tr '\n' ' '))" >&2
  exit 2
fi

cd "$ACC_HOME"
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

export ACC_HOME ACC_EMPLOYEE="$name" ACC_HEADLESS=1
export ACC_VAULT_PATH="${ACC_VAULT_PATH:-/srv/brain}"

mkdir -p "logs/$name"
log="logs/$name/$(date +%F).log"
lock="logs/.$name.lock"

# Claude Code skips this folder's .claude/settings.json (and so the fence hook)
# until you've trusted the folder once. Never run a shift without the fence.
if ! python3 -c 'import json,os,sys; p=json.load(open(os.path.expanduser("~/.claude.json"))).get("projects",{}); sys.exit(0 if p.get(sys.argv[1],{}).get("hasTrustDialogAccepted") else 1)' "$ACC_HOME" 2>/dev/null; then
  echo "=== $(date '+%F %T') $name: NOT STARTED. Trust this folder first: cd $ACC_HOME && claude (accept the prompt)" >> "$log"
  echo "wake.sh: $ACC_HOME isn't trusted yet; run claude there once and accept the trust prompt" >&2
  exit 3
fi

prompt="Shift start: $(date '+%A %d %B %Y, %H:%M').
Job: $task

Before you start: check your inbox (python3 scripts/acc inbox $name) and your cards (python3 scripts/acc board list --owner $name).
Put a card in doing for the job if there isn't one. When you finish: move cards on, raise review cards for anything that needs the owner's yes, file inbox notes you dealt with (python3 scripts/acc inbox $name --done <file>), and add any lesson to team/$name/notes.md."

# Shared allowlist: files (fenced to the desk), research, and the acc script.
allowed=(
  Read Glob Grep Write Edit WebSearch WebFetch
  "Bash(python3 scripts/acc:*)"
  "Bash(git status:*)" "Bash(git log:*)" "Bash(git diff:*)"
  "Bash(ls:*)" "Bash(date:*)"
)
# Per-employee extras (read-only and draft tools only; see the file's header).
if [[ -f "team/$name/tools.txt" ]]; then
  while IFS= read -r line; do
    line="${line%%#*}"; line="${line//[[:space:]]/}"
    [[ -n "$line" ]] && allowed+=("$line")
  done < "team/$name/tools.txt"
fi

{
  echo
  echo "=== $(date '+%F %T') $name: $task"
} >> "$log"

set +e
flock -n "$lock" timeout "${ACC_SHIFT_TIMEOUT:-1800}" \
  "${CLAUDE_BIN:-claude}" -p "$prompt" \
    --agent "$name" \
    --permission-mode dontAsk \
    --allowedTools "${allowed[@]}" \
    --output-format text \
    < /dev/null >> "$log" 2>&1
status=$?
set -e

case $status in
  0)   echo "=== $(date '+%T') $name: done" >> "$log" ;;
  1)   echo "=== $(date '+%T') $name: claude exited with an error (or $name was already on shift)" >> "$log" ;;
  124) echo "=== $(date '+%T') $name: shift timed out after ${ACC_SHIFT_TIMEOUT:-1800}s" >> "$log" ;;
  *)   echo "=== $(date '+%T') $name: exit $status" >> "$log" ;;
esac
exit $status
