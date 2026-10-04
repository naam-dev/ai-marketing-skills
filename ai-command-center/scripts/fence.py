#!/usr/bin/env python3
"""PreToolUse hook: the fences.

Runs before every tool call in the command center and decides allow / ask /
deny. Rules, in order:

1. Nobody touches the vault (ACC_VAULT_PATH, default /srv/brain) from here.
2. Outward or destructive actions (send, publish, delete, spend, ...) need
   your yes. In your own interactive session that is a normal prompt. For an
   employee on the clock it is a hard deny with instructions to raise a review
   card, unless `acc dispatch` approved exactly that tool for this run.
3. Employees may only write files their fence.json lists, and may only run
   the read-only shell commands and the shared `acc` script.

Stdlib only. Fails closed for employees if anything goes wrong.
"""
from __future__ import annotations

import fnmatch
import json
import os
import re
import shlex
import sys
from datetime import datetime
from pathlib import Path

HOME = Path(os.environ.get("ACC_HOME") or os.environ.get("CLAUDE_PROJECT_DIR")
            or Path(__file__).resolve().parent.parent).resolve()
VAULT = Path(os.environ.get("ACC_VAULT_PATH", "/srv/brain"))

# Verbs in an MCP tool's name that mean "this leaves the company, spends
# money or destroys something". Matched as whole words of the tool part.
GATED_VERBS = {
    "send", "reply", "forward", "publish", "unpublish", "upload", "post",
    "delete", "trash", "remove", "purge", "spam", "archive",
    "pay", "purchase", "charge", "refund", "transfer", "checkout", "order",
    "share", "invite", "comment", "deploy", "merge", "discount", "dm",
    "schedule", "cancel", "fire", "execute", "apply", "restore", "pause",
    # calendar invites/responses reach other people
    "event", "events", "respond",
    # live store / paid generation
    "product", "products", "inventory", "collection", "mutation",
    "generate", "upscale",
}
# MCP tools whose names contain a gated verb but are read-only.
GATED_EXCEPTIONS = re.compile(r"(^|_)(get|list|search|read|show|query|fetch|find|preview|status)(_|$)")

# Shell: always gated (you get asked, employees are refused).
DANGEROUS_SHELL = [
    r"\brm\s", r"\brmdir\b", r"\bshred\b", r"\bmkfs", r"\bdd\s",
    r"git\s+push\b.*(--force|\s-f\b)", r"git\s+reset\s+--hard", r"git\s+clean\b",
    r"\bcurl\b.*(-X\s*(POST|PUT|PATCH|DELETE)|--data|\s-d\s|-F\s|--upload-file)",
    r"\bwget\b.*--post", r"\bssh\b", r"\bscp\b", r"\brsync\b.*:", r"\bsudo\b",
    r"crontab\s+-r", r"\bsendmail\b", r"\bmail\s",
]
# Shell commands an employee may run (first word of every pipeline segment).
EMPLOYEE_SHELL = {
    "ls", "cat", "head", "tail", "wc", "grep", "rg", "date", "pwd", "echo",
    "sort", "uniq", "cut", "tr", "jq", "diff", "basename", "dirname", "stat",
    "file", "python3", "scripts/acc", "./scripts/acc", "git", "find", "tree",
}
EMPLOYEE_PY_OK = ("scripts/acc", "./scripts/acc", str(HOME / "scripts" / "acc"))
EMPLOYEE_GIT_OK = {"status", "diff", "log", "show"}
WRITE_TOOLS = {"Write", "Edit", "MultiEdit", "NotebookEdit"}
READ_TOOLS = {"Read", "Grep", "Glob"}


def decide(decision: str, reason: str) -> None:
    log(decision, reason)
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": decision,
        "permissionDecisionReason": reason,
    }}))
    sys.exit(0)


def log(decision: str, reason: str) -> None:
    try:
        (HOME / "logs").mkdir(exist_ok=True)
        with (HOME / "logs" / "fence.log").open("a") as f:
            f.write(f"{datetime.now():%Y-%m-%d %H:%M:%S} {employee() or 'you'} "
                    f"{TOOL} {decision}: {reason}\n")
    except OSError:
        pass


def roster() -> set[str]:
    f = HOME / "company" / "roster.md"
    if not f.exists():
        return set()
    return {m.group(1) for line in f.read_text().splitlines()
            if (m := re.match(r"^- \*\*([a-z][a-z0-9-]*)\*\*", line))}


def employee() -> str:
    """The employee on the clock, or '' when it's you in your own session."""
    name = os.environ.get("ACC_EMPLOYEE", "").strip()
    if not name:
        # A teammate spun up as a subagent inside your session.
        name = str(EVENT.get("agent_type") or EVENT.get("agent_name") or "").strip()
    return name if name in roster() else ""


def under(path: Path, root: Path) -> bool:
    try:
        path.resolve().relative_to(root.resolve())
        return True
    except (ValueError, OSError):
        return False


def target_path(raw: str) -> Path:
    p = Path(raw).expanduser()
    return p if p.is_absolute() else (Path(EVENT.get("cwd") or HOME) / p)


def gated_mcp(tool: str) -> bool:
    if not tool.startswith("mcp__"):
        return False
    action = tool.split("__", 2)[-1].lower()
    if GATED_EXCEPTIONS.search(action):
        return False
    return bool(set(re.split(r"[^a-z0-9]+", action)) & GATED_VERBS)


def approved_for_this_run(tool: str) -> bool:
    """dispatch passes the card's --action; match it exactly, or by tool name
    when the card gave only the short name (e.g. send_message)."""
    for t in (x.strip() for x in os.environ.get("ACC_APPROVED_TOOLS", "").split(",")):
        if t and (tool == t or ("__" not in t and tool.split("__")[-1] == t)):
            return True
    return False


SHELL_OPS = {"&&", "||", ";", "|", "&", ";;", "|&"}


def employee_shell_ok(cmd: str) -> str | None:
    """Return None if the command is allowed for an employee, else a reason."""
    if "`" in cmd or "$(" in cmd:
        return "command substitution is off-limits"
    lex = shlex.shlex(cmd.replace("\n", " ; "), posix=True, punctuation_chars=True)
    lex.whitespace_split = True
    try:
        tokens = list(lex)
    except ValueError:
        return "could not parse command"
    segments, cur = [], []
    for tok in tokens:
        if tok in SHELL_OPS:
            segments.append(cur)
            cur = []
        elif set(tok) <= set("<>&|;()") and tok:
            return "redirects are off-limits; write files with Write/Edit inside your desk or use `acc`"
        else:
            cur.append(tok)
    segments.append(cur)
    for words in filter(None, segments):
        first = words[0]
        if "=" in first or first not in EMPLOYEE_SHELL:
            return f"`{first}` is not on the employee command list"
        if first == "python3" and (len(words) < 2 or words[1] not in EMPLOYEE_PY_OK):
            return "python3 may only run scripts/acc"
        if first == "git" and (len(words) < 2 or words[1] not in EMPLOYEE_GIT_OK):
            return "git is read-only for employees (status, diff, log, show)"
        if first == "find" and any(w in ("-delete", "-exec", "-execdir", "-ok", "-fprint", "-fls") for w in words):
            return "find may only search"
        for w in words[1:]:
            if not w.startswith("-") and "/" in w and under(target_path(w), VAULT):
                return "the vault is off-limits to the command center"
    return None


def main() -> None:
    tool, inp = TOOL, EVENT.get("tool_input") or {}
    me = employee()
    on_clock = bool(os.environ.get("ACC_HEADLESS")) or bool(me)

    # 1. The vault is a separate world.
    paths = [inp.get(k) for k in ("file_path", "path", "notebook_path") if inp.get(k)]
    if tool in WRITE_TOOLS | READ_TOOLS and any(under(target_path(p), VAULT) for p in paths):
        if tool in WRITE_TOOLS or me:
            decide("deny", f"{VAULT} is your main vault and is kept separate from the command center.")

    # 2. Outward / destructive actions need a yes.
    if gated_mcp(tool):
        if me and approved_for_this_run(tool):
            decide("allow", f"approved on card {os.environ.get('ACC_APPROVED_CARD', '?')}")
        if on_clock:
            decide("deny",
                   f"{tool} needs the owner's yes. Prepare everything, then raise a review card: "
                   f"python3 scripts/acc board add --owner {me or '<you>'} --status review "
                   f"--title \"...\" --body \"<exact recipient/content/amount>\" --action {tool}")
        decide("ask", f"{tool} sends, publishes, spends or deletes. Confirm before it runs.")

    if tool == "Bash":
        cmd = str(inp.get("command", ""))
        if any(re.search(p, cmd) for p in DANGEROUS_SHELL):
            if on_clock:
                decide("deny", "destructive or outbound shell commands need the owner. Raise a review card instead.")
            decide("ask", "destructive or outbound shell command. Confirm before it runs.")
        if re.search(re.escape(str(VAULT)), cmd) and (me or on_clock):
            decide("deny", f"{VAULT} is your main vault and is kept separate from the command center.")
        if me:
            why = employee_shell_ok(cmd)
            if why:
                decide("deny", f"fence: {why}.")
        sys.exit(0)

    # 3. Employees write only inside their fence.
    if me and tool in WRITE_TOOLS:
        try:
            fence = json.loads((HOME / "team" / me / "fence.json").read_text())
            globs = fence.get("write") or []
        except (OSError, ValueError):
            globs = [f"team/{me}/**"]
        for p in paths:
            full = target_path(p)
            if not under(full, HOME):
                decide("deny", f"fence: {me} may only write inside the command center.")
            rel = full.resolve().relative_to(HOME).as_posix()
            if not any(fnmatch.fnmatch(rel, g) for g in globs):
                decide("deny", f"fence: {me} may not write {rel}. Allowed: {', '.join(globs)}. "
                               f"Board changes go through `python3 scripts/acc`.")
    sys.exit(0)


try:
    EVENT = json.load(sys.stdin)
except ValueError:
    EVENT = {}
TOOL = str(EVENT.get("tool_name", ""))

if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:  # noqa: BLE001
        if os.environ.get("ACC_EMPLOYEE") or os.environ.get("ACC_HEADLESS"):
            decide("deny", f"fence error, failing closed: {e}")
        sys.exit(0)
