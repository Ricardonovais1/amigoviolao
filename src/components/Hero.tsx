import Image from "next/image";
import Reveal from "./Reveal";

const buttonBase =
  "rounded-full px-6 py-3 text-center text-sm font-semibold transition-[background-color,border-color,transform] duration-150 ease-snappy active:scale-[0.97]";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-dark">
      <Image
        src="/images/fundo-home-site.png"
        alt=""
        fill
        priority
        className="object-cover object-center opacity-30"
      />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url("https://amigoviolao.com/wp-content/uploads/2018/09/Sobreposi%C3%A7%C3%A3o.png")',
          backgroundRepeat: "repeat",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/60 to-dark" />

      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <Reveal>
          <h1 className="text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
            Ensine ou aprenda violão com leveza e alegria
          </h1>
        </Reveal>

        <Reveal delay={90}>
          <p className="mx-auto mt-6 max-w-xl text-xl text-white/90">
            Comece hoje com nossos cursos para crianças, professores e
            iniciantes
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="#como-funciona"
              className={`${buttonBase} border border-white/30 text-white hover:border-white hover:bg-white/10`}
            >
              Como Funciona?
            </a>
            <a
              href="#cursos"
              className={`${buttonBase} bg-primary text-white hover:bg-primary-dark`}
            >
              Conhecer os Cursos
            </a>
            <a
              href="#contato"
              className={`${buttonBase} border border-white/30 text-white hover:border-white hover:bg-white/10`}
            >
              Entrar em Contato
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
