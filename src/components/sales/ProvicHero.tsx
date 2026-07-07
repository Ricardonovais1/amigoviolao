import Reveal from "../Reveal";

export default function ProvicHero() {
  return (
    <section className="bg-dark py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Curso PROVIC
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Professor Ricardo Novais
          </p>
          <p className="mt-1 text-teal">
            Seja um professor de violão mais reconhecido e valorize suas
            aulas, reduzindo a desmotivação e desistências.
          </p>

          <a
            href="#comprar"
            className="mt-6 inline-block rounded-full bg-primary px-8 py-3.5 text-center text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]"
          >
            Quero ensinar violão com eficácia
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
