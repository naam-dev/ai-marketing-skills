#!/usr/bin/env bash
# wake.sh: put one employee on the clock for one job, then let them go home.
#
#   scripts/wake.sh quill "Sort the inbox."
#
# Runs Claude Code headless as that employee (.claude/agents/<name>.md), with
# the fence hook active, one run at a time per employee, logged to
# logs/<name>/YYYY-MM-DD.log.
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

prompt="Shift start: $(date '+%A %d %B %Y, %H:%M').
Job: $task

Before you start: check your inbox (python3 scripts/acc inbox $name) and your cards (python3 scripts/acc board list --owner $name).
Put a card in doing for the job if there isn't one. When you finish: move cards on, raise review cards for anything that needs the owner's yes, file inbox notes you dealt with (python3 scripts/acc inbox $name --done <file>), and add any lesson to team/$name/notes.md."

# Permissions: the fence hook (.claude/settings.json -> scripts/fence.py) is the
# gate. Hooks still run under bypassPermissions, so nothing below can send,
# spend, delete or write outside the desk without a card you approved.
mode="${ACC_PERMISSION_MODE:-bypassPermissions}"

{
  echo
  echo "=== $(date '+%F %T') $name: $task"
  [[ -n "${ACC_APPROVED_CARD:-}" ]] && echo "    (approved card ${ACC_APPROVED_CARD}, tools: ${ACC_APPROVED_TOOLS:-none})"
} >> "$log"

set +e
flock -n "$lock" timeout "${ACC_SHIFT_TIMEOUT:-1800}" \
  claude -p "$prompt" \
    --agent "$name" \
    --permission-mode "$mode" \
    --output-format text \
    >> "$log" 2>&1
status=$?
set -e

case $status in
  0)   echo "=== $(date '+%T') $name: done" >> "$log" ;;
  1)   echo "=== $(date '+%T') $name: claude exited with an error (or $name was already on shift)" >> "$log" ;;
  124) echo "=== $(date '+%T') $name: shift timed out after ${ACC_SHIFT_TIMEOUT:-1800}s" >> "$log" ;;
  *)   echo "=== $(date '+%T') $name: exit $status" >> "$log" ;;
esac
exit $status
