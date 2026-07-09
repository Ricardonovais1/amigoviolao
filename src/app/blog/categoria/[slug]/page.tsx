import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/blog/PostCard";
import CategoryList from "@/components/blog/CategoryList";
import {
  getAllCategories,
  getPostsByCategory,
  categoryLabel,
} from "@/lib/blog";

export function generateStaticParams() {
  return getAllCategories().map((cat) => ({ slug: cat.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = categoryLabel(slug);
  return {
    title: `${name} - Blog Amigo Violão`,
    description: `Artigos sobre ${name} no blog do Amigo Violão.`,
  };
}

export default async function CategoryArchive({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getPostsByCategory(slug);
  if (!posts.length) notFound();

  const name = categoryLabel(slug);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-black/5 bg-cream/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <nav className="mb-4 text-sm text-charcoal/60">
              <Link href="/blog" className="hoverable:text-primary">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <span>Categorias</span>
            </nav>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Categoria
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-dark">{name}</h1>
            <p className="mt-3 text-charcoal/70">
              {posts.length} {posts.length === 1 ? "artigo" : "artigos"}
            </p>
            <div className="mt-6">
              <CategoryList activeSlug={slug} />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
