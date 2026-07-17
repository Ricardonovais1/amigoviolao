import Image from "next/image";
import { whatsappUrl } from "@/lib/links";
import Reveal from "./Reveal";
import WhatsAppIcon from "./WhatsAppIcon";

const defaultParagraphs = [
  "Tocar violão sempre foi minha paixão. E há 20 anos venho ensinando.",
  "As crianças abriram as portas para que eu me tornasse um didata do instrumento.",
  "O Amigo Violão abriu as portas do mundo para meu trabalho, através da internet.",
  "Eu valorizo os alunos que, apesar de terem um professor, são antes de tudo autodidatas, pois buscam o conhecimento.",
];

export default function About({
  paragraphs = defaultParagraphs,
  whatsappMessage,
}: {
  paragraphs?: string[];
  whatsappMessage?: string;
}) {
  return (
    <section id="sobre" className="bg-white py-20">
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
          <a
            href={whatsappUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#25d366] px-7 py-3.5 font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-[#1faf54] active:scale-[0.97]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Entrar em contato
          </a>
        </Reveal>
      </div>
    </section>
  );
}
