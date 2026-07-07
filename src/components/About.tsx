import Image from "next/image";
import Reveal from "./Reveal";

const defaultParagraphs = [
  "Tocar violão sempre foi minha paixão. E há 20 anos venho ensinando.",
  "As crianças abriram as portas para que eu me tornasse um didata do instrumento.",
  "O Amigo Violão abriu as portas do mundo para meu trabalho, através da internet.",
  "Eu valorizo os alunos que, apesar de terem um professor, são antes de tudo autodidatas, pois buscam o conhecimento.",
];

export default function About({
  paragraphs = defaultParagraphs,
}: {
  paragraphs?: string[];
}) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <Reveal>
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-full border-4 border-charcoal">
            <Image
              src="https://amigoviolao.com/wp-content/uploads/2018/05/Foto-No-Escrit%C3%B3rio-MENOR-diferente.png"
              alt="Ricardo Novais"
              width={600}
              height={654}
              className="h-auto w-full"
            />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="text-3xl font-extrabold text-charcoal">
            Ricardo Novais
          </h2>
          <div className="mt-4 space-y-4 text-foreground/80">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
