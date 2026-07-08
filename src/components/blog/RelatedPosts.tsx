import Link from "next/link";
import { getRelatedPosts } from "@/lib/blog";
import PostCover from "./PostCover";

// Determines the 3 related posts in code (see getRelatedPosts) and renders them
// as cards. Server Component -> selection happens at build time.

export default function RelatedPosts({ slug }: { slug: string }) {
  const related = getRelatedPosts(slug, 3);
  if (!related.length) return null;

  return (
    <section className="mt-16 border-t border-black/10 pt-10">
      <h2 className="mb-6 text-2xl font-bold text-dark">Leia também</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-200 hoverable:shadow-md"
          >
            <div className="relative aspect-video w-full bg-cream">
              <PostCover
                src={post.featured_image}
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 font-semibold text-dark transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
