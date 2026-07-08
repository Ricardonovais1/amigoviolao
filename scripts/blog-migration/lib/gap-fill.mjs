// Deterministic fallback for missing SEO fields.
//
// The REAL, higher-quality gap-filling (writing a compelling meta description
// when Yoast left it empty) is the job of the `blog-seo` Claude Code subagent,
// which processes one flagged post at a time with a FRESH context window. This
// module only guarantees the build never ships an empty <meta name="description">
// in the meantime — no LLM tokens are spent here.

/** Build a ~155-char plain-text description from the cleaned markdown body. */
export function fallbackDescription(markdown) {
  const text = (markdown || "")
    // strip markdown link syntax -> keep the visible text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // strip images
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    // strip heading / emphasis / list markers
    .replace(/^[#>\-*\s]+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= 155) return text;
  return text.slice(0, 152).replace(/\s+\S*$/, "") + "…";
}
