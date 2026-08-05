import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

// Substitui a /quem-somos do WordPress (que recebe 301 pra ca). A copy vem de
// la quase literal de proposito: e o texto que o Google ja indexou, e reescrever
// do zero jogaria fora a relevancia acumulada. Só o ultimo paragrafo mudou --
// no WP ele dizia que os cursos para outros publicos ainda estavam sendo
// implementados, o que hoje nao e mais verdade.

export const metadata: Metadata = {
  title: "Sobre o Amigo Violão",
  description:
    "O Amigo Violão é a principal referência do ensino de violão para crianças no Brasil. Conheça a história e o trabalho de Ricardo Novais.",
  alternates: { canonical: "https://amigoviolao.com/sobre" },
};

const PARAGRAPHS = [
  "Olá, seja bem-vindo(a) ao Amigo Violão! Meu nome é Ricardo Novais, e eu sou o seu anfitrião aqui no Amigo Violão.",
  "Este site é dedicado ao ensino deste maravilhoso instrumento. Hoje já contamos com muitos professores credenciados por todo o Brasil.",
  "Nossa história é marcada pelo amor ao instrumento, com uma dedicação especial às crianças, que merecem toda consideração. Afinal, é na infância que o talento é melhor despertado.",
  "Mas não é só isso. O Amigo Violão é conhecido hoje como a principal referência do ensino do violão para crianças no Brasil — e o nosso catálogo já atende também iniciantes, estudantes de violão clássico e alunos intermediários, além de teoria e leitura musical.",
];

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-black/5 bg-cream/40">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Sobre
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-dark">
              Quem somos
            </h1>
            <p className="mt-3 max-w-2xl text-charcoal/80">
              A história por trás do Amigo Violão e do trabalho que virou
              referência no ensino de violão para crianças no Brasil.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
          <Reveal>
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-full border-4 border-charcoal">
              <Image
                src="/images/blog/2018/05/Ricardo-Novais-1.webp"
                alt="Ricardo Novais, criador do Amigo Violão"
                width={600}
                height={654}
                className="h-auto w-full"
                priority
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="text-3xl font-extrabold text-charcoal">
              Ricardo Novais
            </h2>
            <div className="mt-4 space-y-4 text-foreground/80">
              {PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/professores"
                className="inline-flex rounded-full bg-primary px-7 py-3.5 font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary/90 active:scale-[0.97]"
              >
                Nossos professores
              </Link>
              <Link
                href="/contato"
                className="inline-flex rounded-full border-2 border-charcoal px-7 py-3.5 font-bold text-charcoal transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-charcoal hoverable:text-white active:scale-[0.97]"
              >
                Falar com a gente
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
