#!/usr/bin/env python3
"""
WhatsApp <-> Claude bot (Twilio sandbox) — the fastest way to test.

The Twilio WhatsApp Sandbox gives you a working WhatsApp number in ~2 minutes
with no Meta Business verification. Great for a demo; switch to the Meta Cloud
API path (whatsapp_claude_bot.py) for production with your own number.

Run:
    pip install -r requirements.txt
    cp .env.example .env   # ANTHROPIC_API_KEY is enough for the sandbox
    uvicorn twilio_whatsapp_bot:app --host 0.0.0.0 --port 8000

Then `ngrok http 8000` and set the sandbox's "When a message comes in" webhook
to  https://<your-ngrok>.ngrok.app/whatsapp  (HTTP POST).

Join the sandbox first: send the join code Twilio shows you (e.g. "join blue-cat")
to the sandbox WhatsApp number from your phone.
"""

from __future__ import annotations

import os
from collections import defaultdict, deque

import anthropic
from fastapi import FastAPI, Form, Response

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

MODEL = os.environ.get("CLAUDE_MODEL", "claude-opus-4-8")
MAX_TOKENS = int(os.environ.get("CLAUDE_MAX_TOKENS", "1024"))
SYSTEM_PROMPT = os.environ.get(
    "CLAUDE_SYSTEM_PROMPT",
    "You are a helpful assistant replying over WhatsApp. Keep replies short, "
    "friendly, and conversational. Plain text only.",
)
HISTORY_TURNS = int(os.environ.get("HISTORY_TURNS", "20"))

app = FastAPI(title="WhatsApp ↔ Claude bot (Twilio)")
client = anthropic.Anthropic()
_history: dict[str, deque] = defaultdict(lambda: deque(maxlen=HISTORY_TURNS))


@app.post("/whatsapp")
async def whatsapp(From: str = Form(...), Body: str = Form(...)):
    """Twilio posts the inbound message as form fields. Reply with TwiML."""
    reply = _ask_claude(From, Body)
    twiml = f"<?xml version='1.0' encoding='UTF-8'?><Response><Message>{_xml_escape(reply)}</Message></Response>"
    return Response(content=twiml, media_type="application/xml")


def _ask_claude(sender: str, user_text: str) -> str:
    convo = _history[sender]
    convo.append({"role": "user", "content": user_text})
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            messages=list(convo),
        )
    except anthropic.APIError as exc:
        convo.pop()
        return f"Sorry, I hit an error ({exc.__class__.__name__}). Please try again."

    reply = "".join(b.text for b in response.content if b.type == "text").strip()
    reply = reply or "Sorry, I didn't catch that — could you rephrase?"
    convo.append({"role": "assistant", "content": reply})
    return reply


def _xml_escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


@app.get("/")
async def health():
    return {"status": "ok", "model": MODEL}
