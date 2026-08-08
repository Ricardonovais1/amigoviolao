import Reveal from "../Reveal";
import AssinaturaRicardo from "./AssinaturaRicardo";

export default function ClassicoHero() {
  return (
    <section className="bg-dark py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-[1.7rem] font-extrabold leading-tight text-white sm:text-[2.15rem]">
            🎼 Pare de aprender conteúdos soltos. Construa uma base sólida para
            tocar violão clássico com segurança e musicalidade.
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Teoria, leitura musical, técnica e repertório em um único percurso.
          </p>
          <AssinaturaRicardo />

          <a
            href="#comprar"
            className="mt-6 inline-block rounded-full bg-primary px-10 py-4 text-center text-base font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]"
          >
            Quero construir minha base
          </a>
        </Reveal>

        <Reveal delay={100}>
          <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <iframe
              src="https://player.vimeo.com/video/671821918"
              title="Curso de Violão Clássico - Amigo Violão"
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
