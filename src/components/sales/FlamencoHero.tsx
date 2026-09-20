import Ambient from "../Ambient";
import Reveal from "../Reveal";

const negrito = "font-bold text-white";

export default function FlamencoHero() {
  return (
    <section className="grain relative isolate overflow-hidden bg-dark py-14 md:py-20">
      <Ambient preset="hero" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-[1.7rem] font-extrabold leading-tight text-white sm:text-[2.15rem]">
            🔥 Rasgueos, picado, alzapúa: as técnicas do violão flamenco que
            levam o seu violão a um outro nível.
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Precisão, velocidade e ritmo — ferramentas para qualquer estilo que
            você toque.
          </p>
          {/* As outras páginas usam AssinaturaRicardo; aqui quem ensina é o
              Cleber, e a linha de autoridade precisa dizer isso. */}
          <p className="mt-3 text-sm leading-snug text-white/70">
            Curso de <strong className={negrito}>Cleber Assumpção</strong>,
            violonista que transita entre o flamenco, o clássico, o choro e o
            jazz — dentro da plataforma criada por{" "}
            <strong className={negrito}>Ricardo Novais</strong>.
          </p>

          <a
            href="#comprar"
            className="sheen mt-6 inline-block rounded-full bg-gradient-to-b from-primary to-primary-dark px-10 py-4 text-center text-base font-bold text-white shadow-cta transition-[transform,box-shadow] duration-200 ease-snappy hoverable:-translate-y-0.5 hoverable:shadow-cta-strong active:scale-[0.97]"
          >
            Quero dominar a técnica flamenca
          </a>
        </Reveal>

        <Reveal delay={100}>
          <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            {/* Vídeo não listado no Vimeo: sem o `h` o player recusa. */}
            <iframe
              src="https://player.vimeo.com/video/764760001?h=2e25371efe"
              title="Curso de Técnicas de Violão Flamenco - Amigo Violão"
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
