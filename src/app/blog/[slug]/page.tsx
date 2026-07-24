import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostBody from "@/components/blog/PostBody";
import PostCover from "@/components/blog/PostCover";
import ReadingProgress from "@/components/blog/ReadingProgress";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ArticleJsonLd from "@/components/blog/ArticleJsonLd";
import { getAllPosts, getPost, categoryLabel } from "@/lib/blog";

// Statically generate every post at build time (Jamstack).
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// Unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: post.canonical,
      images: post.og_image ? [{ url: post.og_image }] : undefined,
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}

const formatDate = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <ReadingProgress targetId="post-content" />
      <ArticleJsonLd post={post} />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-12">
          <nav className="mb-6 text-sm text-charcoal/60">
            <Link href="/" className="hoverable:text-primary">
              Início
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hoverable:text-primary">
              Blog
            </Link>
          </nav>

          <header>
            {post.categories[0] ? (
              <Link
                href={`/blog/categoria/${post.categories[0]}`}
                className="text-xs font-semibold uppercase tracking-wide text-teal-text hoverable:text-primary"
              >
                {categoryLabel(post.categories[0])}
              </Link>
            ) : null}
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-dark sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-charcoal/60">
              {formatDate(post.date)}
            </p>
          </header>

          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-cream">
            <PostCover
              src={post.featured_image}
              alt={post.title}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <div id="post-content" className="mt-10">
            <PostBody content={post.content} />
          </div>

          {post.categories.length ? (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-black/10 pt-6">
              <span className="text-sm font-semibold text-charcoal/70">
                Categorias:
              </span>
              {post.categories.map((slug) => (
                <Link
                  key={slug}
                  href={`/blog/categoria/${slug}`}
                  className="rounded-full bg-cream/70 px-3 py-1.5 text-sm font-medium text-charcoal transition-colors hoverable:bg-teal/20 hoverable:text-dark"
                >
                  {categoryLabel(slug)}
                </Link>
              ))}
            </div>
          ) : null}

          <RelatedPosts slug={post.slug} />
        </article>
      </main>
      <Footer />
    </>
  );
}
