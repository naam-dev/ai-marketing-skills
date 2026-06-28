# WhatsApp ↔ Claude

Put **Claude on WhatsApp** — incoming WhatsApp messages are answered automatically
by Claude, with per-contact conversation memory. Two paths:

- **Twilio sandbox** — working in ~2 minutes, no Meta verification. Best for a demo.
- **Meta WhatsApp Cloud API** — your own WhatsApp Business number, free tier, no
  per-message third-party markup. Best for production.

Both share the same Claude wiring (Anthropic Python SDK, `claude-opus-4-8`).

```
whatsapp-claude/
├── SKILL.md
├── README.md
├── requirements.txt
├── .env.example
└── scripts/
    ├── whatsapp_claude_bot.py   # Meta WhatsApp Cloud API webhook (production)
    ├── twilio_whatsapp_bot.py   # Twilio sandbox webhook (fastest test)
    └── send_message.py          # send a proactive message (Meta)
```

---

## How it works

```
WhatsApp user ──▶ Meta/Twilio ──▶ your webhook (FastAPI) ──▶ Claude API
      ▲                                     │
      └──────────── reply ◀─────────────────┘
```

1. A user messages your WhatsApp number.
2. Meta/Twilio POSTs the message to your `/webhook` endpoint.
3. The server appends it to that user's history and calls the Claude Messages API.
4. Claude's reply is sent back to the user over WhatsApp.

---

## Quick start

```bash
cd whatsapp-claude
pip install -r requirements.txt
cp .env.example .env          # add your keys
cd scripts
```

You need a publicly reachable URL for the webhook. The easiest is
[ngrok](https://ngrok.com): `ngrok http 8000` gives you an `https://…ngrok.app` URL.

---

## Path A — Twilio sandbox (fastest test)

1. Create a free [Twilio](https://www.twilio.com/try-twilio) account.
2. Console → **Messaging → Try it out → Send a WhatsApp message**. You'll see a
   sandbox number and a join code like `join blue-cat`.
3. From your phone, send that join code to the sandbox number on WhatsApp.
4. Put your `ANTHROPIC_API_KEY` in `.env`, then run:
   ```bash
   uvicorn twilio_whatsapp_bot:app --host 0.0.0.0 --port 8000
   ngrok http 8000        # in another terminal
   ```
5. In the Twilio sandbox settings, set **"When a message comes in"** to
   `https://<your-ngrok>.ngrok.app/whatsapp` (HTTP **POST**).
6. Message the sandbox number — Claude replies.

That's the whole loop. No Meta account, no number approval.

---

## Path B — Meta WhatsApp Cloud API (production)

1. Create a Meta app at [developers.facebook.com](https://developers.facebook.com)
   → **Create App** → add the **WhatsApp** product. Meta gives you a free test
   number to start.
2. From **WhatsApp → API Setup**, copy:
   - the **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - a temporary **access token** (for testing) → `WHATSAPP_TOKEN`. For production,
     create a **System User** with a permanent token.
3. From **App → Settings → Basic**, copy the **App Secret** → `WHATSAPP_APP_SECRET`
   (used to verify inbound webhook signatures).
4. Choose any string for `WHATSAPP_VERIFY_TOKEN` (you'll paste the same value in
   the next step).
5. Fill in `.env` and run:
   ```bash
   uvicorn whatsapp_claude_bot:app --host 0.0.0.0 --port 8000
   ngrok http 8000
   ```
6. In the Meta dashboard → **WhatsApp → Configuration → Webhook → Edit**:
   - **Callback URL:** `https://<your-ngrok>.ngrok.app/webhook`
   - **Verify token:** the same `WHATSAPP_VERIFY_TOKEN`
   - Click **Verify and save** (Meta hits the `GET /webhook` endpoint).
   - Under **Webhook fields**, subscribe to **messages**.
7. Add your own phone as a recipient on the API Setup page (test numbers can only
   message a short allow-list until the number is reviewed), then message it.

### Sending the first / outbound message

WhatsApp's 24-hour rule: you can send free-form text only within 24h of a user's
last message. For cold/first contact, use an approved template:

```bash
# free-form (only inside the 24h window)
python3 send_message.py --to COUNTRYCODE-NUMBER --text "Thanks — how can I help?"

# template (any time; required for first contact)
python3 send_message.py --to COUNTRYCODE-NUMBER --template hello_world --lang en_US
```

---

## Configuration

All via environment / `.env` (see `.env.example`):

| Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | Claude API key (required) |
| `CLAUDE_MODEL` | `claude-opus-4-8` | Model id |
| `CLAUDE_MAX_TOKENS` | `1024` | Max reply length |
| `CLAUDE_SYSTEM_PROMPT` | generic concierge | **The main lever** — set the persona, rules, and what info to collect |
| `CLAUDE_THINKING` | `off` | `on` enables adaptive thinking (Meta path) for harder questions |
| `HISTORY_TURNS` | `20` | Messages kept per contact |
| `WHATSAPP_TOKEN` | — | Meta access token |
| `WHATSAPP_PHONE_NUMBER_ID` | — | Meta phone number id |
| `WHATSAPP_VERIFY_TOKEN` | — | Webhook verification string |
| `WHATSAPP_APP_SECRET` | — | Enables inbound signature verification (recommended) |

---

## Make it yours (marketing / sales)

The default system prompt is a generic concierge. The real value is a specific one —
for example a lead-qualifier:

```
CLAUDE_SYSTEM_PROMPT="You are the WhatsApp concierge for <Company>. Greet warmly,
answer questions about <product>, and for buying-intent messages collect the
person's name, company, and use case, then offer to book a call at <link>. Keep
replies to one or two sentences, plain text, no markdown."
```

---

## Production notes

- **Persistence:** history is in-memory and resets on restart. Use Redis or
  Postgres keyed by phone number for real deployments.
- **Security:** keep `WHATSAPP_APP_SECRET` set so the Meta path rejects forged
  webhooks. Never commit `.env`.
- **Compliance:** honor an opt-out keyword (e.g. "STOP"), get consent, and follow
  the WhatsApp Business Messaging Policy.
- **Hosting:** any host that runs a Python ASGI app works (Render, Railway, Fly,
  a VM). Replace ngrok with the host's public HTTPS URL in the webhook config.
