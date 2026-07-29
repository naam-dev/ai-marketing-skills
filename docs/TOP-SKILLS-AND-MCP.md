# Top Claude Code Skills & MCP Servers — Research and Installation

_Last updated: July 2026_

This repo now ships with a curated set of the top ecosystem skills and MCP servers,
chosen from current popularity data with a marketing/sales lens. Everything below is
installed at the project level, so anyone who opens this repo in Claude Code gets it
automatically.

---

## What's installed

### Skills — `.claude/skills/`

Vendored from [anthropics/skills](https://github.com/anthropics/skills) (the official
skills repo, ~165k stars) at commit `b29e7cf`. All three are Apache-2.0 licensed; each
skill folder retains its original `LICENSE.txt`.

| Skill | Why it made the cut |
|-------|--------------------|
| **frontend-design** | The most-used design skill in the ecosystem (277k+ installs). Produces distinctive, non-templated UI — directly useful for landing pages, CRO experiments (`conversion-ops`), and campaign microsites. |
| **theme-factory** | One of the most-enabled skills on claude.ai (~840k enables). Applies cohesive color/font themes to slides, docs, reports, and landing pages — pairs with `deck-generator` and client reporting. |
| **skill-creator** | Anthropic's official skill for authoring, testing, and benchmarking skills. This is a skills repo — contributors can use it to scaffold and eval new marketing skills. |

Claude Code auto-discovers these because they live in `.claude/skills/`. No setup needed.

### MCP servers — `.mcp.json`

Project-scoped config, checked in so the whole team shares it. Claude Code will prompt
to approve these servers on first use.

| Server | Type | Auth | Marketing use |
|--------|------|------|---------------|
| **playwright** | local (`npx @playwright/mcp`) | none | Browser automation: CRO audits, landing-page screenshots, funnel walkthroughs |
| **context7** | remote HTTP | none required | Up-to-date library docs when editing this repo's Python/API scripts |
| **github** | remote HTTP | OAuth on first use | PRs, issues, CI for this repo |
| **notion** | remote HTTP | OAuth on first use | Content calendars, briefs, campaign docs |
| **firecrawl** | local (`npx firecrawl-mcp`) | `FIRECRAWL_API_KEY` | Web scraping for `outbound-engine` competitive monitor, `seo-ops` content attack briefs |
| **dataforseo** | local (`npx dataforseo-mcp-server`) | `DATAFORSEO_USERNAME` / `DATAFORSEO_PASSWORD` | Keyword/SERP data for `seo-ops` |
| **fetch** | local (`uvx mcp-server-fetch`) | none | Simple page fetching for research skills |

API-keyed servers read credentials from environment variables (`${VAR}` expansion), so
no secrets live in the repo. Add keys to your shell profile or a `.env` file
(gitignored). Servers without keys still work out of the box; the keyed ones simply
fail to start until credentials are present.

---

## Research summary

### Top skills (2026)

- **Superpowers** (obra) — the most popular community skill/plugin by a wide margin
  (94k+ GitHub stars, in the official marketplace). It's a full engineering-workflow
  plugin (TDD, planning, atomic tasks). Not vendored here because it's distributed as
  a plugin marketplace, not a copyable skill — install with:
  `/plugin marketplace add obra/superpowers-marketplace` then `/plugin install superpowers`.
- **frontend-design** — most-installed design skill (277k+ installs). ✅ Installed.
- **theme-factory** — among the most-enabled skills on claude.ai. ✅ Installed.
- **Document skills (docx / pptx / xlsx / pdf)** — the highest-usage skills anywhere
  (they power Claude's file creation). Not vendored: they are **source-available, not
  open source**, so they don't belong in an MIT/Apache OSS repo — and they're already
  bundled with Claude apps and Claude Code, so vendoring adds nothing.
- **skill-creator** — Anthropic's meta-skill for building skills. ✅ Installed.
- **canvas-design / brand-guidelines** — evaluated and skipped: canvas-design is 5.6 MB
  (bundled fonts, too heavy to vendor); brand-guidelines applies *Anthropic's* brand
  specifically, which isn't useful for third-party marketing work.

### Top MCP servers (2026)

General-purpose leaders: **GitHub, Playwright, Filesystem, Supabase, Stripe, Sentry,
Notion** — with remote OAuth-secured endpoints now the default distribution model
(30+ major remote servers as of July 2026, up from 16 in January).

Marketing/SEO leaders: **Ahrefs, Semrush, DataForSEO, Google Search Console, HubSpot,
Firecrawl** — practitioner consensus is to run 2–4 together rather than one.

Installed picks favor servers that (a) rank at the top of both lists, (b) map to
skills already in this repo, and (c) work without per-seat paid accounts. Notable
omissions and why:

- **HubSpot / Ahrefs / Semrush** — top-tier for marketing but require paid accounts
  with per-user OAuth; add them via claude.ai Connectors or your own `.mcp.json`
  entry when your team has seats. DataForSEO covers the keyword/SERP need with
  simple pay-as-you-go API credentials.
- **Supabase / Stripe / Sentry** — top-10 overall but developer-infrastructure
  focused; not relevant to this repo's workflows.
- **Filesystem** — redundant; Claude Code has native file tools.

### Sources

- [Firecrawl — Best Claude Code Skills](https://www.firecrawl.dev/blog/best-claude-code-skills)
- [Composio — Top 10 Claude Code Skills 2026](https://composio.dev/content/top-claude-skills)
- [DesignRevision — Awesome Claude Code Skills (2026)](https://designrevision.com/blog/awesome-claude-skills)
- [Firecrawl — 10 Best MCP Servers for Developers in 2026](https://www.firecrawl.dev/blog/best-mcp-servers-for-developers)
- [MCPBundles — Best MCP Servers in 2026](https://www.mcpbundles.com/blog/best-mcp-servers)
- [SE Ranking — Best SEO MCP servers 2026](https://seranking.com/blog/best-seo-mcps/)
- [Serpstat — Best SEO MCP Servers in 2026](https://serpstat.com/blog/best-seo-mcp-servers-comparison/)
- [Tally — The 7 Best MCP Servers for Marketing Teams in 2026](https://tally.so/help/best-mcp-servers-for-marketing-teams)
- [anthropics/skills](https://github.com/anthropics/skills)
