import Image from "next/image";
import Reveal from "../Reveal";

// Prints reais de mensagens de alunos (WhatsApp, Facebook, Instagram) —
// prova social que uma citação em texto não passa.
const defaultScreenshots = [
  {
    src: "/images/professores/depoimentos/depoimento-1.webp",
    width: 587,
    height: 565,
    alt: "Depoimento de Cristiane Aquino Oliveira sobre o curso Amigo Violão PROVIC",
  },
  {
    src: "/images/professores/depoimentos/depoimento-2.webp",
    width: 555,
    height: 362,
    alt: "Depoimento de Graziela, aluna PROVIC há 2 anos",
  },
  {
    src: "/images/professores/depoimentos/depoimento-3.webp",
    width: 583,
    height: 370,
    alt: "Depoimento de Gabriella Ramos Rodrigues sobre o curso Provic",
  },
  {
    src: "/images/professores/depoimentos/depoimento-4.webp",
    width: 522,
    height: 418,
    alt: "Depoimento de Kilson sobre a primeira aula com o método PROVIC",
  },
  {
    src: "/images/professores/depoimentos/depoimento-5.webp",
    width: 900,
    height: 545,
    alt: "Menção de Cleber Assumpção sobre a conclusão do curso PROVIC",
  },
];

type Screenshot = { src: string; width: number; height: number; alt: string };

type ImageTestimonialsProps = {
  heading?: string;
  subheading?: string;
  screenshots?: Screenshot[];
};

export default function ImageTestimonials({
  heading = "O que os professores estão dizendo",
  subheading = "Mensagens reais de professores aplicando o método PROVIC em suas aulas.",
  screenshots = defaultScreenshots,
}: ImageTestimonialsProps) {
  return (
    <section className="bg-cream/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="text-center">
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            {heading}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-foreground/70">
            {subheading}
          </p>
        </Reveal>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {screenshots.map((shot, i) => (
            <Reveal key={shot.src} delay={i * 60} className="mb-4 break-inside-avoid">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                className="w-full rounded-xl border border-charcoal/10 shadow-sm"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
