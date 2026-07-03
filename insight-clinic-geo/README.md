# Insight Clinic — GEO / AI-Search Optimization

**Goal:** Make [insightclinic.care](https://www.insightclinic.care/) the source that AI
answer engines — ChatGPT, Perplexity, Google Gemini, Google AI Overviews, Claude, and
Copilot — *cite* when someone asks about complementary and integrative health in London.

This is a **Generative Engine Optimization (GEO / AEO)** program, not a traditional
"rank on page one" SEO project. AI Overviews now appear on an estimated **30–40% of
Google searches** and answer the question without a click. For local, high-trust health
queries — *"best homeopath in Islington," "acupuncture for anxiety in London," "does
craniosacral therapy help migraines"* — the win condition is being **named inside the AI
answer**, with a link back to the clinic.

> **Business snapshot (from public sources):** Insight Integrative Health Clinic — Islington,
> London N1. 35–40+ years in practice. Services: homeopathy, acupuncture, cosmetic
> acupuncture, iridology, craniosacral / cranial rebalance, herbal medicine, nutritional
> health, and integrative medicine consultations. Also runs a Shopify supplements store
> (`/collections/supplements`). Positive long-term patient reviews.

---

## ⚠️ Read this first — how this document was produced

This session **could not crawl the live site**: the execution environment's network policy
blocks `insightclinic.care` (proxy returned a 403 CONNECT denial — a policy block, *not* the
site rejecting us), and the Shopify connector token was expired. So the findings below are
built from **search-visible data + Shopify-platform knowledge + current (2026) GEO best
practices**, and every diagnostic gap is marked **`[VERIFY]`**.

The [Live-Site Verification Checklist](#-live-site-verification-checklist) at the end turns
each `[VERIFY]` into a 2-minute confirmation. Once the Shopify MCP connector is re-authorized
against the clinic's store, the very first step is `get-shop-info` + reading the live theme,
pages, and `robots.txt` to convert every hypothesis into a confirmed finding — after which
the [`/specs`](./specs) files can be implemented directly.

---

## The 6 pillars

### 1. Make the site machine-readable (structured data)
The single highest-leverage GEO move for a Shopify health site. LLMs and AI Overviews lean
heavily on `schema.org` JSON-LD to extract facts (who, what, where, hours, price, rating)
without guessing.

| Schema type | Where | Purpose |
|---|---|---|
| `MedicalClinic` / `LocalBusiness` + `Organization` | Sitewide (theme) | NAP, geo, hours, `sameAs`, `aggregateRating` — the clinic's identity card for AI |
| `Service` | Each treatment page | Names each therapy as a distinct, retrievable entity |
| `Person` | Each practitioner bio | Credentials → E-E-A-T authority signals |
| `FAQPage` | FAQ + service pages | **Highest-impact GEO schema** — each Q&A is a direct citation candidate |
| `Product` + `AggregateRating` | Supplement pages | Rich, quotable product facts for shopping answers |
| `BreadcrumbList` | All pages | Site structure the model can reason over |

→ Ready-to-implement templates: [`specs/schema-localbusiness.jsonld`](./specs/schema-localbusiness.jsonld),
[`specs/schema-faqpage.jsonld`](./specs/schema-faqpage.jsonld),
[`specs/schema-service-and-person.jsonld`](./specs/schema-service-and-person.jsonld).
**`[VERIFY]`** current schema coverage — most Shopify themes ship only thin `Product`/
`Organization` markup and no `MedicalClinic`, `Service`, `Person`, or `FAQPage`.

### 2. Restructure content answer-first
AI engines that retrieve in real time (Perplexity, AI Overviews) judge a page mostly on its
**opening content**. Rewrite so the first 200 words directly and completely answer the page's
core question.

- **Definition-first opening sentence** — "*Craniosacral therapy is a gentle, hands-on
  treatment that…*" (definition-first phrasing ≈ **+2.1× citation rate**).
- **Direct 40–60 word answer** to the page's primary question, up top.
- **Question-phrased H2s** — "*How much does acupuncture cost in London?*" not "*Pricing*".
- **Self-contained 130–170 word passages** — each section quotable on its own.
- **Named statistics + sources** — cited stats ≈ **+40% citation rate**. For YMYL health,
  cite reputable bodies (NHS, Cochrane, NICE, professional registers) — this also protects
  trust and compliance.

### 3. Build E-E-A-T + entity authority
Health is **YMYL** (Your Money or Your Life) — AI engines weight trust and expertise far
more heavily here than for ordinary topics.

- **Practitioner bio pages** with real names, qualifications, years, and **register
  memberships** (e.g. Society of Homeopaths, British Acupuncture Council / BAcC, GNC, ANP).
- **About / credentials page** stating the 35–40-year history, philosophy, and registrations.
- **`Organization.sameAs`** linking every official profile — Google Business Profile,
  Facebook, Instagram, LinkedIn, Trustpilot, directories — so engines resolve them to one
  entity.
- **A Wikidata entity** for the clinic (a primary knowledge source many models ingest).

### 4. Own local + off-site citations
For "near me" health queries AI engines lean on **Google Business Profile + third-party
mentions**, not just the website.

- **Claim & fully optimize Google Business Profile:** correct primary + secondary categories
  (Homeopath, Acupuncture clinic, Alternative medicine practitioner), services, description,
  photos, hours, and the **GBP Q&A** section (seed it with your FAQ).
- **Enforce consistent NAP** (Name, Address, Phone) — *byte-identical* everywhere. Any
  mismatch fractures the entity and dilutes AI confidence.
- **Reviews engine:** steady flow of Google + Trustpilot reviews; respond to each.
- **Directory listings:** health/therapy directories (e.g. TopDoctors, WhatClinic, Yell,
  local Islington/London listings) with identical NAP.

### 5. Make sure AI crawlers are actually allowed
A silent block here **nullifies every other pillar** — the model literally cannot read the
site. Explicitly allow the AI user-agents in `robots.txt`:

`GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI) · `ClaudeBot`, `Claude-User` (Anthropic) ·
`PerplexityBot`, `Perplexity-User` · `Google-Extended` (Gemini/AI Overviews training) ·
`Applebot-Extended` · `CCBot` (Common Crawl — feeds many models) · `Bytespider`, `Amazonbot`.

→ Drop-in snippet: [`specs/robots-additions.txt`](./specs/robots-additions.txt).
**`[VERIFY]`** the live `robots.txt` — Shopify's default is mostly permissive, but apps,
password pages, or manual edits can block these. Also publish
**[`specs/llms.txt`](./specs/llms.txt)** at `/llms.txt` — an emerging convention that gives
models a clean, curated map of the site.

### 6. Freshness + measurement
- **Freshness:** Perplexity and AI Overviews favor recent content. Publish a blog answering
  real patient questions on a cadence, and refresh cornerstone pages with a visible "last
  updated" date.
- **Measure what matters — AI citation share-of-voice:** monthly, run the
  [query universe](./query-universe.md) through each engine and log whether the clinic is
  *cited*, *mentioned*, or *absent* vs. competitors. Traditional rank tracking misses this.
- **GA4 "AI referrals" segment:** track sessions from `chatgpt.com`, `perplexity.ai`,
  `gemini.google.com`, `claude.ai`, `copilot.microsoft.com` referrers.

---

## 30 / 60 / 90-day roadmap

### Days 0–30 — Foundation & quick wins
- [ ] `[VERIFY]` + fix `robots.txt` so all AI crawlers are allowed ([snippet](./specs/robots-additions.txt)).
- [ ] Inject sitewide `MedicalClinic`/`LocalBusiness` + `Organization` JSON-LD in the theme
      ([template](./specs/schema-localbusiness.jsonld)).
- [ ] Claim & optimize **Google Business Profile** (categories, services, hours, photos, Q&A).
- [ ] Rewrite the **homepage + top 3 service intros** answer-first (definition-first opener).
- [ ] Publish **`/llms.txt`** ([template](./specs/llms.txt)).
- [ ] Fix `<title>` + meta description on the homepage and each service/collection page.

### Days 30–60 — Content depth
- [ ] Restructure **every service page** answer-first + add `FAQPage` schema
      ([template](./specs/schema-faqpage.jsonld)).
- [ ] Build **practitioner bio pages** with `Person` schema + credentials
      ([template](./specs/schema-service-and-person.jsonld)).
- [ ] Publish **6–8 FAQ/blog articles** targeting the [query universe](./query-universe.md).
- [ ] Add `Product` + `AggregateRating` schema to supplement pages.

### Days 60–90 — Authority & measurement
- [ ] Directory + citation building; run a full **NAP consistency audit**.
- [ ] Stand up a **review-generation** flow (Google + Trustpilot).
- [ ] Create a **Wikidata** entity; complete `Organization.sameAs`.
- [ ] Internal-linking pass (service ↔ FAQ ↔ blog ↔ supplements).
- [ ] Launch the **AI citation share-of-voice** tracker + GA4 AI-referral segment; baseline,
      then compare against the day-0 measurement.

---

## Priority matrix (do the top rows first)

| Action | Impact | Effort | When |
|---|---|---|---|
| Allow AI crawlers in `robots.txt` | 🔴 Critical | Trivial | Now |
| Sitewide LocalBusiness/Organization schema | 🔴 Critical | Low | Now |
| Google Business Profile optimization | 🔴 Critical | Low | Now |
| Answer-first homepage + service intros | 🟠 High | Medium | 0–30 |
| FAQPage schema + FAQ content | 🟠 High | Medium | 30–60 |
| Practitioner bios + Person schema | 🟠 High | Medium | 30–60 |
| `/llms.txt` | 🟡 Medium | Trivial | 0–30 |
| Blog freshness engine | 🟡 Medium | Ongoing | 30–90 |
| Directories + reviews + Wikidata | 🟡 Medium | Medium | 60–90 |

---

## How each piece is implemented on Shopify

| Deliverable | Shopify mechanism |
|---|---|
| Sitewide JSON-LD | Edit `theme.liquid` (or a `schema.liquid` snippet rendered in `<head>`) via the theme code editor |
| Per-template schema | Section/template `.liquid` files, or metafields surfaced in the template |
| FAQ / service / bio content | Shopify **Pages** (`/pages/*`) and **Blog** articles |
| Supplement `Product` schema | Product template + metafields |
| `robots.txt` edits | Shopify serves an editable **`robots.txt.liquid`** |
| `/llms.txt` | A page + URL redirect, or a small app/asset serving the file |

**Direct implementation is ready to go once the Shopify MCP connector is re-authorized**
against the clinic's store — the [`specs`](./specs) files are the exact payloads. First
command after re-auth: `get-shop-info`, then read the live theme + `robots.txt` to confirm
each `[VERIFY]`.

---

## 📋 Live-site verification checklist

Run these to convert hypotheses into confirmed findings (via Shopify MCP or any browser):

1. **Schema present?** Google **Rich Results Test** on the homepage + a service page + a
   product page. Note which types exist vs. the pillar-1 table.
2. **`robots.txt`** at `/robots.txt` — is any AI user-agent `Disallow`ed?
3. **`/llms.txt`** — 404 or present?
4. **Titles/meta** — view-source on the homepage + top service pages; are they unique and
   descriptive?
5. **Answer-first?** Does the first paragraph of each service page directly answer "what is
   this / who is it for / what does it cost"?
6. **FAQ content** — do service pages have a real Q&A block?
7. **Practitioner E-E-A-T** — are there named bios with credentials?
8. **GBP** — is the Google Business Profile claimed, categorized, and NAP-consistent with the site?
9. **Baseline citation test** — run 5 queries from the [query universe](./query-universe.md)
   through ChatGPT, Perplexity, and Gemini; record cited / mentioned / absent.

---

## Files in this folder

```
insight-clinic-geo/
├── README.md                              ← this audit + strategy
├── query-universe.md                      ← target AI queries + citation-tracking sheet
└── specs/
    ├── schema-localbusiness.jsonld        ← sitewide MedicalClinic + Organization
    ├── schema-faqpage.jsonld              ← answer-first FAQ template
    ├── schema-service-and-person.jsonld   ← Service + Person + Product templates
    ├── llms.txt                           ← ready-to-host /llms.txt
    └── robots-additions.txt               ← AI crawler allowlist
```

## Sources

- Enrich Labs — [GEO: The Complete 2026 Guide to Ranking in AI Search](https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026)
- LLMrefs — [Generative Engine Optimization: The 2026 Guide to AI Search Visibility](https://llmrefs.com/generative-engine-optimization)
- AI Magicx — [Getting Cited in ChatGPT, Claude, and Perplexity in 2026](https://www.aimagicx.com/blog/generative-engine-optimization-chatgpt-perplexity-2026)

---

<div align="center">

**🧠 [Want these built and managed for you? →](https://singlebrain.com/?utm_source=github&utm_medium=skill_repo&utm_campaign=ai_marketing_skills)**

*This is how we build agents at [Single Brain](https://singlebrain.com/?utm_source=github&utm_medium=skill_repo&utm_campaign=ai_marketing_skills) for our clients.*

[Single Grain](https://www.singlegrain.com/?utm_source=github&utm_medium=skill_repo&utm_campaign=ai_marketing_skills) · our marketing agency

📬 **[Level up your marketing with 14,000+ marketers and founders →](https://levelingup.beehiiv.com/subscribe)** *(free)*

</div>
