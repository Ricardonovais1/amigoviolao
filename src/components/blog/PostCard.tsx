import Link from "next/link";
import type { Post } from "@/lib/blog";
import { categoryLabel } from "@/lib/blog";
import PostCover from "./PostCover";

// Reusable post card for the blog index and category archives.

export default function PostCard({ post }: { post: Post }) {
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
      </div>
      <div className="p-5">
        {post.categories[0] ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-teal">
            {categoryLabel(post.categories[0])}
          </span>
        ) : null}
        <h2 className="mt-1 line-clamp-2 text-lg font-bold text-dark transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-charcoal/70">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
