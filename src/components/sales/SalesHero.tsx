import Reveal from "../Reveal";
import YouTubeVideo from "../YouTubeVideo";

export default function SalesHero() {
  return (
    <section className="bg-dark py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Desperte o talento musical de seu filho com o violão
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Melhor curso de violão para crianças do Brasil
          </p>
          <p className="mt-1 text-white/80">Professor Ricardo Novais</p>

          <a
            href="#comprar"
            className="mt-6 inline-block rounded-full bg-primary px-8 py-3.5 text-center text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]"
          >
            Quero meu desconto
          </a>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <YouTubeVideo
              id="Qwhow0411J8"
              title="Curso de Violão para Crianças - Amigo Violão"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
