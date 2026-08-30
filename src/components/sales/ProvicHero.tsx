import Ambient from "../Ambient";
import Reveal from "../Reveal";
import AssinaturaRicardo from "./AssinaturaRicardo";

export default function ProvicHero() {
  return (
    <section className="grain relative isolate overflow-hidden bg-dark py-14 md:py-20">
      <Ambient preset="hero" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-[1.7rem] font-extrabold leading-tight text-white sm:text-[2.15rem]">
            Domine a pedagogia do violão infantil. Suas aulas mais leves,
            divertidas e lucrativas.
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Uma formação 100% prática em didática e ludicidade do violão
            infantil. Aprenda a destravar o aprendizado das crianças desde a
            primeira aula.
          </p>
          <AssinaturaRicardo foco="criancas" />

          <a
            href="#comprar"
            className="sheen mt-6 inline-block rounded-full bg-gradient-to-b from-primary to-primary-dark px-10 py-4 text-center text-base font-bold text-white shadow-cta transition-[transform,box-shadow] duration-200 ease-snappy hoverable:-translate-y-0.5 hoverable:shadow-cta-strong active:scale-[0.97]"
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
