#!/usr/bin/env bash
# setup-server.sh: install the AI Command Center on a server that already runs
# Claude Code, kept separate from your main vault.
#
#   sudo bash ai-command-center/scripts/setup-server.sh            # fresh install
#   sudo bash ai-command-center/scripts/setup-server.sh --update   # refresh scripts only
#
# Options:
#   --target DIR   where it lives            (default /srv/ai-command-center)
#   --user NAME    unix user the team runs as (default acc; created if missing)
#   --vault DIR    your main vault, kept off-limits (default /srv/brain)
#   --no-cron      don't install the clocks yet
#   --update       copy new scripts/hooks/skills into an existing install; never
#                  touches company/, shared/, team/ or board/
#   --yes          don't ask before installing Claude Code / copying login
#
# Why a separate unix user: the employees run with permission prompts off (the
# fence hook is the gate). Running them as their own user means the operating
# system also keeps them out of your vault and your root account.
set -euo pipefail

TARGET=/srv/ai-command-center
RUN_USER=acc
VAULT=/srv/brain
CRON=1
UPDATE=0
YES=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    --user)   RUN_USER="$2"; shift 2 ;;
    --vault)  VAULT="$2"; shift 2 ;;
    --no-cron) CRON=0; shift ;;
    --update) UPDATE=1; shift ;;
    --yes|-y) YES=1; shift ;;
    -h|--help) sed -n '2,22p' "$0"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
say()  { printf '\n\033[1m== %s\033[0m\n' "$*"; }
ok()   { printf '   ok  %s\n' "$*"; }
warn() { printf '   !!  %s\n' "$*"; }
ask()  { [[ $YES == 1 ]] && return 0; read -r -p "   ?   $* [y/N] " r; [[ "$r" =~ ^[Yy] ]]; }
as_user() { sudo -u "$RUN_USER" -H bash -lc "export PATH=\"\$HOME/.local/bin:/usr/local/bin:\$PATH\"; if [[ -d '$TARGET' ]]; then cd '$TARGET' || exit 1; fi; $*"; }

[[ $EUID -eq 0 ]] || { echo "run with sudo (needs to create the '$RUN_USER' user and $TARGET)"; exit 1; }
[[ -f "$SRC/scripts/acc" && -f "$SRC/CLAUDE.md" ]] || { echo "run this from the ai-command-center template folder"; exit 1; }

TARGET="$(realpath -m "$TARGET")"
VAULT="$(realpath -m "$VAULT")"
say "AI Command Center -> $TARGET (runs as '$RUN_USER', vault $VAULT kept separate)"

# --- 1. keep away from the vault --------------------------------------------
case "$TARGET/" in
  "$VAULT/"*) echo "refusing: $TARGET is inside your vault $VAULT. Pick another --target."; exit 1 ;;
esac
case "$VAULT/" in
  "$TARGET/"*) echo "refusing: your vault $VAULT would sit inside $TARGET."; exit 1 ;;
esac
ok "target is outside the vault"

# --- 2. packages -------------------------------------------------------------
missing=()
need=(python3 git flock timeout sudo)
[[ $CRON == 1 ]] && need+=(crontab)
for bin in "${need[@]}"; do command -v "$bin" >/dev/null || missing+=("$bin"); done
if (( ${#missing[@]} )); then
  warn "missing: ${missing[*]}"
  if command -v apt-get >/dev/null && ask "install them with apt (python3 git util-linux coreutils cron sudo)?"; then
    apt-get update -qq && apt-get install -y -qq python3 git util-linux coreutils cron sudo
    systemctl enable --now cron >/dev/null 2>&1 || true
  else
    echo "install those, then re-run"; exit 1
  fi
fi
ok "${need[*]} present"

# --- 3. the team's own unix user --------------------------------------------
if ! id "$RUN_USER" >/dev/null 2>&1; then
  useradd -m -s /bin/bash "$RUN_USER"
  ok "created user $RUN_USER"
else
  ok "user $RUN_USER exists"
fi
RUN_HOME="$(getent passwd "$RUN_USER" | cut -d: -f6)"

# --- 4. files ----------------------------------------------------------------
copy_code() {
  mkdir -p "$TARGET/scripts" "$TARGET/.claude/skills"
  cp -a "$SRC/scripts/." "$TARGET/scripts/"
  rm -rf "$TARGET"/scripts/__pycache__
  cp -a "$SRC/.claude/settings.json" "$TARGET/.claude/settings.json"
  cp -a "$SRC/.claude/skills/." "$TARGET/.claude/skills/"
  cp -a "$SRC/.gitignore" "$SRC/README.md" "$TARGET/" 2>/dev/null || true
}
if [[ -e "$TARGET/company/roster.md" ]]; then
  if [[ $UPDATE == 1 ]]; then
    copy_code
    ok "updated scripts, hooks and skills (your team, company files and board untouched)"
  else
    echo "$TARGET already has a command center. Use --update to refresh scripts only."; exit 1
  fi
else
  mkdir -p "$TARGET"
  cp -a "$SRC/." "$TARGET/"
  rm -rf "$TARGET/logs" "$TARGET/tests" "$TARGET"/scripts/__pycache__ && mkdir -p "$TARGET/logs"
  [[ -f "$TARGET/.env" ]] || cp "$TARGET/.env.example" "$TARGET/.env"
  ok "copied template into $TARGET"
fi
sed -i "s#^ACC_VAULT_PATH=.*#ACC_VAULT_PATH=$VAULT#" "$TARGET/.env" 2>/dev/null || true
chmod +x "$TARGET"/scripts/*
chown -R "$RUN_USER:$RUN_USER" "$TARGET"
chmod 750 "$TARGET"
chmod 600 "$TARGET/.env"
ok "owned by $RUN_USER, closed to other users"

# --- 5. the vault stays out of reach -----------------------------------------
if [[ -d "$VAULT" ]]; then
  if sudo -u "$RUN_USER" test -w "$VAULT"; then
    warn "$RUN_USER can write to $VAULT. The fence still blocks it, but you can lock it at OS level:"
    warn "  chmod o-rwx $VAULT   (if the vault is owned by another user)"
  elif sudo -u "$RUN_USER" test -r "$VAULT"; then
    ok "$RUN_USER can read but not write $VAULT; the fence also blocks reads by employees"
  else
    ok "$RUN_USER cannot read or write $VAULT"
  fi
else
  ok "no vault found at $VAULT (pass --vault if it lives elsewhere)"
fi

# --- 6. Claude Code for the team user ----------------------------------------
if as_user 'command -v claude' >/dev/null 2>&1; then
  ok "claude available to $RUN_USER ($(as_user 'claude --version' 2>/dev/null | head -1))"
else
  warn "claude isn't on $RUN_USER's PATH (yours may be installed under /root)"
  if ask "install Claude Code for $RUN_USER with the official installer?"; then
    as_user 'curl -fsSL https://claude.ai/install.sh | bash'
  else
    echo "install it for $RUN_USER, then re-run with --update"; exit 1
  fi
fi

# cron and sudo don't load login PATHs, so remember exactly where claude is.
CLAUDE_BIN="$(as_user 'command -v claude')"
if grep -q '^CLAUDE_BIN=' "$TARGET/.env"; then
  sed -i "s#^CLAUDE_BIN=.*#CLAUDE_BIN=$CLAUDE_BIN#" "$TARGET/.env"
else
  echo "CLAUDE_BIN=$CLAUDE_BIN" >> "$TARGET/.env"
fi
ok "shifts will run $CLAUDE_BIN"

# Login: reuse yours if you like, or log in fresh as the team user.
if [[ -f "$RUN_HOME/.claude/.credentials.json" ]] || [[ -n "$(grep -s '^ANTHROPIC_API_KEY=.\+' "$TARGET/.env")" ]]; then
  ok "$RUN_USER has Claude credentials"
else
  src_cred=""
  [[ -n "${SUDO_USER:-}" ]] && src_cred="$(getent passwd "$SUDO_USER" | cut -d: -f6)/.claude/.credentials.json"
  [[ -f "$src_cred" ]] || src_cred="/root/.claude/.credentials.json"
  if [[ -f "$src_cred" ]] && ask "copy your existing Claude login ($src_cred) to $RUN_USER?"; then
    install -d -o "$RUN_USER" -g "$RUN_USER" -m 700 "$RUN_HOME/.claude"
    install -o "$RUN_USER" -g "$RUN_USER" -m 600 "$src_cred" "$RUN_HOME/.claude/.credentials.json"
    ok "login copied"
  else
    warn "log the team in once:  sudo -u $RUN_USER -i claude   then type /login"
    warn "(or put ANTHROPIC_API_KEY=... in $TARGET/.env)"
  fi
fi

sudo -u "$RUN_USER" test -x "$TARGET" || { echo "$RUN_USER cannot enter $TARGET (check the parent folders' permissions)"; exit 1; }

# --- 7. history --------------------------------------------------------------
if [[ ! -d "$TARGET/.git" ]]; then
  as_user "git init -q && git config user.name 'AI Command Center' && git config user.email 'acc@localhost' && git add -A && git commit -q -m 'AI Command Center: day one'"
  ok "git history started (nightly snapshots via scripts/sync.sh)"
fi

# --- 8. clocks ---------------------------------------------------------------
if [[ $CRON == 1 ]]; then
  as_user "ACC_VAULT_PATH='$VAULT' python3 scripts/acc clocks install"
else
  ok "clocks skipped (--no-cron); install later: sudo -u $RUN_USER $TARGET/scripts/acc clocks install"
fi

# --- 9. check ----------------------------------------------------------------
say "Health check"
as_user "ACC_VAULT_PATH='$VAULT' python3 scripts/acc doctor" || true

tz="$(cat /etc/timezone 2>/dev/null || timedatectl show -p Timezone --value 2>/dev/null || date +%Z)"
say "Done. Next steps"
cat <<EOF
   Server timezone is $tz; the clocks use it. For UK time:  sudo timedatectl set-timezone Europe/London

   1. Fill in the company folder (5 minutes, it shapes everything):
        sudo -u $RUN_USER -i
        cd $TARGET && nano company/about-you.md company/brand-voice.md
   2. Open Claude once as the team, in the command center:
        sudo -u $RUN_USER -i bash -c 'cd $TARGET && claude'
        - accept "trust this folder" (shifts refuse to start until you do,
          because that's what loads the fence)
        - type /login if it asks, then /mcp to see which connectors it has
   3. First shift, by hand:
        sudo -u $RUN_USER $TARGET/scripts/wake.sh quill "Introduce yourself and list your inbox."
        less $TARGET/logs/quill/\$(date +%F).log
   4. Notion dashboard (optional):
        - create an internal integration at https://www.notion.so/my-integrations
        - put its secret in $TARGET/.env as NOTION_TOKEN=...
        - make a Notion page "AI Command Center", share it with the integration
          (page menu > Connections), copy its link, then:
        sudo -u $RUN_USER $TARGET/scripts/acc notion setup --parent '<page link>'
   5. Run the team from anywhere (phone, claude.ai/code):
        sudo -u $RUN_USER -i
        cd $TARGET && tmux new -s hq
        claude remote-control
        then: /review to approve cards, /hire to add an employee

   Shifts start read-and-draft only. Gmail/Calendar/Drive are off until you
   uncomment them in team/<name>/tools.txt after watching a few runs.
EOF
