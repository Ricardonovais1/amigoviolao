// Agent 1 (ETL) + Agent 2 (SEO) - TRANSFORM step, deterministic.
//
// Reads the cached raw posts, cleans each HTML body to Markdown, builds the
// strict front-matter from Yoast, and writes content/blog/<slug>.md. Posts with
// missing SEO fields are recorded in .cache/gaps.json for the blog-seo subagent.
//
// GUARDRAILS honoured here:
//   - Iterative: posts are processed strictly one at a time (no cross-post state).
//   - Human-in-the-loop: writing INTO the Next.js tree is gated behind a [y/N]
//     confirmation unless `--yes` is passed.
//   - Hybrid: 100% code. No tokens are spent; the LLM step is a separate subagent.
//
// Usage:
//   node scripts/blog-migration/2-transform.mjs               # prompts before writing
//   node scripts/blog-migration/2-transform.mjs --yes         # non-interactive
//   node scripts/blog-migration/2-transform.mjs --slug=<slug> # single post

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { htmlToMarkdown } from "./lib/clean-html.mjs";
import { buildFrontmatter } from "./lib/frontmatter.mjs";
import { fallbackDescription } from "./lib/gap-fill.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.join(HERE, ".cache", "wp-raw");
const GAPS = path.join(HERE, ".cache", "gaps.json");
const SEO_OVERRIDES = path.join(HERE, "seo-overrides.json");
const ROOT = path.resolve(HERE, "..", ".."); // project root
const OUT = path.join(ROOT, "content", "blog");

const YES = process.argv.includes("--yes");
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const ONLY = slugArg ? slugArg.split("=")[1] : null;

async function confirm(message) {
  if (YES) return true;
  const { createInterface } = await import("node:readline/promises");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`${message} [y/N] `)).trim().toLowerCase();
  rl.close();
  return answer === "y" || answer === "yes";
}

async function main() {
  let files;
  try {
    files = (await readdir(RAW)).filter((f) => f.endsWith(".json"));
  } catch {
    console.error("No raw cache found. Run 1-ingest.mjs first.");
    process.exit(1);
  }

  const targets = ONLY ? files.filter((f) => f.includes(ONLY)) : files;
  if (!targets.length) {
    console.error("No matching raw posts to transform.");
    process.exit(1);
  }

  console.log(`About to write ${targets.length} markdown file(s) into:`);
  console.log(`  ${path.relative(ROOT, OUT)}\n`);
  if (!(await confirm("Proceed writing into the Next.js content tree?"))) {
    console.log("Aborted. Nothing written.");
    return;
  }

  await mkdir(OUT, { recursive: true });

  // Durable SEO overrides written by the blog-seo agent (slug -> { description,
  // featured_image, ... }). Applied on top of Yoast so hand-authored metadata
  // survives future re-runs of this deterministic transform.
  let overrides = {};
  try {
    overrides = JSON.parse(await readFile(SEO_OVERRIDES, "utf8"));
  } catch {
    // no overrides yet
  }

  const gaps = [];
  const categoryNames = {}; // slug -> display name, written to categories.json
  for (const file of targets) {
    // Strictly one post at a time -> no cross-post context accumulates.
    const post = JSON.parse(await readFile(path.join(RAW, file), "utf8"));
    const { frontmatter, gaps: missing } = buildFrontmatter(post);
    // Prefer content.raw (full, from authenticated ingest); fall back to the
    // truncated content.rendered when ingesting without credentials.
    const rawHtml =
      (post.content && (post.content.raw || post.content.rendered)) || "";
    let body = htmlToMarkdown(rawHtml);

    // Avoid showing the same photo twice: if the body opens with the image that
    // is also the featured image, drop that leading image from the body.
    body = dedupeLeadingImage(body, frontmatter.featured_image);

    // Deterministic SEO fill: when WP/Yoast gave no featured image, derive one
    // from the post's own media (a video's YouTube thumbnail, else the first
    // body image, which is then promoted out of the body to become the hero).
    if (!frontmatter.featured_image) {
      const derived = deriveFeaturedImage(body);
      if (derived) {
        frontmatter.featured_image = derived.url;
        if (!frontmatter.og_image) frontmatter.og_image = derived.url;
        body = derived.body;
        const i = missing.indexOf("featured_image");
        if (i >= 0) missing.splice(i, 1);
      }
    }

    // Collect category display names (with proper accents) from the embedded
    // terms, so the UI can label /blog/categoria/<slug> nicely.
    const terms = ((post._embedded && post._embedded["wp:term"]) || []).flat();
    for (const t of terms) {
      if (t && t.taxonomy === "category") categoryNames[t.slug] = t.name;
    }

    if (!frontmatter.description) {
      frontmatter.description = fallbackDescription(body);
    }

    // Apply durable SEO overrides (blog-seo agent output) — these win and clear
    // the corresponding gap.
    const ov = overrides[frontmatter.slug];
    if (ov) {
      for (const key of ["description", "featured_image", "og_image", "title"]) {
        // `key in ov` (not truthiness) so an override can also intentionally
        // clear a field, e.g. featured_image: "" for a deleted-video post.
        if (key in ov) {
          frontmatter[key] = ov[key];
          const i = missing.indexOf(key);
          if (i >= 0 && ov[key]) missing.splice(i, 1);
        }
      }
    }

    if (missing.length) {
      gaps.push({ slug: frontmatter.slug, missing });
    }

    const outFile = path.join(OUT, `${frontmatter.slug}.md`);
    const fileContents = matter.stringify(`\n${body}\n`, frontmatter);
    await writeFile(outFile, fileContents, "utf8");

    const flag = missing.length ? `  (gaps: ${missing.join(", ")})` : "";
    console.log(`  wrote  ${path.relative(ROOT, outFile)}${flag}`);
  }

  // Merge category names into any existing map (so partial runs don't lose
  // labels from posts not processed this time).
  const catFile = path.join(OUT, "categories.json");
  let existing = {};
  try {
    existing = JSON.parse(await readFile(catFile, "utf8"));
  } catch {
    // no existing map yet
  }
  await writeFile(
    catFile,
    JSON.stringify({ ...existing, ...categoryNames }, null, 2),
    "utf8",
  );

  await writeFile(GAPS, JSON.stringify(gaps, null, 2), "utf8");
  console.log(
    `\nDone. ${gaps.length} post(s) flagged for the blog-seo subagent -> ${path.relative(ROOT, GAPS)}`,
  );
}

// Normalise an image URL to a comparison key: decode %XX, drop the path and any
// -1024x768 size suffix, strip accents and non-alphanumerics. So
// ".../Foto-Violão-1024x682.jpg" and ".../Foto-Violao.jpg" match.
function imageKey(url) {
  let u = url || "";
  try {
    u = decodeURIComponent(u);
  } catch {
    // leave as-is if malformed encoding
  }
  return u
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[?#]/)[0]
    .split("/")
    .pop()
    .replace(/-\d+x\d+(?=\.\w+$)/, "")
    .replace(/[^a-z0-9.]/g, "");
}

function dedupeLeadingImage(body, featuredImage) {
  if (!featuredImage) return body;
  const fk = imageKey(featuredImage);
  return body.replace(/^\s*!\[[^\]]*\]\(([^)]+)\)\s*/, (match, url) =>
    imageKey(url) === fk ? "" : match,
  );
}

// Pick a featured image from the post's own media. YouTube thumbnails come from
// img.youtube.com (already whitelisted in next.config.ts). When falling back to
// the first body image, it is removed from the body so it isn't shown twice.
function deriveFeaturedImage(body) {
  const yt = body.match(
    /\[▶[^\]]*\]\(https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)\)/,
  );
  if (yt) {
    return {
      url: `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`,
      body,
    };
  }
  const img = body.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (img) {
    const newBody = body.replace(img[0], "").replace(/\n{3,}/g, "\n\n").trim();
    return { url: img[1], body: newBody };
  }
  return null;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
