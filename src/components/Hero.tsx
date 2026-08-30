import Image from "next/image";
import Ambient from "./Ambient";
import Reveal from "./Reveal";

const buttonBase =
  "rounded-full px-6 py-3 text-center text-sm font-semibold transition-[background-color,border-color,box-shadow,transform] duration-200 ease-snappy active:scale-[0.97]";

export default function Hero() {
  return (
    <section className="grain relative isolate overflow-hidden bg-dark">
      {/* A foto de fundo desce mais devagar que o texto conforme a página
          rola (classe .parallax-bg, ligada ao scroll timeline). */}
      <Image
        src="/images/fundo-home-site.webp"
        alt=""
        fill
        priority
        className="parallax-bg no-zoom object-cover object-center opacity-30"
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url("https://amigoviolao.com/wp-content/uploads/2018/09/Sobreposi%C3%A7%C3%A3o.png")',
          backgroundRepeat: "repeat",
        }}
      />

      <Ambient preset="hero" />

      <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/60 to-dark" />
      {/* Vinheta: escurece as quinas e empurra o olho para o centro. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 42%, transparent 42%, rgba(33,33,33,0.55) 100%)",
        }}
      />

      <div className="parallax-fade relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        <Reveal variant="fade" duration={700}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary" />
              <span className="ping absolute inline-flex h-full w-full rounded-full bg-primary" />
            </span>
            Cursos online para toda a família
          </span>
        </Reveal>

        <Reveal variant="blur" duration={800} delay={60}>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-5xl md:text-6xl">
            Ensine ou aprenda violão com{" "}
            <span className="text-gradient">leveza e alegria</span>
          </h1>
        </Reveal>

        <Reveal delay={150} duration={700}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80 sm:text-xl">
            Comece hoje com nossos cursos para crianças, professores e
            iniciantes
          </p>
        </Reveal>

        <Reveal delay={240} duration={700}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#como-funciona"
              className={`${buttonBase} border border-white/25 bg-white/10 text-white hoverable:border-white/60 hoverable:bg-white/[0.18]`}
            >
              Como Funciona?
            </a>
            <a
              href="#cursos"
              className={`sheen ${buttonBase} bg-gradient-to-b from-primary to-primary-dark text-white shadow-cta hoverable:shadow-cta-strong`}
            >
              Conhecer os Cursos
            </a>
            <a
              href="#sobre"
              className={`${buttonBase} border border-white/25 bg-white/10 text-white hoverable:border-white/60 hoverable:bg-white/[0.18]`}
            >
              Entrar em Contato
            </a>
          </div>
        </Reveal>
      </div>

      {/* Indica que a página continua abaixo da dobra. */}
      <a
        href="#como-funciona"
        aria-label="Ver como funciona"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/60 transition-colors hoverable:text-white md:block"
      >
        <svg
          className="scroll-cue"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
