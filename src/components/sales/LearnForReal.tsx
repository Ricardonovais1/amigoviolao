import Image from "next/image";
import Reveal from "../Reveal";

export default function LearnForReal() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl font-extrabold">
            <span className="text-primary">Aprenda violão de verdade</span>{" "}
            <span className="text-charcoal">para tocar o que quiser</span>
          </h2>
          <p className="mt-6 text-foreground/80">
            O jeito Amigo Violão de aprender é o que possibilita iniciantes,
            inclusive crianças e aqueles com mais dificuldade, chegarem mais
            rápido e de forma mais prazerosa ao objetivo de tocar violão com
            os amigos. O segredo está em músicas que te permitem tocar com
            excelência desde a primeira aula, aquilo que é proposto.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <Image
            src="https://amigoviolao.com/wp-content/uploads/2021/06/Duple-de-violao-2.png"
            alt="Duas pessoas tocando violão juntas"
            width={600}
            height={500}
            className="mx-auto h-auto w-full max-w-md"
          />
        </Reveal>
      </div>
    </section>
  );
}
