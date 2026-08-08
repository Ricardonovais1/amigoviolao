import Reveal from "../Reveal";
import YouTubeVideo from "../YouTubeVideo";
import AssinaturaRicardo from "./AssinaturaRicardo";

export default function SalesHero() {
  return (
    <section className="bg-dark py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-[1.7rem] font-extrabold leading-tight text-white sm:text-[2.15rem]">
            Seu filho aprende violão brincando.
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Você ganha momentos em família que ficam para sempre.
          </p>
          <AssinaturaRicardo foco="criancas" />

          <a
            href="#comprar"
            className="mt-6 inline-block rounded-full bg-primary px-10 py-4 text-center text-base font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]"
          >
            Quero inscrever meu filho
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
