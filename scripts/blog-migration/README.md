# Blog migration (WordPress → Next.js Markdown)

Deterministic pipeline that migrates posts from the live WordPress site
(`amigoviolao.com`) into `content/blog/*.md`, which the Next.js blog renders
statically at build time.

## How full content is fetched

The **public** REST API only returns teasers (truncated at `<!--more-->`), so the
pipeline supports two content sources:

- **Plan B — scraping (default, no credentials).** For each post the ingest
  fetches the public page (`post.link`) and extracts the article body from the
  Elementor `theme-post-content` widget (`lib/scrape-body.mjs`). This is the
  active path and needs no setup.
- **Plan A — authenticated API (optional, cleaner).** If a WordPress Application
  Password is present in `.env.local`, the ingest instead uses `?context=edit`
  and reads `content.raw` directly, skipping the scrape.

  ```
  WORDPRESS_USER=your-wp-login
  WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
  ```

  Generate it at WP Admin → **Users → Profile → Application Passwords** (only
  works over HTTPS; some security plugins disable it). `.env.local` is
  git-ignored.

Either way, `2-transform.mjs` prefers `content.raw` and runs the same cleaner.

## Run the pipeline

```bash
# 1. Ingest raw posts from the WP API -> scripts/blog-migration/.cache/wp-raw/
node scripts/blog-migration/1-ingest.mjs --limit=1     # pilot (first post)
node scripts/blog-migration/1-ingest.mjs               # all 103 posts

# 2. Clean + build front-matter -> content/blog/*.md   (prompts before writing)
node scripts/blog-migration/2-transform.mjs --slug=<slug>   # single post
node scripts/blog-migration/2-transform.mjs                  # all cached posts
node scripts/blog-migration/2-transform.mjs --yes           # skip the [y/N] prompt
```

`2-transform.mjs` writes `.cache/gaps.json` listing posts whose Yoast SEO fields
were empty. Hand that to the **blog-seo** subagent to write real meta
descriptions (one post at a time, fresh context).

## Architecture

| Step | File | Role |
|------|------|------|
| Ingest | `1-ingest.mjs` | Paginate WP API, cache raw JSON. Pure code. |
| Transform | `2-transform.mjs` | Orchestrate cleaning + front-matter, one post at a time. |
| Clean | `lib/clean-html.mjs` | **Pure** HTML→Markdown (strips styles, shortcodes, comments, empty spans, more-links, scripts). |
| Front-matter | `lib/frontmatter.mjs` | Map Yoast → strict front-matter; report gaps. |
| Gap fallback | `lib/gap-fill.mjs` | Deterministic placeholder description; real fill is the SEO subagent. |

## Guardrails

- **Deterministic first.** All parsing/foldering is code. The LLM (blog-seo
  subagent) only touches posts flagged in `gaps.json`.
- **Iterative / context reset.** Posts are processed one at a time; no cross-post
  state. The SEO subagent must reset context per post.
- **Prompt-injection safe.** WP content is cleaned to data *before* any model
  sees it and is never treated as instructions.
- **Human-in-the-loop.** Writes into `content/` are gated behind `[y/N]`; builds
  and deploys require explicit approval.

## Agents (`.claude/agents/`)

- `blog-etl` — ingestion & mechanical cleaning.
- `blog-seo` — front-matter + JSON-LD + gap-filling.
- `blog-qa` — build/security/route audit before shipping.
