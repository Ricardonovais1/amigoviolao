import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Build-time Jamstack data layer for the blog. Posts live as Markdown files in
// content/blog/*.md and are parsed once per build (or per request in dev). No
// runtime database, no client fetching -> great Core Web Vitals.

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const CATEGORIES_FILE = path.join(BLOG_DIR, "categories.json");

export interface Category {
  slug: string;
  name: string;
  count: number;
}

// slug -> display name, produced by the migration (categories.json).
let categoryNameMap: Record<string, string> | null = null;
function loadCategoryNames(): Record<string, string> {
  if (categoryNameMap) return categoryNameMap;
  let map: Record<string, string>;
  try {
    map = JSON.parse(fs.readFileSync(CATEGORIES_FILE, "utf8"));
  } catch {
    map = {};
  }
  categoryNameMap = map;
  return map;
}

/** Human label for a category slug (falls back to a prettified slug). */
export function categoryLabel(slug: string): string {
  const fromMap = loadCategoryNames()[slug];
  if (fromMap) return fromMap;
  return slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  modified?: string;
  slug: string;
  categories: string[];
  tags: string[];
  featured_image?: string;
  og_image?: string;
  canonical?: string;
  wpId?: number;
}

export interface Post extends PostFrontmatter {
  /** Raw Markdown body (front-matter stripped). */
  content: string;
}

function readPostFile(fileName: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;
  return {
    title: fm.title ?? "",
    description: fm.description ?? "",
    date: fm.date ?? "",
    modified: fm.modified,
    slug: fm.slug ?? fileName.replace(/\.md$/, ""),
    categories: fm.categories ?? [],
    tags: fm.tags ?? [],
    featured_image: fm.featured_image,
    og_image: fm.og_image,
    canonical: fm.canonical,
    wpId: fm.wpId,
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPostFile)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** All categories that have at least one post, with counts, most-used first. */
export function getAllCategories(): Category[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const slug of post.categories) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, name: categoryLabel(slug), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getPostsByCategory(slug: string): Post[] {
  return getAllPosts().filter((p) => p.categories.includes(slug));
}

/**
 * Deterministic related-posts selection (no LLM):
 *   shared category = 2 points, shared tag = 1 point, recency breaks ties.
 * Always returns up to `count` posts (default 3), padding with the most recent
 * when too few share taxonomy so the section is never partially empty.
 */
export function getRelatedPosts(slug: string, count = 3): Post[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  const cats = new Set(current.categories);
  const tags = new Set(current.tags);

  return all
    .filter((p) => p.slug !== slug)
    .map((post) => {
      const catScore = post.categories.filter((c) => cats.has(c)).length * 2;
      const tagScore = post.tags.filter((t) => tags.has(t)).length;
      return { post, score: catScore + tagScore };
    })
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, count)
    .map((x) => x.post);
}
