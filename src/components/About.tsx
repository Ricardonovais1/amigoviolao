import type { CSSProperties } from "react";
import Image from "next/image";
import { whatsappUrl } from "@/lib/links";
import Ambient from "./Ambient";
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
  seam = true,
}: {
  paragraphs?: string[];
  whatsappMessage?: string;
  /**
   * Filete de 1px no topo da seção. Existe para costurar a fronteira com um
   * bloco de cor diferente; entre dois brancos ele vira um risco solto no meio
   * da página, que foi o que aconteceu na página de professores.
   */
  seam?: boolean;
}) {
  return (
    <section
      id="sobre"
      className={`relative isolate overflow-hidden bg-white py-24 ${
        seam ? "seam-top" : ""
      }`}
      style={{ "--seam-color": "rgba(62,69,72,0.14)" } as CSSProperties}
    >
      <Ambient preset="light" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <Reveal variant="scale" duration={700}>
          <div className="relative mx-auto w-full max-w-sm">
            {/* Halo + anel em gradiente: a foto deixa de flutuar solta no
                branco e ganha um assentamento. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-5 -z-10 rounded-full bg-[radial-gradient(circle,rgba(239,84,0,0.16),transparent_70%)]"
            />
            <div className="rounded-full bg-gradient-to-br from-primary via-charcoal to-teal p-1 shadow-panel">
              <div className="overflow-hidden rounded-full border-4 border-white">
                <Image
                  src="/images/legacy/foto-no-escritorio-menor-diferente.webp"
                  alt="Ricardo Novais"
                  width={600}
                  height={654}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal variant="right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-text">
              Quem ensina
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-charcoal sm:text-4xl">
              Ricardo Novais
            </h2>
            <span className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light" />
          </Reveal>

          <div className="mt-6 space-y-4 text-foreground/80">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={100 + i * 70} variant="right">
                <p className="leading-relaxed">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100 + paragraphs.length * 70}>
            <a
              href={whatsappUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="sheen mt-8 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-[#25d366] to-[#1faf54] px-7 py-3.5 font-bold text-white shadow-[0_12px_30px_-14px_rgba(37,211,102,0.9)] transition-[transform,box-shadow] duration-200 ease-snappy hoverable:-translate-y-0.5 hoverable:shadow-[0_18px_38px_-14px_rgba(37,211,102,1)] active:scale-[0.97]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Entrar em contato
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
