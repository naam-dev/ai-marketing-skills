# Apply the schema (status + finish steps)

Sitewide `MedicalClinic + WebSite` schema **and** a `FAQPage` (mirroring the live FAQ) for
insightclinic.care, built from the store's real, verified data (address, phone, geo, since
1984, practitioners Dr Ravi Ponniah & Dr Shyam Ravrani incl. BAcC, real fees, Instagram).

A safe **copy of the live theme** already exists in the store:
**"Insight — GEO/AI-search optimized (review & publish)"** (theme id `178441126264`).

## Current state in that theme copy (via Shopify MCP)
- ✅ `snippets/geo-schema.liquid` — written & verified (enriched MedicalClinic + WebSite).
- ✅ `snippets/meta-tags.liquid` — written & verified. Renders `geo-schema` sitewide and
  `geo-faq` **only on the FAQs page**.
- ⚠️ `snippets/geo-faq.liquid` — **NOT yet written** (connector kept dropping the approval).
  Because `meta-tags.liquid` already references it, the FAQs page will show a
  "snippet not found" error **until this file is added**. So this file must be added before
  previewing/publishing — it's `geo-faq.liquid` in this folder.

## Finish — Option A (via MCP, preferred)
When the Shopify connector is stable, say **"apply the FAQ schema"** — it's a single
`themeFilesUpsert` of `snippets/geo-faq.liquid` into theme `178441126264`.

## Finish — Option B (Shopify admin, works now)
Online Store → Themes → **"Insight — GEO/AI-search optimized"** → ⋯ **Edit code**:
1. Snippets → **Add a new snippet** → name it `geo-faq` → paste `geo-faq.liquid` from this
   folder → Save. *(This is the only missing piece; the other two are already in the theme.)*
2. (If you ever need to re-check the other two, `geo-schema.liquid` and `meta-tags.liquid`
   here are the exact copies that were written.)
3. **Preview** the theme → confirm the site + FAQs page look right.
4. **Validate:** Google **Rich Results Test** on the preview → expect `MedicalClinic` +
   `WebSite` sitewide, and `FAQPage` on `/pages/faqs`.
5. **Publish** the theme.

## Revert
Delete `snippets/geo-schema.liquid` + `snippets/geo-faq.liquid`, and remove the render lines
at the end of `snippets/meta-tags.liquid`. No other file is touched.

## Notes
- The `FAQPage` mirrors 27 of the ~60 live FAQ answers (top ~3 per section) — enough to be
  strong without bloat. All answers are copied from the live page, so schema and visible
  content agree (Google requirement).
- Health claims stay measured/sourced (e.g. NICE for acupuncture) per ASA/MHRA — matching
  the clinic's own FAQ wording.
