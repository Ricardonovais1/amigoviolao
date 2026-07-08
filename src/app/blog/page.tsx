import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/blog/PostCard";
import CategoryList from "@/components/blog/CategoryList";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog - Amigo Violão",
  description:
    "Dicas, métodos e reflexões sobre ensinar e aprender violão com leveza e alegria.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-black/5 bg-cream/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Blog
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-dark">
              Aprenda e ensine violão
            </h1>
            <p className="mt-3 max-w-2xl text-charcoal/80">
              Dicas práticas, métodos e histórias para tocar e ensinar com mais
              leveza.
            </p>
            <div className="mt-6">
              <CategoryList showCounts />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-12">
          {posts.length === 0 ? (
            <p className="text-charcoal/70">
              Nenhum post publicado ainda. Rode a migração para importar os
              posts.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
