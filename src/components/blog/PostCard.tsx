import Link from "next/link";
import type { PostCardData } from "@/lib/blog";
import { primaryCategory } from "@/lib/categories";
import { postPath } from "@/lib/routes";
import PostCover from "./PostCover";

// Reusable post card for the blog index and category archives. Accepts the
// lightweight PostCardData shape (full Post objects satisfy it structurally),
// and stays client-safe so it can render inside the BlogExplorer filter.

export default function PostCard({ post }: { post: PostCardData }) {
  const category = primaryCategory(post.categories);

  return (
    <Link
      href={postPath(post.slug)}
      data-spotlight
      className="hairline spotlight group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft transition-[transform,box-shadow] duration-300 ease-snappy hoverable:-translate-y-1.5 hoverable:shadow-lift"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-cream">
        <PostCover
          src={post.featured_image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Véu inferior: separa a capa do texto sem uma linha dura. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
        />
        {category ? (
          <span className="absolute left-3 top-3 z-10 rounded-md bg-primary/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_6px_16px_-8px_rgba(239,84,0,0.9)] backdrop-blur-sm">
            {category.name}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-lg font-bold text-dark transition-colors duration-300 group-hover:text-primary">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-charcoal/70">
          {post.description}
        </p>
        {/* No toque a chamada fica sempre visível; só onde há hover real ela
            entra junto com o card levantando. */}
        <span
          aria-hidden="true"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-[opacity,transform] duration-300 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:-translate-x-1 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-focus-visible:translate-x-0 [@media(hover:hover)_and_(pointer:fine)]:group-focus-visible:opacity-100"
        >
          Ler o post
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
