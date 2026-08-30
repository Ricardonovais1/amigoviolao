import type { CSSProperties } from "react";
import Image from "next/image";
import Ambient from "./Ambient";
import Reveal from "./Reveal";
import SpotlightGroup from "./SpotlightGroup";

const testimonials = [
  {
    quote:
      "O Amigo Violão me deu conhecimento e confiança para explorar o ensino do violão. O método do Ricardo Novais é simples e direto, não deixando dúvidas para o educador e o educando.",
    name: "Júnior Oliveira",
    city: "São Paulo",
    avatar: "/images/testimonials/junior-oliveira.webp",
  },
  {
    quote:
      "Ricardo Novais preparou meticulosamente o conteúdo. Graças à sua paciência e senso de organização didática, ele abre as portas para o aprendizado do violão de uma maneira fácil e objetiva.",
    name: "Marlon Nascimento",
    city: "Belo Horizonte",
    avatar: "/images/testimonials/marlon-nascimento.webp",
  },
  {
    quote:
      "Estou utilizando o Amigo Violão nas minhas aulas. O conteúdo é exatamente a proposta pedagógica do projeto e também o que eu sempre busquei no ensino do violão, unindo o lado técnico ao lúdico.",
    name: "Renato Lourenço",
    city: "Araçatuba",
    avatar: "/images/testimonials/renato-lourenco.webp",
  },
];

export default function Testimonials() {
  return (
    <section className="seam-top grain relative isolate overflow-hidden bg-charcoal py-24">
      <Ambient preset="dark" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 text-center" delay={0}>
          <div
            className="mb-4 flex justify-center gap-1.5 text-xl text-amber-star"
            role="img"
            aria-label="Avaliação cinco de cinco estrelas"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                aria-hidden="true"
                className="star-twinkle"
                style={{ "--star-delay": `${i * 0.18}s` } as CSSProperties}
              >
                ★
              </span>
            ))}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Professores aprovam a metodologia
          </h2>
        </Reveal>

        <SpotlightGroup className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110} variant="blur">
              <figure
                data-spotlight
                className="hairline spotlight group relative flex h-full flex-col rounded-2xl bg-white/[0.055] p-7 transition-[transform,background-color] duration-300 ease-snappy hoverable:-translate-y-1 hoverable:bg-white/[0.085]"
                style={
                  {
                    "--hairline":
                      "linear-gradient(145deg, rgba(255,255,255,0.28), rgba(72,194,195,0.22) 45%, rgba(255,255,255,0.04))",
                    "--spot-color": "rgba(72,194,195,0.16)",
                  } as CSSProperties
                }
              >
                {/* Aspas como ornamento, não como texto: some para o leitor
                    de tela e para a seleção. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-3 select-none font-serif text-6xl leading-none text-white/10 transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-white/[0.16]"
                >
                  &rdquo;
                </span>

                <blockquote className="relative flex-1 text-sm italic leading-relaxed text-white/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  {t.avatar ? (
                    <span className="relative shrink-0 rounded-full p-[1.5px] transition-colors duration-300 [background:linear-gradient(140deg,rgba(239,84,0,0.7),rgba(72,194,195,0.6))]">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="no-zoom h-11 w-11 rounded-full object-cover"
                      />
                    </span>
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {t.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/60">{t.city}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </SpotlightGroup>
      </div>
    </section>
  );
}
