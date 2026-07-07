import Reveal from "../Reveal";

export default function ClassicoHero() {
  return (
    <section className="bg-dark py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Curso de Violão Clássico
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Aumente seu nível no violão
          </p>
          <p className="mt-1 text-teal">
            Saiba tocar suas primeiras peças de violão solo, aprenda a ler
            partituras de forma interativa
          </p>

          <a
            href="#comprar"
            className="mt-6 inline-block rounded-full bg-primary px-8 py-3.5 text-center text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]"
          >
            Quero meu desconto
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
