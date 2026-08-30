import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ambient from "@/components/Ambient";
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
      <main className="flex-1 bg-dark">
        <section className="grain relative isolate overflow-hidden border-b border-white/10">
          <Ambient preset="dark" />
          <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Blog
              </p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Aprenda e <span className="text-gradient">ensine violão</span>
              </h1>
              <p className="mt-4 max-w-2xl text-white/70">
                Dicas práticas, métodos e histórias para tocar e ensinar com
                mais leveza.
              </p>
              <span className="mt-6 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light" />
            </div>
            <div className="hidden shrink-0 items-center gap-4 sm:flex">
              <p className="max-w-xs text-right text-sm text-white/70">
                <span className="font-semibold text-white">
                  Ricardo Novais
                </span>
                , professor de violão há mais de 20 anos e pesquisador
                dedicado ao ensino do violão.
              </p>
              <Image
                src="/images/ricardo-novais.webp"
                alt="Ricardo Novais"
                width={112}
                height={112}
                className="no-zoom shrink-0 rounded-full ring-2 ring-primary/40"
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-10">
          {posts.length === 0 ? (
            <p className="text-white/70">
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
