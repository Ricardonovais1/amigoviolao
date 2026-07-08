// Deterministic mapping: a WP post (fetched with `_embed`) + its Yoast SEO block
// -> a strict front-matter object. Any missing SEO field is reported in `gaps`
// so the LLM (blog-seo subagent) only ever touches the real holes.

/** Minimal, dependency-free HTML-entity decode for titles/descriptions. */
function decodeEntities(str) {
  return (str || "")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .trim();
}

const toHttps = (u) => (u || "").replace(/^http:\/\//i, "https://");

/**
 * @returns {{ frontmatter: object, gaps: string[] }}
 */
export function buildFrontmatter(post) {
  const yoast = post.yoast_head_json || {};
  const embedded = post._embedded || {};

  // wp:term is an array-of-arrays (categories, tags, ...). Flatten and split.
  const terms = (embedded["wp:term"] || []).flat();
  const categories = terms
    .filter((t) => t && t.taxonomy === "category")
    .map((t) => t.slug);
  const tags = terms
    .filter((t) => t && t.taxonomy === "post_tag")
    .map((t) => t.slug);

  const media = (embedded["wp:featuredmedia"] || [])[0] || {};
  const ogImage = Array.isArray(yoast.og_image)
    ? yoast.og_image[0] && yoast.og_image[0].url
    : undefined;

  const gaps = [];

  const title =
    decodeEntities(yoast.title || (post.title && post.title.rendered)) ||
    "(sem titulo)";

  let description = decodeEntities(yoast.description || yoast.og_description || "");
  if (!description) gaps.push("description");

  const featured_image = toHttps(media.source_url || ogImage || "");
  if (!featured_image) gaps.push("featured_image");

  const frontmatter = {
    title,
    description,
    date: (post.date || "").slice(0, 10),
    modified: (post.modified || "").slice(0, 10),
    slug: post.slug, // ORIGINAL wp slug -> preserves inbound links, avoids 404s
    categories,
    tags,
    featured_image,
    og_image: toHttps(ogImage || media.source_url || ""),
    canonical: `https://amigoviolao.com/blog/${post.slug}`,
    wpId: post.id,
  };

  return { frontmatter, gaps };
}
