import type { CSSProperties } from "react";
import Image from "next/image";
import Ambient from "./Ambient";
import Reveal from "./Reveal";
import SpotlightGroup from "./SpotlightGroup";

const features = [
  {
    title: "Especialistas em violão",
    description:
      "Metodologia criada por quem ensina violão há mais de 20 anos, para todas as idades.",
  },
  {
    title: "Tudo para você aprender",
    description:
      "Videoaulas, jogos musicais interativos e certificados a cada módulo concluído.",
  },
  {
    title: "Didática em primeiro lugar",
    description:
      "Conteúdo simples e direto, sem deixar dúvidas para o educador e o educando.",
  },
  {
    title: "Turma de dúvidas responsável",
    description:
      "Suporte por WhatsApp, comunidade e lives ao vivo para tirar todas as suas dúvidas.",
  },
];

type WhyLearnProps = {
  image?: { src: string; alt: string; width: number; height: number };
};

export default function WhyLearn({
  image = {
    src: "/images/legacy/amigo-violao.webp",
    alt: "Pessoas aprendendo violão juntas",
    width: 480,
    height: 320,
  },
}: WhyLearnProps) {
  return (
    <section
      className="seam-top relative isolate overflow-hidden bg-white py-20"
      style={{ "--seam-color": "rgba(62,69,72,0.14)" } as CSSProperties}
    >
      <Ambient preset="light" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Reveal variant="left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-text">
                O método
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                Porque aprender no Amigo Violão?
              </h2>
              {/* Filete curto no lugar de uma régua de largura total: dá
                  acabamento ao título sem cortar a seção ao meio. */}
              <span className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light" />
            </Reveal>
            <Reveal delay={120} variant="scale" duration={700}>
              <div className="relative mt-8 w-full max-w-sm">
                {/* Halo atrás da foto: separa a imagem do branco puro. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(239,84,0,0.13),transparent_75%)]"
                />
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          </div>

          <SpotlightGroup className="grid gap-5 sm:grid-cols-2">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 90} variant="blur">
                <div
                  data-spotlight
                  className="hairline spotlight group h-full rounded-2xl bg-white p-6 shadow-soft transition-[transform,box-shadow] duration-300 ease-snappy hoverable:-translate-y-1 hoverable:shadow-lift"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-dark text-sm font-bold text-white transition-transform duration-300 ease-spring [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-bold text-charcoal">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </SpotlightGroup>
        </div>
      </div>
    </section>
  );
}
