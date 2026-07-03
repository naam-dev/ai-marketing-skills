# Apply the sitewide schema (2 minutes)

These are the **exact, final files** to add sitewide `MedicalClinic + WebSite` JSON-LD to
insightclinic.care, built from the store's real, verified data (NAP, geo, services). Adding
them is how the site starts being understood and cited by ChatGPT, Perplexity, Gemini,
Google AI Overviews and Claude.

I already **duplicated your live theme** to a safe copy named
**"Insight — GEO/AI-search optimized (review & publish)"** (theme id `178441126264`). The
only step left is writing these two files into that copy, previewing, and publishing.

## What each file is
- **`geo-schema.liquid`** → a NEW snippet: `snippets/geo-schema.liquid`. Contains the
  JSON-LD. Purely additive.
- **`meta-tags.liquid`** → REPLACES `snippets/meta-tags.liquid`. It is byte-for-byte your
  current file (verified: original was 2535 bytes) **plus one line at the end** that renders
  the schema on every page:
  `{% render 'geo-schema' %}`.

## Option A — I finish it via Shopify MCP (preferred)
The connector kept dropping the write-approval this session. Once it's stable (re-add the
Shopify connector, or run from Claude Code desktop/CLI where approvals render), just say
**"apply the schema"** — the theme copy and files are ready; it's one `themeFilesUpsert` call.

## Option B — you paste it in Shopify admin (works right now)
1. Shopify admin → **Online Store → Themes**.
2. Find **"Insight — GEO/AI-search optimized (review & publish)"** → **⋯ → Edit code**.
3. Under **Snippets**, click **Add a new snippet**, name it `geo-schema`, and paste the
   contents of `geo-schema.liquid`. Save.
4. Open **`snippets/meta-tags.liquid`**, select all, and replace with the contents of the
   `meta-tags.liquid` in this folder. Save. *(The only change vs. your current file is the
   two comment/render lines at the very bottom.)*
5. Back on the Themes page, use **Preview** on that theme to check the site looks identical.
6. **Validate:** open the preview, view page source, confirm a
   `<script type="application/ld+json">` block with `"MedicalClinic"` is present. Optionally
   paste the preview URL into Google's **Rich Results Test**.
7. When happy, click **Publish** on that theme.

## After publishing
- Re-run Google **Rich Results Test** on the live homepage — expect `MedicalClinic`/
  `LocalBusiness` + `WebSite` detected with no errors.
- This is pillar 1 of the plan in `../README.md`. Next up (also doable via MCP): `FAQPage`
  schema on the FAQs page, `Person` schema on the Shyam Ravrani / Dr. Ravi Ponniah bio pages,
  answer-first rewrites, and fresh service-focused blog posts.

## To revert (if ever needed)
Delete `snippets/geo-schema.liquid` and remove the last two lines of
`snippets/meta-tags.liquid`. No other file is touched.
