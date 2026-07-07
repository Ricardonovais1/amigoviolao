import Image from "next/image";
import Reveal from "../Reveal";
import { HOTMART_CHECKOUT_URL } from "@/lib/links";

const defaultInclusions = [
  "Curso completo de violão para crianças (5 módulos + violão GOSPEL)",
  "Jogos musicais interativos (quizzes)",
  "Acesso por 2 anos na plataforma NAVE",
  "Suporte da comunidade Amigo Violão",
  "Garantia incondicional de 30 dias",
];

type PricingCTAProps = {
  eyebrow?: string;
  heading?: string;
  ctaText?: string;
  checkoutUrl?: string;
  inclusions?: string[] | null;
  trustImage?: { src: string; alt: string; width: number; height: number };
  sectionId?: string;
};

export default function PricingCTA({
  eyebrow,
  heading = "O melhor curso de violão para crianças por apenas:",
  ctaText = "SIM! QUERO INSCREVER MEU FILHO!",
  checkoutUrl = HOTMART_CHECKOUT_URL,
  inclusions = defaultInclusions,
  trustImage = {
    src: "https://amigoviolao.com/wp-content/uploads/2023/12/cOMPRA-SEGURA-HOTMART-1.png.webp",
    alt: "Compra segura via Hotmart",
    width: 350,
    height: 87,
  },
  sectionId = "comprar",
}: PricingCTAProps) {
  return (
    <section id={sectionId} className="bg-cream py-16">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          {eyebrow && (
            <p className="mb-2 font-bold text-primary">{eyebrow}</p>
          )}
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            {heading}
          </h2>
        </Reveal>

        {inclusions && (
          <Reveal delay={40}>
            <ul className="mx-auto mt-8 max-w-md space-y-2 text-left">
              {inclusions.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-foreground/80"
                >
                  <span className="text-green-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        <Reveal delay={80}>
          <p className="mt-6 text-2xl text-red-500/80 line-through">
            R$697,00
          </p>
          <p className="text-5xl font-extrabold text-primary">R$479,00</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            ou 12x R$49,54
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Garantia de 30 dias
          </p>
        </Reveal>

        <Reveal delay={140}>
          <a
            href={checkoutUrl}
            className="mt-6 inline-block w-full rounded-full bg-green-600 px-8 py-4 text-center text-lg font-bold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-green-700 active:scale-[0.97] sm:w-auto sm:px-16"
          >
            {ctaText}
          </a>
        </Reveal>

        <Reveal delay={200}>
          <Image
            src={trustImage.src}
            alt={trustImage.alt}
            width={trustImage.width}
            height={trustImage.height}
            className="mx-auto mt-6 h-auto w-full max-w-[280px]"
          />
        </Reveal>
      </div>
    </section>
  );
}
