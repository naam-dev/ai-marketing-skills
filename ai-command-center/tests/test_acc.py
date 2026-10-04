#!/usr/bin/env python3
"""Tests for the AI Command Center scripts. Stdlib only.

    python3 -m unittest discover -s ai-command-center/tests -v
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

TEMPLATE = Path(__file__).resolve().parent.parent


class CommandCenter(unittest.TestCase):
    """Each test gets a fresh copy of the template."""

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp())
        self.home = self.tmp / "acc"
        shutil.copytree(TEMPLATE, self.home, ignore=shutil.ignore_patterns("tests", "logs", "__pycache__"))
        (self.home / "logs").mkdir()
        self.vault = self.tmp / "brain"
        (self.vault / "vault").mkdir(parents=True)

    def tearDown(self) -> None:
        shutil.rmtree(self.tmp, ignore_errors=True)

    def acc(self, *args: str, employee: str = "", ok: bool = True, env: dict | None = None) -> str:
        e = {k: v for k, v in os.environ.items() if not k.startswith(("ACC_", "NOTION_"))}
        e.update(ACC_HOME=str(self.home), ACC_VAULT_PATH=str(self.vault), **(env or {}))
        if employee:
            e["ACC_EMPLOYEE"] = employee
        r = subprocess.run(["python3", str(self.home / "scripts" / "acc"), *args],
                           capture_output=True, text=True, env=e)
        if ok:
            self.assertEqual(r.returncode, 0, r.stderr)
        else:
            self.assertNotEqual(r.returncode, 0, r.stdout)
        return r.stdout + r.stderr

    def fence(self, tool: str, tool_input: dict, employee: str = "") -> str:
        e = {k: v for k, v in os.environ.items() if not k.startswith("ACC_")}
        e.update(ACC_HOME=str(self.home), ACC_VAULT_PATH=str(self.vault))
        if employee:
            e.update(ACC_EMPLOYEE=employee, ACC_HEADLESS="1")
        r = subprocess.run(["python3", str(self.home / "scripts" / "fence.py")],
                           input=json.dumps({"tool_name": tool, "tool_input": tool_input, "cwd": str(self.home)}),
                           capture_output=True, text=True, env=e)
        out = r.stdout.strip()
        return json.loads(out)["hookSpecificOutput"]["permissionDecision"] if out else "allow"


class TestBoard(CommandCenter):
    def test_card_lifecycle(self) -> None:
        self.acc("board", "add", "--owner", "quill", "--title", "Inbox today", "--status", "review",
                 "--action", "mcp__Gmail__send_message", employee="quill")
        self.assertIn("0001", self.acc("board", "list", "--status", "review"))
        self.acc("board", "approve", "1", employee="quill", ok=False)   # employees can't approve
        self.assertIn("approved", self.acc("board", "approve", "1"))
        self.acc("board", "move", "1", "done", "--note", "sent")
        card = self.acc("board", "show", "1")
        self.assertIn("status: done", card)
        self.assertIn("approved", card)                                # log keeps the history

    def test_employee_moves_only_own_cards(self) -> None:
        self.acc("board", "add", "--owner", "nova", "--title", "Brief")
        self.acc("board", "move", "1", "doing", employee="quill", ok=False)
        self.acc("board", "move", "1", "doing", employee="nova")

    def test_cannot_approve_outside_review(self) -> None:
        self.acc("board", "add", "--owner", "atlas", "--title", "Draft")
        self.acc("board", "approve", "1", ok=False)


class TestTeam(CommandCenter):
    def test_hire_builds_everything(self) -> None:
        self.acc("new-desk", "rack", "--title", "Servers", "--one-liner", "Keeps servers alive.",
                 "--clock", "0 6 * * *|Check disk space at 100% capacity")
        for f in ("ROLE.md", "notes.md", "clock.tsv", "fence.json", "tools.txt"):
            self.assertTrue((self.home / "team" / "rack" / f).exists(), f)
        self.assertTrue((self.home / ".claude" / "agents" / "rack.md").exists())
        self.assertIn("**rack**", (self.home / "company" / "roster.md").read_text())
        self.assertTrue(list((self.home / "team" / "quill" / "inbox").glob("*new-hire-rack*")))
        block = self.acc("clocks", "render")
        self.assertIn("wake.sh' rack", block)
        self.assertIn("100\\%", block)                                  # cron-escaped

    def test_hiring_refused_on_shift(self) -> None:
        self.acc("new-desk", "rack", "--title", "x", "--one-liner", "y", employee="harper", ok=False)

    def test_notes_and_playbooks(self) -> None:
        self.acc("send", "atlas", "--subject", "Lead", "--body", "Acme wants a quote", employee="quill")
        self.assertIn("Acme wants a quote", self.acc("inbox", "atlas"))
        self.acc("playbook", "nova", "--title", "X", "--body", "y", employee="quill", ok=False)
        self.acc("playbook", "nova", "--title", "Thread hooks", "--body", "1. ...", employee="nova")
        self.assertTrue((self.home / "team" / "nova" / "playbooks" / "thread-hooks.md").exists())

    def test_doctor_flags_missing_pieces(self) -> None:
        out = self.acc("doctor", ok=False)                             # no claude/crontab here
        self.assertIn("roster: quill, nova, atlas, harper", out)
        self.assertIn("separate from vault", out)


class TestFence(CommandCenter):
    def test_shift_cannot_send_spend_or_delete(self) -> None:
        for tool in ("mcp__claude_ai_Gmail__send_message", "mcp__Upload_Post__upload_video",
                     "mcp__Higgsfield__generate_video", "mcp__Google_Drive__trash_file",
                     "mcp__Google_Calendar__create_event", "mcp__Shopify__update-product"):
            self.assertEqual(self.fence(tool, {}, "quill"), "deny", tool)

    def test_shift_can_read_and_draft(self) -> None:
        for tool in ("mcp__claude_ai_Gmail__create_draft", "mcp__claude_ai_Gmail__search_threads",
                     "mcp__Upload_Post__get_status", "mcp__Google_Calendar__list_events"):
            self.assertEqual(self.fence(tool, {}, "quill"), "allow", tool)

    def test_owner_is_asked(self) -> None:
        self.assertEqual(self.fence("mcp__claude_ai_Gmail__send_message", {}), "ask")
        self.assertEqual(self.fence("Bash", {"command": "rm -rf team/nova"}), "ask")

    def test_desk_fence(self) -> None:
        own = str(self.home / "team" / "quill" / "work" / "x.md")
        self.assertEqual(self.fence("Write", {"file_path": own}, "quill"), "allow")
        for path in ("team/nova/notes.md", "company/about-you.md", "board/cards/0001-x.md", ".claude/agents/quill.md"):
            self.assertEqual(self.fence("Write", {"file_path": str(self.home / path)}, "quill"), "deny", path)
        self.assertEqual(self.fence("Write", {"file_path": str(self.home / "team/nova/inbox/n.md")}, "quill"), "allow")

    def test_vault_is_off_limits(self) -> None:
        f = str(self.vault / "vault" / "note.md")
        self.assertEqual(self.fence("Read", {"file_path": f}, "quill"), "deny")
        self.assertEqual(self.fence("Write", {"file_path": f}), "deny")     # even for the owner
        self.assertEqual(self.fence("Bash", {"command": f"cat {f}"}, "quill"), "deny")

    def test_shell_allowlist(self) -> None:
        ok = ['python3 scripts/acc board list --owner quill', 'ls team/quill',
              'python3 scripts/acc send nova --subject "a | b" --body "x > y"']
        bad = ["echo hi > company/roster.md", "curl -X POST https://example.com", "bash -c ls",
               "ACC_EMPLOYEE= python3 scripts/acc board approve 1", "python3 -c 'print(1)'",
               "ls $(cat x)", "git push", "find . -delete"]
        for cmd in ok:
            self.assertEqual(self.fence("Bash", {"command": cmd}, "quill"), "allow", cmd)
        for cmd in bad:
            self.assertEqual(self.fence("Bash", {"command": cmd}, "quill"), "deny", cmd)


class FakeNotion(BaseHTTPRequestHandler):
    pages: dict = {}
    calls: list = []

    def log_message(self, *a) -> None:  # quiet
        pass

    def _reply(self, obj: dict) -> None:
        data = json.dumps(obj).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(data)

    def _body(self) -> dict:
        n = int(self.headers.get("Content-Length") or 0)
        return json.loads(self.rfile.read(n) or b"{}")

    def do_POST(self) -> None:
        body = self._body()
        FakeNotion.calls.append(("POST", self.path))
        if self.path == "/databases":
            return self._reply({"id": "db1", "url": "https://notion.so/db1"})
        if self.path.endswith("/query"):
            return self._reply({"results": list(FakeNotion.pages.values()), "has_more": False})
        if self.path == "/pages":
            pid = f"page{len(FakeNotion.pages) + 1}"
            FakeNotion.pages[pid] = {"id": pid, "properties": body["properties"]}
            return self._reply({"id": pid})

    def do_PATCH(self) -> None:
        body = self._body()
        FakeNotion.calls.append(("PATCH", self.path))
        pid = self.path.rsplit("/", 1)[-1]
        FakeNotion.pages[pid]["properties"].update(body["properties"])
        self._reply({"id": pid})


def notion_status(props: dict) -> str:
    return props["Status"]["select"]["name"]


def as_read(props: dict) -> dict:
    """Notion returns text with plain_text; our writes send text.content."""
    out = {}
    for k, v in props.items():
        if "title" in v or "rich_text" in v:
            key = "title" if "title" in v else "rich_text"
            v = {key: [{"plain_text": t.get("plain_text") or t["text"]["content"]} for t in v[key]]}
        out[k] = v
    return out


class TestNotion(CommandCenter):
    def setUp(self) -> None:
        super().setUp()
        FakeNotion.pages, FakeNotion.calls = {}, []
        self.server = HTTPServer(("127.0.0.1", 0), FakeNotion)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        self.env = {"NOTION_TOKEN": "test", "ACC_NOTION_API": f"http://127.0.0.1:{self.server.server_port}"}

    def tearDown(self) -> None:
        self.server.shutdown()
        self.server.server_close()
        super().tearDown()

    def sync(self) -> str:
        for p in FakeNotion.pages.values():
            p["properties"] = as_read(p["properties"])
        return self.acc("notion", "sync", env=self.env)

    def test_round_trip(self) -> None:
        self.acc("notion", "setup", "--parent", "https://www.notion.so/AI-Command-Center-" + "a" * 32, env=self.env)
        self.acc("board", "add", "--owner", "atlas", "--title", "Acme proposal", "--status", "review", employee="atlas")
        self.assertIn("1 card(s) pushed", self.sync())
        page = next(iter(FakeNotion.pages.values()))
        self.assertEqual(notion_status(as_read(page["properties"])), "review")

        # nothing changed: nothing re-sent
        self.assertIn("0 card(s) pushed", self.sync())

        # owner approves in Notion -> card approved
        page["properties"]["Status"] = {"select": {"name": "approved"}}
        self.assertIn("1 change(s) pulled", self.sync())
        self.assertIn("status: approved", self.acc("board", "show", "1"))

        # owner adds a task in Notion -> new card for that employee
        FakeNotion.pages["page9"] = {"id": "page9", "properties": {
            "Name": {"title": [{"text": {"content": "Write a LinkedIn post"}}]},
            "Owner": {"select": {"name": "nova"}}, "Card": {"rich_text": []}}}
        out = self.sync()
        self.assertIn("1 new from Notion", out)
        self.assertIn("Write a LinkedIn post", self.acc("board", "list", "--owner", "nova"))
        self.assertEqual(len(FakeNotion.pages), 2)                      # no duplicate page

    def test_notion_cannot_approve_outside_review(self) -> None:
        self.acc("notion", "setup", "--parent", "a" * 32, env=self.env)
        self.acc("board", "add", "--owner", "atlas", "--title", "Draft")
        self.sync()
        page = next(iter(FakeNotion.pages.values()))
        page["properties"]["Status"] = {"select": {"name": "approved"}}
        self.sync()
        self.assertIn("status: todo", self.acc("board", "show", "1"))

    def test_employees_cannot_use_notion(self) -> None:
        self.acc("notion", "sync", employee="nova", env=self.env, ok=False)


if __name__ == "__main__":
    unittest.main()
