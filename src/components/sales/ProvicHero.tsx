import Reveal from "../Reveal";
import AssinaturaRicardo from "./AssinaturaRicardo";

export default function ProvicHero() {
  return (
    <section className="bg-dark py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-[1.7rem] font-extrabold leading-tight text-white sm:text-[2.15rem]">
            Crianças que aprendem brincando aprendem melhor e querem voltar à
            próxima aula.
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Uma formação completa em pedagogia do violão infantil, com módulos
            de iniciação, violão popular, clássico, improvisação e
            musicalização.
          </p>
          <AssinaturaRicardo foco="criancas" />

          <a
            href="#comprar"
            className="mt-6 inline-block rounded-full bg-primary px-10 py-4 text-center text-base font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]"
          >
            Quero me tornar esse professor
          </a>
        </Reveal>

        <Reveal delay={100}>
          <div className="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <iframe
              src="https://player.vimeo.com/video/439443834"
              title="Professor de Violão para Crianças - PROVIC"
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
