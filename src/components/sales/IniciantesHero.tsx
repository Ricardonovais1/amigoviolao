import Reveal from "../Reveal";
import YouTubeVideo from "../YouTubeVideo";
import AssinaturaRicardo from "./AssinaturaRicardo";

export default function IniciantesHero() {
  return (
    <section className="bg-dark py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Reveal>
          <h1 className="text-[1.7rem] font-extrabold leading-tight text-white sm:text-[2.15rem]">
            🎸 Pare de tentar aprender sozinho. Comece a tocar violão de
            verdade, mesmo que você esteja começando do zero.
          </h1>
          <p className="mt-4 text-lg font-semibold text-primary">
            Do primeiro acorde ao violão popular e erudito. Tudo em um único
            acesso.
          </p>
          <AssinaturaRicardo />

          <a
            href="#comprar"
            className="mt-6 inline-block rounded-full bg-primary px-10 py-4 text-center text-base font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]"
          >
            Quero começar a tocar hoje
          </a>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
            <YouTubeVideo
              id="bGdaHM4VcPM"
              title="Curso de Violão para iniciantes - Metodologia Amigo Violão"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
