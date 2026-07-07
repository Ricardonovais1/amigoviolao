import Image from "next/image";
import Reveal from "../Reveal";

export default function NaveCourses() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            Tem muito mais:
          </h2>
          <p className="mt-2 text-foreground/70">
            Você está adquirindo, além do PROVIC, acesso completo a todos os
            cursos da NAVE Amigo Violão:
          </p>
        </Reveal>

        <Reveal delay={100}>
          <Image
            src="https://amigoviolao.com/wp-content/uploads/2023/01/cursos-NAVE.jpg.webp"
            alt="Todos os cursos da plataforma NAVE Amigo Violão"
            width={918}
            height={463}
            className="mx-auto mt-8 h-auto w-full rounded-xl shadow-sm"
          />
        </Reveal>
      </div>
    </section>
  );
}
