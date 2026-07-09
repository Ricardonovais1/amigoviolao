import categoryNames from "../../content/blog/categories.json";

// Client-safe category helpers (no node:fs) so blog UI components can run in
// the browser. The slug -> name map ships with the bundle via JSON import.

/** Human label for a category slug (falls back to a prettified slug). */
export function categoryLabel(slug: string): string {
  const fromMap = (categoryNames as Record<string, string>)[slug];
  if (fromMap) return fromMap;
  return slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

/** WordPress migration remnants that should never surface in the UI. */
export const HIDDEN_CATEGORIES = new Set(["uncategorized", "blog"]);

export interface CategoryRef {
  slug: string;
  name: string;
}

export interface CategoryGroup {
  title: string;
  categories: CategoryRef[];
}

const group = (title: string, slugs: string[]): CategoryGroup => ({
  title,
  categories: slugs.map((slug) => ({ slug, name: categoryLabel(slug) })),
});

/**
 * Curated macro-categories shown in the "Explorar Assuntos" dropdown,
 * grouped by theme (one column per group). Counters intentionally omitted.
 */
export const FEATURED_CATEGORY_GROUPS: CategoryGroup[] = [
  group("Aprender violão", [
    "como-tocar-violao",
    "violao-para-iniciantes",
    "aula-de-violao-para-criancas",
  ]),
  group("Educação musical", [
    "educacao-musical-infantil",
    "o-professor-e-a-musica",
    "desenvolvimento-da-crianca",
  ]),
  group("Pais e família", [
    "participacao-dos-pais",
    "presenca-dos-pais",
    "comportamento-infantil",
    "brincadeiras-para-fazer-em-casa",
  ]),
];

/** First meaningful category of a post (skips migration junk), or null. */
export function primaryCategory(categories: string[]): CategoryRef | null {
  const slug = categories.find((c) => !HIDDEN_CATEGORIES.has(c));
  return slug ? { slug, name: categoryLabel(slug) } : null;
}
