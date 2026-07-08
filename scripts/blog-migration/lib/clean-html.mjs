import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

// Pure, deterministic HTML -> Markdown cleaner.
//
// This runs BEFORE any LLM ever sees the content, which serves two purposes:
//   1. Prompt-injection safety: the WordPress body is treated as data, and the
//      cruft that could carry hidden instructions (scripts, shortcodes) is gone.
//   2. Token control: we strip the Elementor/WordPress bloat so the markdown we
//      commit (and occasionally hand to the SEO agent) is as small as possible.

const td = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
  linkStyle: "inlined",
});
td.use(gfm);

// Drop WordPress "continue reading" / "read more" anchors entirely.
td.addRule("moreLink", {
  filter: (node) =>
    node.nodeName === "A" &&
    (node.getAttribute("class") || "").includes("more-link"),
  replacement: () => "",
});

// Handle every <iframe>: YouTube/Vimeo embeds (Gutenberg wraps them in an
// iframe) become a clean Markdown link so the video isn't lost; any other iframe
// is dropped. One rule keeps this immune to Turndown's rule-ordering.
td.addRule("iframeEmbed", {
  filter: "iframe",
  replacement: (_content, node) => {
    const src = node.getAttribute("src") || "";
    const yt = src.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([\w-]+)/i);
    if (yt) {
      return `\n\n[▶ Assista ao vídeo no YouTube](https://www.youtube.com/watch?v=${yt[1]})\n\n`;
    }
    const vm = src.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (vm) return `\n\n[▶ Assista ao vídeo no Vimeo](https://vimeo.com/${vm[1]})\n\n`;
    return "";
  },
});

// Never emit script/style/noscript content.
td.addRule("stripDangerous", {
  filter: ["script", "style", "noscript"],
  replacement: () => "",
});

function preCleanHtml(html) {
  return (
    html
      // HTML comments: <!--more-->, Gutenberg block markers (<!-- wp:... -->),
      // and any other editor comment noise present in raw post content.
      .replace(/<!--[\s\S]*?-->/g, "")
      // WordPress "continue reading" anchors (<!--more--> teaser link). Removed
      // BEFORE class attributes are stripped, otherwise the class match is lost.
      .replace(/<a[^>]*class="[^"]*more-link[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
      // WP / Elementor shortcodes:  [foo attr="x"] ... [/foo]
      .replace(/\[\/?[a-zA-Z][^\]]*\]/g, "")
      // inline style / class / id / data-* attributes
      .replace(/\s(style|class|id|data-[\w-]+)="[^"]*"/gi, "")
      // empty spans / paragraphs left behind by the editor
      .replace(/<span[^>]*>\s*<\/span>/gi, "")
      .replace(/<p[^>]*>(?:\s|&nbsp;)*<\/p>/gi, "")
      // non-breaking spaces -> normal spaces
      .replace(/&nbsp;/gi, " ")
  );
}

function postCleanMarkdown(md) {
  return md
    // theme post-view counter that trails the article ("Post Views: 4.587")
    .replace(/^\s*Post Views:\s*[\d.,]+\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n") // collapse runs of blank lines
    .replace(/[ \t]+$/gm, "") // trailing whitespace
    .trim();
}

/** Convert a rendered WordPress HTML body into clean Markdown. */
export function htmlToMarkdown(html) {
  const cleaned = preCleanHtml(html || "");
  const md = td.turndown(cleaned);
  return postCleanMarkdown(md);
}
