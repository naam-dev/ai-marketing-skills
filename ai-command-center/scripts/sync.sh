#!/usr/bin/env bash
# sync.sh: nightly snapshot of the command center into its own git history.
# Pushes only if you've added a remote (git remote add origin ...).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

git rev-parse --git-dir >/dev/null 2>&1 || { echo "not a git repo; run setup-server.sh"; exit 1; }
git add -A
if git diff --cached --quiet; then
  echo "$(date '+%F %T') nothing to snapshot"
  exit 0
fi
git commit -q -m "snapshot $(date '+%F %H:%M')"
echo "$(date '+%F %T') snapshot committed"
if git remote get-url origin >/dev/null 2>&1; then
  git push -q origin HEAD && echo "$(date '+%F %T') pushed"
fi
