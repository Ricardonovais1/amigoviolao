import { parse } from "node-html-parser";

// Plan B content source (no credentials): the public REST API only returns
// teasers, so we fetch the post's public HTML page and extract the article body
// from the Elementor "theme-post-content" widget. The extracted HTML is then
// handed to the same deterministic clean-html.mjs cleaner as everything else.

/**
 * Extract the post body HTML from a full rendered page.
 * @param {string} pageHtml - full HTML of the post's public URL
 * @returns {string} inner HTML of the content container ("" if not found)
 */
export function extractBodyHtml(pageHtml) {
  const root = parse(pageHtml, {
    blockTextElements: { script: false, style: false, noscript: false },
  });

  // Elementor renders the_content() inside:
  //   .elementor-widget-theme-post-content > .elementor-widget-container
  const widget = root.querySelector(".elementor-widget-theme-post-content");
  const container =
    widget?.querySelector(".elementor-widget-container") ||
    // Fallbacks for non-Elementor templates.
    root.querySelector(".entry-content") ||
    root.querySelector(".post-content");

  if (!container) return "";

  // Drop obvious non-article widgets that can sneak into the container
  // (share bars, related posts, author boxes, nav).
  container
    .querySelectorAll(
      ".sharedaddy, .jp-relatedposts, .addtoany_share_save_container, " +
        ".author-box, nav, .post-navigation, .elementor-share-buttons",
    )
    .forEach((el) => el.remove());

  return container.innerHTML;
}
