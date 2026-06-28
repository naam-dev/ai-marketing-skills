#!/usr/bin/env python3
"""
WhatsApp <-> Claude bot (Meta WhatsApp Cloud API).

Incoming WhatsApp messages hit the /webhook endpoint, get answered by Claude,
and the reply is sent back to the user through the WhatsApp Cloud API.

This is the production path: your own WhatsApp Business number, no per-message
third-party markup. For the fastest local test instead, see twilio_whatsapp_bot.py.

Run:
    pip install -r requirements.txt
    cp .env.example .env   # fill in the values
    uvicorn whatsapp_claude_bot:app --host 0.0.0.0 --port 8000

Then expose port 8000 publicly (e.g. `ngrok http 8000`) and register the
https URL as the webhook callback in the Meta App dashboard.
"""

from __future__ import annotations

import hashlib
import hmac
import os
from collections import defaultdict, deque

import anthropic
import requests
from fastapi import FastAPI, Request, Response

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # python-dotenv is optional
    pass

# --- Configuration (all via environment) -----------------------------------

# Meta WhatsApp Cloud API
WHATSAPP_TOKEN = os.environ["WHATSAPP_TOKEN"]              # permanent/system-user token
PHONE_NUMBER_ID = os.environ["WHATSAPP_PHONE_NUMBER_ID"]  # from the WhatsApp > API setup page
VERIFY_TOKEN = os.environ["WHATSAPP_VERIFY_TOKEN"]        # any string you choose; echoed at setup
APP_SECRET = os.environ.get("WHATSAPP_APP_SECRET")        # optional but recommended (signature check)
GRAPH_VERSION = os.environ.get("WHATSAPP_GRAPH_VERSION", "v21.0")

# Claude
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]  # read automatically by the SDK
MODEL = os.environ.get("CLAUDE_MODEL", "claude-opus-4-8")
MAX_TOKENS = int(os.environ.get("CLAUDE_MAX_TOKENS", "1024"))
SYSTEM_PROMPT = os.environ.get(
    "CLAUDE_SYSTEM_PROMPT",
    "You are a helpful assistant replying over WhatsApp. Keep replies short, "
    "friendly, and conversational — usually one or two sentences. Plain text "
    "only: no markdown, no headers, no bullet symbols.",
)
# Turn on Claude's adaptive thinking for harder questions (adds latency).
USE_THINKING = os.environ.get("CLAUDE_THINKING", "off").lower() == "on"

# How many prior turns to keep per sender (user+assistant counts as 2).
HISTORY_TURNS = int(os.environ.get("HISTORY_TURNS", "20"))

GRAPH_URL = f"https://graph.facebook.com/{GRAPH_VERSION}/{PHONE_NUMBER_ID}/messages"

app = FastAPI(title="WhatsApp ↔ Claude bot")
client = anthropic.Anthropic()

# In-memory conversation history keyed by sender wa_id.
# Swap this for Redis/Postgres in production so it survives restarts.
_history: dict[str, deque] = defaultdict(lambda: deque(maxlen=HISTORY_TURNS))
# Track processed message IDs so Meta retries don't double-answer.
_seen_messages: deque = deque(maxlen=1000)


# --- Webhook verification (GET) --------------------------------------------

@app.get("/webhook")
async def verify(request: Request):
    """Meta calls this once when you register the webhook URL."""
    params = request.query_params
    if (
        params.get("hub.mode") == "subscribe"
        and params.get("hub.verify_token") == VERIFY_TOKEN
    ):
        return Response(content=params.get("hub.challenge", ""), media_type="text/plain")
    return Response(content="verification failed", status_code=403)


# --- Incoming messages (POST) ----------------------------------------------

@app.post("/webhook")
async def incoming(request: Request):
    raw = await request.body()

    if not _valid_signature(request, raw):
        return Response(content="bad signature", status_code=403)

    payload = await request.json()
    for message, sender in _iter_text_messages(payload):
        if message["id"] in _seen_messages:
            continue
        _seen_messages.append(message["id"])

        _mark_read(message["id"])
        reply = _ask_claude(sender, message["text"]["body"])
        _send_text(sender, reply)

    # Always 200 quickly so Meta doesn't retry.
    return Response(content="ok", status_code=200)


# --- Claude ----------------------------------------------------------------

def _ask_claude(sender: str, user_text: str) -> str:
    convo = _history[sender]
    convo.append({"role": "user", "content": user_text})

    kwargs = {
        "model": MODEL,
        "max_tokens": MAX_TOKENS,
        "system": SYSTEM_PROMPT,
        "messages": list(convo),
    }
    if USE_THINKING:
        kwargs["thinking"] = {"type": "adaptive"}

    try:
        response = client.messages.create(**kwargs)
    except anthropic.APIError as exc:
        # Don't poison the history with a failed turn.
        convo.pop()
        return f"Sorry, I hit an error reaching the model ({exc.__class__.__name__}). Please try again."

    reply = "".join(block.text for block in response.content if block.type == "text").strip()
    reply = reply or "Sorry, I didn't catch that — could you rephrase?"
    convo.append({"role": "assistant", "content": reply})
    return reply


# --- WhatsApp Cloud API calls ----------------------------------------------

def _send_text(to: str, body: str) -> None:
    # WhatsApp text bodies cap at 4096 chars.
    payload = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": body[:4096]},
    }
    resp = requests.post(GRAPH_URL, headers=_auth_headers(), json=payload, timeout=30)
    if resp.status_code >= 400:
        print(f"[send] {resp.status_code} {resp.text}")


def _mark_read(message_id: str) -> None:
    payload = {
        "messaging_product": "whatsapp",
        "status": "read",
        "message_id": message_id,
    }
    try:
        requests.post(GRAPH_URL, headers=_auth_headers(), json=payload, timeout=10)
    except requests.RequestException:
        pass  # best-effort


def _auth_headers() -> dict:
    return {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }


# --- Helpers ---------------------------------------------------------------

def _iter_text_messages(payload: dict):
    """Yield (message, sender_wa_id) for each inbound text message."""
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            for message in value.get("messages", []):
                if message.get("type") == "text":
                    yield message, message["from"]


def _valid_signature(request: Request, raw: bytes) -> bool:
    """Verify Meta's X-Hub-Signature-256 header. Skipped if APP_SECRET unset."""
    if not APP_SECRET:
        return True
    received = request.headers.get("X-Hub-Signature-256", "")
    expected = "sha256=" + hmac.new(APP_SECRET.encode(), raw, hashlib.sha256).hexdigest()
    return hmac.compare_digest(received, expected)


@app.get("/")
async def health():
    return {"status": "ok", "model": MODEL}
