import Link from "next/link";
import type { PostCardData } from "@/lib/blog";
import { primaryCategory } from "@/lib/categories";
import PostCover from "./PostCover";

// Reusable post card for the blog index and category archives. Accepts the
// lightweight PostCardData shape (full Post objects satisfy it structurally),
// and stays client-safe so it can render inside the BlogExplorer filter.

export default function PostCard({ post }: { post: PostCardData }) {
  const category = primaryCategory(post.categories);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-200 hoverable:shadow-md"
    >
      <div className="relative aspect-video w-full bg-cream">
        <PostCover
          src={post.featured_image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {category ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-primary/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {category.name}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <h2 className="line-clamp-2 text-lg font-bold text-dark transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-charcoal/70">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
