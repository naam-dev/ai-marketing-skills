#!/usr/bin/env python3
"""
Send a proactive WhatsApp message via the Meta Cloud API.

Two modes, because WhatsApp has a 24-hour rule:
  - Inside the 24h window after a user messaged you  -> free-form text is allowed.
  - Outside it (cold / first contact)                -> you MUST use an approved
    message template.

Usage:
    # Free-form (only works inside the 24h customer-service window)
    python3 send_message.py --to COUNTRYCODE-NUMBER --text "Thanks for reaching out!"

    # Approved template (works any time; required for first contact)
    python3 send_message.py --to COUNTRYCODE-NUMBER --template hello_world --lang en_US
"""

import argparse
import os

import requests

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

TOKEN = os.environ["WHATSAPP_TOKEN"]
PHONE_NUMBER_ID = os.environ["WHATSAPP_PHONE_NUMBER_ID"]
GRAPH_VERSION = os.environ.get("WHATSAPP_GRAPH_VERSION", "v21.0")
URL = f"https://graph.facebook.com/{GRAPH_VERSION}/{PHONE_NUMBER_ID}/messages"


def main() -> None:
    ap = argparse.ArgumentParser(description="Send a WhatsApp message")
    ap.add_argument("--to", required=True, help="Recipient phone in international format, no +")
    ap.add_argument("--text", help="Free-form text body (24h window only)")
    ap.add_argument("--template", help="Approved template name (for cold contact)")
    ap.add_argument("--lang", default="en_US", help="Template language code")
    args = ap.parse_args()

    if args.template:
        payload = {
            "messaging_product": "whatsapp",
            "to": args.to,
            "type": "template",
            "template": {"name": args.template, "language": {"code": args.lang}},
        }
    elif args.text:
        payload = {
            "messaging_product": "whatsapp",
            "to": args.to,
            "type": "text",
            "text": {"body": args.text},
        }
    else:
        ap.error("provide either --text or --template")

    resp = requests.post(
        URL,
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
        json=payload,
        timeout=30,
    )
    print(resp.status_code, resp.text)
    resp.raise_for_status()


if __name__ == "__main__":
    main()
