---
name: whatsapp-claude
description: Connect WhatsApp to Claude so an AI agent answers inbound WhatsApp messages automatically. Stands up a webhook server that receives WhatsApp messages, replies with Claude, and keeps per-contact conversation history. Use when asked to put Claude (or "AI"/"a chatbot") on WhatsApp, build a WhatsApp bot/agent/concierge, automate WhatsApp lead replies or customer support, or integrate the WhatsApp Business API with the Anthropic API. Supports the Meta WhatsApp Cloud API (production) and the Twilio sandbox (fastest test).
---


## Preamble (runs on skill start)

```bash
# Version check (silent if up to date)
python3 telemetry/version_check.py 2>/dev/null || true

# Telemetry opt-in (first run only, then remembers your choice)
python3 telemetry/telemetry_init.py 2>/dev/null || true
```

> **Privacy:** This skill logs usage locally to `~/.ai-marketing-skills/analytics/`. Remote telemetry is opt-in only. No code, file paths, message content, or phone numbers are ever collected. See `telemetry/README.md`.

---

# WhatsApp ↔ Claude

Put Claude on WhatsApp: incoming messages hit a webhook, Claude answers, and the
reply goes back to the user — with per-contact memory across the conversation.

## Startup: Pick the path

Ask the user **one** question:

> Do you want the fastest test (Twilio sandbox — working in ~2 minutes, no Meta
> verification) or your own production WhatsApp Business number (Meta Cloud API)?

- **Just testing / a demo →** Twilio sandbox path (`scripts/twilio_whatsapp_bot.py`).
- **Real number / going live →** Meta WhatsApp Cloud API path (`scripts/whatsapp_claude_bot.py`).

Both reuse the same Claude wiring; only the WhatsApp side differs.

## What you need

| | Twilio sandbox | Meta Cloud API |
|---|---|---|
| Anthropic API key | ✅ | ✅ |
| WhatsApp Business / Meta app | — | ✅ (free tier) |
| Time to first reply | ~2 min | ~20–30 min |
| Own phone number | uses Twilio's shared sandbox | ✅ your number |
| Cold/outbound messages | sandbox only | needs an approved template |

## Build steps

1. `pip install -r requirements.txt`
2. `cp .env.example .env` and fill in the keys for the chosen path (see `README.md`).
3. Run the server:
   - Twilio: `uvicorn twilio_whatsapp_bot:app --port 8000` (from `scripts/`)
   - Meta: `uvicorn whatsapp_claude_bot:app --port 8000` (from `scripts/`)
4. Expose it publicly: `ngrok http 8000`.
5. Register the public URL as the webhook (Twilio sandbox config, or Meta App
   dashboard — full walkthrough in `README.md`).
6. Message the number from your phone and confirm Claude answers.

## Customize the agent

- **Persona / rules:** set `CLAUDE_SYSTEM_PROMPT` (e.g. a lead-qualifying concierge
  for the user's business). This is the main lever — make it specific.
- **Model:** `CLAUDE_MODEL` (default `claude-opus-4-8`).
- **Reply length:** `CLAUDE_MAX_TOKENS` (default 1024; WhatsApp replies are short).
- **Deeper reasoning:** `CLAUDE_THINKING=on` (Meta path) for adaptive thinking on
  hard questions — adds latency, so leave off for snappy chat.
- **Memory window:** `HISTORY_TURNS` (default 20). History is in-memory; swap for
  Redis/Postgres before production so it survives restarts.

## Proactive / outbound messages

`scripts/send_message.py` sends a message to a user. Note WhatsApp's 24-hour rule:
free-form text only works within 24h of the user's last message; first/cold contact
**must** use a pre-approved template (`--template`).

## Going to production (checklist)

- Move conversation history to a real store (Redis/Postgres) keyed by phone number.
- Keep `WHATSAPP_APP_SECRET` set so inbound webhook signatures are verified.
- Add rate limiting and an opt-out keyword ("STOP") handler.
- Log conversations to your CRM if you want the marketing/sales value.
- Comply with WhatsApp Business messaging policy and local consent rules.
