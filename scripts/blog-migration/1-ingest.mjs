// Agent 1 (ETL) - INGESTION step, purely deterministic.
//
// Paginate the WordPress REST API and cache the raw `_embed`-ed JSON of each
// post to disk. No transformation, no LLM. Re-runnable and idempotent.
//
// The public API only returns teasers (truncated at <!--more-->). To get full
// article bodies we authenticate with a WordPress Application Password and use
// ?context=edit, which returns content.raw (the complete, unfiltered content).
// Without credentials the script still runs, but you get teasers only.
//
// Setup: WP Admin > Users > Profile > Application Passwords. Put in .env.local:
//   WORDPRESS_USER=<your-wp-login>
//   WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
//
// Usage:
//   node scripts/blog-migration/1-ingest.mjs            # all posts
//   node scripts/blog-migration/1-ingest.mjs --limit=1  # pilot: first N posts

import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractBodyHtml } from "./lib/scrape-body.mjs";

const API = "https://amigoviolao.com/wp-json/wp/v2/posts";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, ".cache", "wp-raw");
const ENV_FILE = path.resolve(HERE, "..", "..", ".env.local");

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

// Minimal .env.local loader (avoids a dotenv dependency).
async function loadEnv() {
  try {
    const text = await readFile(ENV_FILE, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no .env.local — fine, we'll fall back to public (teaser) mode
  }
}

// Fetch with a couple of retries + backoff for transient upstream errors
// (Cloudflare 5xx/52x, network blips) that are common against a shared WP host.
async function fetchRetry(url, options = {}, attempts = 3) {
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status < 500 || i === attempts) return res;
      console.warn(`  ! ${res.status} on attempt ${i}, retrying...`);
    } catch (e) {
      if (i === attempts) throw e;
      console.warn(`  ! ${e.message} on attempt ${i}, retrying...`);
    }
    await new Promise((r) => setTimeout(r, 1500 * i));
  }
  throw new Error(`fetch failed after ${attempts} attempts: ${url}`);
}

async function main() {
  await loadEnv();
  await mkdir(OUT, { recursive: true });

  const user = process.env.WORDPRESS_USER;
  const appPassword = process.env.WORDPRESS_APP_PASSWORD;
  const authed = Boolean(user && appPassword);
  const headers = authed
    ? {
        Authorization:
          "Basic " +
          Buffer.from(`${user}:${appPassword.replace(/\s+/g, "")}`).toString(
            "base64",
          ),
      }
    : {};
  console.log(
    authed
      ? "Authenticated (context=edit) -> fetching FULL content.raw\n"
      : "No credentials -> scraping full body from public pages (Plan B)\n",
  );

  // Small pages keep the `_embed` response cheap enough that the origin server
  // doesn't time out (a per_page=100 + _embed request 524s on this host).
  const PER_PAGE = 20;

  let page = 1;
  let saved = 0;
  let totalPages = 1;

  do {
    const ctx = authed ? "&context=edit" : "";
    const url = `${API}?per_page=${PER_PAGE}&page=${page}&_embed${ctx}`;
    const res = await fetchRetry(url, { headers });
    if (!res.ok) throw new Error(`WP API returned ${res.status} on page ${page}`);

    totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    const posts = await res.json();

    for (const post of posts) {
      if (saved >= LIMIT) break;

      // Plan B: without credentials the API body is a teaser. Scrape the full
      // article HTML from the public page and stash it as content.raw so the
      // transform step (which prefers content.raw) gets the complete post.
      if (!authed && post.link) {
        try {
          const pageRes = await fetchRetry(post.link, {
            headers: { "User-Agent": "Mozilla/5.0 (blog-migration)" },
          });
          if (pageRes.ok) {
            const bodyHtml = extractBodyHtml(await pageRes.text());
            if (bodyHtml) {
              post.content = post.content || {};
              post.content.raw = bodyHtml;
            } else {
              console.warn(`  ! no body extracted for ${post.slug} (using teaser)`);
            }
          }
        } catch (e) {
          console.warn(`  ! scrape failed for ${post.slug}: ${e.message}`);
        }
      }

      const file = path.join(OUT, `${post.id}-${post.slug}.json`);
      await writeFile(file, JSON.stringify(post, null, 2), "utf8");
      saved += 1;
      console.log(`  saved  ${post.id}  ${post.slug}`);
    }

    page += 1;
  } while (page <= totalPages && saved < LIMIT);

  console.log(`\nIngested ${saved} post(s) -> ${path.relative(process.cwd(), OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
