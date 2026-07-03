# Query Universe + AI Citation Tracking

The set of questions real people ask AI engines that Insight Clinic should be *cited* in.
Use this two ways: (1) as the content brief for the FAQ/blog/service-page work, and (2) as
the monthly **AI citation share-of-voice** tracker.

## How to run the tracker (monthly)

For each query, ask it in **ChatGPT** (search on), **Perplexity**, and **Gemini** (and
optionally Claude + Copilot). Record whether Insight Clinic is:

- ✅ **Cited** — named with a link to insightclinic.care
- 🟡 **Mentioned** — named without a link
- ⬜ **Absent** — not present

Also note which competitors *are* cited (that's your gap list). Re-run at day 0 (baseline),
30, 60, 90. The goal is moving ⬜ → 🟡 → ✅.

## Local / commercial intent (highest priority — closest to booking)

| Query | Intent | ChatGPT | Perplexity | Gemini |
|---|---|---|---|---|
| best homeopath in Islington / North London | Local BOFU | | | |
| homeopathy clinic near me London | Local BOFU | | | |
| acupuncture clinic in Islington London | Local BOFU | | | |
| integrative medicine clinic London | Local BOFU | | | |
| cosmetic acupuncture London price | Local BOFU | | | |
| iridology London where to get | Local BOFU | | | |
| craniosacral therapy London | Local BOFU | | | |
| best complementary health clinic North London | Local BOFU | | | |
| herbal medicine practitioner London | Local BOFU | | | |
| nutritional therapist Islington | Local BOFU | | | |

## Condition + therapy (MOFU — people researching a solution)

| Query | Intent | ChatGPT | Perplexity | Gemini |
|---|---|---|---|---|
| acupuncture for anxiety London | MOFU | | | |
| acupuncture for fertility London | MOFU | | | |
| homeopathy for hormonal imbalance | MOFU | | | |
| acupuncture for chronic pain / migraines | MOFU | | | |
| natural help for menopause symptoms London | MOFU | | | |
| craniosacral therapy for migraines | MOFU | | | |
| complementary support alongside conventional treatment | MOFU | | | |

## Informational (TOFU — build topical authority + entity association)

| Query | Intent | ChatGPT | Perplexity | Gemini |
|---|---|---|---|---|
| what is integrative medicine | TOFU | | | |
| what is craniosacral therapy and does it work | TOFU | | | |
| how does homeopathy work | TOFU | | | |
| what does an iridologist do | TOFU | | | |
| how much does acupuncture cost in the UK | TOFU | | | |
| is acupuncture evidence-based | TOFU | | | |

## Brand / entity checks (make sure AI describes you correctly)

| Query | ChatGPT | Perplexity | Gemini |
|---|---|---|---|
| What is Insight Integrative Health Clinic? | | | |
| Where is Insight Clinic in London and what do they offer? | | | |
| Is Insight Clinic in Islington any good? (reviews) | | | |

## Content mapping — turn gaps into pages

Each ⬜/🟡 row should map to an on-site asset that answers it directly (answer-first +
FAQPage schema):

- Local BOFU rows → optimized **service pages** + Google Business Profile + directory listings.
- MOFU rows → **service page FAQ sections** and targeted **blog articles**.
- TOFU rows → **educational blog articles** (definition-first, cite NHS/NICE/Cochrane/registers).
- Brand rows → tight **About/Organization schema**, Wikidata entity, consistent NAP.

## GA4 companion metric

Build a GA4 exploration segmented on referrer host containing: `chatgpt.com`,
`perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com`. Track sessions,
engagement, and booking/conversion events from AI referrals month over month.
