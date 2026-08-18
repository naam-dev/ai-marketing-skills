#!/bin/bash
# Installs the addy-agent-skills plugin so its skills are available in any
# session working in this repo.
#
# Runs on every machine, not just remote ones: containers that are recreated
# per session (Claude Code on the web, throwaway Docker hosts) carry no
# per-machine plugin install and need this every time. On a persistent
# machine the install survives, so this exits early after the first run.
set -euo pipefail

command -v claude >/dev/null 2>&1 || exit 0

PLUGIN="agent-skills@addy-agent-skills"

# Idempotent: nothing to do if a previous run already installed it.
if claude plugin list 2>/dev/null | grep -qF "$PLUGIN"; then
  echo "session-start: $PLUGIN already installed"
  exit 0
fi

# The marketplace is also declared in .claude/settings.json; adding it here
# keeps the hook self-sufficient if that entry is ever removed.
claude plugin marketplace add addyosmani/agent-skills >/dev/null 2>&1 || true

# -y: the confirmation prompt requires it when stdin/stdout is not a TTY.
if claude plugin install -y "$PLUGIN" >/dev/null 2>&1; then
  echo "session-start: installed $PLUGIN"
else
  # Never block the session on a plugin that failed to fetch.
  echo "session-start: could not install $PLUGIN (continuing)" >&2
fi
