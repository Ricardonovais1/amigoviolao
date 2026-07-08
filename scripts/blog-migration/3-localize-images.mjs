// Step 3 - IMAGE LOCALIZATION (run after 2-transform).
//
// Downloads the still-live post images into public/images/blog/ so they become
// part of the repo (committed, deployed with the code) instead of hotlinking the
// old WordPress site. Dead images (from the defunct tresamigosead.com.br domain
// and LeadLovers tracking redirects) are removed, along with any heading whose
// only content was a removed image ("mode 2" cleanup). YouTube/Vimeo thumbnails
// stay remote (stable CDNs).
//
// Idempotent: URLs already pointing at /images/blog are left alone, so it is safe
// to re-run after a fresh 2-transform.
//
// Usage:
//   node scripts/blog-migration/3-localize-images.mjs           # prompts first
//   node scripts/blog-migration/3-localize-images.mjs --yes     # non-interactive

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const BLOG = path.join(ROOT, "content", "blog");
const PUBLIC_IMG = path.join(ROOT, "public", "images", "blog");
const WEB_BASE = "/images/blog";

const YES = process.argv.includes("--yes");

// Hosts whose images we keep remote (reliable CDNs / live video providers).
const KEEP = /(?:youtube\.com|youtu\.be|ytimg\.com|vimeo\.com|vimeocdn\.com)/i;
// Hosts known to be dead / non-image — always removed, never downloaded.
const DEAD = /(?:tresamigosead\.com\.br|leadlovers\.com)/i;
// Already-localized references.
const LOCAL = /^\/images\/blog\//;

async function confirm(msg) {
  if (YES) return true;
  const { createInterface } = await import("node:readline/promises");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const a = (await rl.question(`${msg} [y/N] `)).trim().toLowerCase();
  rl.close();
  return a === "y" || a === "yes";
}

// Map a remote URL to a local repo path (mirror the WP uploads path; hash others).
function localPathFor(url) {
  const u = new URL(url);
  const up = u.pathname.match(/\/uploads\/(.+)$/);
  let rel;
  if (up) {
    rel = decodeURIComponent(up[1]);
  } else {
    const ext = (u.pathname.match(/\.(jpe?g|png|webp|gif)$/i) || [".jpg"])[0];
    rel = `misc/${crypto.createHash("sha1").update(url).digest("hex").slice(0, 16)}${ext}`;
  }
  rel = rel.replace(/[^\w./-]/g, "_");
  return { abs: path.join(PUBLIC_IMG, rel), web: `${WEB_BASE}/${rel}` };
}

// Encode a URL's path segments so accented filenames fetch correctly.
function encodeUrl(url) {
  const u = new URL(url);
  u.pathname = u.pathname.split("/").map(encodeURIComponent).join("/");
  return u.toString();
}

async function download(url) {
  const { abs, web } = localPathFor(url);
  if (existsSync(abs)) return web; // already downloaded
  const res = await fetch(encodeUrl(url), {
    headers: { "User-Agent": "Mozilla/5.0 (blog-migration)" },
  }).catch(() => null);
  if (!res || !res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 100) return null; // guard against error pages / 1px pixels
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, buf);
  return web;
}

/** Decide + act on a single image URL. Returns local web path, or "" to drop. */
async function resolveImage(url, stats) {
  if (LOCAL.test(url) || KEEP.test(url)) return url; // keep as-is
  if (DEAD.test(url)) {
    stats.removed += 1;
    return "";
  }
  const web = await download(url);
  if (web) {
    stats.localized += 1;
    return web;
  }
  stats.removed += 1; // couldn't fetch (404/dead) -> drop
  return "";
}

async function main() {
  const files = (await readdir(BLOG)).filter((f) => f.endsWith(".md"));
  console.log(`Localizing images for ${files.length} posts into ${path.relative(ROOT, PUBLIC_IMG)}`);
  console.log("Live images -> downloaded; dead images -> removed (mode 2).\n");
  if (!(await confirm("Proceed (downloads images and edits the .md files)?"))) {
    console.log("Aborted.");
    return;
  }
  await mkdir(PUBLIC_IMG, { recursive: true });

  const stats = { localized: 0, removed: 0, orphanHeadings: 0, links: 0 };

  for (const file of files) {
    const raw = await readFile(path.join(BLOG, file), "utf8");
    const { data, content } = matter(raw);
    let body = content;

    // 1. Linked images (CTA banners): [![alt](img "title")](link)
    for (const m of [...body.matchAll(/\[!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\)\]\(([^)\s]+)\)/g)]) {
      const [full, alt, imgUrl, linkUrl] = m;
      const web = await resolveImage(imgUrl, stats);
      const replacement = web ? `[![${alt}](${web})](${linkUrl})` : "";
      body = body.replace(full, replacement);
    }

    // 2. Standalone images: ![alt](url "title"). The optional Markdown title
    // (WP exports carry one on almost every image) must be consumed too, else
    // the URL never matches and dead images survive.
    for (const m of [...body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+(?:"[^"]*"|'[^']*'))?\)/g)]) {
      const [full, alt, url] = m;
      const web = await resolveImage(url, stats);
      body = body.replace(full, web ? `![${alt}](${web})` : "");
    }

    // 3. Dead text links: unwrap [text](deadUrl) -> text
    body = body.replace(/(?<!!)\[([^\]]+)\]\(([^)\s]+)\)/g, (full, text, url) => {
      if (DEAD.test(url)) {
        stats.links += 1;
        return text;
      }
      return full;
    });

    // 4. Front-matter featured_image / og_image
    for (const key of ["featured_image", "og_image"]) {
      if (data[key]) data[key] = await resolveImage(data[key], stats);
    }

    // 5. Mode-2 cleanup: drop headings whose section has no real content left.
    const lines = body.split("\n");
    const isHeading = (l) => /^#{1,6}\s/.test(l.trim());
    const isReal = (l) => l.trim() && !isHeading(l);
    const keep = lines.map(() => true);
    for (let i = 0; i < lines.length; i += 1) {
      if (!isHeading(lines[i])) continue;
      let hasReal = false;
      for (let j = i + 1; j < lines.length; j += 1) {
        if (isHeading(lines[j])) break;
        if (isReal(lines[j])) {
          hasReal = true;
          break;
        }
      }
      if (!hasReal) {
        keep[i] = false;
        stats.orphanHeadings += 1;
      }
    }
    body = lines.filter((_, i) => keep[i]).join("\n");
    body = body.replace(/\n{3,}/g, "\n\n").trim();

    await writeFile(path.join(BLOG, file), matter.stringify(`\n${body}\n`, data), "utf8");
  }

  console.log(
    `\nDone.\n  images localized: ${stats.localized}` +
      `\n  dead images removed: ${stats.removed}` +
      `\n  dead links unwrapped: ${stats.links}` +
      `\n  orphan headings removed: ${stats.orphanHeadings}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
