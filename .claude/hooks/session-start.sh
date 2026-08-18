#!/bin/bash
# Installs the addy-agent-skills plugin so its skills are available in
# Claude Code on the web sessions, which start from a fresh container each
# time and do not carry a per-machine plugin install.
#
# Local machines (Mac, servers) install the plugin once into ~/.claude and
# keep it, so this is a no-op there.
set -euo pipefail

# Remote sessions only.
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

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

if claude plugin install "$PLUGIN" >/dev/null 2>&1; then
  echo "session-start: installed $PLUGIN"
else
  # Never block the session on a plugin that failed to fetch.
  echo "session-start: could not install $PLUGIN (continuing)" >&2
fi
