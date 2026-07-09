import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogExplorer from "@/components/blog/BlogExplorer";
import { getAllPosts, toPostCardData } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog - Amigo Violão",
  description:
    "Dicas, métodos e reflexões sobre ensinar e aprender violão com leveza e alegria.",
};

export default function BlogIndex() {
  const posts = getAllPosts().map(toPostCardData);

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
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-10">
          {posts.length === 0 ? (
            <p className="text-charcoal/70">
              Nenhum post publicado ainda. Rode a migração para importar os
              posts.
            </p>
          ) : (
            <BlogExplorer posts={posts} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
