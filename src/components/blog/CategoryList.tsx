import Link from "next/link";
import { getAllCategories } from "@/lib/blog";

// Category chips to encourage browsing. Used on the blog index, each post, and
// the category archive (where `activeSlug` highlights the current one).

export default function CategoryList({
  activeSlug,
  showCounts = false,
}: {
  activeSlug?: string;
  showCounts?: boolean;
}) {
  const categories = getAllCategories();
  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const active = cat.slug === activeSlug;
        return (
          <Link
            key={cat.slug}
            href={`/blog/categoria/${cat.slug}`}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary text-white"
                : "bg-cream/70 text-charcoal hoverable:bg-teal/20 hoverable:text-dark"
            }`}
          >
            {cat.name}
            {showCounts ? (
              <span className={active ? "text-white/70" : "text-charcoal/50"}>
                {" "}
                ({cat.count})
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
