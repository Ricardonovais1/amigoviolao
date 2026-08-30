import Image from "next/image";
import Reveal from "../Reveal";
import Ambient from "../Ambient";
import { HOTMART_CHECKOUT_URL } from "@/lib/links";

const defaultInclusions = [
  "As 3 Trilhas completas — Infantil, Iniciantes e Clássico",
  "Acesso por 2 anos",
  "Suporte da comunidade Amigo Violão",
  "Garantia incondicional de 30 dias",
];

/** "R$1.497,00" — mesmo formato usado em todas as páginas de venda. */
function formatBRL(value: number) {
  return `R$${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** "R$ 340" — sem centavos, para a linha de economia. */
function formatBRLInteiro(value: number) {
  return `R$ ${value.toLocaleString("pt-BR")}`;
}

type PricingCTAProps = {
  eyebrow?: string;
  heading?: string;
  ctaText?: string;
  checkoutUrl?: string;
  inclusions?: string[] | null;
  /** Valor de ancoragem, exibido riscado. */
  anchorPrice?: number;
  /** Número de parcelas exibido ao lado do valor da parcela. */
  installments?: number;
  /** Valor de cada parcela. Ver a fórmula em .claude/skills/precificacao. */
  installmentPrice?: number;
  /** Preço à vista. */
  cashPrice?: number;
  trustImage?: { src: string; alt: string; width: number; height: number };
  sectionId?: string;
};

export default function PricingCTA({
  eyebrow,
  heading = "O melhor curso de violão para crianças por apenas:",
  ctaText = "SIM! QUERO INSCREVER MEU FILHO!",
  checkoutUrl = HOTMART_CHECKOUT_URL,
  inclusions = defaultInclusions,
  anchorPrice = 697,
  installments = 12,
  installmentPrice = 49.54,
  cashPrice = 479,
  trustImage = {
    src: "https://amigoviolao.com/wp-content/uploads/2023/12/cOMPRA-SEGURA-HOTMART-1.png.webp",
    alt: "Compra segura via Hotmart",
    width: 350,
    height: 87,
  },
  sectionId = "comprar",
}: PricingCTAProps) {
  return (
    <section
      id={sectionId}
      className="relative isolate overflow-hidden bg-cream py-20"
    >
      <Ambient preset="light" />
      <div className="relative mx-auto max-w-2xl px-6 text-center">
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

        <Reveal delay={80} variant="scale">
          {/* Diferença calculada da própria âncora: não há como a economia
              anunciada divergir dos dois preços exibidos logo abaixo. */}
          {anchorPrice > cashPrice && (
            <p className="mt-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-extrabold text-primary">
              🔥 Economize {formatBRLInteiro(anchorPrice - cashPrice)} hoje
            </p>
          )}
          <p className="mt-3 text-2xl text-red-500/80 line-through">
            {formatBRL(anchorPrice)}
          </p>
          <p className="text-primary">
            <span className="text-2xl font-bold">{installments}x de </span>
            <span className="text-5xl font-extrabold">
              {formatBRL(installmentPrice)}
            </span>
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground/70">
            ou {formatBRL(cashPrice)} à vista
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-foreground/60">
            Garantia de 30 dias
          </p>
        </Reveal>

        <Reveal delay={140}>
          <a
            href={checkoutUrl}
            className="mt-6 sheen inline-block w-full rounded-full bg-gradient-to-b from-green-600 to-green-700 px-8 py-4 text-center text-lg font-bold text-white shadow-buy transition-[transform,box-shadow] duration-200 ease-snappy hoverable:-translate-y-0.5 hoverable:shadow-buy-strong active:scale-[0.97] sm:w-auto sm:px-16"
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
            className="no-zoom mx-auto mt-6 h-auto w-full max-w-[280px]"
          />
        </Reveal>
      </div>
    </section>
  );
}
