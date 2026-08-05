// Single source of truth for blog URL shapes. Client-safe (no node:fs), so
// PostCard & co. can import it from inside the BlogExplorer filter.
//
// Posts live at the ROOT (/<slug>), not under /blog/<slug>: these slugs are the
// same ones the old WordPress site used, so keeping them where Google already
// indexed them avoids 93 redirects and the ranking risk that comes with them.
// /blog stays as the index, and category archives keep the /blog/ prefix (they
// were never indexed at the root).

export const postPath = (slug: string) => `/${slug}`;

export const categoryPath = (slug: string) => `/blog/categoria/${slug}`;
